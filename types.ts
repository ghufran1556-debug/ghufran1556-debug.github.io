
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

export interface PortfolioItem {
  id: string;
  category_id: string;
  title: string;
  image_url: string;
  media_type?: 'image' | 'video';
  description?: string;
  created_at?: string;
  category?: Category;
}
