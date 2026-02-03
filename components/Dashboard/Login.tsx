
import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Lock, Mail, ArrowLeft } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ 
        email: email.trim(), 
        password: password 
      });

      if (authError) {
        console.error("Auth error:", authError);
        setError(authError.message === "Invalid login credentials" 
          ? "البريد الإلكتروني أو كلمة المرور غير صحيحة." 
          : "حدث خطأ أثناء تسجيل الدخول: " + authError.message);
      } else if (data.session) {
        onLogin();
      }
    } catch (err: any) {
      console.error("Login unexpected error:", err);
      setError("حدث خطأ غير متوقع. يرجى التأكد من الاتصال بالإنترنت.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-slate-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-purple-600">
            <Lock size={40} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">تسجيل دخول الإدارة</h1>
          <p className="text-slate-500 font-bold">مرحباً بكِ مجدداً غفران</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-widest text-right">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pr-12 pl-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-purple-600 outline-none transition-all text-right" 
                placeholder="email@example.com"
                dir="ltr"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-widest text-right">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pr-12 pl-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-purple-600 outline-none transition-all text-right" 
                placeholder="••••••••"
                dir="ltr"
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl text-center border border-red-100 animate-fade-in-down">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-purple-600 transition-all shadow-xl shadow-purple-100 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
            {loading ? 'جاري التحقق...' : 'دخول للوحة التحكم'}
          </button>
        </form>

        <button 
          onClick={() => window.location.hash = '#home'}
          className="w-full mt-6 flex items-center justify-center gap-2 text-slate-400 font-bold hover:text-slate-600 transition-colors"
        >
          <ArrowLeft size={18} />
          العودة للموقع
        </button>
      </div>
    </div>
  );
};

export default Login;
