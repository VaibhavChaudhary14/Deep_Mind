# "Jedi" Neo-Brutalist Redesign

## Goal
Transform the UI from dark "Cyber-Stealth" to a bright, retro, "Neo-Brutalist" aesthetic based on the provided reference.

## Design System

### Colors
- **Background Main**: `#FBF9F1` (Cream/Off-white)
- **Sidebar**: `#A3D9B5` (Sage/Mint Green) or `#B8E3C9`
- **Card Backgrounds**: `#FFFFFF` (White), `#FAE392` (Mustard Yellow), `#F3C5D8` (Soft Pink)
- **Text**: `#000000` (Stark Black)
- **Borders**: `#000000` (2px solid)
- **Shadows**: `4px 4px 0px 0px #000000` (Hard shadow)

### Typography
- **Headings**: `Space Mono` or `Courier Prime` (Monospace/Typewriter feel)
- **Body**: `Inter` or `Public Sans` (Clean sans-serif for readability)

### New Components
#### [NEW] [components/providers/auth-provider.tsx](file:///D:/Projects/Tracker/components/providers/auth-provider.tsx)
- Context that manages `isAuthenticated`.
- Checks `localStorage` on mount.
- Provides `login()` (sets flag, redirects to /dashboard) and `logout()` (clears flag, redirects to /).
- Wraps the application layout.

#### [NEW] [app/onboarding/page.tsx](file:///D:/Projects/Tracker/app/onboarding/page.tsx)
- **Purpose**: Collect user details to build their profile.
- **Questions**: Name, Role/Profession (e.g. AI Engineer, Full Stack), Level, Main Goal.
- **Action**: On submit, save to `db.settings`, set `isAuthenticated`, and redirect to `/dashboard`.

### Modified Files
#### [MODIFY] [app/layout.tsx](file:///D:/Projects/Tracker/app/layout.tsx)
- Wrap children in `AuthProvider`.

#### [MODIFY] [app/page.tsx](file:///D:/Projects/Tracker/app/page.tsx)
- "Start Mission" button logic:
    - Check if `db.settings` has a profile.
    - If yes -> Login -> Dashboard.
    - If no -> Redirect to `/onboarding`.

#### [MODIFY] [components/layout/sidebar.tsx](file:///D:/Projects/Tracker/components/layout/sidebar.tsx)
- Add a "Logout" button.

#### [MODIFY] [components/layout/shell.tsx](file:///D:/Projects/Tracker/components/layout/shell.tsx)
- Add a check: if not authenticated, redirect to `/`.

## Verification
- Clear DB/Local Storage.
- Click "Start Mission" -> Verify redirect to `/onboarding`.
- Fill Form -> Submit.
- Verify redirect to `/dashboard`.
- Verify Sidebar shows the new Name/Role.
- Logout -> Return to Landing.
- Click "Start Mission" -> Verify redirect to `/dashboard` (skip onboarding).

### Components To Refactor

#### 1. Global Styles (`app/globals.css`)
- Define new CSS variables.
- Create `.neo-card` utility for borders and shadows.
- Reset body background to Cream.

#### 2. Layout (`Shell` & `Sidebar`)
- **Boxy Layout**: Sidebar should be a distinct bordered box on the left.
- **Top Bar**: Simple border bottom, breadcrumbs or simple title.

#### 3. Feature Views
- **Dashboard**: Update charts to use black strokes and bold colors.
- **Todos**: KanBan cards with hard shadows.
- **Roadmap**: Timeline with thick lines.

### Execution Plan
1.  **Fonts**: Add `Space Mono` to `layout.tsx`.
2.  **Globals**: Replace dark theme vars with "Jedi" palette.
3.  **Shell**: Remove gradients/blurs, apply solid colors/borders.
4.  **Components**: Iterate through Sidebar, Dashboard, Todos to apply `.neo-card`.
