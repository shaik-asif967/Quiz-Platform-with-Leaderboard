# ⚔️ Quiz Arena Pro — Gamified Educational Learning Platform

Quiz Arena Pro is a premium, responsive, desktop-first educational trivia battleground designed for modern learning environments. It features isolated workflows for **Students** and **Instructors/Administrators**, enabling interactive quest solving, real-time stat tracking, and real-time custom quiz authoring with zero cloud database configuration required!

---

## 🚀 Key Features

### 🎓 For Students
*   **Zero-Score Onboarding:** All points, levels, accuracy, and streaks start strictly at `0` for newcomers, establishing a fair competitive baseline.
*   **Gamified XP Systems:** Complete quiz cards to earn static point allocations, level up starting from Level `0`, and earn dynamic performance badges.
*   **Intuitive Category Dashboards:** Responsive category selectors for Technology, Science, Geography, History, Sports, and more.
*   **Desktop Full-Screen Integration:** Made specifically to stretch and balance fluidly on wide desktop monitors, ensuring high visibility without layout clutter.

### 👑 For Teachers & Admins
*   **Student Metrics Ledger:** Active, real-time tracking of all enrolled student performance metrics, levels, accuracy ratings, and overall XP.
*   **Dynamic Trivia Builder:** Easily establish and publish custom quiz challenges with custom questions, point rewards, duration parameters, and distinct correct-answer validation markers.
*   **Practice Log Analytics:** Review direct chronological diagnostic logs of recent interactive gameplay attempts.
*   **Default Credentials:** Log in immediately with simple credentials out-of-the-box (`admin` / `admin`).

---

## 🎨 Design Theme & Aesthetics
*   **Interactive Motion:** Fluent screen shifts powered by `@motion/react` (formerly Framer Motion) with elegant fade transitions.
*   **Cosmic Slate Theme:** Dark mode aesthetic employing high-contrast deep charcoal and purple accents with crisp text legibility.
*   **High Quality Visual Assets:** High-resolution responsive graphic interfaces embedded in login structures and active card dashboards.

---

## 🛠️ Built With

*   **Vite** — Fast, modern React bundling
*   **React (v18+)** — Declarative UI building
*   **Tailwind CSS** — Fluid utility-first styling
*   **Motion/React** — Smooth micro-interactions and route animations
*   **Lucide React** — Elegant vector UI symbols

---

## 🎮 Getting Started (Local Development)

### 📋 Prerequisites
*   [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
*   [npm](https://www.npmjs.com/) 

### ⚙️ Installation & Build Setup

1. **Clone the Repository:**
   ```bash
   git clone <your-github-repo-url>
   cd quiz-arena-pro
   ```

2. **Install Frontend Dependencies:**
   ```bash
   npm install
   ```

3. **Boot Local Development Server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000` to preview the applet.

4. **Run Linter Checks:**
   ```bash
   npm run lint
   ```

5. **Compile Production Build:**
   ```bash
   npm run build
   ```

---

## 🛡️ Default Authentication Credentials

| Portal | Default Username | Security Passcode |
| :--- | :--- | :--- |
| **Student Portal** (Or Register New) | `asif_quiz` | *None required* (Select Profiles Grid) |
| **Admin Portal** | `admin` | `admin` |

---

## 📂 File Directory Map

*   `src/App.tsx` — Main portal navigation manager and navigation coordinator
*   `src/types.ts` — Main TypeScript type declarations, enums, & shape boundaries 
*   `src/components/` — Sub-component catalog
    *   `Login.tsx` — Separated student enrollment and admin credentials verification
    *   `AdminPanel.tsx` — Instructor analytics dashboard and dynamic quiz authoring tool
    *   `Dashboard.tsx` — Student overview, personalized welcome card, and category selector
    *   `QuizPlaying.tsx` — Full-screen responsive quiz taking view with helper timer
    *   `QuizResult.tsx` — End-session summary showing points gained, correct answers ratio, and unlock honors
    *   `Leaderboard.tsx` — Active podium showing top competing student scores
    *   `ProfileSettings.tsx` — Student profile and persistent score data manager
*   `src/utils/storage.ts` — High fidelity localStorage state synchronization and data persistence helper
*   `src/data/quizzes.ts` — Initial foundational trivia question deck datasets
