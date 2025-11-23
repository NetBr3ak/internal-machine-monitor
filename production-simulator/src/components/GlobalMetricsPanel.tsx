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
		<div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-4 shadow-xl">
			<div className="flex items-center justify-between gap-6">
				{/* Header Section */}
				<div className="flex items-center gap-4 min-w-max">
					<div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
						<span className="text-2xl">🏭</span>
					</div>
					<div>
						<h1 className="text-xl font-bold text-slate-100 tracking-tight">
							Monitor Produkcji
						</h1>
						<div className="flex items-center gap-3 text-sm font-mono mt-1">
							<span className="text-slate-400 bg-slate-800/50 px-2 py-0.5 rounded border border-slate-700/50">
								⏱️ {formatTime(simulationTime)}
							</span>
							<div className={`flex items-center gap-1.5 px-2 py-0.5 rounded border ${isRunning
									? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
									: 'bg-slate-700/30 border-slate-600/30 text-slate-400'
								}`}>
								<span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
								<span className="font-bold text-xs tracking-wide uppercase">
									{isRunning ? 'LIVE' : 'PAUSED'}
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Metrics Grid */}
				<div className="flex-1 grid grid-cols-5 gap-3">
					{/* Hall Load */}
					<div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/50 flex flex-col justify-between group hover:bg-slate-800/60 transition-all duration-300">
						<div className="flex justify-between items-start">
							<div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Obciążenie</div>
							<div className="text-xs opacity-50">📊</div>
						</div>
						<div className={`text-2xl font-bold ${hallLoadColor} tabular-nums mt-1`}>
							{metrics.hallLoad}<span className="text-sm opacity-60">%</span>
						</div>
						<div className="w-full bg-slate-700/30 h-1 rounded-full mt-2 overflow-hidden">
							<div
								className={`h-full transition-all duration-500 ${metrics.hallLoad > 80 ? 'bg-red-500' : metrics.hallLoad > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
								style={{ width: `${metrics.hallLoad}%` }}
							/>
						</div>
					</div>

					{/* ETA */}
					<div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/50 flex flex-col justify-between group hover:bg-slate-800/60 transition-all duration-300">
						<div className="flex justify-between items-start">
							<div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">ETA</div>
							<div className="text-xs opacity-50">⏱️</div>
						</div>
						<div className="text-2xl font-bold text-cyan-400 tabular-nums mt-1">
							{metrics.estimatedCompletionTime > 0 ? metrics.estimatedCompletionTime : '—'}<span className="text-sm text-slate-500 font-normal ml-0.5">min</span>
						</div>
					</div>

					{/* Completed */}
					<div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/50 flex flex-col justify-between group hover:bg-slate-800/60 transition-all duration-300">
						<div className="flex justify-between items-start">
							<div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Wykonane</div>
							<div className="text-xs opacity-50">✅</div>
						</div>
						<div className="text-2xl font-bold text-emerald-400 tabular-nums mt-1">
							{metrics.completedCount}
						</div>
					</div>

					{/* In Progress */}
					<div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/50 flex flex-col justify-between group hover:bg-slate-800/60 transition-all duration-300">
						<div className="flex justify-between items-start">
							<div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">W toku</div>
							<div className="text-xs opacity-50">⚡</div>
						</div>
						<div className="text-2xl font-bold text-blue-400 tabular-nums mt-1">
							{metrics.inProgressCount}
						</div>
					</div>

					{/* Waiting */}
					<div className={`bg-slate-800/40 rounded-xl p-3 border flex flex-col justify-between transition-all duration-300 ${metrics.waitingCount > 10 ? 'border-amber-500/30 bg-amber-500/5' : 'border-slate-700/50 hover:bg-slate-800/60'}`}>
						<div className="flex justify-between items-start">
							<div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Kolejka</div>
							<div className="text-xs opacity-50">⏳</div>
						</div>
						<div className={`text-2xl font-bold tabular-nums mt-1 ${metrics.waitingCount > 10 ? 'text-amber-400' : 'text-slate-300'}`}>
							{metrics.waitingCount}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
