# College Match

A full-stack college matchmaking platform that connects students through a swipe-based interface. Built with vanilla JavaScript and Supabase, featuring authentication, real-time data handling, and secure backend policies.

---

## 🚀 Overview

College Match is a lightweight dating-style web app designed for college students. It enables users to create profiles, browse others, and form matches through mutual likes.

- 🔐 Secure authentication (.edu-based concept)
- 🔁 Real-time matching logic (mutual likes)
- 📦 Full-stack integration with Supabase (DB, auth, storage)
- ⚡ Clean, responsive UI with vanilla JS

---

## 💡 Key Features

- **User Authentication**  
  Email-based signup/login powered by Supabase Auth :contentReference[oaicite:0]{index=0}  

- **Profile Creation**  
  Users can create and update profiles with photos, bio, major, and interests :contentReference[oaicite:1]{index=1}  

- **Swipe-Based Browsing**  
  Browse profiles and like/pass with a simple interface :contentReference[oaicite:2]{index=2}  

- **Matching System**  
  Mutual likes generate matches stored in the database :contentReference[oaicite:3]{index=3}  

- **Secure Backend (RLS)**  
  Row-Level Security ensures users only modify their own data :contentReference[oaicite:4]{index=4}  

---

## 🛠 Tech Stack

- **Frontend:** HTML, CSS, Vanilla JavaScript  
- **Backend:** Supabase (PostgreSQL, Auth, Storage)  
- **Architecture:** Client-side app with serverless backend  

---

## ⚙️ How It Works

1. Users sign up and authenticate via Supabase  
2. A profile is automatically created in the database  
3. Users browse other profiles and send likes  
4. If two users like each other → a match is created  
5. Matches are displayed in a dedicated view  

---

## 📂 Project Structure
college-matchmaking/
├── index.html # Landing page
├── auth.html # Login / signup
├── profile.html # Profile creation/edit
├── browse.html # Swipe interface
├── matches.html # Matches view
├── css/
├── js/
└── README.md


---

## 🔧 Setup (Quick)

1. Create a Supabase project  
2. Add your API keys in `supabase-client.js`  
3. Run the provided SQL schema  
4. Serve locally (Live Server / Python / Node)

Full setup instructions in the project files.

---

## 📌 Why This Project Stands Out

- Demonstrates **full-stack product thinking** (not just algorithms)
- Implements **real-world auth + database design**
- Uses **secure access control (RLS)** like production systems
- Clean, modular structure without frameworks → shows core JS understanding

---

## 🧠 Future Improvements

- Real-time chat between matches  
- Recommendation algorithm (interests / similarity scoring)  
- Mobile-first UI enhancements  
- Deployment (Vercel / Netlify)

---
