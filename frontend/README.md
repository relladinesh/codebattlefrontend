# Brawl Frontend

React frontend for Brawl - a gamified DSA learning platform.

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS with custom theme
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Animations**: Framer Motion
- **State Management**: React Query (@tanstack/react-query)
- **Routing**: Wouter
- **Forms**: React Hook Form + Zod validation

## Features

- **Gamified Learning**: XP system, levels, streaks, and achievements
- **Dark/Light Mode**: Theme switching with persistence
- **Responsive Design**: Mobile-first approach
- **Type-Safe**: Full TypeScript implementation
- **Modern UI**: 48 shadcn components with custom styling
- **Smooth Animations**: Page transitions and interactive elements

## Development

```bash
# Install dependencies
npm install

# Start dev server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Setup

Copy `.env.example` to `.env.development` and configure:

```env
VITE_API_URL=/api
```

For production, update `.env.production` with your backend URL.

## Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn components (48 components)
│   └── shared/       # Custom shared components
├── pages/            # Route pages (12 pages)
├── lib/              # Utilities and providers
├── hooks/            # Custom React hooks
├── types/            # TypeScript types and schemas
└── assets/           # Static assets
```

## API Integration

The dev server proxies `/api` requests to `http://localhost:5000` (backend server).

Make sure the backend server is running on port 5000 when developing locally.

## Design System

- **Primary Color**: Purple (#8B5CF6)
- **Secondary Color**: Cyan
- **Fonts**: Space Grotesk, Inter, JetBrains Mono
- **Custom Animations**: pulse-glow, float, gradient-shift, xp-fill, shine
- **Theme**: Dark/light mode with HSL color system

## Available Pages

- `/` - Landing page
- `/signup` - User registration
- `/login` - User login
- `/dashboard` - Main dashboard
- `/dashboard/challenges` - Challenge list
- `/dashboard/arena` - Battle arena
- `/dashboard/quests` - Quest list
- `/dashboard/leaderboard` - Global rankings
- `/dashboard/achievements` - User achievements
- `/dashboard/settings` - User settings

## Contributing

This is a personal project. Feel free to fork and modify as needed.
