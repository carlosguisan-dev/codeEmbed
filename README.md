# CodeEmbed - A Vibecoding Project

This project was built live using **Firebase Studio**, with **Gemini** as the AI coding partner. It's a "vibecoding" session result, demonstrating rapid application development with generative AI.

The application is a code snippet manager that allows users to create, share, and embed syntax-highlighted code blocks.

## Tech Stack

- **Framework**: Next.js (App Router)
- **AI**: Google Gemini
- **Backend**: Firebase (Authentication & Firestore)
- **UI**: ShadCN UI Components & Tailwind CSS
- **Deployment**: Vercel

## Deploy to Vercel

Follow these steps to deploy your own version of this project to Vercel.

### 1. Fork the Repository

Start by forking this repository to your own GitHub account.

### 2. Create a Vercel Project

- Go to your Vercel dashboard and click "Add New... > Project".
- Import the repository you just forked.
- Vercel will automatically detect that it's a Next.js project.

### 3. Configure Environment Variables

Before deploying, you need to set up the environment variables. Vercel will prompt you for these.

You will need the following values from your Firebase project's settings:

- Go to `Project Settings` > `General` > `Your apps` > `SDK setup and configuration`.
- Select `Config` and you will see the Firebase configuration object.

```
NEXT_PUBLIC_FIREBASE_PROJECT_ID="<YOUR_PROJECT_ID>"
NEXT_PUBLIC_FIREBASE_APP_ID="<YOUR_APP_ID>"
NEXT_PUBLIC_FIREBASE_API_KEY="<YOUR_API_KEY>"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="<YOUR_AUTH_DOMAIN>"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="<YOUR_MESSAGING_SENDER_ID>"
```

### 4. Deploy

Once the environment variables are set, click the "Deploy" button. Vercel will handle the rest, including installing dependencies and running the build. Your site will be live in a few minutes!
