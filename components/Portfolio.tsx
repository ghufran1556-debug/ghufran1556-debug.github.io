
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ZoomIn, PlayCircle, X, ArrowRightCircle } from 'lucide-react';
import { Category, PortfolioItem } from '../types';

interface PortfolioProps {
  categories: Category[];
  projects: PortfolioItem[];
  onNavigate: (slug: string) => void;
}

const Portfolio: React.FC<PortfolioProps> = ({ categories, projects, onNavigate }) => {
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);

  // عرض أحدث 12 عملاً لضمان ظهور كافة الأقسام بما فيها الجرافيك بشكل متنوع
  const latestProjects = projects
    .filter(p => p.title !== 'شعار شركة هدايا') // استبعاد يدوي لأعمال معينة إذا لزم الأمر
    .slice(0, 12);

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestProjects.map((project) => (
            <div 
              key={project.id} 
              onClick={() => setSelectedProject(project)}
              className="group cursor-pointer bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500"
            >
              <div className="aspect-[4/3] overflow-hidden relative bg-slate-100">
                {project.media_type === 'video' ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white p-4">
                    <PlayCircle className="w-12 h-12 text-purple-500 mb-2 group-hover:scale-110 transition-transform duration-500" />
                    <span className="text-xs font-bold opacity-50 uppercase tracking-widest">فيديو</span>
                  </div>
                ) : (
                  <img 
                    src={project.image_url} 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-purple-600 shadow-xl transform scale-50 group-hover:scale-100 transition-transform">
                    <ZoomIn size={24} />
                  </div>
                </div>
              </div>
              <div className="p-8">
                <span className="text-xs font-black text-purple-600 uppercase tracking-widest mb-2 block">
                  {project.category?.name}
                </span>
                <h3 className="text-xl font-black text-slate-900">{project.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* نافذة العرض المكبرة (Modal) */}
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
                  <video 
                    src={selectedProject.image_url} 
                    controls 
                    className="w-full h-auto max-h-[85vh] mx-auto"
                    autoPlay
                  />
                ) : (
                  <img 
                    src={selectedProject.image_url} 
                    alt={selectedProject.title} 
                    className="w-full h-auto max-h-[85vh] object-contain mx-auto"
                  />
                )}
              </div>
              
              <div className="max-w-3xl ml-auto">
                <h3 className="text-3xl font-black text-slate-900 mb-6">نبذة عن العمل</h3>
                <div className="w-16 h-1.5 bg-purple-600 rounded-full mb-8"></div>
                <p className="text-slate-600 text-xl leading-relaxed whitespace-pre-line mb-16">
                  {selectedProject.description || "لا يوجد وصف متاح لهذا العمل حالياً."}
                </p>

                <div className="flex justify-center sm:justify-end pb-12">
                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="flex items-center gap-3 bg-slate-900 text-white px-12 py-5 rounded-[2rem] font-black text-xl hover:bg-purple-600 hover:shadow-2xl hover:shadow-purple-200 transition-all transform hover:-translate-y-1 active:scale-95"
                  >
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
