export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_actions: {
        Row: {
          action_type: string
          admin_id: string
          created_at: string
          details: Json | null
          id: string
          target_user_id: string | null
        }
        Insert: {
          action_type: string
          admin_id: string
          created_at?: string
          details?: Json | null
          id?: string
          target_user_id?: string | null
        }
        Update: {
          action_type?: string
          admin_id?: string
          created_at?: string
          details?: Json | null
          id?: string
          target_user_id?: string | null
        }
        Relationships: []
      }
      connections: {
        Row: {
          created_at: string
          id: string
          recipient_id: string
          requester_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          recipient_id: string
          requester_id: string
          status: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          recipient_id?: string
          requester_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          contact_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          contact_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          contact_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      creator_applications: {
        Row: {
          address: string
          birthday: string
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          id_back_url: string
          id_front_url: string
          id_selfie_url: string
          legal_first_name: string
          legal_last_name: string
          legal_middle_name: string | null
          signature: string
          signature_date: string
          status: string
          terms_agreed: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          birthday: string
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          id_back_url: string
          id_front_url: string
          id_selfie_url: string
          legal_first_name: string
          legal_last_name: string
          legal_middle_name?: string | null
          signature: string
          signature_date: string
          status?: string
          terms_agreed?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          birthday?: string
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          id_back_url?: string
          id_front_url?: string
          id_selfie_url?: string
          legal_first_name?: string
          legal_last_name?: string
          legal_middle_name?: string | null
          signature?: string
          signature_date?: string
          status?: string
          terms_agreed?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      creator_onboarding: {
        Row: {
          created_at: string | null
          creator_username: string
          id: string
          terms_agreed: boolean | null
          terms_signature: string | null
          terms_signed_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          creator_username: string
          id?: string
          terms_agreed?: boolean | null
          terms_signature?: string | null
          terms_signed_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          creator_username?: string
          id?: string
          terms_agreed?: boolean | null
          terms_signature?: string | null
          terms_signed_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "creator_onboarding_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          destruct_after: unknown | null
          id: string
          is_encrypted: boolean | null
          is_self_destruct: boolean | null
          media_type: string | null
          media_url: string | null
          read_at: string | null
          receiver_id: string
          replied_to_id: string | null
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          destruct_after?: unknown | null
          id?: string
          is_encrypted?: boolean | null
          is_self_destruct?: boolean | null
          media_type?: string | null
          media_url?: string | null
          read_at?: string | null
          receiver_id: string
          replied_to_id?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          destruct_after?: unknown | null
          id?: string
          is_encrypted?: boolean | null
          is_self_destruct?: boolean | null
          media_type?: string | null
          media_url?: string | null
          read_at?: string | null
          receiver_id?: string
          replied_to_id?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_replied_to_id_fkey"
            columns: ["replied_to_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          content: Json
          created_at: string
          id: string
          is_read: boolean
          type: string
          user_id: string
        }
        Insert: {
          content: Json
          created_at?: string
          id?: string
          is_read?: boolean
          type: string
          user_id: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          is_read?: boolean
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      privacy_settings: {
        Row: {
          bio_visibility: string | null
          disable_message_history: boolean | null
          display_name_visibility: string | null
          experience_visibility: string | null
          hide_from_search: boolean | null
          id: string
          incognito_mode: boolean | null
          interests_visibility: string | null
          photos_visibility: string | null
          prevent_screenshots: boolean | null
          role_visibility: string | null
          user_id: string
        }
        Insert: {
          bio_visibility?: string | null
          disable_message_history?: boolean | null
          display_name_visibility?: string | null
          experience_visibility?: string | null
          hide_from_search?: boolean | null
          id?: string
          incognito_mode?: boolean | null
          interests_visibility?: string | null
          photos_visibility?: string | null
          prevent_screenshots?: boolean | null
          role_visibility?: string | null
          user_id: string
        }
        Update: {
          bio_visibility?: string | null
          disable_message_history?: boolean | null
          display_name_visibility?: string | null
          experience_visibility?: string | null
          hide_from_search?: boolean | null
          id?: string
          incognito_mode?: boolean | null
          interests_visibility?: string | null
          photos_visibility?: string | null
          prevent_screenshots?: boolean | null
          role_visibility?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: string | null
          avatar_url: string | null
          banner_url: string | null
          bio: string | null
          creator_onboarding_complete: boolean | null
          creator_username: string | null
          display_name: string | null
          experience_level: string | null
          first_name: string | null
          gender: string | null
          id: string
          is_active: boolean | null
          is_creator: boolean | null
          joined_at: string | null
          kinks_fetishes: string[] | null
          last_active: string | null
          last_name: string | null
          location: string | null
          looking_for: string[] | null
          orientation: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          age?: string | null
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          creator_onboarding_complete?: boolean | null
          creator_username?: string | null
          display_name?: string | null
          experience_level?: string | null
          first_name?: string | null
          gender?: string | null
          id: string
          is_active?: boolean | null
          is_creator?: boolean | null
          joined_at?: string | null
          kinks_fetishes?: string[] | null
          last_active?: string | null
          last_name?: string | null
          location?: string | null
          looking_for?: string[] | null
          orientation?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          age?: string | null
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          creator_onboarding_complete?: boolean | null
          creator_username?: string | null
          display_name?: string | null
          experience_level?: string | null
          first_name?: string | null
          gender?: string | null
          id?: string
          is_active?: boolean | null
          is_creator?: boolean | null
          joined_at?: string | null
          kinks_fetishes?: string[] | null
          last_active?: string | null
          last_name?: string | null
          location?: string | null
          looking_for?: string[] | null
          orientation?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_kinks: {
        Row: {
          created_at: string | null
          id: string
          kink_name: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          kink_name: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          kink_name?: string
          user_id?: string
        }
        Relationships: []
      }
      user_notes: {
        Row: {
          content: string
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_personas: {
        Row: {
          bio: string | null
          created_at: string | null
          display_name: string | null
          experience_level: string | null
          id: string
          interests: string[] | null
          is_default: boolean | null
          name: string
          role: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          experience_level?: string | null
          id?: string
          interests?: string[] | null
          is_default?: boolean | null
          name: string
          role?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          experience_level?: string | null
          id?: string
          interests?: string[] | null
          is_default?: boolean | null
          name?: string
          role?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      creator_applications_with_profiles: {
        Row: {
          address: string | null
          birthday: string | null
          created_at: string | null
          display_name: string | null
          email: string | null
          id: string | null
          id_back_url: string | null
          id_front_url: string | null
          id_selfie_url: string | null
          legal_first_name: string | null
          legal_last_name: string | null
          legal_middle_name: string | null
          profile_avatar_url: string | null
          profile_display_name: string | null
          signature: string | null
          signature_date: string | null
          status: string | null
          terms_agreed: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "user" | "moderator" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
