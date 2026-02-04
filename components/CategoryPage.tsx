
import React, { useState, useMemo } from 'react';
import { ArrowRight, X, Maximize2 } from 'lucide-react';
import { Category, PortfolioItem, SubCategory } from '../types';
import NotFound from './NotFound';

interface CategoryPageProps {
  categorySlug: string;
  categories: Category[];
  subCategories: SubCategory[];
  projects: PortfolioItem[];
  onBack: () => void;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ categorySlug, categories, subCategories, projects, onBack }) => {
  const [activeSubCat, setActiveSubCat] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);

  const info = useMemo(() => categories.find(c => c.slug === categorySlug), [categories, categorySlug]);
  const categoryItems = useMemo(() => projects.filter(item => item.category?.slug === categorySlug), [projects, categorySlug]);
  const currentSubCats = useMemo(() => subCategories.filter(s => s.category_id === info?.id), [subCategories, info]);

  const filteredItems = useMemo(() => {
    if (activeSubCat === 'all') return categoryItems;
    return categoryItems.filter(item => item.sub_category_id === activeSubCat);
  }, [categoryItems, activeSubCat]);

  if (!info) return <NotFound onBack={onBack} />;

  return (
    <div className="min-h-screen pt-32 pb-24 bg-white animate-fade-in">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <button onClick={onBack} className="flex items-center gap-2 text-purple-600 font-bold mb-8 hover:-translate-x-2 transition-transform">
            <ArrowRight size={20} /> العودة للرئيسية
          </button>
          
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
            <div className="max-w-3xl text-right">
              <h1 className="text-4xl md:text-7xl font-black text-slate-900 mb-6 leading-tight">{info.name}</h1>
              <p className="text-slate-500 text-xl leading-relaxed">{info.description || "استكشف تفاصيل هذا القسم المبدع."}</p>
            </div>
          </div>
        </div>

        {currentSubCats.length > 0 && (
          <div className="mb-12 flex flex-wrap gap-3 items-center">
            <button
              onClick={() => setActiveSubCat('all')}
              className={`px-8 py-3 rounded-2xl font-bold transition-all ${activeSubCat === 'all' ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-100 text-slate-600'}`}
            >
              الكل
            </button>
            {currentSubCats.map(sub => (
              <button
                key={sub.id}
                onClick={() => setActiveSubCat(sub.id)}
                className={`px-8 py-3 rounded-2xl font-bold transition-all ${activeSubCat === sub.id ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-100 text-slate-600'}`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                onClick={() => setSelectedProject(item)}
                className="group cursor-pointer bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-500"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-purple-600 shadow-xl scale-50 group-hover:scale-100 transition-transform">
                      <Maximize2 size={24} />
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-black text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm font-bold">{currentSubCats.find(s => s.id === item.sub_category_id)?.name || info.name}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold">لا توجد أعمال مضافة في هذا الفرع حالياً.</p>
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 animate-fade-in">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm" onClick={() => setSelectedProject(null)}></div>
          <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[3rem] relative z-10 shadow-2xl flex flex-col md:flex-row">
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 left-6 z-20 w-12 h-12 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all"
            >
              <X size={24} />
            </button>
            
            <div className="w-full md:w-2/3 h-[400px] md:h-auto bg-slate-100">
              <img src={selectedProject.image_url} alt={selectedProject.title} className="w-full h-full object-contain p-4" />
            </div>
            
            <div className="w-full md:w-1/3 p-10 md:p-12 text-right">
              <div className="mb-8">
                <span className="text-purple-600 font-black text-xs uppercase tracking-widest block mb-2">
                  {currentSubCats.find(s => s.id === selectedProject.sub_category_id)?.name || info.name}
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-4">{selectedProject.title}</h2>
              </div>
              <div className="space-y-4">
                <h4 className="text-slate-400 font-black text-xs uppercase tracking-widest">عن المشروع</h4>
                <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-line">
                  {selectedProject.description || "مشروع إبداعي يعكس الدقة والاحترافية في التنفيذ."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
