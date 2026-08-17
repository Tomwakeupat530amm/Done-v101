# Atomic Recovery

> A private, local-first desktop app for addiction recovery. Built with Electron, React, TypeScript, and SQLite.

**Your data never leaves your device.**

---

## Features

- 🛡️ **Sobriety counter** — Live days, hours, minutes tracking
- ✅ **Habit tracking** — Daily check-in with streak calendar
- 🚨 **Emergency Mode** — Full-screen urge overlay with timer (`Ctrl+E` / `Cmd+E`)
- 📓 **Journal** — Morning intention + evening reflection with auto-save
- 😊 **Mood tracking** — 5-state mood + energy level
- 👤 **Identity (Future Self)** — Identity statements and affirmations
- 📊 **Analytics** — Mood trends, habit stats, recovery summary
- 🔒 **PIN Lock** — Optional app-level PIN security
- 🌙 **Dark mode** — Default, always

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Shell | Electron 39 + electron-vite |
| Frontend | React 19 + TypeScript |
| Styling | Tailwind CSS v4 + ShadcnUI |
| State | Zustand + TanStack Query |
| Database | SQLite via Prisma ORM |
| Animations | Framer Motion |
| Icons | Lucide React |

---

## Development

### Prerequisites
- Node.js 20+
- npm 10+

### Setup

```bash
# Install dependencies
npm install

# Run database migrations
npm run db:migrate

# Seed default data
npm run db:seed

# Start development server
npm run dev
```

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development app |
| `npm run typecheck` | Run TypeScript checks (node + web) |
| `npm run build` | Typecheck + build for production |
| `npm run build:win` | Build Windows installer (.exe) |
| `npm run build:mac` | Build macOS disk image (.dmg) |
| `npm run build:linux` | Build Linux AppImage + deb |
| `npm run db:migrate` | Apply Prisma migrations |
| `npm run db:seed` | Seed default settings |
| `npm run db:studio` | Open Prisma Studio |

---

## Project Structure

```
src/
  main/               # Electron main process
    services/         # Business logic (RecoveryService, HabitService, etc.)
    ipc/              # IPC handlers (one file per feature)
    database/         # PrismaClient singleton
  preload/            # Context bridge (type-safe IPC)
  renderer/src/       # React frontend
    components/       # Shared UI components
    features/         # Feature modules (recovery, habits, journal, etc.)
    pages/            # Top-level page components
    stores/           # Zustand stores
  shared/             # Types and DTOs shared between main and renderer
    types/            # TypeScript interfaces
    dtos/             # Input DTOs (Zod validated)
prisma/
  schema.prisma       # Database schema
  migrations/         # SQLite migrations
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+E` / `Cmd+E` | Open Emergency Mode |
| `Ctrl+1` / `Cmd+1` | Dashboard |
| `Ctrl+2` / `Cmd+2` | Recovery |
| `Ctrl+3` / `Cmd+3` | Habits |
| `Ctrl+4` / `Cmd+4` | Journal |
| `Ctrl+5` / `Cmd+5` | Identity |
| `Ctrl+6` / `Cmd+6` | Analytics |

---

## Privacy

All data is stored locally in SQLite at your OS user data directory:
- **Windows:** `%APPDATA%\atomic-recovery\database.db`
- **macOS:** `~/Library/Application Support/atomic-recovery/database.db`
- **Linux:** `~/.config/atomic-recovery/database.db`

No telemetry. No cloud sync. No accounts.

---

## License

MIT
