import Dexie, { type Table } from 'dexie';

export interface Log {
    id?: number;
    date: string; // ISO YYYY-MM-DD
    hours_studied: number;
    focus_area: 'Python' | 'Math' | 'ML' | 'Projects' | 'Deployment' | 'Revision';
    tasks_completed: number;
    deep_work_intervals: number;
    mood: 'Fire' | 'Neutral' | 'Tired';
    blockers?: string;
    shipped_today?: string;
    created_at: Date;
}

// ... (Log interface unchanged)

export interface Project {
    id?: number;
    name: string;
    status: 'Idea' | 'Build' | 'Polish' | 'Ship' | 'Archived';
    tech_stack: string[];
    github_url?: string;
    demo_url?: string;
    hire_signal: boolean; // Computed or manual
    checklist: {
        readme: boolean;
        demo: boolean;
        metrics: boolean;
        social: boolean;
    };
    metrics?: string; // Markdown or text
    last_updated: Date;
}

export interface Skill {
    id?: number;
    name: string;
    category: string;
    current_level: number; // 1-5
    target_level: number; // 1-5
    last_updated: Date;
}

export interface Settings {
    id?: number; // Singleton, likely 1
    theme: 'dark' | 'light' | 'deep-work';
    username: string;
    role?: string; // e.g. "Engineer"
    title?: string; // e.g. "L3 • SDE II"
    level?: string; // e.g. "Level 4"
    streak: number;
    execution_score: number;
    deep_work_mode: boolean;
    avatar_url?: string;
}

export interface Application {
    id?: number;
    company: string;
    role: string;
    platform: 'LinkedIn' | 'Referral' | 'Cold Email' | 'Other';
    date_applied: string;
    status: 'Applied' | 'OA Received' | 'Interview' | 'Offer' | 'Rejected';
    follow_up_date?: string;
    notes?: string;
}

export interface Roadmap {
    id?: number;
    week: number;
    topic: string;
    goals: string[];
    project: string;
    status: 'Planned' | 'Active' | 'Completed' | 'Delayed';
}

export interface Todo {
    id?: number;
    title: string;
    description?: string;
    priority: 'High' | 'Medium' | 'Low';
    status: 'Todo' | 'In Progress' | 'Done';
    position: number;
    created_at: Date;
}

export interface Goal {
    id?: number;
    type: 'Daily' | 'Weekly' | 'Monthly';
    text: string;
    completed: boolean;
    created_at: Date;
}

export class MissionControlDB extends Dexie {
    logs!: Table<Log>;
    projects!: Table<Project>;
    skills!: Table<Skill>;
    settings!: Table<Settings>;
    applications!: Table<Application>;
    roadmap!: Table<Roadmap>;
    todos!: Table<Todo>;
    goals!: Table<Goal>;

    constructor() {
        super('MissionControlDB');
        this.version(1).stores({
            logs: '++id, date, focus_area',
            projects: '++id, status, hire_signal',
            skills: '++id, level',
            settings: '++id',
            applications: '++id, status',
            roadmap: '++id, week, status',
            todos: '++id, status, priority',
            goals: '++id, type, completed'
        });

        // V2: Schema update for Skill components
        this.version(2).stores({
            skills: '++id, category, current_level',
            roadmap: '++id, week, status, topic'
        });
    }
}

export const db = new MissionControlDB();
