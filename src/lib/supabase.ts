import { createClient } from "@supabase/supabase-js";

// Utilisation de valeurs par défaut pour le développement
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://example.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlbW8iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjQyMjU4MCwiZXhwIjoxOTMyMDk4NTgwfQ.jbJUI2WqjNwd2kF2AUKQjLJYBY7yjVK0-pIa0x0SfQM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
