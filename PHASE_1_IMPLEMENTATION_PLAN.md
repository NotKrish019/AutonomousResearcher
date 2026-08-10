# Phase 1 Implementation Plan: Workspace Setup & Monorepo Configuration

## Objective
Initialize the root workspace `AutonomousResearcher` with a modular full-stack monorepo structure containing separate `/client` (React + Vite + Tailwind CSS) and `/server` (Node.js + Express + LangGraph.js) applications.

---

## 1. Project Directory Structure
```text
AutonomousResearcher/
├── client/                     # Vite + React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
├── server/                     # Express Backend & LangGraph Multi-Agent Engine
│   ├── src/
│   │   ├── agents/
│   │   ├── config/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── tools/
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── PHASE_1_IMPLEMENTATION_PLAN.md
└── package.json                # Root package.json (scripts to run client & server)
```

---

## 2. Package Dependencies Specifications

### Backend (`/server/package.json`)
- **Core Server**: `express`, `cors`, `dotenv`, `mongoose`
- **LangChain / LangGraph**: `@langchain/langgraph`, `@langchain/core`, `@langchain/google-genai`, `@langchain/openai`
- **Search & Tools**: `@tavily/core` (or axios for web research fallback)
- **Dev Tools**: `nodemon`

### Frontend (`/client/package.json`)
- **Core Framework**: `react`, `react-dom`
- **UI & Icons**: `lucide-react`, `clsx`, `tailwind-merge`
- **Styling**: `tailwindcss`, `autoprefixer`, `postcss`
- **Markdown & Syntax**: `react-markdown`, `remark-gfm`
- **Build Tool**: `vite`, `@vitejs/plugin-react`

---

## 3. Initialization Commands Sequence

```powershell
# 1. Initialize root package.json
npm init -y

# 2. Create client Vite app
npx -y create-vite@latest client --template react

# 3. Create server directory & package.json
mkdir server
cd server
npm init -y
npm install express cors dotenv mongoose @langchain/langgraph @langchain/core @langchain/google-genai @langchain/openai @tavily/core
npm install --save-dev nodemon
cd ..

# 4. Install client dependencies
cd client
npm install lucide-react react-markdown remark-gfm clsx tailwind-merge
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
cd ..
```

---

## 4. Environment Variables Schema (`/server/.env.example`)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/autonomous_researcher
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
```

---

## Verification Strategy
1. Verify `/server/package.json` and `/client/package.json` configurations.
2. Run test dev start on both client and server.
3. Confirm environment variables structure.

---

## Draft System Prompts for Multi-Agent Graph (Reference)
- **Planner Agent**: Decomposes topic into 4-6 focused subtopics.
- **Researcher Agent**: Formulates queries, invokes web search, extracts factual summaries and citations.
- **Evaluator Agent**: Evaluates information completeness; triggers re-search if criteria aren't met (up to 2 iterations).
- **Writer Agent**: Compiles full notes into an academic-grade Markdown report with inline citations and a bibliography.
