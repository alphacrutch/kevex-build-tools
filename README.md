# Kevex ProBuild Suite MVP

Kevex ProBuild Suite is a Vue 3 + Vite + Pinia + Firebase PWA for generating estimates, saving quotes, managing clients, and tracking job profit.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and fill in your Firebase project values.

3. Start the development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

## Firebase

This app expects Firebase Authentication and Firestore to be enabled.

- Auth provider: Email/Password
- Firestore collections: `users`, `quotes`, `clients`, `jobs`

Supporting artifacts are included in [`firebase/firestore.rules`](C:\Web Projects\kevex-build-tools\firebase\firestore.rules) and [`firebase/firestore.indexes.json`](C:\Web Projects\kevex-build-tools\firebase\firestore.indexes.json).
