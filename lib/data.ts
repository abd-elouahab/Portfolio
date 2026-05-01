import type { Project, ExperienceEntry, Certification, Skill, SkillGroup, NavItem } from './types';

// ─── Navigation ───────────────────────────────────────────

export const NAV_ITEMS: NavItem[] = [
  { id: 'about',      label: 'About' },
  { id: 'projects',   label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills',     label: 'Skills' },
  { id: 'contact',    label: 'Contact' },
];

// ─── Side Streams ─────────────────────────────────────────

export const STREAM_WORDS = [
  'GPT', 'TRANSFORMER', 'ATTENTION', 'BACKPROP', 'GRADIENT',
  'EPOCH', 'WEIGHTS', 'EMBEDDINGS', 'TOKEN', 'PROMPT',
  'FINE-TUNE', 'HALLUCINATION', 'CONTEXT', 'LATENT', 'DIFFUSION',
  'RLHF', 'AGENT', 'RAG', 'CHAIN', 'ZERO-SHOT',
];
export const SIGNAL_CHARS = ['>_', '//', '0x', '::', '[]', '{}', '<<', '>>', '&&', '||'];

// ─── Projects ─────────────────────────────────────────────

export const PROJECTS: Project[] = [
  {
    name: 'AI-Powered Customer Service Automation',
    problem: "The company's support team was overwhelmed by repetitive customer inquiries, with no after-hours coverage — leading to delayed responses and lost business opportunities.",
    solution: 'Built an intelligent chatbot that ingests internal company documents, retrieves the most relevant context via vector search, and generates accurate, human-like responses around the clock.',
    impact: 'Delivered 24/7 automated support, eliminated repetitive inquiry backlog, and freed the human team to focus on high-value interactions.',
    stack: ['Python', 'GenAI', 'Vector Search', 'REST API', 'React'],
  },
  {
    name: 'E-Commerce BI Dashboard',
    problem: 'Raw e-commerce data from orders, payments, and reviews sat in disconnected CSV files — making it impossible for decision-makers to extract actionable insights.',
    solution: 'Designed a data warehouse with a galaxy schema, built an ETL pipeline to clean and integrate heterogeneous sources, and developed interactive analytical dashboards.',
    impact: 'Enabled cross-functional business analysis across four fact tables, giving stakeholders real-time visibility into revenue trends and performance.',
    stack: ['ETL', 'SQL Server', 'Data Warehousing', 'Power BI', 'Streamlit'],
  },
  {
    name: 'Enterprise Port Operations Platform',
    problem: 'A multi-department port authority needed a unified system to manage vessel traffic, operations, finance, and HR — with strict data governance across 15+ entities.',
    solution: 'Engineered a full relational schema with role-based access control, automated business packages, security triggers, and a Java/Spring Boot integration layer.',
    impact: 'Consolidated fragmented workflows into a single secure platform with audit trails, reducing manual errors and enforcing compliance.',
    stack: ['Oracle DB', 'PL/SQL', 'Java', 'Spring Boot', 'RBAC'],
  },
  {
    name: "L'Artisan — AI Home Repair Platform",
    problem: 'Over 150,000 skilled artisans in Morocco struggle with unemployment — not due to lack of expertise, but lack of market visibility and client access.',
    solution: 'Designing a two-sided marketplace where clients upload photos of repairs needed, AI diagnoses the issue and estimates pricing, then matches them with the best-rated local artisan.',
    impact: 'Bridges the gap between supply and demand in the skilled trades sector, creating economic opportunity through technology.',
    stack: ['Computer Vision', 'Python', 'System Design', 'AI Diagnostics'],
  },
];

// ─── Experience ───────────────────────────────────────────

export const EXPERIENCES: ExperienceEntry[] = [
  {
    role: 'AI & Web Development Intern',
    org: 'Media Leo Tech — Agadir',
    period: 'Jul 2025 – Aug 2025',
    desc: 'Designed and deployed an intelligent RAG chatbot leveraging internal company documents for 24/7 automated customer service. Built the backend with FastAPI and REST APIs for chatbot management, user handling, and automatic translation. Developed a dynamic multilingual frontend in React/TypeScript and deployed the full stack on a production VPS.',
  },
  {
    role: 'Head of Production Department',
    org: 'INJAZ AL-MAGHRIB — Agadir',
    period: 'Feb 2024 – Jun 2024',
    desc: 'Led cross-departmental coordination to ensure smooth execution of production operations. Organized workflows, managed resource allocation to improve productivity and reduce costs, and maintained a positive team environment through conflict resolution and clear communication.',
  },
];

// ─── Certifications ───────────────────────────────────────

export const CERTIFICATIONS: Certification[] = [
  { name: 'OCI 2025 Generative AI Professional', issuer: 'Oracle University' },
  { name: 'Hackathon RamadanIA', issuer: 'Participation & Reward' },
  { name: 'Claude Code in Action', issuer: 'Anthropic' },
  { name: 'GenAI Job Simulation', issuer: 'Forage' },
  { name: 'Supervised Learning with scikit-learn', issuer: 'DataCamp' },
  { name: 'Introduction to Data and Data Science', issuer: '365 Data Science' },
  { name: 'Git and GitHub', issuer: '365 Data Science' },
  { name: 'Generative AI Overview for Project Managers', issuer: 'PMI' },
  { name: 'Introduction to Java', issuer: 'DataCamp' },
];

// ─── Skills ───────────────────────────────────────────────
// Radar chart categories — aligned with CV "Compétences" section

export const SKILLS: Skill[] = [
  { name: 'Programming', value: 88 },
  { name: 'AI & Data Science', value: 82 },
  { name: 'Databases', value: 82 },
  { name: 'Data Eng. & BI', value: 76 },
  { name: 'Soft Skills', value: 84 },
];

// Tag groups — strictly matching CV "Compétences" section
export const SKILL_GROUPS: SkillGroup[] = [
  {
    title: 'Langages',
    tags: ['Python', 'SQL', 'R', 'Java', 'JavaScript', 'HTML/CSS', 'C', 'Matlab', 'PHP'],
  },
  {
    title: 'IA & Data Science',
    tags: ['Machine Learning', 'Deep Learning', 'NLP', 'RAG (LangChain, FAISS)', 'LLM', 'Data Analysis', 'Data Visualization'],
  },
  {
    title: 'Data Engineering & BI',
    tags: ['ETL/ELT', 'SSIS', 'Data Warehousing', 'Galaxy Schema', 'Power BI', 'Streamlit'],
  },
  {
    title: 'Bases de données',
    tags: ['Oracle PL/SQL', 'MySQL', 'SQL Server', 'MongoDB', 'ArangoDB', 'Cassandra'],
  },
  {
    title: 'Soft Skills',
    tags: ['Teamwork', 'Communication', 'Autonomy', 'Problem-solving', 'Project Management', 'Analytical Mindset'],
  },
];
