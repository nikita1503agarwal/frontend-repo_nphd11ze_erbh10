import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import GlassCard from './GlassCard';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function ToolManager({ onChanged }) {
  const [tools, setTools] = useState([]);
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [type, setType] = useState('');
  const [notes, setNotes] = useState('');

  async function load() {
    const r = await fetch(`${API}/api/tools`);
    const j = await r.json();
    setTools(j);
  }

  useEffect(() => { load(); }, []);

  async function addTool(e) {
    e.preventDefault();
    const res = await fetch(`${API}/api/tools`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, brand, type, notes })
    });
    if (res.ok) {
      setName(''); setBrand(''); setType(''); setNotes('');
      await load();
      onChanged && onChanged();
    }
  }

  return (
    <div className="grid gap-4">
      <GlassCard className="p-4 sm:p-6">
        <form onSubmit={addTool} className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="col-span-2">
            <h3 className="text-slate-200 font-medium">Tools</h3>
            <p className="text-slate-400 text-sm">Save your brewers, grinders and machines</p>
          </div>
          {[['name','Name'], ['brand','Brand'], ['type','Type']].map(([k,label]) => (
            <div key={k} className="col-span-1">
              <label className="text-sm text-slate-300">{label}</label>
              <input value={{name,brand,type}[k]} onChange={e => ({name:setName,brand:setBrand,type:setType}[k](e.target.value))} className="mt-1 w-full rounded-xl bg-slate-900/60 text-slate-100 border border-white/10 px-3 py-2 backdrop-blur placeholder:text-slate-400" placeholder={label} />
            </div>
          ))}
          <div className="col-span-2">
            <label className="text-sm text-slate-300">Notes</label>
            <input value={notes} onChange={e => setNotes(e.target.value)} className="mt-1 w-full rounded-xl bg-slate-900/60 text-slate-100 border border-white/10 px-3 py-2 backdrop-blur placeholder:text-slate-400" placeholder="Optional notes" />
          </div>
          <div className="col-span-2 flex justify-end">
            <button className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-slate-100 bg-white/10 hover:bg-white/15 active:bg-white/20 border border-white/10 backdrop-blur-lg">
              <Plus className="w-4 h-4" />
              Add Tool
            </button>
          </div>
        </form>
      </GlassCard>

      <div className="grid sm:grid-cols-2 gap-4">
        {tools.map(t => (
          <GlassCard key={t._id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-100 font-medium">{t.name}</p>
                <p className="text-slate-400 text-sm">{t.brand || '—'} • {t.type || '—'}</p>
              </div>
            </div>
          </GlassCard>
        ))}
        {tools.length === 0 && (
          <p className="text-slate-400">No tools yet. Add your first one above.</p>
        )}
      </div>
    </div>
  );
}
