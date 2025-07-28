// supabase.client.ts
import { environment } from '@app/shared/constants/environments/environment'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = environment.SUPABASE_URL
const supabaseKey = environment.SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
