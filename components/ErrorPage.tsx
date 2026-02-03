
import React from 'react';
import { RefreshCcw, AlertCircle } from 'lucide-react';

interface ErrorPageProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ message, onRetry }) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-red-50 text-center max-w-md">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
          <AlertCircle size={40} />
        </div>
        
        <h1 className="text-3xl font-black text-slate-900 mb-4">حدث خطأ تقني</h1>
        <p className="text-slate-500 font-bold mb-10 leading-relaxed">
          {message || "نعتذر عن هذا الخلل المفاجئ. يبدو أن هناك مشكلة في الاتصال بالخادم، جاري العمل على فحص العطل."}
        </p>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => onRetry ? onRetry() : window.location.reload()}
            className="w-full bg-red-500 text-white py-4 rounded-2xl font-black text-lg hover:bg-red-600 transition-all shadow-lg shadow-red-100 flex items-center justify-center gap-3"
          >
            <RefreshCcw size={20} />
            إعادة المحاولة
          </button>
          
          <button 
            onClick={() => window.location.hash = '#home'}
            className="w-full text-slate-400 font-bold py-2 hover:text-slate-600 transition-colors"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
