🗳️ Election Assistant

Election Process Education App for Indian Citizens

A full-stack web app that explains how elections work in India with an AI-powered assistant.

✨ Features
🤖 AI Chat Assistant — Gemini-powered election help
📋 Election Guide — 6-step interactive timeline
🏛️ Official Resources — NVSP, ECI, Voter apps
✅ Eligibility Checker — Age + citizenship validation
📍 Booth Locator — Pincode-based lookup (mock)
📱 Responsive UI — Mobile → Desktop
🛠️ Tech Stack

Frontend

React 19
TypeScript
Tailwind CSS
Framer Motion

Backend

Node.js
Express
Helmet
express-rate-limit

AI

Google Gemini (@google/genai)

Build & Deploy

Vite
Docker
Google Cloud Run
🚀 Local Setup
# clone
git clone https://github.com/YOUR_USERNAME/election-assistant.git
cd election-assistant

# install
npm install

# env
cp .env.example .env
# add GEMINI_API_KEY

# run
npm run dev

👉 http://localhost:3000

🐳 Docker
docker build -t election-assistant .

docker run -p 8080:8080 \
  -e GEMINI_API_KEY=your_key_here \
  election-assistant

👉 http://localhost:8080

☁️ Deploy (Cloud Run)
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

gcloud run deploy election-assistant \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_key_here
📁 Structure
election-assistant/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── App.tsx
│   └── main.tsx
├── server.ts
├── Dockerfile
└── .env.example
🔒 Security
Helmet headers
Rate limiting
Input validation
Non-root Docker
CSP enabled
♿ Accessibility
Semantic HTML
ARIA labels
Keyboard navigation
Screen reader support
📜 License

MIT

⚠️ Disclaimer

Educational app only.
Official sites: https://eci.gov.in
 • https://nvsp.in

Helpline: 1950

👨‍💻 Developed By

Saranaeswar
