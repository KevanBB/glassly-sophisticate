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
      activity_logs: {
        Row: {
          action: string
          created_at: string | null
          data: Json | null
          element: string | null
          id: string
          page: string | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          data?: Json | null
          element?: string | null
          id?: string
          page?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          data?: Json | null
          element?: string | null
          id?: string
          page?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      admin_actions: {
        Row: {
          action_type: string
          admin_id: string | null
          created_at: string | null
          details: Json | null
          id: string
          target_user_id: string | null
        }
        Insert: {
          action_type: string
          admin_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          target_user_id?: string | null
        }
        Update: {
          action_type?: string
          admin_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          target_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_actions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_actions_target_user_id_fkey"
            columns: ["target_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      connections: {
        Row: {
          created_at: string | null
          id: string
          recipient_id: string
          requester_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          recipient_id: string
          requester_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          recipient_id?: string
          requester_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "connections_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connections_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "contacts_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_applications: {
        Row: {
          address: string
          birthday: string
          created_at: string | null
          denial_reason: string | null
          display_name: string | null
          email: string | null
          id: string
          id_back_url: string
          id_front_url: string
          id_selfie_url: string
          legal_first_name: string
          legal_last_name: string
          legal_middle_name: string | null
          signature_date: string | null
          status: string | null
          terms_agreed: boolean | null
          terms_signature: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address: string
          birthday: string
          created_at?: string | null
          denial_reason?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          id_back_url: string
          id_front_url: string
          id_selfie_url: string
          legal_first_name: string
          legal_last_name: string
          legal_middle_name?: string | null
          signature_date?: string | null
          status?: string | null
          terms_agreed?: boolean | null
          terms_signature?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string
          birthday?: string
          created_at?: string | null
          denial_reason?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          id_back_url?: string
          id_front_url?: string
          id_selfie_url?: string
          legal_first_name?: string
          legal_last_name?: string
          legal_middle_name?: string | null
          signature_date?: string | null
          status?: string | null
          terms_agreed?: boolean | null
          terms_signature?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "creator_applications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_categories: {
        Row: {
          allowed_roles: string[] | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_private: boolean | null
          name: string
          position: number | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          allowed_roles?: string[] | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_private?: boolean | null
          name: string
          position?: number | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          allowed_roles?: string[] | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_private?: boolean | null
          name?: string
          position?: number | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      forum_posts: {
        Row: {
          content: string
          created_at: string | null
          edited_at: string | null
          id: string
          parent_post_id: string | null
          thread_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          edited_at?: string | null
          id?: string
          parent_post_id?: string | null
          thread_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          edited_at?: string | null
          id?: string
          parent_post_id?: string | null
          thread_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_posts_parent_post_id_fkey"
            columns: ["parent_post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_posts_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "forum_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_reactions: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          reaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          reaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_subcategories: {
        Row: {
          allowed_roles: string[] | null
          category_id: string
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_private: boolean | null
          name: string
          position: number | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          allowed_roles?: string[] | null
          category_id: string
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_private?: boolean | null
          name: string
          position?: number | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          allowed_roles?: string[] | null
          category_id?: string
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_private?: boolean | null
          name?: string
          position?: number | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "forum_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_subscriptions: {
        Row: {
          created_at: string | null
          id: string
          thread_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          thread_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          thread_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_subscriptions_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "forum_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_threads: {
        Row: {
          created_at: string | null
          id: string
          is_featured: boolean | null
          is_locked: boolean | null
          is_pinned: boolean | null
          is_private: boolean | null
          private_users: string[] | null
          slug: string
          subcategory_id: string
          title: string
          updated_at: string | null
          user_id: string
          view_count: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_featured?: boolean | null
          is_locked?: boolean | null
          is_pinned?: boolean | null
          is_private?: boolean | null
          private_users?: string[] | null
          slug: string
          subcategory_id: string
          title: string
          updated_at?: string | null
          user_id: string
          view_count?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_featured?: boolean | null
          is_locked?: boolean | null
          is_pinned?: boolean | null
          is_private?: boolean | null
          private_users?: string[] | null
          slug?: string
          subcategory_id?: string
          title?: string
          updated_at?: string | null
          user_id?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_threads_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "forum_subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string | null
          created_at: string | null
          destruct_after: string | null
          id: string
          is_encrypted: boolean | null
          is_self_destruct: boolean | null
          media_type: string | null
          media_url: string | null
          read_at: string | null
          receiver_id: string | null
          room_id: string | null
          sender_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          destruct_after?: string | null
          id?: string
          is_encrypted?: boolean | null
          is_self_destruct?: boolean | null
          media_type?: string | null
          media_url?: string | null
          read_at?: string | null
          receiver_id?: string | null
          room_id?: string | null
          sender_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          destruct_after?: string | null
          id?: string
          is_encrypted?: boolean | null
          is_self_destruct?: boolean | null
          media_type?: string | null
          media_url?: string | null
          read_at?: string | null
          receiver_id?: string | null
          room_id?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_link: string | null
          content: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          sender_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_link?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          sender_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_link?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          sender_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_media: {
        Row: {
          caption: string | null
          created_at: string | null
          file_size: number | null
          id: string
          media_type: string | null
          media_url: string
          position: number | null
          post_id: string
          thumbnail_url: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          file_size?: number | null
          id?: string
          media_type?: string | null
          media_url: string
          position?: number | null
          post_id: string
          thumbnail_url?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          file_size?: number | null
          id?: string
          media_type?: string | null
          media_url?: string
          position?: number | null
          post_id?: string
          thumbnail_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_media_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          caption: string | null
          created_at: string | null
          creator_id: string
          id: string
          price: number | null
          tags: string[] | null
          title: string
          updated_at: string | null
          visibility: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          creator_id: string
          id?: string
          price?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          visibility?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          creator_id?: string
          id?: string
          price?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      privacy_settings: {
        Row: {
          bio_visibility: string | null
          disable_message_history: boolean | null
          display_name_visibility: string | null
          experience_visibility: string | null
          hide_from_search: boolean | null
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
          incognito_mode?: boolean | null
          interests_visibility?: string | null
          photos_visibility?: string | null
          prevent_screenshots?: boolean | null
          role_visibility?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "privacy_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
          email: string | null
          experience_level: string | null
          first_name: string | null
          gender: string | null
          id: string
          is_active: boolean | null
          joined_at: string | null
          kinks_fetishes: string[] | null
          last_active: string | null
          last_name: string | null
          location: string | null
          looking_for: string[] | null
          orientation: string | null
          role: string | null
          updated_at: string | null
          user_number: number
          username: string | null
        }
        Insert: {
          age?: string | null
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          creator_onboarding_complete?: boolean | null
          creator_username?: string | null
          display_name?: string | null
          email?: string | null
          experience_level?: string | null
          first_name?: string | null
          gender?: string | null
          id: string
          is_active?: boolean | null
          joined_at?: string | null
          kinks_fetishes?: string[] | null
          last_active?: string | null
          last_name?: string | null
          location?: string | null
          looking_for?: string[] | null
          orientation?: string | null
          role?: string | null
          updated_at?: string | null
          user_number?: number
          username?: string | null
        }
        Update: {
          age?: string | null
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          creator_onboarding_complete?: boolean | null
          creator_username?: string | null
          display_name?: string | null
          email?: string | null
          experience_level?: string | null
          first_name?: string | null
          gender?: string | null
          id?: string
          is_active?: boolean | null
          joined_at?: string | null
          kinks_fetishes?: string[] | null
          last_active?: string | null
          last_name?: string | null
          location?: string | null
          looking_for?: string[] | null
          orientation?: string | null
          role?: string | null
          updated_at?: string | null
          user_number?: number
          username?: string | null
        }
        Relationships: []
      }
      status_comment_likes: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "status_comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "status_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "status_comment_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      status_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          parent_comment_id: string | null
          status_update_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          parent_comment_id?: string | null
          status_update_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          parent_comment_id?: string | null
          status_update_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "status_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "status_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "status_comments_status_update_id_fkey"
            columns: ["status_update_id"]
            isOneToOne: false
            referencedRelation: "status_updates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "status_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      status_likes: {
        Row: {
          created_at: string
          id: string
          status_update_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          status_update_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          status_update_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "status_likes_status_update_id_fkey"
            columns: ["status_update_id"]
            isOneToOne: false
            referencedRelation: "status_updates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "status_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      status_update_media: {
        Row: {
          created_at: string
          id: string
          media_type: string
          media_url: string
          status_update_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          media_type: string
          media_url: string
          status_update_id: string
        }
        Update: {
          created_at?: string
          id?: string
          media_type?: string
          media_url?: string
          status_update_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "status_update_media_status_update_id_fkey"
            columns: ["status_update_id"]
            isOneToOne: false
            referencedRelation: "status_updates"
            referencedColumns: ["id"]
          },
        ]
      }
      status_updates: {
        Row: {
          content: string | null
          created_at: string
          hashtags: string[] | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          hashtags?: string[] | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          hashtags?: string[] | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "status_updates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "user_kinks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notes: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
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
