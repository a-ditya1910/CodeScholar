#  CodeScholar

**CodeScholar** is a full-stack (MERN) ed-tech platform where instructors publish and sell video courses, and students discover, purchase, and learn from them. On top of a complete course marketplace, it adds an **AI assistant**, **AI-generated quizzes**, **live classes**, and a multi-layered **video-security pipeline**.

---

##  Features

**For students**
- Sign up with email-OTP verification, secure JWT login, password reset
- Browse courses by category, view details, ratings & reviews
- Cart + **Razorpay** checkout with server-side signature verification
- Course player with section/lecture navigation and **progress tracking**
- **AI chatbot** for platform, study, and (if enrolled) lesson-specific help
- **AI quizzes** per course with Basic/Medium/Hard difficulty
- Join **live classes** for enrolled courses

**For instructors**
- Full course CRUD — sections, lectures, thumbnails, videos (Cloudinary)
- Publish/draft workflow
- **Schedule and run live classes**
- Analytics dashboard (students, income, course stats)

**Platform / security**
- **Authenticated blob streaming** — the video loads via a `fetch` with the JWT in the `Authorization` header (never in the URL) and plays from a page-scoped `blob:` URL, so a copied link or incognito tab has no auth and can't open or download it
- The raw Cloudinary URL is **stripped from API responses** and only streamed through the backend after an enrollment check
- **Dynamic watermark** (viewer email + id) over recorded videos and live classes

---

##  Tech stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, React Router v6, Redux Toolkit, Tailwind CSS, React Hook Form, Axios, video-react |
| **Backend** | Node.js, Express, Mongoose, JWT, Bcrypt |
| **Database** | MongoDB (Atlas) |
| **AI** | Google Gemini API |
| **Live video** | Jitsi Meet |
| **Media / DRM** | Cloudinary, VdoCipher |
| **Payments** | Razorpay |
| **Email** | Nodemailer (Gmail SMTP) |

---

##  Architecture

```
┌─────────────┐   REST + JWT  
│  React SPA  │ ───────────────▶│  Express API │ ─────▶ │  MongoDB  │
│  (Redux)    │ ◀───────────────│  (Node.js)   │      
└─────────────┘               
                                       │
        ┌──────────────┬───────────────┼───────────────┬───────────────┐
     Cloudinary     Razorpay         Gemini           Jitsi         VdoCipher
     (media)       (payments)      (AI chat/quiz)   (live video)     (DRM)
```

- **Monorepo:** React app at the root, Express API in `/server`.
- Every request goes through a single Axios instance (`apiConnector`) that attaches the JWT.
- **Content model:** `Course → Section → SubSection (lecture)`.
- **Access control:** enrollment stored on `user.courses` is the single source of truth for lessons, quizzes, live classes, and video streams.

---

##  Folder structure

```
.
├── src/                        # React frontend
│   ├── components/             # common + core (Auth, Dashboard, Course, ViewCourse, HomePage…)
│   ├── pages/                  # route-level pages
│   ├── services/               # apis.js, apiconnector, operations/ (API calls)
│   ├── slices/ + reducer/      # Redux Toolkit state
│   └── utils/, hooks/, data/
│
└── server/                     # Express backend
    ├── controllers/            # Auth, Course, Payments, Chat, Quiz, LiveClass, VideoStream, VdoCipher…
    ├── models/                 # Mongoose schemas
    ├── routes/                 # route definitions
    ├── middlewares/auth.js     # JWT verify + role guards
    ├── mail/templates/         # email templates
    ├── config/                 # database, cloudinary, razorpay
    └── index.js                # app entry
```

---

##  Getting started

### Prerequisites
- Node.js 18+
- A MongoDB connection string
- Accounts/keys for: Cloudinary, Razorpay (test), Google Gemini, a Gmail App Password (optional: VdoCipher)

### Install
```bash
git clone <your-repo-url>
cd codescholar
npm install
cd server && npm install && cd ..
```

### Environment variables

**Root `.env` (frontend):**
```
REACT_APP_BASE_URL=http://localhost:4000/api/v1
REACT_APP_RAZORPAY_KEY=rzp_test_xxxxxxxx
```

**`server/.env` (backend):**
```
PORT=4000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_secret

MAIL_HOST=smtp.gmail.com
MAIL_USER=your_gmail
MAIL_PASS=your_16_char_app_password

CLOUD_NAME=...            # Cloudinary
API_KEY=...
API_SECRET=...

RAZORPAY_KEY=rzp_test_xxxxxxxx
RAZORPAY_SECRET=...

GEMINI_API_KEY=...        # Google AI Studio
GEMINI_MODEL=gemini-2.5-flash

VDOCIPHER_API_SECRET=...  # optional, for DRM
```

### Run
```bash
npm run dev      # runs client (:3000) + server (:4000) together
```


##  Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Run frontend + backend concurrently |
| `npm start` | Frontend only |
| `npm run server` | Backend only |
| `npm run build` | Production build of the frontend |

---

##  Key API routes (`/api/v1`)

| Method | Route | Purpose |
|---|---|---|
| POST | `/auth/signup` · `/auth/login` · `/auth/sendotp` | Auth |
| POST | `/course/createCourse` · `/course/getFullCourseDetails` | Courses |
| POST | `/payment/capturePayment` · `/payment/verifyPayment` | Razorpay |
| POST | `/chat/chat` | AI chatbot |
| POST | `/quiz/generate` | AI quiz |
| POST | `/liveclass/create` · `/liveclass/join` | Live classes |
| GET | `/video/stream/:id` (JWT in `Authorization` header) | Secure video streaming (blob) |
