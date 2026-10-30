# 🎮 Kabaad to Karodpati — Desi Auto & Scrap Empire

> **The Ultimate Indian Trade, Automotive & Business Life Simulator**
> From footpath collector (बोरी-मैन) to automotive tycoon (टाइकून) — build your empire from scrap to crores!

---

## 🚀 Quick Start (5 Minutes to Playable)

### Prerequisites
- **GitHub Account** (for Codespaces + Actions)
- **Android Phone** with USB Debugging (for mobile testing)
- **No local installs required!** Everything runs in cloud.

---

### 1. Create Repo & Open in Codespaces
```bash
# On GitHub.com:
# 1. New Repository → "kabaad-to-karodpati" → Public
# 2. Push this folder to the repo (see below)
# 3. Open repo → Code → Codespaces → "Create codespace on main"
```

### 2. Start Dev Server (in Codespaces Terminal)
```bash
cd apps/web && npm run dev
```
→ **Port 3000 auto-forwards** → Click "Open in Browser" → **Game runs!**

### 3. Test on Your Phone
- Same WiFi → open forwarded URL on phone browser
- **Or**: Codespaces → Ports tab → Right-click 3000 → "Copy Local Address" → paste on phone

### 4. Build Windows .exe (Cloud)
```bash
gh workflow run build-windows.yml
```
→ Download `.msi` installer from **Actions → Artifacts**

### 5. Build Android .apk (Cloud)
```bash
gh workflow run build-android.yml
```
→ Download `app-debug.apk` from **Actions → Artifacts** → Install on phone

---

## 🎯 Expo Checklist (Nov 3-4)

| Day | Target | Status |
|-----|--------|--------|
| **Day 1** | Garage scene + 1 car + basic UI + mobile test | 🎯 |
| **Day 2** | Buy/Sell/Dismantle loop + scrap kanta + cash/inventory | 🎯 |
| **Day 3** | Negotiation chat + Bahi Khata ledger + progression stages | 🎯 |
| **Day 4** | Monsoon/Shaadi events + RTO/loan systems + polish | 🎯 |
| **Day 5** | Windows build + Android build + demo rehearsal | 🎯 |

---

## 🏗️ Architecture

```
kabaad-to-karodpati/
├── apps/
│   ├── web/          # Next.js 15 + React 19 + Three.js (R3F) — MAIN GAME
│   ├── desktop/      # Tauri v2 config → Windows .exe/.msi
│   └── mobile/       # Capacitor v6 config → Android .apk/.aab
├── packages/
│   └── shared/       # TypeScript types, vehicle data, economy, progression (shared across platforms)
├── .github/workflows/  # CI/CD: dev server, Windows build, Android build
└── turbo.json        # Turborepo for fast builds
```

---

## 🎮 Core Gameplay Systems (From PRD)

| System | Implementation |
|--------|----------------|
| **Scrap Market** | Dynamic daily rates (7 materials) with seasonal events |
| **Vehicle Dismantling** | Part-by-part extraction vs Quick Crush (JCB) |
| **Complete Car Resale** | Buy → Repair → List → Negotiate → Sell (Kachha/Pakka) |
| **6-Stage Progression** | Bori-Man → Thela-Wala → Galli Garage → Dealership → Industrial Yard → Tycoon |
| **Indian Bureaucracy** | RTO NOC/Fitness, Kachha vs Pakka bills, IT Raid risk, Loans, Recovery agents |
| **Staff Management** | Chhotu, Ustaad Ji, Bablu, Munim Ji, Sheru Paji with special abilities |
| **Seasonal Events** | Monsoon (hydrolocked engines), Shaadi Season (white SUV demand), Diwali, Highway Strike |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **3D Engine** | Three.js + React Three Fiber (R3F) |
| **UI Framework** | Next.js 15 + React 19 + Tailwind CSS |
| **State Management** | Zustand (persisted to localStorage) |
| **Desktop Build** | Tauri v2 (Rust backend, WebView2) |
| **Mobile Build** | Capacitor v6 (Chrome WebView) |
| **Shared Logic** | TypeScript (packages/shared) |
| **CI/CD** | GitHub Actions (Windows + Ubuntu runners) |
| **Cloud Dev** | GitHub Codespaces (60h/mo free) |

---

## 📱 Mobile Optimization Checklist

- [ ] Low-poly models (< 2k tris per vehicle)
- [ ] Texture atlasing (single material per vehicle)
- [ ] Baked lighting (no real-time shadows on mobile)
- [ ] InstancedMesh for scrap piles, tyre stacks
- [ ] LOD system for distant objects
- [ ] Touch controls (pan/zoom/rotate)
- [ ] 30+ FPS on mid-range Android (test on your device!)

---

## 🎨 Art Pipeline (Blender → Game)

1. **Model in Blender** → Export GLTF/GLB
2. **Naming Convention** for detachable parts:
   ```
   VehicleRoot
   ├── Body (non-detachable)
   ├── Engine (detachable, installable)
   ├── Gearbox (detachable, installable)
   ├── Wheels_FL, Wheels_FR, Wheels_RL, Wheels_RR
   ├── Doors_FL, Doors_FR, Doors_RL, Doors_RR
   ├── Hood, Trunk, Bumpers_F, Bumpers_R
   └── Interior_Seats, Interior_Dashboard
   ```
3. **Drop in** `apps/web/public/models/{vehicleId}.glb`
4. **Hot reload** in Codespaces → test immediately

---

## 🔧 Development Commands

```bash
# In Codespaces terminal:

# Start dev server
cd apps/web && npm run dev

# Type check
npm run typecheck

# Lint
npm run lint

# Build web (static export)
npm run build:web

# Build Windows (triggers GitHub Action)
gh workflow run build-windows.yml

# Build Android (triggers GitHub Action)
gh workflow run build-android.yml

# View logs
gh run list --limit 5
gh run view <run-id> --log
```

---

## 📦 GitHub Secrets Required (for Release Builds)

| Secret | Purpose |
|--------|---------|
| `TAURI_PRIVATE_KEY` | Tauri code signing (Windows) |
| `TAURI_KEY_PASSWORD` | Tauri key password |
| `KEYSTORE_BASE64` | Base64-encoded Android keystore |
| `KEYSTORE_PASSWORD` | Keystore password |
| `KEY_ALIAS` | Key alias |
| `KEY_PASSWORD` | Key password |

> **For Expo/Demo**: Debug builds work **without** secrets! Only needed for Play Store / production Windows signing.

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Codespaces won't start | Repo must be **Public** for free tier; check 60h/mo limit |
| Port 3000 not forwarding | Codespaces → Ports → Right-click 3000 → "Port Visibility: Public" |
| Mobile build fails | Check `apps/mobile/android/` exists; run `cap sync` locally first |
| Windows build fails | Ensure Rust toolchain installed; check Tauri v2 compat |
| Three.js not loading | Check browser console; ensure `output: "export"` in next.config.js |
| Save not persisting | Zustand persist middleware uses localStorage; check browser settings |

---

## 📄 License

MIT License — Build your empire freely!

---

## 🙏 Credits

- **Game Design**: PRD by [Your Team]
- **Engine**: Three.js, React Three Fiber, Next.js, Tauri, Capacitor
- **Icons**: Lucide React
- **Fonts**: Inter, Rajdhani, Noto Sans Devanagari (Google Fonts)
- **Inspiration**: Mayapuri, Kurla, Chor Bazaar — the real desi auto hubs

---

**Built with ❤️ for Expo 2024 | Jai Hind! 🇮🇳**