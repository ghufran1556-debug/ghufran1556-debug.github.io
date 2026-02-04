
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Category } from '../types';

interface PortfolioProps {
  categories: Category[];
  onNavigate: (slug: string) => void;
}

const Portfolio: React.FC<PortfolioProps> = ({ categories, onNavigate }) => {
  return (
    <section id="portfolio" className="py-24 bg-slate-50 scroll-mt-20 overflow-hidden relative">
      <div className="absolute top-40 right-[-5%] text-[10rem] font-black text-slate-100/50 select-none -z-0 leading-none">
        PORTFOLIO
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">معرض الأعمال</h2>
          <div className="w-20 h-2 bg-purple-600 rounded-full mb-6 mx-auto"></div>
          <p className="text-slate-600 text-lg">
            اكتشف إبداعي من خلال تصفح الأقسام المتنوعة. كل قسم يروي قصة نجاح وحلول بصرية متكاملة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              onClick={() => onNavigate(cat.slug)}
              className="group relative h-80 rounded-[3rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer border border-slate-100"
            >
              <img 
                src={cat.cover_image} 
                alt={cat.name} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent flex flex-col justify-end p-10">
                <h4 className="text-3xl font-black text-white mb-2 leading-tight">
                  {cat.name}
                </h4>
                <div className="flex items-center gap-2 text-purple-400 font-bold transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                  <span>استكشف الأعمال</span>
                  <ArrowLeft size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
