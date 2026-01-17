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
      gallery_images: {
        Row: {
          id: string
          title: string
          description: string | null
          image_url: string
          thumbnail_url: string | null
          tags: string[]
          social_media_source: string | null
          social_media_url: string | null
          display_order: number
          is_featured: boolean
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          image_url: string
          thumbnail_url?: string | null
          tags?: string[]
          social_media_source?: string | null
          social_media_url?: string | null
          display_order?: number
          is_featured?: boolean
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          image_url?: string
          thumbnail_url?: string | null
          tags?: string[]
          social_media_source?: string | null
          social_media_url?: string | null
          display_order?: number
          is_featured?: boolean
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      testimonials: {
        Row: {
          id: string
          client_name: string
          client_photo_url: string | null
          rating: number
          review_text: string
          project_type: string | null
          location: string | null
          is_published: boolean
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          client_name: string
          client_photo_url?: string | null
          rating: number
          review_text: string
          project_type?: string | null
          location?: string | null
          is_published?: boolean
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          client_name?: string
          client_photo_url?: string | null
          rating?: number
          review_text?: string
          project_type?: string | null
          location?: string | null
          is_published?: boolean
          display_order?: number
          created_at?: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string | null
          content: string
          featured_image_url: string | null
          author: string
          tags: string[]
          meta_title: string | null
          meta_description: string | null
          is_published: boolean
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt?: string | null
          content: string
          featured_image_url?: string | null
          author?: string
          tags?: string[]
          meta_title?: string | null
          meta_description?: string | null
          is_published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string | null
          content?: string
          featured_image_url?: string | null
          author?: string
          tags?: string[]
          meta_title?: string | null
          meta_description?: string | null
          is_published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
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
