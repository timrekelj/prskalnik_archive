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
      companies: {
        Row: {
          address: string
          created_at: string
          description: string
          email_contact_person: string
          firstname_contact_person: string
          id: string
          industry: string
          lastname_contact_person: string
          name: string
          phone_contact_person: string
        }
        Insert: {
          address: string
          created_at?: string
          description: string
          email_contact_person: string
          firstname_contact_person: string
          id: string
          industry: string
          lastname_contact_person: string
          name: string
          phone_contact_person: string
        }
        Update: {
          address?: string
          created_at?: string
          description?: string
          email_contact_person?: string
          firstname_contact_person?: string
          id?: string
          industry?: string
          lastname_contact_person?: string
          name?: string
          phone_contact_person?: string
        }
        Relationships: [
          {
            foreignKeyName: "companies_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      jobs: {
        Row: {
          company_id: string
          country: string
          created_at: string
          description: string
          id: string
          location: string
          offers: string[]
          profession: string
          region: string
          requirements: string[]
          responsibilities: string[]
          reward: boolean
          title: string
        }
        Insert: {
          company_id: string
          country: string
          created_at?: string
          description: string
          id?: string
          location: string
          offers: string[]
          profession: string
          region: string
          requirements: string[]
          responsibilities?: string[]
          reward?: boolean
          title: string
        }
        Update: {
          company_id?: string
          country?: string
          created_at?: string
          description?: string
          id?: string
          location?: string
          offers?: string[]
          profession?: string
          region?: string
          requirements?: string[]
          responsibilities?: string[]
          reward?: boolean
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          }
        ]
      }
      user_job: {
        Row: {
          created_at: string
          job_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          job_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          job_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_job_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_job_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          birthyear: string
          college: boolean
          created_at: string
          eduinstitution: string
          eduprogram: string
          email: string
          firstname: string
          id: string
          lastname: string
        }
        Insert: {
          birthyear: string
          college: boolean
          created_at?: string
          eduinstitution: string
          eduprogram: string
          email: string
          firstname: string
          id: string
          lastname: string
        }
        Update: {
          birthyear?: string
          college?: boolean
          created_at?: string
          eduinstitution?: string
          eduprogram?: string
          email?: string
          firstname?: string
          id?: string
          lastname?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      regions: {
        Row: {
          region: string | null
        }
        Relationships: []
      }
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
