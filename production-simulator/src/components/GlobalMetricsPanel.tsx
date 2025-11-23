import type { GlobalMetrics } from '../types';

interface GlobalMetricsPanelProps {
	metrics: GlobalMetrics;
	simulationTime: number;
	isRunning: boolean;
}

export function GlobalMetricsPanel({ metrics, simulationTime, isRunning }: GlobalMetricsPanelProps) {
	const formatTime = (minutes: number): string => {
		const hours = Math.floor(minutes / 60);
		const mins = Math.floor(minutes % 60);
		return `${hours}h ${mins}m`;
	};

	const hallLoadColor =
		metrics.hallLoad > 80 ? 'text-red-400' :
			metrics.hallLoad > 50 ? 'text-amber-400' :
				'text-emerald-400';

	return (
		<div className="bg-slate-950 border-y border-slate-800 p-6 shadow-2xl relative overflow-hidden">
			{/* Cyberpunk Grid Background */}
			<div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.9)_2px,transparent_2px),linear-gradient(90deg,rgba(15,23,42,0.9)_2px,transparent_2px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] opacity-20 pointer-events-none" />

			<div className="relative z-10 flex items-center justify-between gap-8">
				{/* Header Section */}
				<div className="flex items-center gap-6 min-w-max">
					<div className="relative group">
						<div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg blur opacity-20 group-hover:opacity-50 transition duration-500"></div>
						<div className="relative p-4 bg-slate-900 ring-1 ring-slate-800 rounded-lg flex items-center justify-center">
							<span className="text-3xl filter drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">🏭</span>
						</div>
					</div>

					<div>
						<h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-cyan-100 to-slate-400 tracking-tighter uppercase font-mono">
							ForgeGrid<span className="text-cyan-500">.OS</span>
						</h1>
						<div className="flex items-center gap-3 text-xs font-mono mt-2 text-cyan-500/60">
							<span className="flex items-center gap-2 bg-slate-900/80 px-3 py-1 rounded border border-cyan-900/30">
								<span className="text-cyan-400">SYS.TIME</span> {formatTime(simulationTime)}
							</span>
							<div className={`flex items-center gap-2 px-3 py-1 rounded border ${isRunning
								? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-400'
								: 'bg-amber-950/30 border-amber-500/30 text-amber-400'
								}`}>
								<span className={`w-1.5 h-1.5 rounded-sm ${isRunning ? 'bg-emerald-400 shadow-[0_0_8px_currentColor] animate-pulse' : 'bg-amber-400'}`} />
								<span className="font-bold tracking-widest uppercase">
									{isRunning ? 'ONLINE' : 'STANDBY'}
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Metrics Grid */}
				<div className="flex-1 grid grid-cols-5 gap-4">
					{/* Hall Load */}
					<div className="relative bg-slate-900/40 border border-slate-800 p-4 group hover:bg-slate-800/40 transition-all duration-300">
						<div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-slate-600 group-hover:border-cyan-400 transition-colors"></div>
						<div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-slate-600 group-hover:border-cyan-400 transition-colors"></div>

						<div className="flex flex-col h-full justify-between relative z-10">
							<div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">Load</div>
							<div className={`text-4xl font-black font-mono ${hallLoadColor} drop-shadow-sm`}>
								{metrics.hallLoad}<span className="text-sm text-slate-600 ml-1">%</span>
							</div>
							<div className="w-full h-1 bg-slate-800 mt-auto overflow-hidden">
								<div
									className={`h-full transition-all duration-500 ${metrics.hallLoad > 80 ? 'bg-red-500' : metrics.hallLoad > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
									style={{ width: `${metrics.hallLoad}%` }}
								/>
							</div>
						</div>
					</div>

					{/* ETA */}
					<div className="relative bg-slate-900/40 border border-slate-800 p-4 group hover:bg-slate-800/40 transition-all duration-300">
						<div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-slate-600 group-hover:border-cyan-400 transition-colors"></div>
						<div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-slate-600 group-hover:border-cyan-400 transition-colors"></div>

						<div className="flex flex-col h-full justify-between relative z-10">
							<div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">ETA</div>
							<div className="text-4xl font-black font-mono text-cyan-400 drop-shadow-sm">
								{metrics.estimatedCompletionTime > 0 ? metrics.estimatedCompletionTime : '—'}<span className="text-sm text-slate-600 ml-1">min</span>
							</div>
						</div>
					</div>

					{/* Completed */}
					<div className="relative bg-slate-900/40 border border-slate-800 p-4 group hover:bg-slate-800/40 transition-all duration-300">
						<div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-slate-600 group-hover:border-emerald-400 transition-colors"></div>
						<div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-slate-600 group-hover:border-emerald-400 transition-colors"></div>

						<div className="flex flex-col h-full justify-between relative z-10">
							<div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">Completed</div>
							<div className="text-4xl font-black font-mono text-emerald-400 drop-shadow-sm">
								{metrics.completedCount}
							</div>
						</div>
					</div>

					{/* In Progress */}
					<div className="relative bg-slate-900/40 border border-slate-800 p-4 group hover:bg-slate-800/40 transition-all duration-300">
						<div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-slate-600 group-hover:border-blue-400 transition-colors"></div>
						<div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-slate-600 group-hover:border-blue-400 transition-colors"></div>

						<div className="flex flex-col h-full justify-between relative z-10">
							<div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">Active</div>
							<div className="text-4xl font-black font-mono text-blue-400 drop-shadow-sm">
								{metrics.inProgressCount}
							</div>
						</div>
					</div>

					{/* Waiting */}
					<div className={`relative bg-slate-900/40 border p-4 group hover:bg-slate-800/40 transition-all duration-300 ${metrics.waitingCount > 10 ? 'border-amber-900/50' : 'border-slate-800'}`}>
						<div className={`absolute top-0 left-0 w-2 h-2 border-t border-l transition-colors ${metrics.waitingCount > 10 ? 'border-amber-500' : 'border-slate-600 group-hover:border-amber-400'}`}></div>
						<div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r transition-colors ${metrics.waitingCount > 10 ? 'border-amber-500' : 'border-slate-600 group-hover:border-amber-400'}`}></div>

						<div className="flex flex-col h-full justify-between relative z-10">
							<div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">Queue</div>
							<div className={`text-4xl font-black font-mono drop-shadow-sm ${metrics.waitingCount > 10 ? 'text-amber-400' : 'text-slate-400'}`}>
								{metrics.waitingCount}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
