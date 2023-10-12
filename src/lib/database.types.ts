export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      contract: {
        Row: {
          created_at: string | null
          id: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contract_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      message: {
        Row: {
          content: string | null
          contract_id: number | null
          created_at: string | null
          id: number
          role: string | null
        }
        Insert: {
          content?: string | null
          contract_id?: number | null
          created_at?: string | null
          id?: number
          role?: string | null
        }
        Update: {
          content?: string | null
          contract_id?: number | null
          created_at?: string | null
          id?: number
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_contract_id_fkey"
            columns: ["contract_id"]
            referencedRelation: "contract"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          balance: number | null
          created_at: string | null
          id: string
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          id: string
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
