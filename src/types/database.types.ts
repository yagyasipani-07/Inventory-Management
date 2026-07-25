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
      audit_logs: {
        Row: {
          action: string
          created_at: string
          description: string | null
          entity: string
          entity_id: string
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          description?: string | null
          entity: string
          entity_id: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          description?: string | null
          entity?: string
          entity_id?: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
      }
      challan_items: {
        Row: {
          challan_id: string
          created_at: string
          id: string
          product_id: string
          quantity: number
          updated_at: string
        }
        Insert: {
          challan_id: string
          created_at?: string
          id?: string
          product_id: string
          quantity: number
          updated_at?: string
        }
        Update: {
          challan_id?: string
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          updated_at?: string
        }
      }
      challans: {
        Row: {
          challan_number: string
          created_at: string
          created_by_id: string | null
          customer_id: string
          deleted_at: string | null
          dispatch_date: string | null
          id: string
          notes: string | null
          status: Database["public"]["Enums"]["challan_status"]
          updated_at: string
        }
        Insert: {
          challan_number: string
          created_at?: string
          created_by_id?: string | null
          customer_id: string
          deleted_at?: string | null
          dispatch_date?: string | null
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["challan_status"]
          updated_at?: string
        }
        Update: {
          challan_number?: string
          created_at?: string
          created_by_id?: string | null
          customer_id?: string
          deleted_at?: string | null
          dispatch_date?: string | null
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["challan_status"]
          updated_at?: string
        }
      }
      customers: {
        Row: {
          contact_person: string | null
          created_at: string
          customer_name: string
          customer_number: string
          deleted_at: string | null
          email: string | null
          gst: string | null
          id: string
          notes: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          contact_person?: string | null
          created_at?: string
          customer_name: string
          customer_number: string
          deleted_at?: string | null
          email?: string | null
          gst?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          contact_person?: string | null
          created_at?: string
          customer_name?: string
          customer_number?: string
          deleted_at?: string | null
          email?: string | null
          gst?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
      }
      export_history: {
        Row: {
          export_type: string
          file_name: string
          generated_at: string
          generated_by: string | null
          id: string
        }
        Insert: {
          export_type: string
          file_name: string
          generated_at?: string
          generated_by?: string | null
          id?: string
        }
        Update: {
          export_type?: string
          file_name?: string
          generated_at?: string
          generated_by?: string | null
          id?: string
        }
      }
      import_history: {
        Row: {
          failed_rows: number
          file_name: string
          id: string
          import_date: string
          imported_by: string | null
          successful_rows: number
          total_rows: number
        }
        Insert: {
          failed_rows?: number
          file_name: string
          id?: string
          import_date?: string
          imported_by?: string | null
          successful_rows?: number
          total_rows?: number
        }
        Update: {
          failed_rows?: number
          file_name?: string
          id?: string
          import_date?: string
          imported_by?: string | null
          successful_rows?: number
          total_rows?: number
        }
      }
      products: {
        Row: {
          active_status: boolean
          brand: string | null
          category: string | null
          created_at: string
          deleted_at: string | null
          description: string | null
          id: string
          length: number | null
          product_code: string
          product_image_path: string | null
          product_name: string
          thickness: number | null
          unit: string | null
          updated_at: string
          width: number | null
        }
        Insert: {
          active_status?: boolean
          brand?: string | null
          category?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          length?: number | null
          product_code: string
          product_image_path?: string | null
          product_name: string
          thickness?: number | null
          unit?: string | null
          updated_at?: string
          width?: number | null
        }
        Update: {
          active_status?: boolean
          brand?: string | null
          category?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          length?: number | null
          product_code?: string
          product_image_path?: string | null
          product_name?: string
          thickness?: number | null
          unit?: string | null
          updated_at?: string
          width?: number | null
        }
      }
      settings: {
        Row: {
          description: string | null
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          description?: string | null
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          description?: string | null
          key?: string
          updated_at?: string
          value?: Json
        }
      }
      stock_movements: {
        Row: {
          created_at: string
          id: string
          movement_type: Database["public"]["Enums"]["movement_type"]
          new_quantity: number
          previous_quantity: number
          product_id: string
          quantity_change: number
          reference_id: string | null
          remarks: string | null
          warehouse_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          movement_type: Database["public"]["Enums"]["movement_type"]
          new_quantity: number
          previous_quantity: number
          product_id: string
          quantity_change: number
          reference_id?: string | null
          remarks?: string | null
          warehouse_id: string
        }
        Update: {
          created_at?: string
          id?: string
          movement_type?: Database["public"]["Enums"]["movement_type"]
          new_quantity?: number
          previous_quantity?: number
          product_id?: string
          quantity_change?: number
          reference_id?: string | null
          remarks?: string | null
          warehouse_id?: string
        }
      }
      user_profiles: {
        Row: {
          active: boolean
          created_at: string
          deleted_at: string | null
          email: string
          id: string
          name: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          deleted_at?: string | null
          email: string
          id: string
          name: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          deleted_at?: string | null
          email?: string
          id?: string
          name?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
      }
      warehouse_stock: {
        Row: {
          created_at: string
          current_quantity: number
          id: string
          product_id: string
          reorder_level: number
          reserved_quantity: number
          updated_at: string
          warehouse_id: string
        }
        Insert: {
          created_at?: string
          current_quantity?: number
          id?: string
          product_id: string
          reorder_level?: number
          reserved_quantity?: number
          updated_at?: string
          warehouse_id: string
        }
        Update: {
          created_at?: string
          current_quantity?: number
          id?: string
          product_id?: string
          reorder_level?: number
          reserved_quantity?: number
          updated_at?: string
          warehouse_id?: string
        }
      }
      warehouses: {
        Row: {
          active_status: boolean
          address: string | null
          code: string
          created_at: string
          deleted_at: string | null
          id: string
          updated_at: string
          warehouse_name: string
        }
        Insert: {
          active_status?: boolean
          address?: string | null
          code: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          updated_at?: string
          warehouse_name: string
        }
        Update: {
          active_status?: boolean
          address?: string | null
          code?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          updated_at?: string
          warehouse_name?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      auth_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      challan_status: "Draft" | "Approved" | "Dispatched" | "Cancelled"
      movement_type:
        | "Opening Stock"
        | "Dispatch"
        | "Adjustment"
        | "Return"
        | "Import"
        | "Manual Update"
      user_role: "Administrator" | "Manager" | "Staff" | "Viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
