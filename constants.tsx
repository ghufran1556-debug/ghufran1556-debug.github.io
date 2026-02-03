
import React from 'react';
import { Palette, Camera, Video, Presentation, Globe, Table, Share2 } from 'lucide-react';
import { ServiceItem, PortfolioItem } from './types';

export const DESIGN_SERVICES: ServiceItem[] = [
  {
    title: "Graphic Design\nتصميم جرافيك",
    description: 'تصميم هويات، بوسترات، وبروفايلات سوشال ميديا بأسلوب احترافي.',
    icon: 'Palette'
  },
  {
    title: "Photography\nالتصوير الفوتوغرافي",
    description: 'تصوير منتجات، أشخاص، ومشاريع تجارية بجودة عالية.',
    icon: 'Camera'
  },
  {
    title: "Video Production\nتصوير وإنتاج فيديوهات",
    description: 'إنتاج فيديوهات قصيرة وإعلانية مع مونتاج احترافي.',
    icon: 'Video'
  },
  {
    title: "Professional Presentations\nعروض تقديمية احترافية",
    description: 'تصميم عروض PowerPoint وGoogle Slides بشكل جذاب وواضح.',
    icon: 'Presentation'
  }
];

export const TECH_SERVICES: ServiceItem[] = [
  {
    title: "Website Design\nتصميم مواقع",
    description: 'إنشاء مواقع بسيطة وجذابة باستخدام أدوات بدون برمجة.',
    icon: 'Globe'
  },
  {
    title: "Excel Sheets & Dashboards\nتصميم جداول إكسل وداشبورد",
    description: 'بناء جداول ولوحات تحكم تساعد على التحليل واتخاذ القرار.',
    icon: 'Table'
  },
  {
    title: "Social Media Management\nإدارة حسابات السوشال ميديا",
    description: 'تنسيق المحتوى، تصميم المنشورات، وجدولة النشر وتحليل الأداء.',
    icon: 'Share2'
  }
];

// Fix: Updated PORTFOLIO_ITEMS to match the PortfolioItem interface defined in types.ts
// This fixes the 'string not assignable to Category' error by using category_id instead of category.
export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  // التصميم الجرافيكي
  { id: 'd1', category_id: 'design', sub_category: 'بوسترات', title: 'بوستر حملة إعلانية سينمائي', image_url: 'https://images.unsplash.com/photo-1572044162444-ad60f128bde2?auto=format&fit=crop&q=80&w=800' },
  { id: 'd2', category_id: 'design', sub_category: 'هويات', title: 'هوية بصرية متكاملة لبراند قهوة', image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800' },
  { id: 'd3', category_id: 'design', sub_category: 'سوشال ميديا', title: 'مجموعة تصاميم انستقرام تفاعلية', image_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800' },
  
  // التصوير
  { id: 'p1', category_id: 'photo', sub_category: 'صور منتجات', title: 'تصوير تجاري لمستحضرات تجميل', image_url: 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=800' },
  { id: 'p2', category_id: 'photo', sub_category: 'صور شخصية', title: 'بورتريه احترافي - إضاءة استوديو', image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800' },
  { id: 'p3', category_id: 'photo', sub_category: 'صور مشاريع', title: 'تغطية فوتوغرافية لمشروع عقاري', image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800' },

  // الفيديو
  { id: 'v1', category_id: 'video', sub_category: 'فيديوهات إعلانية', title: 'إعلان تجاري قصير لمنتج تقني', image_url: 'https://images.unsplash.com/photo-1492691523567-6170c340537d?auto=format&fit=crop&q=80&w=800' },
  { id: 'v2', category_id: 'video', sub_category: 'مونتاج', title: 'مونتاج فيديو رحلة استكشافية', image_url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=800' },
  
  // العروض
  { id: 'pr1', category_id: 'presentation', sub_category: 'شرائح', title: 'تصميم عرض تقديمي لشركة ناشئة', image_url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800' },
  { id: 'pr2', category_id: 'presentation', sub_category: 'نماذج عروض', title: 'قالب بوربوينت لتقرير سنوي', image_url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800' },

  // حلول تقنية
  { id: 't1', category_id: 'table', sub_category: 'داشبورد', title: 'لوحة تحكم بيانات مبيعات متقدمة', image_url: 'https://images.unsplash.com/photo-1551288049-bbbda50030ad?auto=format&fit=crop&q=80&w=800' },
  { id: 'w1', category_id: 'website', sub_category: 'تصميم مواقع', title: 'تصميم واجهة موقع محفظة أعمال', image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800' },
];

export const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'Palette': return <Palette className="w-8 h-8 text-purple-600" />;
    case 'Camera': return <Camera className="w-8 h-8 text-purple-600" />;
    case 'Video': return <Video className="w-8 h-8 text-purple-600" />;
    case 'Presentation': return <Presentation className="w-8 h-8 text-purple-600" />;
    case 'Globe': return <Globe className="w-8 h-8 text-purple-600" />;
    case 'Table': return <Table className="w-8 h-8 text-purple-600" />;
    case 'Share2': return <Share2 className="w-8 h-8 text-purple-600" />;
    default: return null;
  }
};
