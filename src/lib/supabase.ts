import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kxxmglprttoicmjjcnor.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4eG1nbHBydHRvaWNtampjbm9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MTcxOTcsImV4cCI6MjA4ODA5MzE5N30.1opE2BQ68_3edpFad4hPHTof6CO6QcBMGEY9pvhM5y4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
