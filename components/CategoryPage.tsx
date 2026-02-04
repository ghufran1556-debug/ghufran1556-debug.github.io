
import React, { useMemo, useState, useEffect } from 'react';
import { ArrowRight, X, ZoomIn, ArrowRightCircle, PlayCircle, Layers } from 'lucide-react';
import { Category, PortfolioItem } from '../types';
import NotFound from './NotFound';

interface CategoryPageProps {
  categorySlug: string;
  categories: Category[];
  projects: PortfolioItem[];
  onBack: () => void;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ categorySlug, categories, projects, onBack }) => {
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  
  const slug = useMemo(() => decodeURIComponent(categorySlug), [categorySlug]);
  
  const info = useMemo(() => {
    return categories.find(c => c.slug === slug || c.slug === categorySlug);
  }, [categories, slug, categorySlug]);

  const groupedItems = useMemo(() => {
    if (!info) return {};
    
    const items = projects.filter(item => item.category_id === info.id);
    const groups: Record<string, PortfolioItem[]> = {};

    items.forEach(item => {
      const description = item.description || "";
      const parts = description.split('|||');
      const subCat = parts.length > 1 && parts[0].trim() !== "" ? parts[0] : "أعمال أخرى";
      
      if (!groups[subCat]) groups[subCat] = [];
      groups[subCat].push(item);
    });

    return groups;
  }, [projects, info]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedProject(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  if (!info) return <NotFound onBack={onBack} />;

  const subCategories = Object.keys(groupedItems);

  return (
    <div className="min-h-screen pt-32 pb-24 bg-white animate-fade-in">
      <div className="container mx-auto px-6 text-right">
        <div className="mb-16">
          <button onClick={onBack} className="flex items-center gap-2 text-purple-600 font-bold mb-8 hover:-translate-x-2 transition-transform">
            <ArrowRight size={20} /> العودة للرئيسية
          </button>
          
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 mb-6 leading-tight">{info.name}</h1>
          <p className="text-slate-500 text-xl leading-relaxed max-w-3xl">{info.description}</p>
        </div>

        {subCategories.length > 0 ? (
          <div className="space-y-20">
            {subCategories.sort((a, b) => a === 'أعمال أخرى' ? 1 : b === 'أعمال أخرى' ? -1 : 0).map((subName) => (
              <div key={subName} className="relative">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-100">
                    <Layers size={20} />
                  </div>
                  <h2 className="text-2xl font-black text-slate-800">{subName}</h2>
                  <div className="flex-1 h-px bg-slate-100"></div>
                </div>

                {/* شبكة الأعمال - تظهر 6 في الصف */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {groupedItems[subName].map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => setSelectedProject(item)}
                      className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl transition-all duration-500"
                    >
                      <div className="aspect-[4/3] overflow-hidden relative bg-slate-100">
                        {item.media_type === 'video' ? (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white p-2 text-center">
                            <PlayCircle className="w-10 h-10 text-purple-500 mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-bold opacity-70">فيديو</span>
                          </div>
                        ) : (
                          <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ZoomIn className="text-white w-8 h-8" />
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="text-xs font-bold text-slate-900 truncate">{item.title}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold">لا توجد أعمال في هذا القسم حالياً.</p>
          </div>
        )}
      </div>

      {selectedProject && (
        <div className="fixed inset-0 z-[100] bg-white animate-fade-in overflow-y-auto">
          <div className="sticky top-0 p-6 flex justify-between items-center bg-white/90 backdrop-blur-md z-[110] border-b shadow-sm">
            <button 
              onClick={() => setSelectedProject(null)}
              className="p-3 bg-slate-100 hover:bg-slate-900 hover:text-white rounded-2xl transition-all flex items-center gap-2 font-bold group"
            >
              <X size={24} className="group-hover:rotate-90 transition-transform" />
              <span className="hidden sm:inline">إغلاق العرض</span>
            </button>
            <h2 className="text-xl font-black text-slate-900">{selectedProject.title}</h2>
          </div>

          <div className="container mx-auto px-6 py-12 text-right">
            <div className="max-w-5xl mx-auto">
              <div className="rounded-[3rem] overflow-hidden shadow-2xl mb-12 bg-black border relative group">
                {selectedProject.media_type === 'video' ? (
                  <video src={selectedProject.image_url} controls className="w-full h-auto max-h-[85vh] mx-auto" autoPlay />
                ) : (
                  <img src={selectedProject.image_url} alt={selectedProject.title} className="w-full h-auto max-h-[85vh] object-contain mx-auto" />
                )}
              </div>
              
              <div className="max-w-3xl ml-auto">
                <h3 className="text-3xl font-black text-slate-900 mb-6">نبذة عن العمل</h3>
                <div className="w-16 h-1.5 bg-purple-600 rounded-full mb-8"></div>
                <p className="text-slate-600 text-xl leading-relaxed whitespace-pre-line mb-16">
                  {(selectedProject.description || "").split('|||').length > 1 
                    ? (selectedProject.description || "").split('|||')[1] 
                    : (selectedProject.description || "لا يوجد وصف متاح لهذا العمل حالياً.")}
                </p>

                <div className="flex justify-center sm:justify-end pb-12">
                  <button onClick={() => setSelectedProject(null)} className="flex items-center gap-3 bg-slate-900 text-white px-12 py-5 rounded-[2rem] font-black text-xl hover:bg-purple-600 hover:shadow-2xl hover:shadow-purple-200 transition-all transform hover:-translate-y-1 active:scale-95">
                    إغلاق والعودة للمعرض
                    <ArrowRightCircle size={24} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
