# White Screen & 404 Error Fix

## The Problem
You are seeing a white screen and 404 errors for files like:
- `/@vite/client`
- `/src/main.tsx`
- `/@react-refresh`

## The Cause
These errors happen because **your browser has cached a Service Worker from a different project** (likely a Vite-based project) that was running on `localhost:3000`.

Even though you are running a Next.js project now, the old Service Worker is still active in your browser. It intercepts your requests and tries to load files that don't exist in this project (like `main.tsx`), causing the white screen.

## The Solution

### Option 1: Run on a different port (Easiest)
I have added a new script to your `package.json` to run the project on port **3001**, which will bypass the old Service Worker.

1. Stop the current server (Ctrl+C).
2. Run this command:
   ```bash
   npm run dev:safe
   ```
3. Open `http://localhost:3001` in your browser.

### Option 2: Clear the Service Worker
If you want to keep using port 3000:
1. Open your browser's Developer Tools (F12).
2. Go to the **Application** tab.
3. Click on **Service Workers** in the left sidebar.
4. Click **"Unregister"** for `localhost:3000`.
5. Refresh the page (Ctrl+F5).
