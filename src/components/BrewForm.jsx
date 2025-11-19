import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Plus } from 'lucide-react';
import GlassCard from './GlassCard';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function BrewForm({ onCreated }) {
  const [tools, setTools] = useState([]);
  const [openSelect, setOpenSelect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    method: 'espresso',
    tool_id: '',
    dose_g: '',
    yield_g: '',
    time_s: '',
    grind: '',
    water_temp_c: '',
    beans: '',
    roast_level: '',
    rating: '',
    notes: ''
  });

  useEffect(() => {
    fetch(`${API}/api/tools`).then(r => r.json()).then(setTools).catch(() => setTools([]));
  }, []);

  function updateField(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        dose_g: parseFloat(form.dose_g),
        yield_g: parseFloat(form.yield_g),
        time_s: parseInt(form.time_s || '0', 10),
        water_temp_c: form.water_temp_c ? parseFloat(form.water_temp_c) : undefined,
        rating: form.rating ? parseInt(form.rating, 10) : undefined,
      };

      const res = await fetch(`${API}/api/brews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to save brew');
      setForm({
        method: 'espresso', tool_id: '', dose_g: '', yield_g: '', time_s: '', grind: '', water_temp_c: '', beans: '', roast_level: '', rating: '', notes: ''
      });
      onCreated && onCreated();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <GlassCard className="p-4 sm:p-6">
      <form onSubmit={submit} className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="col-span-2">
          <label className="text-sm text-slate-300">Method</label>
          <select value={form.method} onChange={e => updateField('method', e.target.value)} className="mt-1 w-full rounded-xl bg-slate-900/60 text-slate-100 border border-white/10 px-3 py-2 backdrop-blur placeholder:text-slate-400">
            <option value="espresso">Espresso</option>
            <option value="pourover">Pourover</option>
            <option value="immersion">Immersion</option>
          </select>
        </div>

        <div className="col-span-2">
          <label className="text-sm text-slate-300">Tool</label>
          <div className="relative">
            <button type="button" onClick={() => setOpenSelect(v => !v)} className="mt-1 w-full rounded-xl bg-slate-900/60 text-slate-100 border border-white/10 px-3 py-2 text-left flex items-center justify-between">
              <span>{tools.find(t => t._id === form.tool_id)?.name || 'Select a tool'}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${openSelect ? 'rotate-180' : ''}`} />
            </button>
            {openSelect && (
              <motion.ul initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="absolute z-20 mt-2 w-full rounded-xl border border-white/10 bg-slate-900/90 backdrop-blur-xl overflow-hidden">
                {tools.map(t => (
                  <li key={t._id}>
                    <button type="button" className="w-full px-3 py-2 text-left hover:bg-white/5" onClick={() => { updateField('tool_id', t._id); setOpenSelect(false); }}>
                      {t.name}{t.brand ? ` • ${t.brand}` : ''}
                    </button>
                  </li>
                ))}
                {tools.length === 0 && (
                  <li className="px-3 py-2 text-slate-400">No tools yet</li>
                )}
              </motion.ul>
            )}
          </div>
        </div>

        {[
          ['dose_g', 'Dose (g)'],
          ['yield_g', 'Yield (g)'],
          ['time_s', 'Time (s)'],
          ['grind', 'Grind'],
          ['water_temp_c', 'Water Temp (°C)'],
          ['beans', 'Beans'],
          ['roast_level', 'Roast Level'],
          ['rating', 'Rating (1-5)'],
        ].map(([key, label]) => (
          <div key={key} className="col-span-1">
            <label className="text-sm text-slate-300">{label}</label>
            <input value={form[key]} onChange={e => updateField(key, e.target.value)} className="mt-1 w-full rounded-xl bg-slate-900/60 text-slate-100 border border-white/10 px-3 py-2 backdrop-blur placeholder:text-slate-400" placeholder={label} />
          </div>
        ))}

        <div className="col-span-2">
          <label className="text-sm text-slate-300">Notes</label>
          <textarea value={form.notes} onChange={e => updateField('notes', e.target.value)} className="mt-1 w-full rounded-xl bg-slate-900/60 text-slate-100 border border-white/10 px-3 py-2 backdrop-blur placeholder:text-slate-400" rows={3} placeholder="Tasting notes, adjustments..." />
        </div>

        <div className="col-span-2 flex justify-end">
          <button disabled={loading} className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-slate-100 bg-white/10 hover:bg-white/15 active:bg-white/20 border border-white/10 backdrop-blur-lg">
            <Plus className="w-4 h-4" />
            Save Brew
          </button>
        </div>
      </form>
    </GlassCard>
  );
}
