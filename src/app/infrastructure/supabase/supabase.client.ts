// supabase.client.ts
import { environment } from "src/environments/environment";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = environment.SUPABASE.SUPABASE_URL;
const supabaseKey = environment.SUPABASE.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
