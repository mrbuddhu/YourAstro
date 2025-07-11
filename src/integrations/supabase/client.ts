// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://xvvbwsxxryzjxnemdbwf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2dmJ3c3h4cnl6anhuZW1kYndmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzNjE0MDgsImV4cCI6MjA1OTkzNzQwOH0.KDZPHumiHBlusqdWjFXGzbxxCyDjtsddxgnyacOA16c";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);