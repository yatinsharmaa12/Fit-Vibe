# FitVibe

## Overview

FitVibe is an innovative platform designed to engage users in daily challenges, rewarding their achievements and fostering a vibrant community. Leveraging advanced AI pose detection using TensorFlow.js, the platform offers an interactive and immersive user experience.

## Features

- **Daily Challenges**: Participate in new challenges every day to test and improve your skills.
- **Reward System**: Earn points and badges for completing challenges and climb the leaderboard.
- **AI Pose Detection**: Utilize real-time pose detection powered by TensorFlow.js for accurate performance tracking.
- **Secure Authentication**: Sign in seamlessly using Google OAuth or Email OTP, secured with JWT tokens.

## Tech Stack

- **Frontend/Backend**: Next.js, Node.js, TypeScript
- **Database**: MongoDB
- **Authentication**: NextAuth, Google OAuth, JWT-based Email OTP
- **Email Service**: Nodemailer
- **AI Pose Detection**: TensorFlow.js (MoveNet)
- **Deployment**: Vercel, GitHub

## Getting Started

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/fitvibe.git
   ```
2. **Install Dependencies**:
   ```bash
   cd fitvibe
   npm install
   ```
3. **Set Up Environment Variables**:
   - Create a `.env` file in the root directory.
   - Add the necessary environment variables as per `.env.example`.
4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` to explore the application.

## Verification

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Docker

The Compose stack runs the app, MongoDB, and Redis. Create a `.env` file from
`.env.example` and set at least `NEXTAUTH_SECRET`, `MONGO_ROOT_PASSWORD`,
`MONGO_APP_PASSWORD`, and `MONGO_EXPRESS_PASSWORD`.

```bash
docker compose up --build
```

MongoDB is initialized with a least-privilege `fitvibe` application user via
`mongo-init.js`. Administration UIs (Mongo Express and Redis Commander) are
bound to localhost and only start with the `tools` profile:

```bash
docker compose --profile tools up
```

The application uses a single database named by `MONGODB_DB` (default
`fitvibe`). If you are upgrading an existing deployment that used the legacy
`bajaj_*` collections or the misspelled `challanges` field, run:

```bash
MONGO_URI="..." MIGRATE_FROM_DB=Practice MONGODB_DB=fitvibe node scripts/migrate-branding.mjs
```

## Contributing

We welcome contributions from the community. To contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Make your changes and commit them: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Open a pull request.
