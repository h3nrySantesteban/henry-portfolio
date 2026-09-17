export type Company = {
  id: string;
  name: string;
  role: string;
  period: string;
  description: string;
  logo_url: string | null;
  order_index: number;
  created_at: string;
};

export type Solution = {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  project_url: string | null;
  order_index: number;
  created_at: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  category: string;
  read_time: string;
  published: boolean;
  created_at: string;
};

export type SiteSettings = {
  id: number;
  full_name: string;
  role_title: string;
  hero_heading: string;
  hero_subheading: string;
  email: string;
  github_url: string;
  cv_url: string | null;
};

type Table<Row, Insert> = {
  Row: Row;
  Insert: Insert;
  Update: Partial<Insert>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      companies: Table<
        Company,
        Partial<Company> & Pick<Company, "name" | "role" | "period" | "description">
      >;
      solutions: Table<Solution, Partial<Solution> & Pick<Solution, "title" | "description">>;
      blog_posts: Table<
        BlogPost,
        Partial<BlogPost> & Pick<BlogPost, "title" | "slug" | "excerpt" | "content" | "category">
      >;
      site_settings: Table<SiteSettings, Partial<SiteSettings>>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
