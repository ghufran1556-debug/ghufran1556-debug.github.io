
export interface ServiceItem {
  title: string;
  description: string;
  icon: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  cover_image: string;
  created_at?: string;
}

export interface SubCategory {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  created_at?: string;
  category?: Category;
}

export interface PortfolioItem {
  id: string;
  category_id: string;
  sub_category_id?: string;
  sub_category?: string; // Legacy field
  title: string;
  image_url: string;
  description?: string;
  created_at?: string;
  category?: Category;
  sub_category_obj?: SubCategory;
}
