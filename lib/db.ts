import Dexie, { type Table } from 'dexie';

export interface Log {
    id?: number;
    sprint_id?: string;
    date: string; // ISO YYYY-MM-DD
    hours_studied: number;
    focus_area: 'Deep Work' | 'Learning' | 'Projects' | 'Planning' | 'Outreach' | 'Admin';
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
    status: 'Idea' | 'Draft' | 'In Progress' | 'Review' | 'Done' | 'Archived';
    tech_stack: string[]; // Can be "Tools Used"
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
    active_sprint?: string; // UUID of current sprint
    username: string;
    role?: string; // e.g. "Product Designer"
    title?: string; // e.g. "Senior Associate"
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
    sprint_id?: string;
    week: number;
    topic: string;
    goals: string[];
    project: string;
    status: 'Planned' | 'Active' | 'Completed' | 'Delayed';
}

export interface Todo {
    id?: number;
    sprint_id?: string;
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

export interface Sprint {
    id: string; // UUID
    target_role: string;
    primary_skill_focus: string;
    primary_project_focus: string;
    sprint_cycle_number: number;
    start_date: string; // ISO
    end_date: string; // ISO
    status: 'active' | 'cooldown' | 'completed' | 'abandoned';
    created_at: Date;
}

export interface AIPlan {
    id?: number;
    role: string;
    content: any[];
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
    sprints!: Table<Sprint>;
    ai_plans!: Table<AIPlan>;

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

        // V3: 90-Day Sprint Engine Migration
        this.version(3).stores({
            sprints: 'id, status, start_date',
            logs: '++id, date, focus_area, sprint_id',
            roadmap: '++id, week, status, topic, sprint_id',
            todos: '++id, status, priority, sprint_id'
        }).upgrade(async tx => {
            // Dexie handles adding new columns
        });

        // V4: Sprint Lifecycle & Cycle Numbers
        this.version(4).stores({
            sprints: 'id, status, start_date, sprint_cycle_number'
        }).upgrade(async tx => {
            await tx.table('sprints').toCollection().modify(sprint => {
                if (!sprint.sprint_cycle_number) {
                    sprint.sprint_cycle_number = 1;
                }
            });
        });

        // V5: Standalone AI Plans
        this.version(5).stores({
            ai_plans: '++id, role'
        });

        // V6: Add created_at index to AI Plans for sorting
        this.version(6).stores({
            ai_plans: '++id, role, created_at'
        });
    }
}

export const db = new MissionControlDB();
