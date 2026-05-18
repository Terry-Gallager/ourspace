# OurSpace 💕

A cute couple's interactive website where two people can share photos and edit content together.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Backend**: Supabase (Auth, Database, Storage)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a project
2. In Supabase Dashboard → **Authentication** → **Providers** → Enable **Email/Password**
3. In Supabase Dashboard → **SQL Editor**, paste and run the contents of `supabase-setup.sql`
4. In Supabase Dashboard → **Authentication** → **Users** → **Add User** to create the accounts for you and your partner

### 3. Environment Variables

This is already configured. The `.env.local` file contains:

```
NEXT_PUBLIC_SUPABASE_URL=https://bbqxxnozrmddlrfpsdib.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How to Use

- **Browse mode**: Anyone visiting the site can see the content
- **Edit mode**: Double-click the heart icon at the bottom of the page → sign in with your email/password → text becomes editable, photos get an upload button
- **Add photos**: In edit mode, click the upload icon on any photo frame
- **Edit text**: In edit mode, click into the text area, edit, and click "Save"

## Deploy to Vercel

1. Push the project to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your GitHub repository
4. Environment variables are already committed in `.env.local` (Vercel will use them automatically)
5. Click **Deploy**

Alternatively, you can use the Vercel CLI:

```bash
npm i -g vercel
vercel
```

## Project Structure

```
src/
├── app/
│   ├── globals.css      # Global styles
│   ├── layout.tsx        # Root layout with AuthProvider
│   └── page.tsx          # Homepage
├── components/
│   ├── CuteAlert.tsx     # Cute error/success toast
│   ├── CuteCard.tsx      # Glassmorphism card component
│   ├── LoginModal.tsx    # Hidden login modal (double-click trigger)
│   ├── PhotoFrame.tsx    # Polaroid-style photo frame
│   └── SweetButton.tsx   # Gradient pink button
├── context/
│   └── AuthContext.tsx    # Auth state management
└── lib/
    ├── crud.ts           # Posts CRUD + image upload functions
    └── supabase.ts       # Supabase client
```
