
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
import { Category, PortfolioItem, SubCategory } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [session, setSession] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const { data: cats } = await supabase.from('categories').select('*').order('name');
      const { data: subs } = await supabase.from('sub_categories').select('*, categories(*)').order('name');
      const { data: projs } = await supabase.from('portfolio_items').select('*, categories(*)').order('created_at', { ascending: false });
      
      setCategories(cats || []);
      setSubCategories(subs || []);
      setProjects(projs?.map(p => ({
        ...p,
        category: p.categories
      })) || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));

    const handleNavigation = () => {
      const hash = window.location.hash || '#home';
      if (hash === '#ghufran') setCurrentPage('login');
      else if (hash === '#dashboard') setCurrentPage('dashboard');
      else if (hash.startsWith('#category/')) {
        setCurrentPage(hash.replace('#category/', ''));
        window.scrollTo(0, 0);
      } else setCurrentPage('home');
    };

    window.addEventListener('hashchange', handleNavigation);
    handleNavigation();
    return () => {
      window.removeEventListener('hashchange', handleNavigation);
      subscription.unsubscribe();
    };
  }, []);

  const navigateTo = (path: string) => { window.location.hash = path; };

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
      <Navbar onNavClick={(href) => navigateTo(href.replace('#', ''))} isHome={currentPage === 'home'} isLoggedIn={!!session} />
      <main>
        {currentPage === 'home' ? (
          <>
            <Hero />
            <Services />
            <Portfolio categories={categories} onNavigate={(cat) => navigateTo(`category/${cat}`)} />
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
            subCategories={subCategories}
            projects={projects}
            onBack={() => navigateTo('home')} 
          />
        )}
      </main>
      <footer className="bg-slate-900 py-12 text-center text-slate-500 border-t border-white/5">
        <div className="container mx-auto px-6">
          <span className="text-xs font-bold opacity-60">© 2026 جميع الحقوق محفوظة لـ غفران صالح</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
