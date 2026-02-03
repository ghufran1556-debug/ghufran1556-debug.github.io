import React from 'react';
import { ArrowLeft } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-20 left-[-10%] w-[500px] h-[500px] bg-purple-100/50 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-indigo-100/50 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-6 flex flex-col items-center text-center">
        <div className="mb-10 max-w-5xl">
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 mb-4 tracking-tight">
            غفران صالح
          </h1>
          <div className="text-2xl md:text-4xl font-bold leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-purple-600 to-indigo-600 block w-full py-2">
              مصممة تجمع بين الإبداع البصري والخبرة التقنية
            </span>
          </div>
        </div>

        <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mb-12">
          أعمل على إنتاج محتوى بصري متقن يعكس الهوية ويخدم الهدف.  
          أتنقل بين التصميم، التصوير، وإنتاج الفيديو بثقة، مدعومة بخلفية تقنية تساعدني على تنفيذ العمل بدقة ووعي بالتفاصيل.
          أؤمن بأن التصميم الجيد يبدأ بفكرة واضحة وينتهي بتجربة بصرية متكاملة.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <a
            href="#portfolio"
            className="flex items-center gap-2 bg-slate-900 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-slate-800 transition-all shadow-xl group"
          >
            استعراض الأعمال
            <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          </a>
          <a
            href="#services"
            className="text-purple-600 font-bold px-10 py-4 rounded-full border-2 border-purple-100 hover:border-purple-600 transition-all"
          >
            اكتشف خدماتي
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;