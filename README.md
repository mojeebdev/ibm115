# IBM 115 · Remember When

A community memory wall celebrating IBM's 115th anniversary (June 16, 1911 – 2026). Share your first IBM product, get a personalized historical note from Gemini AI rendered on an animated IBM Selectric typewriter, and join the living archive.

**Live:** [ibm115.vercel.app](https://ibm115.vercel.app)

---

## Disclaimer

**IBM 115 · Remember When** is an independent community tribute built in honor of IBM's 115th anniversary. It is **not affiliated with, endorsed by, or sponsored by** International Business Machines Corporation. IBM® and all IBM product names are trademarks of IBM.

Built by [BlindspotLab](https://mojeeb.xyz) · mojeeb.xyz

---

## Stack

- **Next.js 16** (App Router)
- **Firebase** Firestore + Storage
- **Gemini 2.5 Flash Lite** (AI memory responses)
- **Vercel** (deployment)

---

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing hero (hero only — no scroll sections) |
| `/submit` | Memory form + typewriter AI output |
| `/celebration` | Community memory wall (masonry grid) |
| `/history` | IBM 115-year editorial timeline |
| `/m/[slug]` | Individual memory page (OG metadata for X sharing) |

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy the example file and add your keys:

```bash
cp .env.example .env.local
```

Required variables:

| Variable | Description |
|----------|-------------|
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google AI Studio / Gemini API key |
| `GEMINI_MODEL` | Optional. Defaults to `gemini-2.5-flash-lite` |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase web API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |
| `NEXT_PUBLIC_BASE_URL` | Public site URL (e.g. `http://localhost:3000`) |

See [`.env.example`](.env.example) for the full template.

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Build for production

```bash
npm run build
npm start
```

---

## Project Structure

```
app/
├── page.tsx                  # Landing
├── submit/page.tsx           # Form + typewriter
├── celebration/page.tsx      # Memory wall
├── history/page.tsx          # Timeline
├── m/[slug]/page.tsx         # Shareable memory page
├── api/generate-memory/      # Gemini API route
└── globals.css               # Design tokens

components/
├── Navbar.tsx
├── TypewriterCard.tsx        # Signature Selectric component
├── MemoryForm.tsx
├── MemoryCard.tsx
├── TimelineSection.tsx
├── ShareButton.tsx
└── Disclaimer.tsx

lib/
├── firebase.ts
├── firestore.ts
└── utils.ts
```

---

## Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. **Upgrade to Blaze (pay-as-you-go)** — Firestore requires a billing account linked to the project, even though the app stays within free quotas for a tribute launch. [Enable billing](https://console.cloud.google.com/billing/enable?project=YOUR_PROJECT_ID) → Firebase Console → ⚙️ Project settings → Usage and billing → **Modify plan** → Blaze.
3. Create **Firestore Database** (Firebase Console → Build → Firestore → Create database → Start in **test mode**, then deploy `firestore.rules`)
4. Enable **Storage** (Firebase Console → Build → Storage → Get started)
5. Enable the **Cloud Firestore API** in [Google Cloud Console](https://console.cloud.google.com/apis/library/firestore.googleapis.com) if prompted
6. Add a web app and copy config values into `.env.local`
7. Deploy security rules (see below)
8. Firestore collection: `memories` (auto-created on first submission)
9. Storage path: `memories/{memoryId}/{filename}`

**Free tier (typical for this app):** ~50K reads / 20K writes per day, 1 GB storage — you only pay if you exceed quotas.

### Firestore & Storage Rules

| File | Purpose |
|------|---------|
| `firestore.rules` | Public read, validated creates, like + photo updates only |
| `storage.rules` | Public read, image uploads max 5 MB |
| `firebase.json` | Wires both rule files for deployment |

**What the rules allow:**

- **Read** — anyone (celebration wall, memory pages, photos)
- **Create** — validated memory (`name`, `product`, `year` 1911–2026, `aiResponse`, `likes: 0`)
- **Update** — increment `likes` by 1 only, OR attach `photoUrl` / `photoStoragePath` after upload
- **Delete** — denied (memories are permanent)

**Deploy via Firebase CLI:**

```bash
npm install -g firebase-tools
firebase login
firebase use your-project-id
firebase deploy --only firestore:rules,storage:rules
```

**Or paste manually** in Firebase Console → Firestore → Rules / Storage → Rules.

---

## Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add all environment variables from `.env.example`
4. Set `NEXT_PUBLIC_BASE_URL` to your Vercel domain

---

## License

Independent tribute project. Not for commercial use of IBM trademarks.