// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kfkhkyoezdgnrpliycvj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtma2hreW9lemRnbnJwbGl5Y3ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzMDI0MjIsImV4cCI6MjA1OTg3ODQyMn0.5lHrxPBPB5j9VMUKAz_BFhRGdQgNuP_dm2EGEn6wXNs";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);