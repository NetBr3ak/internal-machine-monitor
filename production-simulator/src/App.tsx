import { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import { LayoutGroup } from 'framer-motion';
import { LayoutDashboard, BarChart3, Loader2 } from 'lucide-react';
import { useSystemStore } from './store';
import { GlobalMetricsPanel } from './components/GlobalMetricsPanel';
import { TaskPoolPanel } from './components/TaskPoolPanel';
import { MachineColumn } from './components/MachineColumn';
import { SystemControls } from './components/SystemControls';
import { SYSTEM_CONFIG, MACHINES } from './config';

// Lazy load heavy Analytics component
const Analytics = lazy(() => import('./pages/Analytics').then(module => ({ default: module.Analytics })));

function App() {
  const [activeView, setActiveView] = useState<'production' | 'analytics'>('production');
  const isRunning = useSystemStore(state => state.isRunning);
  const startSystem = useSystemStore(state => state.startSystem);
  const pauseSystem = useSystemStore(state => state.pauseSystem);
  const resetSystem = useSystemStore(state => state.resetSystem);
  const tick = useSystemStore(state => state.tick);
  const assignAllTasks = useSystemStore(state => state.assignAllTasks);
  const addTaskBatch = useSystemStore(state => state.addTaskBatch);

  // Initialize system with tasks on mount
  useEffect(() => {
    resetSystem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // System tick
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      tick();
    }, SYSTEM_CONFIG.REFRESH_RATE);

    return () => clearInterval(interval);
  }, [isRunning, tick]);

  // Periodic batch task generation
  useEffect(() => {
    if (!isRunning) return;

    let timeoutId: number;

    const generateTaskBatch = () => {
      // Get current metrics to decide on frequency
      // We access the store directly to get the freshest state without triggering re-renders
      const metrics = useSystemStore.getState().getGlobalMetrics();
      const waitingCount = metrics.waitingCount;

      addTaskBatch();

      // Dynamic Interval Logic (Queue Size Control) - Optimized for CNC
      // Target Queue: 8-25 tasks (higher for CNC workload)
      // < 8 tasks: Fast generation (0.3s - 0.8s)
      // > 25 tasks: Slow generation (2s - 4s)
      // 8-25 tasks: Normal generation (1s - 2s)
      let nextInterval: number;

      if (waitingCount < 8) {
        nextInterval = Math.random() * 500 + 300;
      } else if (waitingCount > 25) {
        nextInterval = Math.random() * 2000 + 2000;
      } else {
        nextInterval = Math.random() * 1000 + 1000;
      }

      timeoutId = window.setTimeout(generateTaskBatch, nextInterval);
    };

    // Initial kickstart
    timeoutId = window.setTimeout(generateTaskBatch, 1000);

    return () => clearTimeout(timeoutId);
  }, [isRunning, addTaskBatch]); const handleStart = useCallback(() => {
    // We can check taskPoolLength here, but better to just call assignAllTasks anyway
    // It handles empty pool gracefully
    assignAllTasks();
    startSystem();
  }, [assignAllTasks, startSystem]);

  const handleReset = useCallback(() => {
    resetSystem();
    setTimeout(() => assignAllTasks(), 100);
  }, [resetSystem, assignAllTasks]);

  return (
    <LayoutGroup>
      <div className="flex flex-col h-screen bg-[var(--color-void)] text-[var(--color-text-primary)] overflow-hidden font-sans relative">
        {/* Background */}
        <div className="absolute inset-0 hud-grid pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-void)]/60 to-[var(--color-void)] pointer-events-none" />

        {/* Header Bar */}
        <header className="flex-none h-16 border-b border-[var(--color-border)] bg-[var(--color-surface)] z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 flex-shrink-0 flex items-center justify-center">
              <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="ForgeGrid" className="h-8 w-8 object-contain" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                <span className="tracking-widest">FORGE</span><span className="accent-text text-glow-cyan">GRID</span>
                <span className="hidden sm:inline text-xs font-mono text-[var(--color-text-muted)] border border-[var(--color-border)] px-2 py-0.5 bg-[var(--color-abyss)]">v2.4</span>
              </h1>
              <p className="hidden sm:block text-xs text-[var(--color-text-muted)] font-mono uppercase tracking-wider mt-1">
                Production Intelligence System
              </p>
            </div>
          </div>

          <div className="flex items-center bg-[var(--color-abyss)] border border-[var(--color-border)]">
            <button
              onClick={() => setActiveView('production')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold tracking-widest transition-colors ${activeView === 'production'
                ? 'bg-[var(--color-accent-dim)] text-[var(--color-accent)] border-r border-[var(--color-border)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-elevated)] border-r border-[var(--color-border)]'
                }`}
            >
              <LayoutDashboard size={16} />
              <span className="hidden xs:inline">PRODUCTION</span>
            </button>
            <button
              onClick={() => setActiveView('analytics')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold tracking-widest transition-colors ${activeView === 'analytics'
                ? 'bg-[var(--color-accent-dim)] text-[var(--color-accent)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-elevated)]'
                }`}
            >
              <BarChart3 size={16} />
              <span className="hidden xs:inline">ANALYTICS</span>
            </button>
          </div>
        </header>

        {/* Content Switcher */}
        {activeView === 'analytics' ? (
          <Suspense fallback={
            <div className="flex items-center justify-center h-[60vh]">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--color-accent)]" />
                <p className="text-[var(--color-text-muted)] font-mono text-sm tracking-widest uppercase">Loading Analytics...</p>
              </div>
            </div>
          }>
            <Analytics />
          </Suspense>
        ) : (
          <>
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-0 relative z-10 overflow-hidden">
              {/* Metrics Bar */}
              <div className="flex-none px-4 lg:px-8 py-4 border-b border-[var(--color-border-dim)] bg-[var(--color-abyss)]/60">
                <GlobalMetricsPanel />
              </div>

              {/* Workspace */}
              <main className="flex-1 flex flex-col lg:flex-row gap-4 p-4 lg:p-5 min-h-0 overflow-hidden">
                {/* Left Panel - Task Pool */}
                <aside className="w-full lg:w-72 xl:w-80 flex-none h-56 lg:h-full hud-panel overflow-hidden">
                  <div className="h-full overflow-hidden">
                    <TaskPoolPanel />
                  </div>
                </aside>

                {/* Right Panel - Machines Grid */}
                <section className="flex-1 flex flex-col min-h-0 min-w-0 hud-panel overflow-hidden relative">
                  {/* Subtle Grid Background */}
                  <div className="absolute inset-0 hud-grid pointer-events-none opacity-50" />

                  <div className="flex-1 p-4 lg:p-5 overflow-y-auto custom-scrollbar relative z-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 xl:grid-rows-2 gap-4 h-full">
                      {MACHINES.map((machine) => (
                        <div key={machine.id} className="min-h-0 flex flex-col h-full">
                          <MachineColumn
                            machineId={machine.id}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </main>
            </div>

            {/* Bottom Bar - Controls */}
            <footer className="flex-none h-16 border-t border-[var(--color-border)] bg-[var(--color-surface)] z-30 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
              <div className="hidden md:block text-xs text-[var(--color-text-muted)] font-mono truncate tracking-wider">
                FORGE GRID // PRODUCTION INTELLIGENCE SYSTEM
              </div>
              <SystemControls
                isRunning={isRunning}
                onStart={handleStart}
                onPause={pauseSystem}
                onReset={handleReset}
              />
            </footer>
          </>
        )}
      </div>
    </LayoutGroup>
  );
}

export default App;
