
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Plus, Layout, FolderKanban, Trash2, Upload, 
  Loader2, FileText, CheckCircle, FileUp, AlertCircle
} from 'lucide-react';
import { Category, PortfolioItem } from '../../types';

const Dashboard: React.FC<{ onUpdate: () => void }> = ({ onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'categories' | 'cv'>('projects');
  const [categories, setCategories] = useState<Category[]>([]);
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form States
  const [catForm, setCatForm] = useState({ name: '', desc: '', file: null as File | null, preview: null as string | null });
  const [projForm, setProjForm] = useState({ title: '', desc: '', catId: '', file: null as File | null, preview: null as string | null });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = async () => {
    const { data: cats } = await supabase.from('categories').select('*').order('name');
    const { data: projs } = await supabase.from('portfolio_items').select('*, categories(*)').order('created_at', { ascending: false });
    if (cats) setCategories(cats);
    if (projs) setProjects(projs);
  };

  useEffect(() => { loadData(); }, []);

  const uploadToStorage = async (file: File, folder: string) => {
    const path = `${folder}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('portfolio').upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from('portfolio').getPublicUrl(path);
    return data.publicUrl;
  };

  const deleteItem = async (table: string, id: string) => {
    if (!confirm('هل أنتِ متأكدة؟ سيتم الحذف نهائياً.')) return;
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (!error) { loadData(); onUpdate(); }
  };

  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catForm.file) { setErrorMsg("يرجى اختيار صورة"); return; }
    setLoading(true); setErrorMsg(null);
    try {
      const url = await uploadToStorage(catForm.file, 'categories');
      const data = { name: catForm.name, description: catForm.desc, cover_image: url, slug: catForm.name.toLowerCase().replace(/\s+/g, '-') };
      const { error } = await supabase.from('categories').insert([data]);
      if (error) throw error;
      setSuccessMsg('تمت الإضافة بنجاح');
      setCatForm({ name: '', desc: '', file: null, preview: null });
      loadData(); onUpdate();
    } catch (err: any) { setErrorMsg(err.message); } finally { setLoading(false); }
  };

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projForm.file) { setErrorMsg("يرجى اختيار صورة"); return; }
    setLoading(true); setErrorMsg(null);
    try {
      const url = await uploadToStorage(projForm.file, 'projects');
      const data = { 
        title: projForm.title, 
        description: projForm.desc, // إضافة الوصف
        image_url: url, 
        category_id: projForm.catId 
      };
      const { error } = await supabase.from('portfolio_items').insert([data]);
      if (error) throw error;
      setSuccessMsg('تمت الإضافة بنجاح');
      setProjForm({ title: '', desc: '', catId: '', file: null, preview: null });
      loadData(); onUpdate();
    } catch (err: any) { setErrorMsg(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen pt-24 pb-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 text-right">
          <h1 className="text-4xl font-black text-slate-900">لوحة التحكم</h1>
          <div className="flex bg-white p-2 rounded-full shadow-sm border border-slate-100 overflow-x-auto max-w-full">
            {[
              { id: 'projects', label: 'الأعمال', icon: FolderKanban },
              { id: 'categories', label: 'الفئات', icon: Layout },
              { id: 'cv', label: 'السيرة', icon: FileText },
            ].map(tab => (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id as any); setErrorMsg(null); setSuccessMsg(null); }} className={`px-8 py-3 rounded-full font-black flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500'}`}>
                <tab.icon size={18} /> {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 text-right">
          <div className="lg:col-span-1">
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 sticky top-32">
              <h3 className="text-2xl font-black mb-8 flex items-center gap-3 text-slate-900">
                <Plus className="text-purple-600" /> إضافة جديد
              </h3>
              {errorMsg && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex gap-2"><AlertCircle size={18}/> {errorMsg}</div>}
              {successMsg && <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-2xl flex gap-2"><CheckCircle size={18}/> {successMsg}</div>}

              {activeTab === 'categories' && (
                <form onSubmit={handleSubmitCategory} className="space-y-4">
                  <input type="text" placeholder="اسم الفئة" value={catForm.name} onChange={e => setCatForm({...catForm, name: e.target.value})} required className="w-full p-4 bg-slate-50 rounded-2xl border" />
                  <textarea placeholder="الوصف" value={catForm.desc} onChange={e => setCatForm({...catForm, desc: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border min-h-[100px]" />
                  <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer border-2 border-dashed p-10 rounded-2xl text-center bg-slate-50">
                    {catForm.preview ? <img src={catForm.preview} className="max-h-32 mx-auto rounded-lg" /> : <Upload className="mx-auto text-slate-300" />}
                    <span className="text-xs font-bold text-slate-400 block mt-2">صورة الغلاف</span>
                  </div>
                  <input type="file" ref={fileInputRef} hidden onChange={e => {
                    const f = e.target.files?.[0];
                    if (f) setCatForm({...catForm, file: f, preview: URL.createObjectURL(f)});
                  }} />
                  <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black">
                    {loading ? <Loader2 className="animate-spin mx-auto" /> : 'إضافة الفئة'}
                  </button>
                </form>
              )}

              {activeTab === 'projects' && (
                <form onSubmit={handleSubmitProject} className="space-y-4">
                  <select value={projForm.catId} onChange={e => setProjForm({...projForm, catId: e.target.value})} required className="w-full p-4 bg-slate-50 rounded-2xl border">
                    <option value="">اختر الفئة</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <input type="text" placeholder="عنوان العمل" value={projForm.title} onChange={e => setProjForm({...projForm, title: e.target.value})} required className="w-full p-4 bg-slate-50 rounded-2xl border" />
                  {/* إعادة حقل وصف العمل */}
                  <textarea placeholder="نبذة عن العمل (تظهر في الصفحة المؤقتة)" value={projForm.desc} onChange={e => setProjForm({...projForm, desc: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border min-h-[100px]" />
                  <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer border-2 border-dashed p-8 rounded-2xl text-center bg-slate-50">
                    {projForm.preview ? <img src={projForm.preview} className="max-h-24 mx-auto" /> : <FileUp className="mx-auto text-slate-300" />}
                    <span className="text-xs font-bold text-slate-400 block mt-2">صورة العمل</span>
                  </div>
                  <input type="file" ref={fileInputRef} hidden onChange={e => {
                    const f = e.target.files?.[0];
                    if (f) setProjForm({...projForm, file: f, preview: URL.createObjectURL(f)});
                  }} />
                  <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black">
                    {loading ? <Loader2 className="animate-spin mx-auto" /> : 'إضافة العمل'}
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            {activeTab === 'categories' && categories.map(cat => (
              <div key={cat.id} className="bg-white p-6 rounded-[2rem] flex items-center justify-between border shadow-sm">
                <div className="flex items-center gap-4">
                  <img src={cat.cover_image} className="w-16 h-16 rounded-2xl object-cover" />
                  <h4 className="font-black text-slate-900">{cat.name}</h4>
                </div>
                <button onClick={() => deleteItem('categories', cat.id)} className="p-3 text-red-500 hover:bg-red-50 rounded-full transition-all"><Trash2 size={20}/></button>
              </div>
            ))}
            {activeTab === 'projects' && projects.map(p => (
              <div key={p.id} className="bg-white p-6 rounded-[2rem] flex items-center justify-between border shadow-sm">
                <div className="flex items-center gap-4">
                  <img src={p.image_url} className="w-16 h-16 rounded-2xl object-cover" />
                  <div>
                    <h4 className="font-black text-slate-900">{p.title}</h4>
                    <span className="text-xs text-slate-400">{categories.find(c => c.id === p.category_id)?.name}</span>
                  </div>
                </div>
                <button onClick={() => deleteItem('portfolio_items', p.id)} className="p-3 text-red-500 hover:bg-red-50 rounded-full transition-all"><Trash2 size={20}/></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
