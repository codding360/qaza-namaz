# Namaz Profile - Prayer Tracking App

A mobile-first prayer tracking application built with Next.js, Supabase, and TypeScript.

## Features

- User authentication (sign up/sign in)
- Prayer statistics tracking with real-time calculations
- Mobile-responsive design
- Real-time data updates
- Secure data storage with Supabase

## Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account

## Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to your project dashboard
3. Copy your project URL and anon key from Settings > API
4. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Set up Database

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Run the SQL script to create all necessary tables and policies

### 4. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database Schema

### Tables

1. **users** - User profiles
   - id (UUID, Primary Key)
   - email (TEXT, Unique)
   - first_name (TEXT)
   - last_name (TEXT)
   - birth_year (INTEGER)
   - gender (TEXT, 'male' or 'female')
   - created_at (TIMESTAMP)
   - updated_at (TIMESTAMP)

2. **prayer_stats** - Individual prayer statistics
   - id (UUID, Primary Key)
   - user_id (UUID, Foreign Key)
   - prayer_name (TEXT)
   - skipped_count (INTEGER)
   - qaza_count (INTEGER)
   - created_at (TIMESTAMP)
   - updated_at (TIMESTAMP)

### Calculations

The application calculates totals dynamically:

- **Total Skipped**: Sum of all `skipped_count` from `prayer_stats`
- **Years Skipped**: `total_skipped / 6 / 365` (6 prayers per day)

### Prayer Start Age

- **Male**: 12 years old
- **Female**: 9 years old

### Prayer Types

- Fajr (Багымдат): 2 rakats
- Dhuhr (Бешим): 4 rakats
- Asr (Аср): 4 rakats
- Maghrib (Шам): 3 rakats
- Isha (Куптан): 4 rakats
- Witr (Витр Важиб): 3 rakats
- **Total per day**: 20 rakats

### Security

- Row Level Security (RLS) is enabled on all tables
- Users can only access their own data
- Authentication is handled through Supabase Auth

## Project Structure

```
├── app/
│   ├── login/
│   │   └── page.tsx          # Login page
│   ├── register/
│   │   └── page.tsx          # Registration page
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main profile page
├── components/
│   └── ui/                   # UI components
├── hooks/
│   ├── useAuth.ts            # Authentication hook
│   ├── usePrayerStats.ts     # Prayer statistics hook
│   └── use-mobile.ts         # Mobile detection hook
├── lib/
│   └── supabase.ts           # Supabase client configuration
├── supabase-schema.sql       # Database schema
└── README.md                 # This file
```

## Usage

1. **Registration**: Users can create an account with email, password, name, and birth year
2. **Login**: Users can sign in with their email and password
3. **Profile**: View personal information and prayer statistics
4. **Prayer Tracking**: Click "Карз" (debt) or "Казы" (qaza) buttons to track missed prayers

## Technologies Used

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **State Management**: React hooks
- **Package Manager**: pnpm

## Development

### Adding New Features

1. Create new components in `components/`
2. Add new hooks in `hooks/` for data management
3. Update database schema if needed
4. Add new pages in `app/` directory

### Database Changes

1. Update `supabase-schema.sql`
2. Run the updated schema in Supabase SQL Editor
3. Update TypeScript interfaces in `lib/supabase.ts`

## Deployment

The app can be deployed to Vercel, Netlify, or any other Next.js-compatible platform. Make sure to:

1. Set environment variables in your deployment platform
2. Configure Supabase project settings for production
3. Update CORS settings if needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
