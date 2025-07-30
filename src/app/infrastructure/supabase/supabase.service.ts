import { Injectable } from '@angular/core';
import { environment } from '@environments/environment.development';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private readonly _supabase: SupabaseClient;
  constructor() {
    this._supabase = createClient(
      environment.SUPABASE.SUPABASE_URL,
      environment.SUPABASE.SUPABASE_ANON_KEY,
    );
  }
  get client(): SupabaseClient {
    return this._supabase;
  }
  get supabase(): SupabaseClient {
    return this._supabase;
  }
}
