import { useEffect } from 'react';
import { useSimulationStore } from './store';
import { GlobalMetricsPanel } from './components/GlobalMetricsPanel';
import { TaskPoolPanel } from './components/TaskPoolPanel';
import { MachineColumn } from './components/MachineColumn';
import { SimulationControls } from './components/SimulationControls';
import { SIMULATION_CONFIG } from './config';

function App() {
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

  // Periodic batch task generation - Realistic production order arrivals
  useEffect(() => {
    if (!isRunning) return;

    const generateTaskBatch = () => {
      addTaskBatch();

      // Schedule next batch with realistic intervals
      const nextInterval = Math.random() *
        (SIMULATION_CONFIG.BATCH_ARRIVAL_INTERVAL_MAX - SIMULATION_CONFIG.BATCH_ARRIVAL_INTERVAL_MIN) +
        SIMULATION_CONFIG.BATCH_ARRIVAL_INTERVAL_MIN;

      setTimeout(generateTaskBatch, nextInterval);
    };

    const initialDelay = Math.random() *
      (SIMULATION_CONFIG.BATCH_ARRIVAL_INTERVAL_MAX - SIMULATION_CONFIG.BATCH_ARRIVAL_INTERVAL_MIN) +
      SIMULATION_CONFIG.BATCH_ARRIVAL_INTERVAL_MIN;

    const timeout = setTimeout(generateTaskBatch, initialDelay);

    return () => clearTimeout(timeout);
  }, [isRunning, addTaskBatch]);

  const handleStart = () => {
    if (taskPool.length > 0) {
      assignAllTasks();
    }
    startSimulation();
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans selection:bg-cyan-500/30">
      {/* Top Bar - Global Metrics */}
      <header className="flex-none p-4 pb-2 z-10">
        <GlobalMetricsPanel
          metrics={globalMetrics}
          simulationTime={simulationTime}
          isRunning={isRunning}
        />
      </header>

      {/* Main Content - Three Zones */}
      <main className="flex-1 flex gap-4 px-4 min-h-0">
        {/* Left Panel - Task Pool */}
        <aside className="w-80 flex-none flex flex-col h-full">
          <TaskPoolPanel tasks={taskPool} />
        </aside>

        {/* Right Panel - Machines Grid */}
        <section className="flex-1 flex flex-col h-full min-w-0">
          <div className="flex-1 bg-slate-900/30 rounded-2xl border border-slate-800/50 p-4 overflow-y-auto custom-scrollbar">
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
  );
}

export default App;
