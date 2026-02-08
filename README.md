# Career Connect 🚀

**The high-performance operating system for elite professionals.**

Career Connect (formerly Deep Mind) is a local-first, AI-powered career accelerator designed to help you track your work, optimize your habits, and land your dream role. It combines a Notion-style tracker with specific AI agents and a gamified progression system.

![Dashboard Preview](public/dashboard-preview.png)

## ✨ Core Features

### 🎮 Gamification Engine
-   **XP & Leveling**: Earn XP for every log, commit, and deep work session. Level up from *Novice* to *Visionary*.
-   **Global Leaderboard**: Compete with other operators in real-time.
-   **Streak System**: Visual flame tracker to keep your momentum alive.
-   **Activity Heatmap**: GitHub-style visualization of your daily consistency.

### 🧠 Neural Link (AI Agents)
-   **Resume Architect**: Turn your raw project notes into FAANG-ready resume bullet points using Gemini Pro.
-   **Cold Email Generator**: Draft high-conversion outreach emails tailored to specific companies and roles.
-   **Mock Interview Bot**: Practice technical and behavioral questions with an AI interviewer.

### ⚡ rigorous Tracking
-   **Deep Work Timer**: Pomodoro-style focus timer that tracks "Quality Hours".
-   **Project Board**: Kanban-style management for your side projects and learning goals.
-   **Job Application Tracker**: Keep tabs on every application, referral, and interview status.

### ☁️ Hybrid Architecture
-   **Local-First (Dexie.js)**: All data lives on your device for instant load times and offline support.
-   **Cloud Sync (Supabase)**: Background synchronization ensures your profile, stats, and leaderboard rank are always up to date across devices.

## 🛠️ Tech Stack

-   **Framework**: Next.js 14 (App Router)
-   **Styling**: Tailwind CSS + Framer Motion (Animations)
-   **Database**: Dexie.js (IndexedDB) + Supabase (PostgreSQL)
-   **Auth**: Supabase Auth (Google OAuth + Email)
-   **AI**: Google Gemini Pro (via Vercel SDK)

## 🚀 Getting Started

### Prerequisites
-   Node.js 18+
-   Supabase Project
-   Google Cloud Console Project (for OAuth)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/VaibhavChaudhary14/Deep_Mind.git
    cd Deep_Mind
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env.local` file:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    GEMINI_API_KEY=your_gemini_api_key
    ```

4.  **Run Locally**
    ```bash
    npm run dev
    ```

## 📦 Deployment

Deploy easily to Vercel:

1.  Push code to GitHub.
2.  Import project into Vercel.
3.  Add Environment Variables in Vercel Dashboard.
4.  **Important**: Ensure Google Cloud Console "Authorized JavaScript origins" and "Authorized redirect URIs" match your Vercel domain.

## 🤝 Contributing

Built by [Vaibhav Chaudhary](https://github.com/VaibhavChaudhary14).
Open for contributions! Feel free to fork and submit a PR.

---
*Query the impossible.*
