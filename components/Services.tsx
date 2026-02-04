
import React from 'react';
import { DESIGN_SERVICES, TECH_SERVICES, getIcon } from '../constants';

const Services: React.FC = () => {
  return (
    <section id="services" className="py-24 bg-white scroll-mt-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">الخدمات</h2>
          <div className="w-24 h-2 bg-purple-600 mx-auto rounded-full"></div>
        </div>

        {/* Visual Production Services - Updated to 5 columns on desktop */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-purple-800 mb-8 border-r-4 border-purple-600 pr-4 text-right">
            خدمات التصميم والإنتاج البصري
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-6">
            {DESIGN_SERVICES.map((service, idx) => (
              <div 
                key={idx} 
                className="group p-6 bg-slate-50 rounded-3xl border border-transparent hover:border-purple-200 hover:bg-white hover:shadow-2xl hover:shadow-purple-100 transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center text-center"
              >
                <div className="mb-6 inline-block p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                  {getIcon(service.icon)}
                </div>
                <h4 className="text-lg font-black text-slate-800 whitespace-pre-line leading-snug">
                  {service.title}
                </h4>
                {service.description && (
                  <p className="text-slate-600 leading-relaxed text-sm mt-3">
                    {service.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Technical Solutions Services */}
        <div>
          <h3 className="text-2xl font-bold text-purple-800 mb-8 border-r-4 border-purple-600 pr-4 text-right">
            الحلول التقنية والرقمية
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TECH_SERVICES.map((service, idx) => (
              <div 
                key={idx} 
                className="group p-8 bg-slate-50 rounded-3xl border border-transparent hover:border-purple-200 hover:bg-white hover:shadow-2xl hover:shadow-purple-100 transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center text-center"
              >
                <div className="mb-6 inline-block p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                  {getIcon(service.icon)}
                </div>
                <h4 className="text-xl font-black text-slate-800 whitespace-pre-line leading-snug">
                  {service.title}
                </h4>
                {service.description && (
                  <p className="text-slate-600 leading-relaxed text-sm mt-3">
                    {service.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
