
import React, { useState, useEffect, useMemo } from 'react';
import { ZoomIn, PlayCircle, X, ArrowRightCircle, MoveLeft, ArrowLeft } from 'lucide-react';
import { Category, PortfolioItem } from '../types';

interface PortfolioProps {
  categories: Category[];
  projects: PortfolioItem[];
  onNavigate: (slug: string) => void;
}

const Portfolio: React.FC<PortfolioProps> = ({ categories, projects, onNavigate }) => {
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);

  // اختيار 6 أعمال منوعة لتعبئة السطر بالكامل في الصفحة الرئيسية
  const latestProjects = useMemo(() => {
    if (projects.length === 0) return [];
    
    const groups: Record<string, PortfolioItem[]> = {};
    projects.forEach(p => {
      const catId = p.category_id;
      if (!groups[catId]) groups[catId] = [];
      groups[catId].push(p);
    });

    const result: PortfolioItem[] = [];
    const catIds = Object.keys(groups);
    
    let i = 0;
    while (result.length < 6 && result.length < projects.length) {
      const cid = catIds[i % catIds.length];
      if (groups[cid] && groups[cid].length > 0) {
        const item = groups[cid].shift();
        if (item) result.push(item);
      }
      i++;
      if (i > projects.length * 2) break; 
    }
    return result;
  }, [projects]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedProject(null);
    };
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [selectedProject]);

  return (
    <section id="portfolio" className="py-24 bg-slate-50 scroll-mt-20 overflow-hidden relative text-right">
      <div className="absolute top-40 right-[-5%] text-[10rem] font-black text-slate-100/50 select-none -z-0 leading-none">
        WORKS
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">معرض الأعمال</h2>
          <div className="w-20 h-2 bg-purple-600 rounded-full mb-6 mx-auto"></div>
          <p className="text-slate-600 text-lg mb-10">
            نظرة مباشرة على أحدث المشاريع والإبداعات الفنية والحلول التقنية من كافة الأقسام.
          </p>

          {/* إعادة الجزء المحذوف: أزرار الأقسام الرئيسية */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onNavigate(cat.slug)}
                className="px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 hover:border-purple-600 hover:text-purple-600 hover:shadow-xl transition-all flex items-center gap-2 group shadow-sm"
              >
                {cat.name}
                <ArrowLeft size={16} className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1" />
              </button>
            ))}
          </div>
        </div>

        {/* شبكة الأعمال - تظهر 6 في الصف (6 أعمدة) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {latestProjects.map((project) => (
            <div 
              key={project.id} 
              onClick={() => setSelectedProject(project)}
              className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="aspect-[4/3] overflow-hidden relative bg-slate-100">
                {project.media_type === 'video' ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white p-2 text-center">
                    <PlayCircle className="w-8 h-8 text-purple-500 mb-1 group-hover:scale-110 transition-transform duration-500" />
                    <span className="text-[10px] font-bold opacity-50 uppercase">فيديو</span>
                  </div>
                ) : (
                  <img 
                    src={project.image_url} 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-purple-600 shadow-xl transform scale-50 group-hover:scale-100 transition-transform">
                    <ZoomIn size={16} />
                  </div>
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-xs font-bold text-slate-900 truncate">{project.title}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button 
            onClick={() => {
              if (categories.length > 0) onNavigate(categories[0].slug);
              else window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group inline-flex items-center gap-4 bg-slate-900 text-white px-10 py-4 rounded-full font-black text-lg hover:bg-purple-600 hover:shadow-2xl hover:shadow-purple-100 transition-all transform hover:-translate-y-1 active:scale-95"
          >
            لمتابعة الأعمال
            <MoveLeft className="group-hover:-translate-x-2 transition-transform" />
          </button>
        </div>
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
    </section>
  );
};

export default Portfolio;
