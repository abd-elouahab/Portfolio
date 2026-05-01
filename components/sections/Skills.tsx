'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { SKILLS, SKILL_GROUPS } from '@/lib/data';
import { sectionReveal, staggerContainer, fadeUp } from '@/lib/motion';
import { playTick } from '@/lib/sounds';

const CX = 150, CY = 150, R = 105, RINGS = 4;
const NS = 'http://www.w3.org/2000/svg';
const N  = SKILLS.length;
const angle = (i: number) => (2 * Math.PI * i / N) - Math.PI / 2;

export default function Skills() {
  const built   = useRef(false);
  const gridRef = useRef<SVGGElement>(null);
  const axesRef = useRef<SVGGElement>(null);
  const lblRef  = useRef<SVGGElement>(null);
  const polyRef = useRef<SVGPolygonElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const svgRef  = useRef<SVGSVGElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; name: string; value: number } | null>(null);

  const buildGrid = useCallback(() => {
    if (built.current) return;
    built.current = true;
    const g = gridRef.current, a = axesRef.current, l = lblRef.current;
    if (!g || !a || !l) return;

    for (let ri = 1; ri <= RINGS; ri++) {
      const rr = R * ri / RINGS;
      const pts = Array.from({ length: N }, (_, i) => {
        const ang = angle(i);
        return `${(CX + rr * Math.cos(ang)).toFixed(1)},${(CY + rr * Math.sin(ang)).toFixed(1)}`;
      }).join(' ');
      const p = document.createElementNS(NS, 'polygon');
      p.setAttribute('points', pts);
      p.setAttribute('fill', 'none');
      p.setAttribute('stroke', 'rgba(255,255,255,0.07)');
      p.setAttribute('stroke-width', '0.5');
      g.appendChild(p);
    }

    for (let i = 0; i < N; i++) {
      const ang = angle(i);
      const x2 = CX + R * Math.cos(ang), y2 = CY + R * Math.sin(ang);
      const line = document.createElementNS(NS, 'line');
      line.setAttribute('x1', String(CX)); line.setAttribute('y1', String(CY));
      line.setAttribute('x2', x2.toFixed(1)); line.setAttribute('y2', y2.toFixed(1));
      line.setAttribute('stroke', 'rgba(255,255,255,0.1)'); line.setAttribute('stroke-width', '0.5');
      a.appendChild(line);

      const lx = CX + (R + 16) * Math.cos(ang), ly = CY + (R + 16) * Math.sin(ang);
      const txt = document.createElementNS(NS, 'text');
      txt.setAttribute('x', lx.toFixed(1)); txt.setAttribute('y', ly.toFixed(1));
      txt.setAttribute('text-anchor', Math.cos(ang) < -0.1 ? 'end' : Math.cos(ang) > 0.1 ? 'start' : 'middle');
      txt.setAttribute('dominant-baseline', 'middle');
      txt.setAttribute('font-family', "'VT323', monospace");
      txt.setAttribute('font-size', '12');
      txt.setAttribute('fill', '#52525b');
      txt.setAttribute('class', `radar-label radar-label-${i}`);
      txt.textContent = SKILLS[i].name;
      l.appendChild(txt);
    }
  }, []);

  const animateRadar = useCallback(() => {
    buildGrid();
    const poly = polyRef.current;
    if (!poly) return;
    const targets = SKILLS.map(s => s.value / 100);
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1400, 1);
      const e = 1 - Math.pow(1 - p, 3);
      poly.setAttribute('points', targets.map((v, i) => {
        const ang = angle(i);
        return `${(CX + R * v * e * Math.cos(ang)).toFixed(1)},${(CY + R * v * e * Math.sin(ang)).toFixed(1)}`;
      }).join(' '));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [buildGrid]);

  const animateTags = useCallback(() => {
    const tags = tagsRef.current?.querySelectorAll<HTMLSpanElement>('.skill-tag');
    tags?.forEach((tag, i) => {
      tag.style.opacity = '0';
      tag.style.transform = 'translateY(6px)';
      tag.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      setTimeout(() => { tag.style.opacity = '1'; tag.style.transform = 'translateY(0)'; }, 30 * i);
    });
  }, []);

  useEffect(() => {
    if (!visible) return;
    const id = setTimeout(() => { animateRadar(); setTimeout(animateTags, 300); }, 200);
    return () => clearTimeout(id);
  }, [visible, animateRadar, animateTags]);

  // SVG hover detection for radar points
  const handleSvgMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scaleX = 300 / rect.width;
    const scaleY = 300 / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;

    let closest = -1;
    let closestDist = Infinity;
    for (let i = 0; i < N; i++) {
      const v = SKILLS[i].value / 100;
      const ang = angle(i);
      const px = CX + R * v * Math.cos(ang);
      const py = CY + R * v * Math.sin(ang);
      const d = Math.hypot(mx - px, my - py);
      if (d < 25 && d < closestDist) {
        closest = i;
        closestDist = d;
      }
    }

    if (closest >= 0) {
      setHovered(closest);
      const v = SKILLS[closest].value / 100;
      const ang = angle(closest);
      const px = CX + R * v * Math.cos(ang);
      const py = CY + R * v * Math.sin(ang);
      setTooltip({
        x: px / 300 * rect.width + rect.left,
        y: py / 300 * rect.height + rect.top,
        name: SKILLS[closest].name,
        value: SKILLS[closest].value,
      });
    } else {
      setHovered(null);
      setTooltip(null);
    }
  }, []);

  const handleSvgLeave = useCallback(() => {
    setHovered(null);
    setTooltip(null);
  }, []);

  // Highlight hovered axis label
  useEffect(() => {
    const labels = lblRef.current?.querySelectorAll('text');
    labels?.forEach((lbl, i) => {
      lbl.setAttribute('fill', i === hovered ? '#e8364e' : '#52525b');
      lbl.setAttribute('font-size', i === hovered ? '14' : '12');
    });
    // Highlight hovered axis line
    const lines = axesRef.current?.querySelectorAll('line');
    lines?.forEach((ln, i) => {
      ln.setAttribute('stroke', i === hovered ? 'rgba(232,54,78,0.5)' : 'rgba(255,255,255,0.1)');
      ln.setAttribute('stroke-width', i === hovered ? '1.5' : '0.5');
    });
  }, [hovered]);

  return (
    <section id="skills">
      <motion.div
        className="section-inner"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        onViewportEnter={() => setVisible(true)}
      >
        <h2 className="section-title">
          <span className="section-number">04</span>
          Skills & Methodologies
        </h2>

        <div className="skills-layout">
          <div className="radar-container">
            <svg
              ref={svgRef}
              className="radar-svg"
              viewBox="0 0 300 300"
              xmlns="http://www.w3.org/2000/svg"
              onMouseMove={handleSvgMove}
              onMouseLeave={handleSvgLeave}
            >
              <defs>
                <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(232,54,78,0.25)" />
                  <stop offset="100%" stopColor="rgba(232,54,78,0.08)" />
                </radialGradient>
              </defs>
              <g ref={gridRef} />
              <g ref={axesRef} />
              <polygon ref={polyRef} fill="url(#radarFill)" stroke="#e8364e" strokeWidth="1.5" points="" filter="url(#glow)" />

              {/* Hoverable data points */}
              {visible && SKILLS.map((s, i) => {
                const v = s.value / 100;
                const ang = angle(i);
                return (
                  <circle
                    key={i}
                    cx={CX + R * v * Math.cos(ang)}
                    cy={CY + R * v * Math.sin(ang)}
                    r={hovered === i ? 5 : 3}
                    fill={hovered === i ? '#e8364e' : 'rgba(232,54,78,0.7)'}
                    stroke={hovered === i ? '#fff' : 'none'}
                    strokeWidth="1"
                    style={{ transition: 'all 0.2s ease' }}
                  />
                );
              })}
              <g ref={lblRef} />
            </svg>

            {/* Tooltip */}
            {tooltip && (
              <div
                className="radar-tooltip"
                style={{
                  left: tooltip.x,
                  top: tooltip.y - 40,
                }}
              >
                <span className="radar-tooltip-name">{tooltip.name}</span>
                <span className="radar-tooltip-value">{tooltip.value}%</span>
              </div>
            )}
          </div>

          <motion.div
            ref={tagsRef}
            className="skills-tags-area"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {SKILL_GROUPS.map((grp, gi) => (
              <motion.div key={gi} className="skill-group" variants={fadeUp}>
                <h3>{grp.title}</h3>
                <div className="skill-tags">
                  {grp.tags.map((tag, ti) => <span key={ti} className="skill-tag" data-magnetic onMouseEnter={() => playTick()}>{tag}</span>)}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
