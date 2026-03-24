# Getting Started in Cursor

Here's a quick guide to start working on your College Match project in Cursor.

## 1. Open the project folder

- **File → Open Folder** (or `Cmd+O` on Mac, `Ctrl+O` on Windows)
- Select: `Coding Workshop/college-matchmaking`
- Click **Open**

You'll see the file tree on the left with all your HTML, CSS, and JS files.

## 2. Essential Cursor / VS Code basics

| Action | How |
|--------|-----|
| **Open a file** | Click it in the file explorer (left sidebar) |
| **Save** | `Cmd+S` (Mac) or `Ctrl+S` (Windows) |
| **Find files** | `Cmd+P` (Mac) or `Ctrl+P` (Windows), then type the filename |
| **Chat with AI** | `Cmd+L` (Mac) or `Ctrl+L` (Windows), or click the chat icon |
| **Run a command** | `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows) |

## 3. Run your site locally

You need to **serve** the files over HTTP (not just open the HTML file in a browser).

### Option A: Live Server (recommended)

1. Install the **Live Server** extension:
   - Click the Extensions icon in the left sidebar (or `Cmd+Shift+X`)
   - Search for **Live Server**
   - Install it
2. Right-click `index.html` in the file explorer
3. Select **"Open with Live Server"**
4. Your browser will open to something like `http://127.0.0.1:5500`

### Option B: Python

If you have Python installed:

1. Open the integrated terminal: **Terminal → New Terminal** (or `` Ctrl+` ``)
2. Run:

   ```bash
   cd college-matchmaking
   python3 -m http.server 8000
   ```

3. Open http://localhost:8000 in your browser

## 4. Set up Supabase (required for auth & data)

Before the site will work fully, you need to:

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your **Project URL** and **anon key** from Settings → API
4. Open `js/supabase-client.js` and replace:
   - `YOUR_SUPABASE_URL` with your URL
   - `YOUR_SUPABASE_ANON_KEY` with your anon key
5. Run the SQL from `README.md` in Supabase's SQL Editor to create the database tables

## 5. Test the flow

1. Open the landing page
2. Click **Sign up** and use a **.edu email** (or any email for local testing if you disable email confirmation in Supabase)
3. After signup/login, you'll be redirected to your profile
4. Fill out your profile and save
5. Go to Browse to see other profiles (you’ll need at least one other test user)
6. Like profiles; mutual likes appear on the Matches page

---

**Stuck?** Use Cursor's chat (`Cmd+L`) and describe what you're trying to do. You can also ask me to explain any file or concept.
