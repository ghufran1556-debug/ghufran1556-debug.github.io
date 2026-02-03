
import React from 'react';
import { Home, Compass } from 'lucide-react';

interface NotFoundProps {
  onBack: () => void;
}

const NotFound: React.FC<NotFoundProps> = ({ onBack }) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <div className="relative mb-8 inline-block">
          <div className="text-[12rem] font-black text-slate-100 select-none leading-none">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-purple-100 rounded-3xl flex items-center justify-center text-purple-600 animate-bounce">
              <Compass size={48} />
            </div>
          </div>
        </div>
        
        <h1 className="text-4xl font-black text-slate-900 mb-4">عذراً، ضاع الطريق!</h1>
        <p className="text-slate-500 text-lg font-bold mb-10 leading-relaxed">
          يبدو أن الصفحة التي تبحثين عنها غير موجودة. لا بأس، فالإبداع يحتاج أحياناً لبعض الضياع لاكتشاف مسارات جديدة!
        </p>
        
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-4 rounded-full font-black text-lg hover:bg-purple-600 transition-all shadow-xl shadow-purple-100 group"
        >
          <Home size={20} className="group-hover:scale-110 transition-transform" />
          العودة للرئيسية
        </button>
      </div>
    </div>
  );
};

export default NotFound;
