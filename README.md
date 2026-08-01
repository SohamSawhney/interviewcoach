# AI Interview Prep Simulator

A MERN-stack app that turns any job description into a mock interview: it generates
tailored questions with Google Gemini, lets you type answers, and gives you AI-scored
feedback on each one.

## Stack
- **MongoDB** — users, job descriptions, questions, answers
- **Express + Node** — REST API, JWT auth
- **React (Vite)** — dashboard + interview session UI
- **Google Gemini API** — question generation + answer scoring

## Project structure
```
interview-prep-simulator/
├── backend/
│   ├── config/db.js              # Mongo connection
│   ├── models/                   # User, JobDescription, Question, Answer
│   ├── controllers/               # Route logic
│   ├── routes/                   # Express routers
│   ├── middleware/auth.js        # JWT protect middleware
│   ├── services/aiService.js     # Claude API calls (generate + score)
│   └── server.js
└── frontend/
    └── src/
        ├── pages/                # Login, Register, Dashboard, InterviewSession
        ├── components/           # ProtectedRoute
        ├── context/AuthContext.jsx
        └── services/api.js       # Axios client
```

## Setup

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
# fill in MONGO_URI, JWT_SECRET, GEMINI_API_KEY
npm run dev
```
Requires a running MongoDB instance (local or Atlas).

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Visit `http://localhost:5173`.

## How the data flows
1. User registers/logs in → gets a JWT.
2. User pastes a job description on the Dashboard → `POST /api/job-descriptions`.
3. Backend saves the JD, then calls `aiService.generateQuestions()` which prompts
   Gemini to return a JSON array of 8 tailored questions, saved to Mongo.
4. On the session page, user answers each question → `POST /api/answers`.
5. Backend calls `aiService.scoreAnswer()` which prompts Gemini to return a JSON
   object with a score, strengths, improvements, and a summary — saved and returned.

## Getting a Gemini API key
Grab a free-tier key from [Google AI Studio](https://aistudio.google.com/apikey) and
paste it into `GEMINI_API_KEY` in your `.env` file.

## Where to take it next
- Add a "answer history" page (`GET /api/answers/history` route already exists) with
  score trends over time using recharts.
- Add voice input (Web Speech API) so users can practice answering out loud.
- Add a "regenerate question" button for more variety per category.
- Support file upload for the JD (PDF) instead of paste-only.
