'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useMouse } from '@/hooks/use-mouse';

// ─── Constants ────────────────────────────────────────────

const NODES        = 80;
const MAX_DIST     = 120;
const REPULSE_R    = 80;
const RIPPLE_R     = 200;
const RIPPLE_LEN   = 30;
const DUST         = 30;
const BOUNDS       = { x: 350, y: 250, z: 150 };

// ─── Helpers ──────────────────────────────────────────────

function wrap(v: number, limit: number) {
  if (v >  limit) return -limit;
  if (v < -limit) return  limit;
  return v;
}

export default function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef(0);
  const { mouse, ripple } = useMouse();

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;

    // ── Renderer ──────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas: cvs, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);
    renderer.setClearColor(0x000000, 0);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 2000);
    camera.position.z = 400;

    // ── Node data ─────────────────────────────────────────
    const pos: number[][] = [];
    const vel: number[][] = [];
    const baseBright: number[] = [];
    const bufPos = new Float32Array(NODES * 3);
    const bufCol = new Float32Array(NODES * 3);

    for (let i = 0; i < NODES; i++) {
      const x = (Math.random() - 0.5) * 700;
      const y = (Math.random() - 0.5) * 500;
      const z = (Math.random() - 0.5) * 300;
      pos.push([x, y, z]);
      vel.push([(Math.random() - 0.5) * 0.25, (Math.random() - 0.5) * 0.25, (Math.random() - 0.5) * 0.1]);
      const b = Math.random() > 0.7 ? 1 : 0.35;
      baseBright.push(b);
      bufPos.set([x, y, z], i * 3);
      bufCol.set([b * 0.91, b * 0.21, b * 0.31], i * 3);
    }

    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(bufPos, 3));
    nodeGeo.setAttribute('color',    new THREE.BufferAttribute(bufCol, 3));
    const nodeMat = new THREE.PointsMaterial({ size: 3, vertexColors: true, transparent: true, opacity: 0.55, sizeAttenuation: true });
    scene.add(new THREE.Points(nodeGeo, nodeMat));

    // ── Lines ─────────────────────────────────────────────
    const maxLines = NODES * 6;
    const lnPos = new Float32Array(maxLines * 6);
    const lnCol = new Float32Array(maxLines * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(lnPos, 3));
    lineGeo.setAttribute('color',    new THREE.BufferAttribute(lnCol, 3));
    lineGeo.setDrawRange(0, 0);
    const lineMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.16 });
    scene.add(new THREE.LineSegments(lineGeo, lineMat));

    // ── Dust particles ────────────────────────────────────
    const dustPos = new Float32Array(DUST * 3);
    const dustVel: number[][] = [];
    for (let i = 0; i < DUST; i++) {
      dustPos.set([(Math.random() - 0.5) * 800, (Math.random() - 0.5) * 600, (Math.random() - 0.5) * 200], i * 3);
      dustVel.push([(Math.random() - 0.5) * 0.08, (Math.random() - 0.5) * 0.08, (Math.random() - 0.5) * 0.03]);
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({ size: 1.5, color: 0xffffff, transparent: true, opacity: 0.12, sizeAttenuation: true });
    scene.add(new THREE.Points(dustGeo, dustMat));

    // ── Mouse helpers ─────────────────────────────────────
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const tmp = new THREE.Vector3();
    const nv  = new THREE.Vector3();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    function mouseOnPlane(nx: number, ny: number) {
      ndc.set(nx, ny);
      ray.setFromCamera(ndc, camera);
      const t = new THREE.Vector3();
      ray.ray.intersectPlane(plane, t);
      return t;
    }

    function distToRay(p: number[]) {
      nv.set(p[0], p[1], p[2]);
      tmp.subVectors(nv, ray.ray.origin);
      const proj = tmp.dot(ray.ray.direction);
      tmp.subVectors(nv, ray.ray.origin.clone().addScaledVector(ray.ray.direction, proj));
      return tmp.length();
    }

    // ── Ripple state ──────────────────────────────────────
    let rippleOn = false;
    let rippleC  = new THREE.Vector3();
    let rippleF  = 0;
    let lastRT   = 0;

    let t = 0;

    // ── Resize ────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    };
    addEventListener('resize', onResize);

    // ── Animation loop ────────────────────────────────────
    const tick = () => {
      frameRef.current = requestAnimationFrame(tick);
      t += 0.005;
      const m = mouse.current;

      // Check new ripple
      const rp = ripple.current;
      if (rp && rp.time > lastRT) {
        lastRT   = rp.time;
        rippleC  = mouseOnPlane(rp.nx, rp.ny);
        rippleOn = true;
        rippleF  = 0;
      }

      // Ray for proximity
      ndc.set(m.nx, m.ny);
      ray.setFromCamera(ndc, camera);
      const mw = mouseOnPlane(m.nx, m.ny);

      // Move nodes
      for (let i = 0; i < NODES; i++) {
        const p = pos[i], v = vel[i];
        p[0] += v[0]; p[1] += v[1]; p[2] += v[2];

        // Mouse repulsion
        const dr = distToRay(p);
        if (dr < REPULSE_R) {
          const s = (1 - dr / REPULSE_R) * 1.5;
          const dx = p[0] - mw.x, dy = p[1] - mw.y;
          const len = Math.sqrt(dx * dx + dy * dy) || 1;
          p[0] += (dx / len) * s;
          p[1] += (dy / len) * s;
        }

        // Ripple
        if (rippleOn) {
          const rx = p[0] - rippleC.x, ry = p[1] - rippleC.y;
          const rd = Math.sqrt(rx * rx + ry * ry);
          if (rd < RIPPLE_R) {
            const amp  = 12 * Math.pow(0.92, rippleF);
            const wave = Math.sin(rd * 0.06 - rippleF * 0.5) * amp;
            const rl   = rd || 1;
            p[0] += (rx / rl) * wave * 0.15;
            p[1] += (ry / rl) * wave * 0.15;
          }
        }

        p[0] = wrap(p[0], BOUNDS.x);
        p[1] = wrap(p[1], BOUNDS.y);
        p[2] = wrap(p[2], BOUNDS.z);
      }

      if (rippleOn && ++rippleF > RIPPLE_LEN) rippleOn = false;

      // Update node buffers
      for (let i = 0; i < NODES; i++) {
        const o = i * 3;
        bufPos[o] = pos[i][0]; bufPos[o + 1] = pos[i][1]; bufPos[o + 2] = pos[i][2];
        const dr = distToRay(pos[i]);
        const boost = dr < REPULSE_R ? (1 - dr / REPULSE_R) * 0.6 : 0;
        const b = baseBright[i];
        bufCol[o]     = Math.min(1, b * 0.91 + boost);
        bufCol[o + 1] = Math.min(1, b * 0.21 + boost * 0.3);
        bufCol[o + 2] = Math.min(1, b * 0.31 + boost * 0.3);
      }
      nodeGeo.attributes.position.needsUpdate = true;
      nodeGeo.attributes.color.needsUpdate    = true;
      nodeMat.opacity = 0.22 + 0.12 * Math.sin(t * 1.5);

      // Update lines
      let lc = 0;
      const maxLC = Math.floor(lnPos.length / 6);
      for (let i = 0; i < NODES && lc < maxLC; i++) {
        for (let j = i + 1; j < NODES && lc < maxLC; j++) {
          const dx = pos[i][0] - pos[j][0];
          const dy = pos[i][1] - pos[j][1];
          const dz = pos[i][2] - pos[j][2];
          const d  = Math.sqrt(dx * dx + dy * dy + dz * dz);
          const diI = distToRay(pos[i]), diJ = distToRay(pos[j]);
          const near = diI < 150 && diJ < 150;
          const eff  = near ? 180 : MAX_DIST;
          if (d < eff) {
            const a = (1 - d / eff) * 0.5 * (near ? 1.8 : 1);
            const o = lc * 6;
            lnPos[o] = pos[i][0]; lnPos[o+1] = pos[i][1]; lnPos[o+2] = pos[i][2];
            lnPos[o+3] = pos[j][0]; lnPos[o+4] = pos[j][1]; lnPos[o+5] = pos[j][2];
            lnCol[o] = a*0.91; lnCol[o+1] = a*0.21; lnCol[o+2] = a*0.31;
            lnCol[o+3] = a*0.91; lnCol[o+4] = a*0.21; lnCol[o+5] = a*0.31;
            lc++;
          }
        }
      }
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.attributes.color.needsUpdate    = true;
      lineGeo.setDrawRange(0, lc * 2);

      // Dust
      for (let i = 0; i < DUST; i++) {
        const o = i * 3;
        dustPos[o] += dustVel[i][0]; dustPos[o+1] += dustVel[i][1]; dustPos[o+2] += dustVel[i][2];
        if (dustPos[o] > 400) dustPos[o] = -400; if (dustPos[o] < -400) dustPos[o] = 400;
        if (dustPos[o+1] > 300) dustPos[o+1] = -300; if (dustPos[o+1] < -300) dustPos[o+1] = 300;
      }
      dustGeo.attributes.position.needsUpdate = true;
      dustMat.opacity = 0.08 + 0.04 * Math.sin(t * 0.8);

      // Parallax
      scene.rotation.y = Math.sin(t * 0.1) * 0.08 + m.nx * 0.05;
      scene.rotation.x = Math.sin(t * 0.07) * 0.04 + m.ny * 0.03;

      renderer.render(scene, camera);
    };

    tick();

    return () => {
      cancelAnimationFrame(frameRef.current);
      removeEventListener('resize', onResize);
      nodeGeo.dispose(); nodeMat.dispose();
      lineGeo.dispose(); lineMat.dispose();
      dustGeo.dispose(); dustMat.dispose();
      renderer.dispose();
    };
  }, [mouse, ripple]);

  return <canvas ref={canvasRef} className="neural-bg" />;
}
