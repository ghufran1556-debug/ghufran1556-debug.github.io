
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import CategoryPage from './components/CategoryPage';
import Login from './components/Dashboard/Login';
import Dashboard from './components/Dashboard/Dashboard';
import { supabase } from './lib/supabase';
import { Category, PortfolioItem } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [session, setSession] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const { data: cats, error: catError } = await supabase.from('categories').select('*').order('name');
      if (catError) throw catError;
      
      const { data: projs, error: projError } = await supabase.from('portfolio_items').select('*, categories(*)').order('created_at', { ascending: false });
      if (projError) throw projError;
      
      const mappedProjs = projs?.map(p => ({
        ...p,
        category: p.categories
      })) || [];

      setCategories(cats || []);
      setProjects(mappedProjs);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // SEO Management
  useEffect(() => {
    const updateMetaTags = () => {
      let title = "غفران صالح | مصممة ومبدعة تقنية";
      let description = "معرض أعمال غفران صالح - إبداع بصري وحلول تقنية متكاملة تشمل التصميم، التصوير، إنتاج الفيديو وتطوير المواقع.";
      let keywords = "غفران صالح, تصميم جرافيك, تصوير فوتوغرافي, إنتاج فيديو, تصميم مواقع, إكسل, صناعة محتوى, السعودية";

      if (currentPage === 'login' || currentPage === 'dashboard') {
        title = "لوحة التحكم | غفران صالح";
        description = "إدارة محتوى الموقع وتحديث معرض الأعمال.";
      } else if (currentPage !== 'home') {
        const cat = categories.find(c => c.slug === currentPage);
        if (cat) {
          title = `${cat.name} | غفران صالح`;
          description = cat.description || `استكشف أعمال غفران صالح في مجال ${cat.name}.`;
          keywords = `${cat.name}, ${keywords}`;
        }
      }

      document.title = title;
      
      // Update or Create Meta Description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);

      // Update or Create Meta Keywords
      let metaKey = document.querySelector('meta[name="keywords"]');
      if (!metaKey) {
        metaKey = document.createElement('meta');
        metaKey.setAttribute('name', 'keywords');
        document.head.appendChild(metaKey);
      }
      metaKey.setAttribute('content', keywords);

      // Open Graph Tags (for Social Media Sharing)
      const ogTitle = document.querySelector('meta[property="og:title"]') || document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      ogTitle.setAttribute('content', title);
      if (!document.querySelector('meta[property="og:title"]')) document.head.appendChild(ogTitle);

      const ogDesc = document.querySelector('meta[property="og:description"]') || document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      ogDesc.setAttribute('content', description);
      if (!document.querySelector('meta[property="og:description"]')) document.head.appendChild(ogDesc);
    };

    updateMetaTags();
  }, [currentPage, categories]);

  useEffect(() => {
    fetchData();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    const handleNavigation = () => {
      const hash = window.location.hash || '#home';
      
      if (hash === '#ghufran') {
        setCurrentPage('login');
      } else if (hash === '#dashboard') {
        setCurrentPage('dashboard');
      } else if (hash.startsWith('#category/')) {
        setCurrentPage(hash.replace('#category/', ''));
        window.scrollTo(0, 0);
      } else {
        setCurrentPage('home');
        if (hash.startsWith('#') && hash !== '#home' && hash !== '#ghufran' && hash !== '#dashboard') {
          setTimeout(() => {
            const element = document.getElementById(hash.replace('#', ''));
            if (element) {
              window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
            }
          }, 100);
        }
      }
    };

    window.addEventListener('hashchange', handleNavigation);
    handleNavigation();

    return () => {
      window.removeEventListener('hashchange', handleNavigation);
      subscription.unsubscribe();
    };
  }, []);

  const navigateTo = (path: string) => {
    window.location.hash = path;
  };

  if (isLoading && currentPage !== 'login' && currentPage !== 'dashboard') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-bold text-slate-400">جاري تحميل الإبداع...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar 
        onNavClick={(href) => navigateTo(href.replace('#', ''))} 
        isHome={currentPage === 'home'} 
        isLoggedIn={!!session}
      />
      <main>
        {currentPage === 'home' ? (
          <>
            <Hero />
            <Services />
            <Portfolio 
              categories={categories} 
              projects={projects} 
              onNavigate={(cat) => navigateTo(`category/${cat}`)} 
            />
            <Contact />
          </>
        ) : currentPage === 'login' ? (
          <Login onLogin={() => navigateTo('dashboard')} />
        ) : currentPage === 'dashboard' ? (
          session ? <Dashboard onUpdate={fetchData} /> : <Login onLogin={() => navigateTo('dashboard')} />
        ) : (
          <CategoryPage 
            categorySlug={currentPage} 
            categories={categories}
            projects={projects}
            onBack={() => navigateTo('home')} 
          />
        )}
      </main>
      
      <footer className="bg-slate-900 py-16 text-center text-slate-500 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="text-2xl font-black text-white mb-4">غفران صالح</div>
          <p className="max-w-md mx-auto mb-8 text-sm opacity-60">
            مصممة تجمع بين الفن والتقنية لتقديم حلول بصرية ورقمية مبتكرة.
          </p>
          <div className="flex justify-center gap-8 mb-8 text-xs font-bold uppercase tracking-widest">
             <a href="#home" className="hover:text-purple-400 transition-colors">الرئيسية</a>
             <a href="#services" className="hover:text-purple-400 transition-colors">الخدمات</a>
             <a href="#portfolio" className="hover:text-purple-400 transition-colors">الأعمال</a>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-xs">© {new Date().getFullYear()} جميع الحقوق محفوظة.</span>
            <div className="flex items-center gap-4">
              {session ? (
                <a href="#dashboard" className="text-xs bg-purple-600/20 text-purple-400 px-4 py-2 rounded-full hover:bg-purple-600 hover:text-white transition-all">لوحة التحكم</a>
              ) : (
                <a href="#ghufran" className="text-[10px] opacity-20 hover:opacity-100 transition-opacity">دخول الإدارة</a>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
