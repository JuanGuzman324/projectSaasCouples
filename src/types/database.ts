// ⚠️ Este archivo está escrito a mano, con la MISMA forma que produce
//
//   supabase gen types typescript --project-id TU-PROYECTO > src/types/database.ts
//
// para que el proyecto compile mientras no tienes un proyecto Supabase real
// conectado. En cuanto lo tengas, reemplázalo por el generado de verdad
// (Project Settings > API > Generate types, o el comando de arriba).
// Los nombres coinciden 1:1 con las migraciones de supabase/migrations/.

export type Json =
  | string | number | boolean | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      couples: {
        Row: {
          id: string
          start_date: string | null
          invite_code: string
          locale: string
          plan: 'free' | 'premium'
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['couples']['Row']>
        Update: Partial<Database['public']['Tables']['couples']['Row']>
        Relationships: []
      }
      couple_members: {
        Row: {
          couple_id: string
          user_id: string
          display_name: string | null
          city: string | null
          lat: number | null
          lon: number | null
          tz: string | null
          locale: string | null
          joined_at: string
        }
        Insert: Partial<Database['public']['Tables']['couple_members']['Row']> & {
          couple_id: string
          user_id: string
        }
        Update: Partial<Database['public']['Tables']['couple_members']['Row']>
        Relationships: [
          {
            foreignKeyName: 'couple_members_couple_id_fkey'
            columns: ['couple_id']
            isOneToOne: false
            referencedRelation: 'couples'
            referencedColumns: ['id']
          },
        ]
      }
      memories: {
        Row: {
          id: string
          couple_id: string
          created_by: string | null
          title: string
          happened_on: string
          tag: 'cita' | 'viaje' | 'detalle' | 'charla' | 'logro' | 'otro'
          place: string | null
          body: string | null
          is_favorite: boolean
          photo_path: string | null
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['memories']['Row']> & {
          couple_id: string
          title: string
          happened_on: string
        }
        Update: Partial<Database['public']['Tables']['memories']['Row']>
        Relationships: [
          {
            foreignKeyName: 'memories_couple_id_fkey'
            columns: ['couple_id']
            isOneToOne: false
            referencedRelation: 'couples'
            referencedColumns: ['id']
          },
        ]
      }
      couple_dates: {
        Row: {
          id: string
          couple_id: string
          created_by: string | null
          title: string
          happens_on: string
          kind: 'encuentro' | 'aniversario' | 'cumple' | 'especial' | 'otro'
          repeat: 'none' | 'monthly' | 'yearly'
          place: string | null
          note: string | null
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['couple_dates']['Row']> & {
          couple_id: string
          title: string
          happens_on: string
        }
        Update: Partial<Database['public']['Tables']['couple_dates']['Row']>
        Relationships: [
          {
            foreignKeyName: 'couple_dates_couple_id_fkey'
            columns: ['couple_id']
            isOneToOne: false
            referencedRelation: 'couples'
            referencedColumns: ['id']
          },
        ]
      }
      moments: {
        Row: {
          id: string
          couple_id: string
          created_by: string | null
          name: string
          happens_on: string | null
          repeat: 'none' | 'yearly'
          tagline: string | null
          message: string | null
          motif: string
          emoji: string
          font: 'serif' | 'hand' | 'sans'
          density: number
          speed: number
          palette: Json
          photo_path: string | null
          plan: Json
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['moments']['Row']> & {
          couple_id: string
          name: string
        }
        Update: Partial<Database['public']['Tables']['moments']['Row']>
        Relationships: [
          {
            foreignKeyName: 'moments_couple_id_fkey'
            columns: ['couple_id']
            isOneToOne: false
            referencedRelation: 'couples'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: Record<string, never>
    Functions: {
      create_couple: {
        Args: { p_start_date: string | null; p_locale: string }
        Returns: Database['public']['Tables']['couples']['Row']
      }
      join_couple: {
        Args: { p_invite_code: string }
        Returns: Database['public']['Tables']['couples']['Row']
      }
      regenerate_invite_code: {
        Args: { p_couple_id: string }
        Returns: string
      }
      leave_couple: {
        Args: { p_couple_id: string }
        Returns: undefined
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
