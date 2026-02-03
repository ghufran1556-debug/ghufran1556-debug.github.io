
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Plus, Layout, FolderKanban, LogOut, Trash2, Upload, X, 
  ImageIcon, Loader2, FileText, CheckCircle, AlertTriangle,
  FileUp, AlertCircle
} from 'lucide-react';
import { Category, PortfolioItem } from '../../types';

interface DashboardProps {
  onUpdate: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'categories' | 'cv'>('projects');
  const [categories, setCategories] = useState<Category[]>([]);
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Success states
  const [cvSuccess, setCvSuccess] = useState(false);
  const [catSuccess, setCatSuccess] = useState(false);
  const [projSuccess, setProjSuccess] = useState(false);

  // Form States
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catImg, setCatImg] = useState('');
  const [catFile, setCatFile] = useState<File | null>(null);
  const [catPreview, setCatPreview] = useState<string | null>(null);
  
  const [projTitle, setProjTitle] = useState('');
  const [projSub, setProjSub] = useState('');
  const [projImg, setProjImg] = useState('');
  const [projCatId, setProjCatId] = useState('');
  const [projFile, setProjFile] = useState<File | null>(null);
  const [projPreview, setProjPreview] = useState<string | null>(null);

  const [cvFile, setCvFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  const loadData = async () => {
    const { data: cats } = await supabase.from('categories').select('*').order('name');
    const { data: projs } = await supabase.from('portfolio_items').select('*, categories(*)').order('created_at', { ascending: false });
    if (cats) setCategories(cats);
    if (projs) {
      const mappedProjs = projs.map(p => ({
        ...p,
        category: p.categories
      })) as PortfolioItem[];
      setProjects(mappedProjs);
    }
  };

  useEffect(() => { loadData(); }, []);

  const resetMessages = () => {
    setErrorMsg(null);
    setCvSuccess(false);
    setCatSuccess(false);
    setProjSuccess(false);
  };

  const simulateProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);
    return interval;
  };

  const uploadFile = async (file: File, path: string): Promise<string | null> => {
    resetMessages();
    setUploading(true);
    setUploadStatus('جاري تجهيز الملف...');
    const progressInterval = simulateProgress();

    try {
      setUploadStatus('جاري الرفع إلى السحابة...');
      const { error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(path, file, { upsert: true, cacheControl: '0' });

      if (uploadError) throw uploadError;

      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadStatus('تم الرفع بنجاح! جاري الحفظ...');

      const { data } = supabase.storage.from('portfolio').getPublicUrl(path);
      return data.publicUrl;
    } catch (error: any) {
      clearInterval(progressInterval);
      setUploadProgress(0);
      console.error('Upload error:', error);
      setErrorMsg(`خطأ في الرفع: ${error.message || 'تأكدي من إعدادات الـ Storage'}`);
      return null;
    } finally {
      setUploading(false);
      setTimeout(() => {
        setUploadProgress(0);
        setUploadStatus('');
      }, 1000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'cat' | 'proj') => {
    const file = e.target.files?.[0];
    resetMessages();
    if (file) {
      if (type === 'cat') {
        setCatFile(file);
        setCatPreview(URL.createObjectURL(file));
      } else {
        setProjFile(file);
        setProjPreview(URL.createObjectURL(file));
      }
    }
  };

  const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    resetMessages();
    if (file && file.type === 'application/pdf') {
      setCvFile(file);
    } else {
      setErrorMsg('يرجى اختيار ملف بصيغة PDF فقط');
      if (e.target) e.target.value = '';
    }
  };

  const saveCV = async () => {
    if (!cvFile) return;
    const path = `cv/ghafran-cv.pdf`;
    const url = await uploadFile(cvFile, path);
    if (url) {
      setCvSuccess(true);
      setCvFile(null);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName) return;
    setLoading(true);

    let finalImg = catImg;
    if (catFile) {
      const path = `categories/${Date.now()}-${catFile.name}`;
      const uploadedUrl = await uploadFile(catFile, path);
      if (uploadedUrl) finalImg = uploadedUrl;
      else { setLoading(false); return; }
    }

    const slug = catName.toLowerCase().trim().replace(/\s+/g, '-');
    const { error } = await supabase.from('categories').insert([{ 
      name: catName, 
      description: catDesc || '', 
      cover_image: finalImg || 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800', 
      slug 
    }]);

    if (!error) {
      setCatSuccess(true);
      setCatName(''); setCatDesc(''); setCatImg(''); setCatFile(null); setCatPreview(null);
      loadData(); onUpdate();
    } else {
      setErrorMsg(`خطأ في الحفظ: ${error.message}`);
    }
    setLoading(false);
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle || !projCatId) return;
    setLoading(true);

    let finalImg = projImg;
    if (projFile) {
      const path = `projects/${Date.now()}-${projFile.name}`;
      const uploadedUrl = await uploadFile(projFile, path);
      if (uploadedUrl) finalImg = uploadedUrl;
      else { setLoading(false); return; }
    }

    const { error } = await supabase.from('portfolio_items').insert([{ 
      title: projTitle, 
      sub_category: projSub || 'عام', 
      image_url: finalImg || 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800', 
      category_id: projCatId 
    }]);

    if (!error) {
      setProjSuccess(true);
      setProjTitle(''); setProjSub(''); setProjImg(''); setProjFile(null); setProjPreview(null);
      loadData(); onUpdate();
    } else {
      setErrorMsg(`خطأ في الحفظ: ${error.message}`);
    }
    setLoading(false);
  };

  const deleteItem = async (table: string, id: string) => {
    if (!confirm('هل أنتِ متأكدة من الحذف؟')) return;
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (!error) { loadData(); onUpdate(); }
  };

  return (
    <div className="min-h-screen pt-24 pb-24 bg-slate-50">
      <div className="container mx-auto px-6">
        {/* Header & Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 mb-2">لوحة التحكم</h1>
            <p className="text-slate-500 font-bold">إدارة المحتوى والأعمال الإبداعية</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 bg-white p-2 rounded-[2.5rem] shadow-sm border border-slate-100">
            {[
              { id: 'projects', label: 'الأعمال', icon: FolderKanban },
              { id: 'categories', label: 'الفئات', icon: Layout },
              { id: 'cv', label: 'السيرة الذاتية', icon: FileText },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); resetMessages(); }}
                className={`px-6 py-3 rounded-full font-black transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <tab.icon size={18} /> {tab.label}
              </button>
            ))}
            <button onClick={() => supabase.auth.signOut()} className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all" title="تسجيل الخروج">
              <LogOut size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form Side */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-xl border border-slate-100 sticky top-32">
              <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                   {activeTab === 'cv' ? <FileText size={24} /> : <Plus size={24} />}
                </div>
                {activeTab === 'categories' ? 'إضافة فئة جديدة' : activeTab === 'projects' ? 'إضافة عمل جديد' : 'تحديث السيرة الذاتية'}
              </h3>

              {/* Progress Bar Container */}
              {(uploading || uploadProgress > 0) && (
                <div className="mb-6 animate-fade-in">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-black text-purple-600 uppercase tracking-widest">{uploadStatus}</span>
                    <span className="text-xs font-black text-purple-600">{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-purple-50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-600 transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* General Messages */}
              {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 flex items-center gap-3 animate-fade-in">
                  <AlertCircle size={20} className="shrink-0" />
                  <span className="text-sm font-bold">{errorMsg}</span>
                </div>
              )}

              {activeTab === 'categories' ? (
                <form onSubmit={handleAddCategory} className="space-y-5">
                  {catSuccess && (
                    <div className="p-4 bg-green-50 text-green-600 rounded-2xl border border-green-100 flex items-center gap-3 animate-fade-in">
                      <CheckCircle size={20} />
                      <span className="text-sm font-bold">تمت إضافة الفئة بنجاح!</span>
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">اسم الفئة</label>
                    <input type="text" placeholder="مثلاً: التصميم الجرافيكي" value={catName} onChange={e => setCatName(e.target.value)} required className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-purple-600/20 border border-slate-100 font-bold transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">الوصف</label>
                    <textarea placeholder="وصف مشوق للفئة..." value={catDesc} onChange={e => setCatDesc(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-purple-600/20 border border-slate-100 font-bold min-h-[100px] transition-all" />
                  </div>
                  
                  <div className="space-y-4">
                    <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">صورة الغلاف</label>
                    {!catPreview ? (
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-10 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-purple-400 hover:text-purple-400 cursor-pointer transition-all bg-slate-50/50"
                      >
                        <FileUp size={32} />
                        <span className="font-bold text-sm">اضغطي لاختيار صورة</span>
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'cat')} className="hidden" />
                      </div>
                    ) : (
                      <div className="relative rounded-2xl overflow-hidden aspect-video group shadow-md">
                        <img src={catPreview} className="w-full h-full object-cover" alt="Preview" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <button 
                            type="button"
                            onClick={() => {setCatFile(null); setCatPreview(null);}}
                            className="p-3 bg-red-500 text-white rounded-full hover:scale-110 transition-transform shadow-lg"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <button type="submit" disabled={loading || uploading} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-purple-600 transition-all shadow-xl shadow-purple-100 flex items-center justify-center gap-2 disabled:opacity-50">
                    {loading ? <Loader2 className="animate-spin" /> : <Plus />}
                    إضافة الفئة
                  </button>
                </form>
              ) : activeTab === 'projects' ? (
                <form onSubmit={handleAddProject} className="space-y-5">
                  {projSuccess && (
                    <div className="p-4 bg-green-50 text-green-600 rounded-2xl border border-green-100 flex items-center gap-3 animate-fade-in">
                      <CheckCircle size={20} />
                      <span className="text-sm font-bold">تمت إضافة العمل بنجاح!</span>
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">عنوان العمل</label>
                    <input type="text" placeholder="مثلاً: شعار شركة تقنية" value={projTitle} onChange={e => setProjTitle(e.target.value)} required className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-purple-600/20 border border-slate-100 font-bold transition-all" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">الفئة</label>
                      <select value={projCatId} onChange={e => setProjCatId(e.target.value)} required className="w-full p-4 bg-slate-50 rounded-2xl outline-none border border-slate-100 font-bold transition-all">
                        <option value="">اختاري...</option>
                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">الفرع</label>
                      <input type="text" placeholder="مثلاً: هويات" value={projSub} onChange={e => setProjSub(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl outline-none border border-slate-100 font-bold transition-all" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">صورة العمل</label>
                    {!projPreview ? (
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-10 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-purple-400 hover:text-purple-400 cursor-pointer transition-all bg-slate-50/50"
                      >
                        <FileUp size={32} />
                        <span className="font-bold text-sm">اضغطي لاختيار صورة</span>
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'proj')} className="hidden" />
                      </div>
                    ) : (
                      <div className="relative rounded-2xl overflow-hidden aspect-video group shadow-md">
                        <img src={projPreview} className="w-full h-full object-cover" alt="Preview" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            type="button"
                            onClick={() => {setProjFile(null); setProjPreview(null);}}
                            className="p-3 bg-red-500 text-white rounded-full hover:scale-110 transition-transform shadow-lg"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <button type="submit" disabled={loading || uploading} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-purple-600 transition-all shadow-xl shadow-purple-100 flex items-center justify-center gap-2 disabled:opacity-50">
                    {loading ? <Loader2 className="animate-spin" /> : <Plus />}
                    إضافة العمل
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="bg-blue-50 p-5 rounded-3xl border border-blue-100 flex gap-4 text-blue-700">
                    <AlertTriangle size={24} className="shrink-0 text-blue-500" />
                    <p className="text-sm font-bold leading-relaxed">
                      قومي برفع ملف السيرة الذاتية (PDF). الرابط في الموقع سيُحدث تلقائياً ليشير لأحدث نسخة.
                    </p>
                  </div>
                  
                  <div 
                    onClick={() => cvInputRef.current?.click()}
                    className={`w-full py-16 border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center gap-4 transition-all cursor-pointer ${cvFile ? 'border-purple-500 bg-purple-50 text-purple-600' : 'border-slate-200 text-slate-400 hover:border-purple-400 hover:text-purple-400 bg-slate-50/50'}`}
                  >
                    <FileText size={48} />
                    <div className="text-center px-4">
                      <span className="block font-black text-lg truncate max-w-[200px] mx-auto">{cvFile ? cvFile.name : 'اختيار ملف PDF'}</span>
                      <span className="text-xs font-bold opacity-60">{cvFile ? `${(cvFile.size / 1024 / 1024).toFixed(2)} MB` : 'الحد الأقصى 10 ميجابايت'}</span>
                    </div>
                    <input ref={cvInputRef} type="file" accept="application/pdf" onChange={handleCvUpload} className="hidden" />
                  </div>

                  {cvSuccess && (
                    <div className="flex items-center gap-2 justify-center text-green-600 font-black animate-fade-in bg-green-50 py-3 rounded-2xl">
                       <CheckCircle size={20} />
                       تم تحديث السيرة الذاتية بنجاح!
                    </div>
                  )}

                  <button 
                    onClick={saveCV}
                    disabled={!cvFile || uploading} 
                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-purple-600 transition-all shadow-xl shadow-purple-100 disabled:opacity-30 flex items-center justify-center gap-2"
                  >
                    {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
                    {uploading ? 'جاري الرفع...' : 'حفظ وتحديث السيرة'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* List Side */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeTab === 'categories' ? (
                categories.map(cat => (
                  <div key={cat.id} className="group bg-white p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-slate-100 flex flex-col gap-5 relative overflow-hidden">
                    <div className="aspect-[2/1] overflow-hidden rounded-[1.5rem] relative">
                      <img src={cat.cover_image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                      <button 
                        onClick={() => deleteItem('categories', cat.id)} 
                        className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-red-500 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-110"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div>
                      <h4 className="font-black text-xl text-slate-900 mb-2">{cat.name}</h4>
                      <p className="text-sm text-slate-500 font-bold line-clamp-2 leading-relaxed">{cat.description || 'لا يوجد وصف متاح لهذا القسم.'}</p>
                    </div>
                  </div>
                ))
              ) : activeTab === 'projects' ? (
                projects.map(proj => (
                  <div key={proj.id} className="group bg-white p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-slate-100 flex gap-5 relative overflow-hidden">
                    <div className="w-28 h-28 shrink-0 overflow-hidden rounded-3xl relative">
                      <img src={proj.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-black text-lg text-slate-900 leading-tight">{proj.title}</h4>
                          <button onClick={() => deleteItem('portfolio_items', proj.id)} className="text-slate-300 hover:text-red-500 transition-colors transform hover:scale-110"><Trash2 size={18} /></button>
                        </div>
                        <span className="inline-block text-[10px] font-black text-purple-600 bg-purple-50 px-3 py-1 rounded-full uppercase tracking-tighter">{proj.category?.name || 'بدون فئة'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <span className="w-4 h-[1px] bg-slate-200"></span>
                        <span className="text-xs font-bold">{proj.sub_category}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="md:col-span-2 bg-white p-16 rounded-[3rem] border border-slate-100 flex flex-col items-center text-center shadow-sm">
                  <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center text-purple-500 mb-8 border border-purple-100">
                    <FileText size={48} />
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 mb-4">نظام إدارة السيرة الذاتية</h4>
                  <p className="text-slate-500 font-bold max-w-md leading-relaxed text-lg">
                    عند رفع ملف جديد، يتم استبدال الملف القديم مباشرة. هذا يعني أن زر "السيرة الذاتية" في شريط التنقل العلوي سيقود الزوار دائماً لأحدث نسخة رفعتها هنا.
                  </p>
                  <div className="mt-8 flex gap-3">
                    <div className="px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs font-black text-slate-400 uppercase tracking-widest">المسار: cv/ghafran-cv.pdf</div>
                  </div>
                </div>
              )}
            </div>
            
            {activeTab !== 'cv' && (activeTab === 'categories' ? categories : projects).length === 0 && (
              <div className="py-32 flex flex-col items-center justify-center bg-white rounded-[3rem] border-4 border-dashed border-slate-100 text-slate-300">
                 <ImageIcon size={64} className="mb-4 opacity-10" />
                 <p className="font-black text-xl">لا توجد سجلات بعد</p>
                 <p className="font-bold text-sm">ابدئي بإضافة إبداعاتكِ من النموذج الجانبي</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
