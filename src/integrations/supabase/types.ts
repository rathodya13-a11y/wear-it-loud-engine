export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15";
  };
  public: {
    Tables: {
      banners: {
        Row: {
          active: boolean;
          created_at: string;
          id: string;
          message: string;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          created_at?: string;
          id?: string;
          message: string;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          active?: boolean;
          created_at?: string;
          id?: string;
          message?: string;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      inventory: {
        Row: {
          product_slug: string;
          size: string;
          stock: number;
          updated_at: string;
        };
        Insert: {
          product_slug: string;
          size: string;
          stock?: number;
          updated_at?: string;
        };
        Update: {
          product_slug?: string;
          size?: string;
          stock?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          address: string;
          city: string;
          created_at: string;
          discount: number;
          email: string;
          full_name: string;
          id: string;
          items: Json;
          order_code: string;
          phone: string;
          pin: string;
          promo_code: string | null;
          shipping: number;
          status: string;
          subtotal: number;
          total: number;
          updated_at: string;
        };
        Insert: {
          address: string;
          city: string;
          created_at?: string;
          discount?: number;
          email: string;
          full_name: string;
          id?: string;
          items?: Json;
          order_code: string;
          phone: string;
          pin: string;
          promo_code?: string | null;
          shipping?: number;
          status?: string;
          subtotal: number;
          total: number;
          updated_at?: string;
        };
        Update: {
          address?: string;
          city?: string;
          created_at?: string;
          discount?: number;
          email?: string;
          full_name?: string;
          id?: string;
          items?: Json;
          order_code?: string;
          phone?: string;
          pin?: string;
          promo_code?: string | null;
          shipping?: number;
          status?: string;
          subtotal?: number;
          total?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          active: boolean;
          bestseller: boolean;
          blurb: string;
          care: string;
          category: string;
          created_at: string;
          fabric: string;
          fit: string;
          hover_image_url: string | null;
          id: string;
          image_url: string;
          mrp: number;
          name: string;
          price: number;
          print: string;
          rating: number;
          reviews: number;
          slug: string;
          stock: Json;
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          bestseller?: boolean;
          blurb?: string;
          care?: string;
          category?: string;
          created_at?: string;
          fabric?: string;
          fit?: string;
          hover_image_url?: string | null;
          id?: string;
          image_url: string;
          mrp: number;
          name: string;
          price: number;
          print?: string;
          rating?: number;
          reviews?: number;
          slug: string;
          stock?: Json;
          updated_at?: string;
        };
        Update: {
          active?: boolean;
          bestseller?: boolean;
          blurb?: string;
          care?: string;
          category?: string;
          created_at?: string;
          fabric?: string;
          fit?: string;
          hover_image_url?: string | null;
          id?: string;
          image_url?: string;
          mrp?: number;
          name?: string;
          price?: number;
          print?: string;
          rating?: number;
          reviews?: number;
          slug?: string;
          stock?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          address: string | null;
          city: string | null;
          created_at: string;
          full_name: string | null;
          id: string;
          phone: string | null;
          pin: string | null;
          updated_at: string;
        };
        Insert: {
          address?: string | null;
          city?: string | null;
          created_at?: string;
          full_name?: string | null;
          id: string;
          phone?: string | null;
          pin?: string | null;
          updated_at?: string;
        };
        Update: {
          address?: string | null;
          city?: string | null;
          created_at?: string;
          full_name?: string | null;
          id?: string;
          phone?: string | null;
          pin?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      promo_codes: {
        Row: {
          active: boolean;
          code: string;
          created_at: string;
          expires_at: string | null;
          kind: string;
          min_subtotal: number;
          value: number;
        };
        Insert: {
          active?: boolean;
          code: string;
          created_at?: string;
          expires_at?: string | null;
          kind: string;
          min_subtotal?: number;
          value: number;
        };
        Update: {
          active?: boolean;
          code?: string;
          created_at?: string;
          expires_at?: string | null;
          kind?: string;
          min_subtotal?: number;
          value?: number;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          brand_name: string;
          created_at: string;
          free_shipping_threshold: number;
          id: number;
          logo_url: string | null;
          sale_ends_at: string;
          tagline: string;
          updated_at: string;
        };
        Insert: {
          brand_name?: string;
          created_at?: string;
          free_shipping_threshold?: number;
          id?: number;
          logo_url?: string | null;
          sale_ends_at?: string;
          tagline?: string;
          updated_at?: string;
        };
        Update: {
          brand_name?: string;
          created_at?: string;
          free_shipping_threshold?: number;
          id?: number;
          logo_url?: string | null;
          sale_ends_at?: string;
          tagline?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
      track_order: {
        Args: { _email: string; _order_code: string };
        Returns: Json;
      };
      validate_promo: {
        Args: { _code: string; _subtotal: number };
        Returns: Json;
      };
    };
    Enums: {
      app_role: "admin" | "user";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const;
