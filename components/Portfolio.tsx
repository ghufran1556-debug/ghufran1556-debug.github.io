
import React from 'react';
import { ExternalLink, Search, ArrowLeft } from 'lucide-react';
import { Category, PortfolioItem } from '../types';

interface PortfolioProps {
  categories: Category[];
  projects: PortfolioItem[];
  onNavigate: (slug: string) => void;
}

const Portfolio: React.FC<PortfolioProps> = ({ categories, projects, onNavigate }) => {
  // Preview only 6 latest items
  const previewItems = projects.slice(0, 6);

  return (
    <section id="portfolio" className="py-24 bg-slate-50 scroll-mt-20 overflow-hidden relative">
      <div className="absolute top-40 right-[-5%] text-[10rem] font-black text-slate-100/50 select-none -z-0 leading-none">
        PORTFOLIO
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end mb-16 gap-10">
          <div className="text-center lg:text-right">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">معرض الأعمال</h2>
            <div className="w-20 h-2 bg-purple-600 rounded-full mb-6 lg:mr-0 mx-auto"></div>
            <p className="text-slate-600 text-lg max-w-xl">
              استكشف مجموعة من أعمالي في مختلف المجالات الإبداعية والتقنية.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 p-2 bg-white rounded-[2rem] shadow-sm border border-slate-100">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => onNavigate(cat.slug)}
                className="px-6 md:px-8 py-3 rounded-full font-bold transition-all duration-300 text-sm md:text-base text-slate-500 hover:text-white hover:bg-purple-600 hover:shadow-xl hover:shadow-purple-200"
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {previewItems.map((item) => (
            <div 
              key={item.id} 
              className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={item.image_url} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10 translate-y-4 group-hover:translate-y-0">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-8 h-[2px] bg-purple-500"></span>
                  <span className="text-purple-400 text-sm font-black uppercase tracking-widest">
                    {item.category?.name || 'عمل إبداعي'}
                  </span>
                </div>
                <h4 className="text-2xl font-black text-white mb-6 leading-tight">
                  {item.title}
                </h4>
                <div className="flex gap-4">
                  <button 
                    onClick={() => onNavigate(item.category?.slug || '')}
                    className="flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-xl text-sm font-black hover:bg-purple-500 hover:text-white transition-all transform hover:scale-105"
                  >
                    عرض القسم
                    <Search size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {projects.length > 6 && (
          <div className="mt-16 text-center">
            <button 
              onClick={() => categories.length > 0 && onNavigate(categories[0].slug)}
              className="inline-flex items-center gap-3 text-purple-600 font-black text-xl hover:gap-5 transition-all"
            >
              استكشف المزيد من الأعمال
              <ArrowLeft size={24} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Portfolio;
