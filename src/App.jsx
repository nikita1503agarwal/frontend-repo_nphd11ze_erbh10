import { useState } from 'react';
import Hero from './components/Hero';
import BrewForm from './components/BrewForm';
import BrewList from './components/BrewList';
import ToolManager from './components/ToolManager';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_70%_-10%,rgba(124,58,237,0.15),transparent_60%),radial-gradient(1000px_500px_at_20%_20%,rgba(217,119,6,0.12),transparent_60%)] bg-slate-950 text-slate-100">
      <Hero />

      <main className="relative z-10 -mt-24 pb-24 px-4">
        <div className="max-w-5xl mx-auto grid gap-6">
          {/* Glass dock */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <BrewForm onCreated={() => setRefreshKey(k => k + 1)} />
            </div>
            <div className="sm:col-span-1">
              <ToolManager onChanged={() => setRefreshKey(k => k + 1)} />
            </div>
          </div>

          <section className="mt-4">
            <h2 className="text-lg font-medium text-slate-200 mb-2">Recent Brews</h2>
            <BrewList refresh={refreshKey} />
          </section>
        </div>
      </main>
    </div>
  )
}

export default App
