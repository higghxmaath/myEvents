# myEvents

Event discovery and hosting platform — React frontend + Express/MongoDB backend.

## Prerequisites

- Node.js 18+ (frontend targets Node 24.x)
- MongoDB Atlas connection (backend)

## Setup

### Backend

```bash
cd myEvents-backend
npm install
# Create .env with PORT, MONGO_URI, JWT_SECRET, Cloudinary keys
npm run dev
```

Runs on `http://localhost:4000`.

### Frontend

```bash
cd myEvents
npm install
# .env should contain: VITE_API_URL=https://myevents-2.onrender.com
npm run dev
```

Runs on `http://localhost:5173`.

## Environment

| Variable | Location | Description |
|----------|----------|-------------|
| `VITE_API_URL` | `myEvents/.env` | Backend API base URL |
| `MONGO_URI` | `myEvents-backend/.env` | MongoDB connection string |
| `JWT_SECRET` | `myEvents-backend/.env` | JWT signing secret |
| `PORT` | `myEvents-backend/.env` | Server port (default 4000) |

## Production

- Frontend: Vercel (`https://my-events-yvnz.vercel.app`)
- Backend: Render (`https://myevents-2.onrender.com`)

After backend changes (e.g. CORS), redeploy to Render for local dev to work against the remote API.
