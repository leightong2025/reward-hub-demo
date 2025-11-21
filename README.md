# Reward Hub — Web Demo (Clean iOS Minimal - Style B)

This is a self-contained static website that simulates a JustPlay-style rewards app. It runs entirely in the browser and uses `localStorage` as a demo database.

**What it includes**
- Play simulated external offers (time-play simulation)
- Built-in mini-games (scratch card, spin, watch ad)
- Points system: 500,000 pts = $20
- Simulated cashout requests (stored locally; no real PayPal)
- Clean iOS-minimal visual design

## How to host on GitHub Pages (quick)
1. Create a GitHub repository (e.g., `reward-hub-demo`).
2. Upload all files from this zip (or drag & drop) to the repo root on GitHub.
3. In repo settings → Pages, set the source to the `main` branch (root).
4. Save. GitHub Pages will publish at `https://<your-username>.github.io/<repo-name>/` within a minute or two.
5. Open that URL on your iPhone Safari.

## Notes & next steps
- This demo **does not** perform real payouts. To pay users you need a backend server and PayPal Payouts integration.
- I can provide a Node.js server template + step-by-step GitHub Action to deploy automatically. Reply **"Server + Deploy"** if you want that.
