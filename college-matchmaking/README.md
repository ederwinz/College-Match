# College Match

A simple matchmaking website for college students (dating). Uses vanilla HTML, CSS, and JavaScript with Supabase for auth and database.

## Prerequisites

- A [Supabase](https://supabase.com) account (free)
- A web browser
- A simple way to serve the files (see below)

## Setup

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project (pick a name and password)
3. In the dashboard: **Settings → API**
4. Copy:
   - **Project URL**
   - **anon public** key (under "Project API keys")

### 2. Add your Supabase credentials

Open `js/supabase-client.js` and replace:

- `YOUR_SUPABASE_URL` with your Project URL
- `YOUR_SUPABASE_ANON_KEY` with your anon public key

### 3. Set up the database (Supabase SQL Editor)

In Supabase: **SQL Editor** → New query. Paste and run:

```sql
-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  photo_url TEXT,
  bio TEXT,
  year INT CHECK (year >= 1 AND year <= 5),
  major TEXT,
  interests TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Likes table (who liked whom)
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(from_user_id, to_user_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Policies: users can read all profiles, update only their own
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policies: users can manage their own likes
CREATE POLICY "Users can insert own likes" ON likes
  FOR INSERT WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "Users can read own likes" ON likes
  FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

-- Trigger: create profile when user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email) VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### 4. Set up Storage for profile photos

1. In Supabase: **Storage** → **New bucket**
2. Name: `avatars`
3. Enable **Public bucket** (so photo URLs work)
4. Create the bucket
5. Go to **Storage** → **avatars** → **Policies** (or **New policy**)
6. Add a policy to allow authenticated users to upload:

```sql
-- Allow users to upload to their own folder
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow public read (bucket is public)
CREATE POLICY "Avatars are publicly readable"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Allow users to overwrite their own avatar (for photo updates)
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
```

### 5. Enable email auth

In Supabase: **Authentication → Providers → Email** — ensure "Enable Email provider" is on.

For local testing, you may need to disable "Confirm email" in Auth settings, or use the magic link from the confirmation email.

### 6. Run the site locally

You need to serve the files over HTTP ( opening `index.html` directly in the browser may block some features).

**Option A: VS Code / Cursor Live Server extension**

1. Install "Live Server" extension
2. Right-click `index.html` → "Open with Live Server"

**Option B: Python (if installed)**

```bash
cd college-matchmaking
python3 -m http.server 8000
```

Then open: http://localhost:8000

**Option C: Node.js**

```bash
npx serve college-matchmaking
```

## Project structure

```
college-matchmaking/
├── index.html       # Landing page
├── auth.html        # Login / sign up
├── profile.html     # Create or edit your profile
├── browse.html      # Swipe through profiles
├── matches.html     # Your matches
├── css/
│   └── styles.css
├── js/
│   ├── supabase-client.js
│   ├── auth.js
│   └── ... (profile.js, browse.js, matches.js)
└── README.md
```
