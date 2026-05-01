'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROJECTS } from '@/lib/data';
import { sectionReveal, staggerContainer, scaleIn } from '@/lib/motion';
import { useTilt } from '@/hooks/use-tilt';
import { playTick } from '@/lib/sounds';
import type { Project } from '@/lib/types';

/* ── Individual project card with 3D tilt ──────────────── */

function ProjectCard({ project, index, expanded, onToggle }: {
  project: Project;
  index: number;
  expanded: boolean;
  onToggle: (i: number) => void;
}) {
  const tilt = useTilt(6, 1.01);

  return (
    <motion.article
      className={`project-card${expanded ? ' project-card--expanded' : ''}`}
      variants={scaleIn}
      data-magnetic
      onClick={() => onToggle(index)}
      onMouseEnter={() => playTick()}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      style={{ transition: 'transform 0.15s ease-out, box-shadow 0.3s ease, border-color 0.3s ease' }}
    >
      {/* Light reflection overlay */}
      <div className="card-glare" />

      {/* Top accent line */}
      <div className="project-card-accent" />

      {/* Header */}
      <h3 className="project-name">{project.name}</h3>

      {/* Brief — always visible */}
      <p className="project-brief">{project.problem}</p>

      {/* Expandable detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="project-detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="project-section">
              <span className="project-label">Solution</span>
              <p>{project.solution}</p>
            </div>
            <div className="project-section">
              <span className="project-label">Impact</span>
              <p>{project.impact}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stack tags */}
      <div className="project-stack">
        {project.stack.map((tech, j) => (
          <span key={j} className="stack-tag">{tech}</span>
        ))}
      </div>

      {/* Expand indicator */}
      <span className="project-expand-hint">
        {expanded ? '[ COLLAPSE ]' : '[ EXPAND ]'}
      </span>
    </motion.article>
  );
}

/* ── Projects section ──────────────────────────────────── */

export default function Projects() {
  const [expanded, setExpanded] = useState<number | null>(null);

  const toggle = useCallback((i: number) => {
    setExpanded(prev => (prev === i ? null : i));
  }, []);

  return (
    <section id="projects">
      <motion.div
        className="section-inner"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <h2 className="section-title">
          <span className="section-number">02</span>
          Projects
        </h2>

        <motion.div
          className="projects-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {PROJECTS.map((project, i) => (
            <ProjectCard
              key={i}
              project={project}
              index={i}
              expanded={expanded === i}
              onToggle={toggle}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
