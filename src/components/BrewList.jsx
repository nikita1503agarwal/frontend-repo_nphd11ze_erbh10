import { useEffect, useState } from 'react';
import GlassCard from './GlassCard';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function BrewList({ refresh }) {
  const [brews, setBrews] = useState([]);

  async function load() {
    const r = await fetch(`${API}/api/brews`);
    const j = await r.json();
    setBrews(j);
  }

  useEffect(() => { load(); }, [refresh]);

  return (
    <div className="grid gap-4">
      {brews.map((b) => (
        <GlassCard key={b._id} className="p-4">
          <div className="grid grid-cols-3 gap-3 text-slate-200 text-sm">
            <div>
              <p className="text-xs text-slate-400">Method</p>
              <p className="font-medium capitalize">{b.method}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Dose → Yield</p>
              <p className="font-medium">{b.dose_g}g → {b.yield_g}g</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Time</p>
              <p className="font-medium">{b.time_s}s</p>
            </div>
          </div>
          {b.notes && <p className="mt-3 text-slate-300/90 text-sm">{b.notes}</p>}
        </GlassCard>
      ))}
      {brews.length === 0 && (
        <p className="text-slate-400">No brews yet. Log one to get started.</p>
      )}
    </div>
  );
}
