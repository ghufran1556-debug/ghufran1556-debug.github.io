
import React from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Category, PortfolioItem } from '../types';

interface PortfolioProps {
  categories: Category[];
  projects: PortfolioItem[];
  onNavigate: (slug: string) => void;
}

const Portfolio: React.FC<PortfolioProps> = ({ categories, projects, onNavigate }) => {
  // استبعاد "شعار شركة هدايا" من الصفحة الرئيسية وعرض أول 6 أعمال أخرى
  const latestProjects = projects
    .filter(p => p.title !== 'شعار شركة هدايا')
    .slice(0, 6);

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
            نظرة مباشرة على أحدث المشاريع والإبداعات الفنية والحلول التقنية.
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
              className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img 
                  src={project.image_url} 
                  alt={project.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-purple-600 shadow-xl transform scale-50 group-hover:scale-100 transition-transform">
                    <ExternalLink size={20} />
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
    </section>
  );
};

export default Portfolio;
