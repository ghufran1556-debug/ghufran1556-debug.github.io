
import React, { useState, useEffect } from 'react';
import { Menu, X, Download, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NavbarProps {
  onNavClick: (href: string) => void;
  isHome: boolean;
  isLoggedIn?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onNavClick, isHome, isLoggedIn }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cvUrl, setCvUrl] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    const getCvLink = () => {
      // جلب الرابط العام للملف المرفوع بمسار ثابت
      const { data } = supabase.storage.from('portfolio').getPublicUrl('cv/ghafran-cv.pdf');
      if (data?.publicUrl) {
        // إضافة timestamp لتجاوز الكاش وضمان تحميل أحدث نسخة
        setCvUrl(`${data.publicUrl}?t=${Date.now()}`);
      }
    };

    window.addEventListener('scroll', handleScroll);
    getCvLink();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'الرئيسية', href: '#home' },
    { name: 'الخدمات', href: '#services' },
    { name: 'الأعمال', href: '#portfolio' },
    { name: 'تواصل معي', href: '#contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    onNavClick(href);
    setIsOpen(false);
  };

  const handleDownloadCV = () => {
    if (cvUrl) {
      const link = document.createElement('a');
      link.href = cvUrl;
      link.target = '_blank';
      link.download = 'Ghafran-Saleh-CV.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('السيرة الذاتية غير متوفرة حالياً، يرجى رفعها من لوحة التحكم.');
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || !isHome ? 'bg-white/95 backdrop-blur-md shadow-md py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <a 
          href="#home" 
          onClick={(e) => handleLinkClick(e, '#home')}
          className="text-2xl font-black text-purple-800 tracking-tighter hover:text-purple-600 transition-colors flex items-center gap-2"
        >
          غفران <span className="text-purple-500">صالح</span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="font-bold text-slate-700 hover:text-purple-600 transition-colors relative group"
            >
              {link.name}
              <span className="absolute bottom-[-4px] right-0 w-0 h-[2px] bg-purple-600 transition-all group-hover:w-full"></span>
            </a>
          ))}
          
          <button
            onClick={handleDownloadCV}
            className="flex items-center gap-2 px-6 py-2 rounded-full bg-slate-900 text-white font-bold hover:bg-purple-600 transition-all shadow-lg shadow-purple-100 transform hover:scale-105 active:scale-95"
          >
            السيرة الذاتية
            <Download size={16} />
          </button>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-purple-800 p-2 hover:bg-slate-100 rounded-lg transition-colors">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full left-0 right-0 bg-white shadow-2xl transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[500px] border-t opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="py-6 px-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="text-lg font-bold text-slate-700 hover:text-purple-600 border-b border-slate-50 pb-2 flex justify-between items-center"
            >
              {link.name}
              <span className="text-slate-300">←</span>
            </a>
          ))}
          
          <button
            onClick={handleDownloadCV}
            className="mt-2 flex items-center justify-center gap-3 py-4 rounded-2xl bg-purple-600 text-white font-black shadow-xl shadow-purple-100"
          >
            <FileText size={20} />
            تحميل السيرة الذاتية
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
