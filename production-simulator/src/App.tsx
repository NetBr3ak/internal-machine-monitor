import { useEffect, useState } from 'react';
import { LayoutGroup } from 'framer-motion';
import { useSimulationStore } from './store';
import { GlobalMetricsPanel } from './components/GlobalMetricsPanel';
import { TaskPoolPanel } from './components/TaskPoolPanel';
import { MachineColumn } from './components/MachineColumn';
import { SimulationControls } from './components/SimulationControls';
import { Analytics } from './pages/Analytics';
import { SIMULATION_CONFIG } from './config';

function App() {
  const [activeView, setActiveView] = useState<'production' | 'analytics'>('production');
  const {
    isRunning,
    simulationTime,
    taskPool,
    machines,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    tick,
    assignAllTasks,
    addTaskBatch,
    getGlobalMetrics,
    getMachineMetrics,
  } = useSimulationStore();

  const globalMetrics = getGlobalMetrics();

  // Initialize simulation with tasks on mount
  useEffect(() => {
    resetSimulation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Simulation tick
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      tick();
    }, SIMULATION_CONFIG.TICK_INTERVAL);

    return () => clearInterval(interval);
  }, [isRunning, tick]);

  // Periodic batch task generation - Realistic production order arrivals with rush periods
  useEffect(() => {
    if (!isRunning) return;

    let rushPeriodActive = false;
    let timeoutId: number;

    const generateTaskBatch = () => {
      addTaskBatch();

      // Check if we should be in rush period (every 60 sim minutes for 15 sim minutes)
      const simMinutes = simulationTime % 60;
      const shouldBeRushPeriod = simMinutes >= 0 && simMinutes < 15;

      if (shouldBeRushPeriod !== rushPeriodActive) {
        rushPeriodActive = shouldBeRushPeriod;
      }

      // During rush period: 2x faster (half the interval)
      const intervalMultiplier = rushPeriodActive ? 0.5 : 1.0;

      const nextInterval = (Math.random() *
        (SIMULATION_CONFIG.BATCH_ARRIVAL_INTERVAL_MAX - SIMULATION_CONFIG.BATCH_ARRIVAL_INTERVAL_MIN) +
        SIMULATION_CONFIG.BATCH_ARRIVAL_INTERVAL_MIN) * intervalMultiplier;

      timeoutId = window.setTimeout(generateTaskBatch, nextInterval);
    };

    const initialDelay = Math.random() *
      (SIMULATION_CONFIG.BATCH_ARRIVAL_INTERVAL_MAX - SIMULATION_CONFIG.BATCH_ARRIVAL_INTERVAL_MIN) +
      SIMULATION_CONFIG.BATCH_ARRIVAL_INTERVAL_MIN;

    timeoutId = window.setTimeout(generateTaskBatch, initialDelay);

    return () => clearTimeout(timeoutId);
  }, [isRunning, addTaskBatch, simulationTime]);

  const handleStart = () => {
    if (taskPool.length > 0) {
      assignAllTasks();
    }
    startSimulation();
  };

  // Show analytics view
  if (activeView === 'analytics') {
    return <Analytics onBack={() => setActiveView('production')} />;
  }

  return (
    <LayoutGroup>
      <div className="flex flex-col h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans selection:bg-cyan-500/30 relative">
        {/* Global Cyberpunk Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,23,42,0)_0%,rgba(2,6,23,0.8)_100%)] pointer-events-none" />

        {/* View Toggle */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <button
            onClick={() => setActiveView('production')}
            className="px-4 py-2 border text-xs font-bold uppercase tracking-widest transition-all bg-cyan-500 text-white border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          >
            🏭 Production
          </button>
          <button
            onClick={() => setActiveView('analytics')}
            className="px-4 py-2 border text-xs font-bold uppercase tracking-widest transition-all bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700 backdrop-blur-sm animate-pulse-3"
          >
            📊 Analytics
          </button>
        </div>

        {/* Top Bar - Global Metrics */}
        <header className="flex-none p-4 pb-2 z-10">
          <GlobalMetricsPanel
            metrics={globalMetrics}
            simulationTime={simulationTime}
            isRunning={isRunning}
          />
        </header>

        {/* Main Content - Three Zones */}
        <main className="flex-1 flex gap-4 px-4 min-h-0 z-10">
          {/* Left Panel - Task Pool */}
          <aside className="w-80 flex-none flex flex-col h-full">
            <TaskPoolPanel tasks={taskPool} />
          </aside>

          {/* Right Panel - Machines Grid */}
          <section className="flex-1 flex flex-col h-full min-w-0">
            <div className="flex-1 p-1 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 grid-rows-2 gap-4 h-full">
                {machines.map((machine) => (
                  <MachineColumn
                    key={machine.id}
                    machine={machine}
                    metrics={getMachineMetrics(machine.id)}
                  />
                ))}
              </div>
            </div>
          </section>
        </main>

        {/* Bottom Bar - Controls */}
        <footer className="flex-none p-4 pt-2 z-10">
          <SimulationControls
            isRunning={isRunning}
            onStart={handleStart}
            onPause={pauseSimulation}
            onReset={() => {
              resetSimulation();
              setTimeout(() => assignAllTasks(), 100);
            }}
          />
        </footer>
      </div>
    </LayoutGroup>
  );
}

export default App;
