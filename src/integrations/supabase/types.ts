export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          check_in: string
          check_out: string
          created_at: string
          guests: number
          id: string
          payment_status: string
          room_id: string
          room_name: string
          special_requests: string | null
          status: string
          total_price: number
          user_id: string
        }
        Insert: {
          check_in: string
          check_out: string
          created_at?: string
          guests?: number
          id?: string
          payment_status?: string
          room_id: string
          room_name: string
          special_requests?: string | null
          status?: string
          total_price: number
          user_id: string
        }
        Update: {
          check_in?: string
          check_out?: string
          created_at?: string
          guests?: number
          id?: string
          payment_status?: string
          room_id?: string
          room_name?: string
          special_requests?: string | null
          status?: string
          total_price?: number
          user_id?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          status: string
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          status?: string
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string
          subject?: string
        }
        Relationships: []
      }
      dining_options: {
        Row: {
          active: boolean
          created_at: string
          cuisine: string
          description: string
          highlight: string
          hours: string
          icon: string
          id: string
          location: string
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          cuisine?: string
          description?: string
          highlight?: string
          hours?: string
          icon?: string
          id?: string
          location?: string
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          cuisine?: string
          description?: string
          highlight?: string
          hours?: string
          icon?: string
          id?: string
          location?: string
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      group_reservations: {
        Row: {
          check_in: string
          check_out: string
          created_at: string
          group_name: string
          id: string
          notes: string | null
          organizer_email: string
          organizer_name: string
          organizer_phone: string | null
          status: string
          total_guests: number
          total_rooms: number
          updated_at: string
        }
        Insert: {
          check_in: string
          check_out: string
          created_at?: string
          group_name: string
          id?: string
          notes?: string | null
          organizer_email: string
          organizer_name: string
          organizer_phone?: string | null
          status?: string
          total_guests?: number
          total_rooms?: number
          updated_at?: string
        }
        Update: {
          check_in?: string
          check_out?: string
          created_at?: string
          group_name?: string
          id?: string
          notes?: string | null
          organizer_email?: string
          organizer_name?: string
          organizer_phone?: string | null
          status?: string
          total_guests?: number
          total_rooms?: number
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          reference_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          reference_id?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          reference_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      offers: {
        Row: {
          active: boolean
          created_at: string
          description: string
          discount: string
          icon: string
          id: string
          sort_order: number
          tag: string
          title: string
          updated_at: string
          validity: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description: string
          discount?: string
          icon?: string
          id?: string
          sort_order?: number
          tag?: string
          title: string
          updated_at?: string
          validity?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string
          discount?: string
          icon?: string
          id?: string
          sort_order?: number
          tag?: string
          title?: string
          updated_at?: string
          validity?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      room_images: {
        Row: {
          created_at: string
          id: string
          image_url: string
          room_id: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          room_id: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          room_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "room_images_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          amenities: string[] | null
          capacity: number
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          price: number
          size: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amenities?: string[] | null
          capacity?: number
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price?: number
          size?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amenities?: string[] | null
          capacity?: number
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          size?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      service_requests: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          status: string
          type: string
          urgency: string | null
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          status?: string
          type: string
          urgency?: string | null
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          status?: string
          type?: string
          urgency?: string | null
          user_id?: string
        }
        Relationships: []
      }
      staff: {
        Row: {
          created_at: string
          department: string
          email: string | null
          id: string
          join_date: string
          name: string
          notes: string | null
          pay_day: number
          phone: string | null
          role: string
          salary: number
          salary_paid: boolean
          shift: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          department?: string
          email?: string | null
          id?: string
          join_date?: string
          name: string
          notes?: string | null
          pay_day?: number
          phone?: string | null
          role?: string
          salary?: number
          salary_paid?: boolean
          shift?: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          department?: string
          email?: string | null
          id?: string
          join_date?: string
          name?: string
          notes?: string | null
          pay_day?: number
          phone?: string | null
          role?: string
          salary?: number
          salary_paid?: boolean
          shift?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      staff_payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          month: string
          notes: string | null
          paid_at: string
          staff_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          month: string
          notes?: string | null
          paid_at?: string
          staff_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          month?: string
          notes?: string | null
          paid_at?: string
          staff_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_payments_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          check_in_desired: string
          check_out_desired: string
          created_at: string
          guest_email: string
          guest_name: string
          guests: number
          id: string
          notes: string | null
          phone: string | null
          room_preference: string | null
          status: string
          updated_at: string
        }
        Insert: {
          check_in_desired: string
          check_out_desired: string
          created_at?: string
          guest_email: string
          guest_name: string
          guests?: number
          id?: string
          notes?: string | null
          phone?: string | null
          room_preference?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          check_in_desired?: string
          check_out_desired?: string
          created_at?: string
          guest_email?: string
          guest_name?: string
          guests?: number
          id?: string
          notes?: string | null
          phone?: string | null
          room_preference?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
