# TaskFlow — Modern Todo App with Authentication

A cross-platform Todo application built with Expo SDK 58, Expo Router, and React Native.

## Features

- **Authentication System**:
  - Sign up with Email, Password, and Display Name
  - Sign in with credential validation
  - Persistent user sessions (stays logged in on restart)
  - Quick Demo / Continue as Guest mode for instant testing
  - Log out with confirmation
  - **Dual Mode**: Runs with **Local / Offline Authentication** out-of-the-box via AsyncStorage, or connects seamlessly to **Supabase Cloud Auth & Database** when environment variables are added.
- **Todo & Task Management**:
  - Create new tasks with title, description, priority, category, and due date
  - Toggle completion status with checkmark
  - Edit existing tasks via modal sheet
  - Delete tasks with confirmation
  - Clear completed tasks in one tap
  - Horizontal category filtering (`All`, `Work`, `Personal`, `Shopping`, `Health`, `Other`) with live task counts
  - Status filter tabs (`All`, `Pending`, `Completed`)
  - Real-time search by task title or description
  - Progress bar and summary metrics (Total, Pending, Completed, % Done)
  - Pre-seeded welcome tasks for new accounts

## Tech Stack

- **Framework**: Expo (SDK 58) / React Native (0.88)
- **Routing**: Expo Router (file-based navigation with typed routes)
- **Icons**: `@expo/vector-icons` (Ionicons)
- **State & Storage**: React Context + `@react-native-async-storage/async-storage`
- **Backend / Auth**: `@supabase/supabase-js` (optional cloud sync)

## Project Structure

```
src/
├── app/
│   ├── _layout.tsx           # Root navigation guard & context providers
│   ├── index.tsx             # Root redirect
│   ├── (auth)/
│   │   ├── _layout.tsx       # Auth stack
│   │   ├── login.tsx         # Sign in & Quick Demo screen
│   │   └── signup.tsx        # Sign up screen
│   └── (app)/
│       ├── _layout.tsx       # App stack
│       └── index.tsx         # Main todo dashboard
├── components/
│   ├── Header.tsx            # Avatar, greeting, status pill, search, logout
│   ├── StatsCard.tsx         # Progress bar and metric counters
│   ├── CategoryFilter.tsx    # Category pills & status segments
│   ├── TodoItem.tsx          # Interactive task item card
│   └── TodoModal.tsx         # Create / edit task modal sheet
├── context/
│   ├── AuthContext.tsx       # Authentication provider
│   └── TodoContext.tsx       # Todo state & persistence provider
├── services/
│   ├── storage.ts            # AsyncStorage persistence layer
│   └── supabase.ts           # Supabase client initialization
└── types/
    └── index.ts              # TypeScript definitions
```

## Running the App

### 1. Start Dev Server
```bash
npx expo start
```

### 2. Run on Web
Press `w` in the terminal or run:
```bash
npx expo start --web
```

### 3. Run on Mobile (iOS / Android)
- Scan the QR code with **Expo Go** on Android or the Camera app on iOS.
- Or press `a` for Android Emulator / `i` for iOS Simulator.

## Optional: Connect to Supabase

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Put your Supabase project credentials in `.env`:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Run the SQL schema from [`scripts/supabase-schema.sql`](file:///c:/Users/johnd/Downloads/website/todoapp/scripts/supabase-schema.sql) in your Supabase SQL Editor.
4. Restart the Expo server (`npx expo start -c`). The app will automatically switch to cloud sync.
