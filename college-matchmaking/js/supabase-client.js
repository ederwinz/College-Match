/**
 * Supabase client — connects the frontend to Supabase (auth, database, storage)
 *
 * SETUP: Replace the placeholder values below with your Supabase project URL and key.
 * Get these from: https://supabase.com/dashboard → your project → Settings → API
 */

const SUPABASE_URL = 'https://bmwimiqccksitjsodcfd.supabase.co';   // e.g. https://xxxxx.supabase.co
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtd2ltaXFjY2tzaXRqc29kY2ZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5ODg5NjIsImV4cCI6MjA4OTU2NDk2Mn0.qSss27CsTlRbOIirPmZrGz9UbfM7Y8pbMo4X2p5O2bo';

window.db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
