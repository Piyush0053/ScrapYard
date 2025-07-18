import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          phone: string;
          name: string | null;
          email: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          phone: string;
          name?: string | null;
          email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          phone?: string;
          name?: string | null;
          email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      pickups: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          time: string;
          address: string;
          scrap_types: string;
          estimated_weight: number;
          remarks: string;
          status: 'scheduled' | 'cancelled' | 'completed';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          time: string;
          address: string;
          scrap_types: string;
          estimated_weight: number;
          remarks?: string;
          status?: 'scheduled' | 'cancelled' | 'completed';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          time?: string;
          address?: string;
          scrap_types?: string;
          estimated_weight?: number;
          remarks?: string;
          status?: 'scheduled' | 'cancelled' | 'completed';
          created_at?: string;
          updated_at?: string;
        };
      };
      scrap_rates: {
        Row: {
          id: string;
          item_name: string;
          rate_per_kg: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          item_name: string;
          rate_per_kg: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          item_name?: string;
          rate_per_kg?: number;
          updated_at?: string;
        };
      };
    };
  };
};