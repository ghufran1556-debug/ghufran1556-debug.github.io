
import React from 'react';
import { Palette, Camera, Video, Presentation, Globe, Table, Share2, Utensils, Package } from 'lucide-react';
import { ServiceItem, PortfolioItem } from './types';

export const DESIGN_SERVICES: ServiceItem[] = [
  {
    title: "Graphic Design\nتصميم جرافيك",
    description: 'تصميم هويات، بوسترات، وبروفايلات سوشال ميديا بأسلوب احترافي.',
    icon: 'Palette'
  },
  {
    title: "Product Photography\nتصوير المنتجات",
    description: 'إبراز تفاصيل منتجاتك بلقطات احترافية تزيد من جاذبيتها البيعية.',
    icon: 'Package'
  },
  {
    title: "Food Photography\nتصوير الأطعمة",
    description: 'تصوير الوجبات والأطباق بأسلوب يثير الشهية ويناسب المطاعم.',
    icon: 'Utensils'
  },
  {
    title: "Video Production\nإنتاج الفيديوهات",
    description: 'إنتاج فيديوهات قصيرة وإعلانية مع مونتاج سينمائي احترافي.',
    icon: 'Video'
  },
  {
    title: "Professional Presentations\nعروض احترافية",
    description: 'تصميم عروض PowerPoint و Keynote جذابة وواضحة.',
    icon: 'Presentation'
  }
];

export const TECH_SERVICES: ServiceItem[] = [
  {
    title: "Website Design\nتصميم مواقع",
    description: 'إنشاء مواقع بسيطة وجذابة',
    icon: 'Globe'
  },
  {
    title: "Excel Sheets & Dashboards\nجداول إكسل وداشبورد",
    description: 'بناء جداول ولوحات تحكم تساعد على التحليل واتخاذ القرار.',
    icon: 'Table'
  },
  {
    title: "Social Media Management\nإدارة حسابات",
    description: 'تنسيق المحتوى، تصميم المنشورات، وجدولة النشر وتحليل الأداء.',
    icon: 'Share2'
  }
];

export const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'Palette': return <Palette className="w-8 h-8 text-purple-600" />;
    case 'Camera': return <Camera className="w-8 h-8 text-purple-600" />;
    case 'Package': return <Package className="w-8 h-8 text-purple-600" />;
    case 'Utensils': return <Utensils className="w-8 h-8 text-purple-600" />;
    case 'Video': return <Video className="w-8 h-8 text-purple-600" />;
    case 'Presentation': return <Presentation className="w-8 h-8 text-purple-600" />;
    case 'Globe': return <Globe className="w-8 h-8 text-purple-600" />;
    case 'Table': return <Table className="w-8 h-8 text-purple-600" />;
    case 'Share2': return <Share2 className="w-8 h-8 text-purple-600" />;
    default: return null;
  }
};
