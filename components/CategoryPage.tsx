
import React, { useState, useMemo } from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Category, PortfolioItem } from '../types';
import NotFound from './NotFound';

interface CategoryPageProps {
  categorySlug: string;
  categories: Category[];
  projects: PortfolioItem[];
  onBack: () => void;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ categorySlug, categories, projects, onBack }) => {
  const [activeSubCat, setActiveSubCat] = useState<string>('all');

  const info = useMemo(() => 
    categories.find(c => c.slug === categorySlug), 
  [categories, categorySlug]);

  const categoryItems = useMemo(() => 
    projects.filter(item => item.category?.slug === categorySlug), 
  [projects, categorySlug]);

  const subCategories = useMemo(() => {
    const cats = new Set(categoryItems.map(item => item.sub_category));
    return ['all', ...Array.from(cats)];
  }, [categoryItems]);

  const filteredItems = useMemo(() => {
    if (activeSubCat === 'all') return categoryItems;
    return categoryItems.filter(item => item.sub_category === activeSubCat);
  }, [categoryItems, activeSubCat]);

  if (!info) {
    return <NotFound onBack={onBack} />;
  }

  return (
    <div className="min-h-screen pt-32 pb-24 bg-white animate-fade-in">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <button onClick={onBack} className="flex items-center gap-2 text-purple-600 font-bold mb-8 hover:-translate-x-2 transition-transform">
            <ArrowRight size={20} />
            العودة للرئيسية
          </button>
          
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-7xl font-black text-slate-900 mb-6 leading-tight">{info.name}</h1>
              <p className="text-slate-500 text-xl md:text-2xl leading-relaxed">{info.description || "استكشف تفاصيل هذا القسم المبدع."}</p>
            </div>
            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col items-center justify-center min-w-[200px] shadow-2xl shadow-purple-200">
              <span className="text-5xl font-black text-purple-400 mb-2">{categoryItems.length}</span>
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">مشروع في هذا القسم</span>
            </div>
          </div>
        </div>

        {subCategories.length > 2 && (
          <div className="mb-12 flex flex-wrap gap-3 items-center">
            {subCategories.map(sub => (
              <button
                key={sub}
                onClick={() => setActiveSubCat(sub)}
                className={`px-6 py-3 rounded-2xl font-bold transition-all ${
                  activeSubCat === sub 
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-200 scale-105' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sub === 'all' ? 'الكل' : sub}
              </button>
            ))}
          </div>
        )}

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredItems.map((item) => (
              <div key={item.id} className="group bg-white rounded-[3rem] overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-500">
                <div className="aspect-[1.2] overflow-hidden relative">
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur shadow-sm rounded-full text-xs font-black text-purple-600">
                    {item.sub_category}
                  </div>
                </div>
                <div className="p-10">
                  <h3 className="text-2xl font-black text-slate-900 mb-4 leading-tight">{item.title}</h3>
                  <p className="text-slate-500 mb-8 leading-relaxed">{item.description || 'مشروع متميز يعكس الدقة والاحترافية في التنفيذ.'}</p>
                  <div className="flex justify-between items-center border-t border-slate-100 pt-8">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">المجال</span>
                      <span className="font-bold text-slate-900">{info.name}</span>
                    </div>
                    <button className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-900 hover:bg-purple-600 hover:text-white transition-all">
                      <ExternalLink size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold">لا توجد أعمال مضافة في هذا القسم حالياً.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
