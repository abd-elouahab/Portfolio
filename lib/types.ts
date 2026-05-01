// ─── Data ─────────────────────────────────────────────────

export interface Project {
  name: string;
  problem: string;
  solution: string;
  impact: string;
  stack: string[];
}

export interface ExperienceEntry {
  role: string;
  org: string;
  period: string;
  desc: string;
}

export interface Certification {
  name: string;
  issuer: string;
}

export interface Skill {
  name: string;
  value: number;
}

export interface SkillGroup {
  title: string;
  tags: string[];
}

export interface NavItem {
  id: string;
  label: string;
}

// ─── Mouse ────────────────────────────────────────────────

export interface MouseState {
  x: number;
  y: number;
  nx: number;
  ny: number;
}

export interface RippleEvent {
  nx: number;
  ny: number;
  time: number;
}

// ─── Component ────────────────────────────────────────────

export type FrameVariant = 'hero' | 'about' | 'projects' | 'experience' | 'certifications' | 'skills';
