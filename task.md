# Task: AI Mission Control - V2 (The Acceleration Engine)

## Phase 1: Core Dashboard & Simplification (Weeks 1-2)
- [x] Implement The Main Character Dashboard
    - [x] Create `TargetIdentity` visual component (e.g., "Becoming: Senior Backend Engineer")
    - [x] Design and implement `AccelerationScore` (0-100 composite metric)
    - [x] Collapse distinct modules (Roadmap, Projects, Todos) into a unified `DailyExecutionBoard`
- [x] Kill / Hide V1 Noise Features
    - [x] Hide `Cold Email Generator` from sidebar/UI
    - [x] Hide `Interview Bot` from sidebar/UI
    - [x] Hide `Resume Architect` from sidebar/UI
    - [x] Hide `Leaderboard` from sidebar/UI
    - [x] Hide `Career Connect` from sidebar/UI

## Phase 2: The 90-Day Sprint Engine (Weeks 3-4)
- [x] Implement 90-Day Sprint Architecture
    - [x] Create Onboarding/Commitment flow for a 90-Day Sprint (Role, Skill Stack, Project Outcome)
    - [x] Generate sprint skeleton (Weekly themes, skill checkpoints) based on commitment
- [x] Implement V2 Retention Engine
    - [x] Build `WeeklyAccelerationReport` generation logic (Email + In-App notification)
    - [x] Implement `MomentumRiskAlert` (Triggered on 3+ inactive days or streak drops)
    - [x] Upgrade `SkillDeltaVisualization` (Current vs Target Gap %, Historical growth chart)

## Phase 3: AI Strategic Coach & Launch (Weeks 5-8)
- [x] Refactor AI Integration
    - [x] Pivot AI from "Generator" to "Strategic Coach"
    - [x] Enhance Blocker Diagnosis Assistant
- [x] Monetization & Launch Prep
    - [x] Implement V2 Pricing Tiers ($2 Trial, $15/mo Pro, $120/yr Operator)
    - [x] Update Landing Page positioning ("Stop Being Stuck. Start Accelerating.")
    - [x] Server-side enhancements (Compute Acceleration Score remotely, deploy report worker)

## Phase 4: Sprint Lifecycle Architecture (Manual Recommitment)
- [x] Database Schema Adjustments
    - [x] Update sprint status ENUM: `active`, `cooldown`, `completed`, `abandoned`
    - [x] Add `sprint_cycle_number` to `sprints` table
- [x] Sprint Expiry & Cooldown State
    - [x] Detect Day 90 and transition sprint to `cooldown` status
    - [x] Implement Dashboard blocker: "Sprint Complete. Do you recommit?"
- [x] Recommitment Flow Design
    - [x] Build Reflection Modal (What worked, What didn't)
    - [x] Goal Evolution (Keep, Upgrade, or New Direction)
    - [x] Confirmation Ritual & Creation of Sprint Day 1 (Cycle N+1)
- [x] Retention Engine Triggers
    - [x] Day 75: "15 days left. Start planning Sprint 2." warning
    - [x] Day 85: "Final Week. Finish Strong." warning
    - [x] Day 104 (Day 90 + 14 days cooldown): Transition to `abandoned` -> "currently off-sprint" dashboard state
    - [x] Show advanced psych stat during recommit ("80% of users see accelerated progress")

## Phase 5: Launch Execution (Revenue Safety & Integrations)
- [x] Phase 5.1: Stripe Hard-Wiring
    - [x] Install Stripe dependencies
    - [x] Add `stripe_customer_id`, `stripe_subscription_id`, `plan_tier`, `subscription_status` to Supabase `profiles` table
    - [x] Create server-side Stripe Checkout Session route `/api/checkout`
    - [x] Create Stripe Webhook handler `/api/webhooks/stripe`
- [x] Phase 5.2: Plan-Based Route Protection
    - [x] Add server-side rendering gate for $120 Architect dormant features (Resume, Interview, Cold Email)
- [x] Phase 5.3: AccelerationScore Integrity Lock
    - [x] Create `sprint_metrics` table in Supabase
    - [x] Shift 0-100 score calculation to backend and store snapshot weekly
- [x] Phase 5.4: Weekly Report via Resend
    - [x] Integrate Resend/SendGrid into `/api/cron/weekly-report`
    - [x] Provide sharp HTML formatted email template
- [x] Phase 5.5: Vercel Cron Reality Check
    - [x] Create `vercel.json` with cron schedule for weekly report
    - [x] Secure with `CRON_SECRET` validation
