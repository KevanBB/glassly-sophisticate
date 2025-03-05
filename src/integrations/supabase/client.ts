
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://keypifghqlthxdelogxe.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtleXBpZmdocWx0aHhkZWxvZ3hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExNjM0NzMsImV4cCI6MjA1NjczOTQ3M30.2pdgzobD61FkPByRxgQ_qqJFRHeVi0nTGUVQRjPJkCc";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
