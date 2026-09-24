
# InterviewKit AI

AI-powered interview preparation platform that converts a job description into a personalized interview kit using resume matching, company research, roadmap generation, coverage analysis, and practice flashcards.

## Live Demo

- **Frontend:** https://interviewkit-ai-1.onrender.com
- **Backend API:** https://interviewkit-ai.onrender.com

---

## Features

### Resume Intelligence
- Upload resume (PDF)
- Automatic skill extraction
- Resume profile stored for future kits

### Interview Kit Generation
- Paste Job Description
- Company website crawling
- AI-generated company brief
- Skill extraction from JD
- Personalized preparation roadmap

### Coverage Analysis
- Resume vs Job Description comparison
- Coverage percentage
- Covered skills
- Missing skills

### Practice Mode
- One-question practice interface
- Reveal answer
- Low / Medium / High confidence
- Progress saved in MongoDB

### Flashcard Management
- Edit flashcards
- Delete flashcards
- Reorder flashcards
- Save changes without regenerating

### Section Regeneration
Regenerate individual sections while preserving the rest of the interview kit.

- Company Brief
- Roadmap
- Flashcards

### Batch Evaluation CLI
Evaluate multiple job descriptions from the terminal.

```bash
npm run evaluate
```

Input:

```text
server/input/jobs.json
```

Output:

```text
server/output/results.json
```

---

## Tech Stack

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Multer

### AI & Processing
- Groq LLM
- LangChain
- Deterministic Coverage Engine

---

## Project Structure

```text
interviewkit-ai/
│
├── client/                 # Next.js frontend
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── services/
│   ├── scripts/
│   ├── input/
│   └── output/
│
└── README.md
```

---

## Local Setup

### Backend

```bash
cd server
npm install
npm run dev
```

Create `.env`

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret
GROQ_API_KEY=your_groq_key
```

### Frontend

```bash
cd client
npm install
npm run dev
```

Create `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## API Endpoints

| Method | Endpoint | Purpose |
|---------|----------|----------|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| POST | /api/resume/upload | Upload Resume |
| GET | /api/resume/me | Resume Profile |
| POST | /api/kits | Create Kit |
| GET | /api/kits | Get User Kits |
| GET | /api/kits/:id | Get Kit Details |
| PATCH | /api/kits/:id/practice | Save Practice Progress |
| PATCH | /api/kits/:id/flashcards | Update Flashcards |
| PATCH | /api/kits/:id/regenerate | Regenerate Section |
| DELETE | /api/kits/:id | Delete Kit |

---

## CLI Usage

Run batch evaluation:

```bash
cd server
npm run evaluate
```

The CLI processes every job description inside `input/jobs.json` and generates structured coverage results in `output/results.json`.

---

## Future Enhancements

- Voice interview agent
- Multi-agent interview coaching
- Speech evaluation
- Behavioral interview simulator
- Real-time coding interview mode
- Collaborative interview sessions

---

## Known Limitations

- Authentication currently uses JWT cookies without refresh-token rotation.
- Company crawling depends on publicly accessible webpages.
- Regeneration currently supports Company Brief, Roadmap, and Flashcards only.
- Voice-based interview practice is planned as a future enhancement.

---

## Author

**Sakthivel N**

AI/ML Engineer • Full Stack AI Developer