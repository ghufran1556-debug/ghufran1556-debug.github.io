
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Plus, Layout, FolderKanban, LogOut, Trash2, Upload, X, 
  Loader2, FileText, CheckCircle, Edit, ListTree, FileUp, AlertCircle
} from 'lucide-react';
import { Category, PortfolioItem, SubCategory } from '../../types';

const Dashboard: React.FC<{ onUpdate: () => void }> = ({ onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'categories' | 'subs' | 'cv'>('projects');
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Statuses
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form States
  const [catForm, setCatForm] = useState({ name: '', desc: '', img: '', file: null as File | null, preview: null as string | null });
  const [subForm, setSubForm] = useState({ name: '', catId: '' });
  const [projForm, setProjForm] = useState({ title: '', desc: '', subId: '', catId: '', file: null as File | null, preview: null as string | null, img: '' });
  const [cvFile, setCvFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = async () => {
    const { data: cats } = await supabase.from('categories').select('*').order('name');
    const { data: subs } = await supabase.from('sub_categories').select('*, categories(*)').order('name');
    const { data: projs } = await supabase.from('portfolio_items').select('*, categories(*)').order('created_at', { ascending: false });
    if (cats) setCategories(cats);
    if (subs) setSubCategories(subs);
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

  const handleEdit = (item: any, type: typeof activeTab) => {
    setEditingId(item.id);
    if (type === 'categories') {
      setCatForm({ name: item.name, desc: item.description, img: item.cover_image, file: null, preview: item.cover_image });
    } else if (type === 'subs') {
      setSubForm({ name: item.name, catId: item.category_id });
    } else if (type === 'projects') {
      setProjForm({ title: item.title, desc: item.description || '', subId: item.sub_category_id || '', catId: item.category_id, file: null, preview: item.image_url, img: item.image_url });
    }
  };

  const deleteItem = async (table: string, id: string) => {
    if (!confirm('سيتم حذف هذا العنصر نهائياً، هل أنتِ متأكدة؟')) return;
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (!error) { loadData(); onUpdate(); }
  };

  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setErrorMsg(null);
    try {
      let url = catForm.img;
      if (catForm.file) url = await uploadToStorage(catForm.file, 'categories');
      const data = { name: catForm.name, description: catForm.desc, cover_image: url, slug: catForm.name.toLowerCase().replace(/\s+/g, '-') };
      const { error } = editingId ? await supabase.from('categories').update(data).eq('id', editingId) : await supabase.from('categories').insert([data]);
      if (error) throw error;
      setSuccessMsg('تم الحفظ بنجاح');
      setCatForm({ name: '', desc: '', img: '', file: null, preview: null });
      setEditingId(null); loadData(); onUpdate();
    } catch (err: any) { setErrorMsg(err.message); } finally { setLoading(false); }
  };

  const handleSubmitSub = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setErrorMsg(null);
    try {
      const data = { name: subForm.name, category_id: subForm.catId, slug: subForm.name.toLowerCase().replace(/\s+/g, '-') };
      const { error } = editingId ? await supabase.from('sub_categories').update(data).eq('id', editingId) : await supabase.from('sub_categories').insert([data]);
      if (error) throw error;
      setSubForm({ name: '', catId: '' }); setEditingId(null); loadData(); onUpdate();
    } catch (err: any) { setErrorMsg(err.message); } finally { setLoading(false); }
  };

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setErrorMsg(null);
    try {
      let url = projForm.img;
      if (projForm.file) url = await uploadToStorage(projForm.file, 'projects');
      const data = { title: projForm.title, description: projForm.desc, image_url: url, category_id: projForm.catId, sub_category_id: projForm.subId || null };
      const { error } = editingId ? await supabase.from('portfolio_items').update(data).eq('id', editingId) : await supabase.from('portfolio_items').insert([data]);
      if (error) throw error;
      setProjForm({ title: '', desc: '', subId: '', catId: '', file: null, preview: null, img: '' });
      setEditingId(null); loadData(); onUpdate();
    } catch (err: any) { setErrorMsg(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen pt-24 pb-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <h1 className="text-4xl font-black text-slate-900">لوحة التحكم</h1>
          <div className="flex flex-wrap justify-center gap-3 bg-white p-2 rounded-[2.5rem] shadow-sm border border-slate-100">
            {[
              { id: 'projects', label: 'الأعمال', icon: FolderKanban },
              { id: 'categories', label: 'الفئات', icon: Layout },
              { id: 'subs', label: 'الفروع', icon: ListTree },
              { id: 'cv', label: 'السيرة', icon: FileText },
            ].map(tab => (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id as any); setEditingId(null); }} className={`px-6 py-3 rounded-full font-black flex items-center gap-2 ${activeTab === tab.id ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500'}`}>
                <tab.icon size={18} /> {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 sticky top-32">
              <h3 className="text-2xl font-black mb-8 flex items-center gap-3 text-slate-900">
                {editingId ? <Edit className="text-blue-500" /> : <Plus className="text-purple-600" />}
                {editingId ? 'تعديل البيانات' : 'إضافة جديد'}
              </h3>

              {errorMsg && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex gap-2"><AlertCircle size={18}/> {errorMsg}</div>}
              {successMsg && <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-2xl flex gap-2"><CheckCircle size={18}/> {successMsg}</div>}

              {activeTab === 'categories' && (
                <form onSubmit={handleSubmitCategory} className="space-y-4">
                  <input type="text" placeholder="اسم الفئة" value={catForm.name} onChange={e => setCatForm({...catForm, name: e.target.value})} required className="w-full p-4 bg-slate-50 rounded-2xl border" />
                  <textarea placeholder="الوصف" value={catForm.desc} onChange={e => setCatForm({...catForm, desc: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border min-h-[100px]" />
                  <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer border-2 border-dashed p-10 rounded-2xl text-center bg-slate-50">
                    {catForm.preview ? <img src={catForm.preview} className="max-h-32 mx-auto rounded-lg mb-2" /> : <Upload className="mx-auto text-slate-300" />}
                    <span className="text-xs font-bold text-slate-400">صورة الغلاف</span>
                  </div>
                  <input type="file" ref={fileInputRef} hidden onChange={e => {
                    const f = e.target.files?.[0];
                    if (f) setCatForm({...catForm, file: f, preview: URL.createObjectURL(f)});
                  }} />
                  <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black">
                    {loading ? <Loader2 className="animate-spin mx-auto" /> : (editingId ? 'تحديث الفئة' : 'إضافة الفئة')}
                  </button>
                  {editingId && <button type="button" onClick={() => setEditingId(null)} className="w-full text-slate-400 font-bold">إلغاء التعديل</button>}
                </form>
              )}

              {activeTab === 'subs' && (
                <form onSubmit={handleSubmitSub} className="space-y-4">
                  <select value={subForm.catId} onChange={e => setSubForm({...subForm, catId: e.target.value})} required className="w-full p-4 bg-slate-50 rounded-2xl border">
                    <option value="">الفئة الرئيسية</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <input type="text" placeholder="اسم الفرع (مثلاً: تصوير أطعمة)" value={subForm.name} onChange={e => setSubForm({...subForm, name: e.target.value})} required className="w-full p-4 bg-slate-50 rounded-2xl border" />
                  <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black">
                    {loading ? <Loader2 className="animate-spin mx-auto" /> : (editingId ? 'تحديث الفرع' : 'إضافة الفرع')}
                  </button>
                  {editingId && <button type="button" onClick={() => setEditingId(null)} className="w-full text-slate-400 font-bold">إلغاء</button>}
                </form>
              )}

              {activeTab === 'projects' && (
                <form onSubmit={handleSubmitProject} className="space-y-4">
                  <select value={projForm.catId} onChange={e => {
                    setProjForm({...projForm, catId: e.target.value, subId: ''});
                  }} required className="w-full p-4 bg-slate-50 rounded-2xl border">
                    <option value="">الفئة</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <select value={projForm.subId} onChange={e => setProjForm({...projForm, subId: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border">
                    <option value="">الفرع (اختياري)</option>
                    {subCategories.filter(s => s.category_id === projForm.catId).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                  <input type="text" placeholder="عنوان العمل" value={projForm.title} onChange={e => setProjForm({...projForm, title: e.target.value})} required className="w-full p-4 bg-slate-50 rounded-2xl border" />
                  <textarea placeholder="تفاصيل المشروع" value={projForm.desc} onChange={e => setProjForm({...projForm, desc: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border min-h-[80px]" />
                  <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer border-2 border-dashed p-8 rounded-2xl text-center bg-slate-50">
                    {projForm.preview ? <img src={projForm.preview} className="max-h-24 mx-auto mb-2" /> : <FileUp className="mx-auto text-slate-300" />}
                    <span className="text-xs font-bold text-slate-400">صورة المشروع</span>
                  </div>
                  <input type="file" ref={fileInputRef} hidden onChange={e => {
                    const f = e.target.files?.[0];
                    if (f) setProjForm({...projForm, file: f, preview: URL.createObjectURL(f)});
                  }} />
                  <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black">
                    {loading ? <Loader2 className="animate-spin mx-auto" /> : (editingId ? 'تحديث العمل' : 'إضافة العمل')}
                  </button>
                  {editingId && <button type="button" onClick={() => setEditingId(null)} className="w-full text-slate-400 font-bold">إلغاء</button>}
                </form>
              )}
            </div>
          </div>

          {/* List Section */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'categories' && categories.map(cat => (
              <div key={cat.id} className="bg-white p-6 rounded-[2.5rem] flex items-center justify-between border shadow-sm group">
                <div className="flex items-center gap-4">
                  <img src={cat.cover_image} className="w-16 h-16 rounded-2xl object-cover" />
                  <div><h4 className="font-black text-slate-900">{cat.name}</h4><p className="text-xs text-slate-400">{cat.description?.slice(0, 50)}...</p></div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(cat, 'categories')} className="p-3 bg-blue-50 text-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition-all"><Edit size={18}/></button>
                  <button onClick={() => deleteItem('categories', cat.id)} className="p-3 bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18}/></button>
                </div>
              </div>
            ))}

            {activeTab === 'subs' && subCategories.map(sub => (
              <div key={sub.id} className="bg-white p-6 rounded-[2.5rem] flex items-center justify-between border shadow-sm">
                <div>
                  <h4 className="font-black text-slate-900">{sub.name}</h4>
                  <span className="text-xs bg-purple-50 text-purple-600 px-3 py-1 rounded-full">{categories.find(c => c.id === sub.category_id)?.name}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(sub, 'subs')} className="p-3 bg-blue-50 text-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition-all"><Edit size={18}/></button>
                  <button onClick={() => deleteItem('sub_categories', sub.id)} className="p-3 bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18}/></button>
                </div>
              </div>
            ))}

            {activeTab === 'projects' && projects.map(p => (
              <div key={p.id} className="bg-white p-6 rounded-[2.5rem] flex items-center justify-between border shadow-sm group">
                <div className="flex items-center gap-4">
                  <img src={p.image_url} className="w-16 h-16 rounded-2xl object-cover" />
                  <div>
                    <h4 className="font-black text-slate-900">{p.title}</h4>
                    <span className="text-[10px] font-bold text-slate-400">{categories.find(c => c.id === p.category_id)?.name} / {subCategories.find(s => s.id === p.sub_category_id)?.name || 'عام'}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(p, 'projects')} className="p-3 bg-blue-50 text-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition-all"><Edit size={18}/></button>
                  <button onClick={() => deleteItem('portfolio_items', p.id)} className="p-3 bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
