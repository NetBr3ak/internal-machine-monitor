import { motion, AnimatePresence } from 'framer-motion';
import type { Machine, MachineMetrics } from '../types';

interface MachineColumnProps {
	machine: Machine;
	metrics: MachineMetrics | null;
}

const machineTypeIcons = {
	CNC: '⚙️',
	Assembly: '🔧',
	Test: '🔬',
	Packaging: '📦',
};

const statusStyles = {
	idle: {
		border: 'border-slate-700/50',
		bg: 'bg-slate-800/40',
		glow: '',
		text: 'text-slate-400',
		label: 'bg-slate-700/50 text-slate-300'
	},
	processing: {
		border: 'border-emerald-500/30',
		bg: 'bg-slate-800/60',
		glow: 'shadow-[0_0_15px_-3px_rgba(16,185,129,0.15)]',
		text: 'text-emerald-400',
		label: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
	},
	maintenance: {
		border: 'border-red-500/30',
		bg: 'bg-slate-800/60',
		glow: 'shadow-[0_0_15px_-3px_rgba(239,68,68,0.15)]',
		text: 'text-red-400',
		label: 'bg-red-500/20 text-red-300 border-red-500/30'
	},
};

const priorityColors = {
	critical: 'border-l-red-500 bg-red-500/10',
	rush: 'border-l-amber-500 bg-amber-500/10',
	normal: 'border-l-emerald-500 bg-emerald-500/5',
};

export function MachineColumn({ machine, metrics }: MachineColumnProps) {
	const icon = machineTypeIcons[machine.type];
	const style = statusStyles[machine.status];

	return (
		<motion.div
			layout
			className={`
				relative rounded-xl border flex flex-col h-full overflow-hidden transition-all duration-300
				${style.bg} ${style.border} ${style.glow}
			`}
		>
			{/* Header */}
			<div className="p-4 border-b border-slate-700/50 bg-slate-900/30">
				<div className="flex items-center justify-between mb-3">
					<div className="flex items-center gap-3">
						<div className={`
							w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-slate-800 border border-slate-700
							${machine.status === 'processing' ? 'animate-pulse border-emerald-500/30' : ''}
						`}>
							{icon}
						</div>
						<div>
							<h2 className="font-bold text-slate-100 leading-tight">{machine.name}</h2>
							<div className="text-xs text-slate-500 font-mono mt-0.5">{machine.id}</div>
						</div>
					</div>
					<motion.div
						key={machine.status}
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${style.label}`}
					>
						{machine.status === 'processing' ? 'PRACA' : machine.status === 'idle' ? 'CZEKA' : 'AWARIA'}
					</motion.div>
				</div>

				{/* Mini Stats */}
				<div className="grid grid-cols-3 gap-2 text-xs">
					<div className="bg-slate-950/30 rounded p-2 text-center border border-slate-800">
						<div className="text-slate-500 mb-0.5 text-[10px] uppercase tracking-wider">Eff</div>
						<div className="font-bold text-slate-200">{Math.round(machine.effectiveTimeMultiplier * 100)}%</div>
					</div>
					<div className="bg-slate-950/30 rounded p-2 text-center border border-slate-800">
						<div className="text-slate-500 mb-0.5 text-[10px] uppercase tracking-wider">Utyl</div>
						<div className={`font-bold ${metrics?.utilization && metrics.utilization > 80 ? 'text-emerald-400' : 'text-slate-200'}`}>
							{metrics?.utilization || 0}%
						</div>
					</div>
					<div className="bg-slate-950/30 rounded p-2 text-center border border-slate-800">
						<div className="text-slate-500 mb-0.5 text-[10px] uppercase tracking-wider">Fin</div>
						<div className="font-bold text-emerald-400">{machine.completedTasks}</div>
					</div>
				</div>
			</div>

			{/* Body */}
			<div className="flex-1 flex flex-col p-3 gap-3 overflow-hidden bg-slate-950/20">
				{/* Current Task */}
				<div className="flex-none h-28">
					<div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex justify-between items-center">
						<span>Aktualne zadanie</span>
						{machine.currentTask && (
							<span className="text-emerald-400 font-mono">{Math.round(machine.currentTask.progress * 100)}%</span>
						)}
					</div>

					<AnimatePresence mode="wait">
						{machine.currentTask ? (
							<motion.div
								key={machine.currentTask.id}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								className="bg-slate-800/80 rounded-lg p-3 border border-slate-700/50 shadow-sm h-full flex flex-col relative overflow-hidden group"
							>
								{/* Glow effect behind task */}
								<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0 opacity-50" />

								<div className="flex justify-between items-start mb-2 z-10">
									<div className="font-medium text-slate-200 text-sm truncate pr-2">
										{machine.currentTask.displayName}
									</div>
									<div className="text-xs text-slate-500 font-mono whitespace-nowrap bg-slate-950/50 px-1.5 py-0.5 rounded">
										{Math.round(machine.currentTask.remainingMinutes)}m
									</div>
								</div>

								<div className="mt-auto z-10">
									<div className="flex justify-between text-[10px] text-slate-500 mb-1">
										<span>Postęp</span>
										<span>{Math.round(machine.currentTask.workloadMinutes)}m total</span>
									</div>
									<div className="h-2 bg-slate-950 rounded-full overflow-hidden relative">
										<motion.div
											className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"
											initial={{ width: 0 }}
											animate={{ width: `${machine.currentTask.progress * 100}%` }}
											transition={{ type: "tween", ease: "linear", duration: 0.5 }}
										/>
									</div>
								</div>
							</motion.div>
						) : (
							<motion.div
								key="empty"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="bg-slate-800/20 rounded-lg border-2 border-dashed border-slate-800 text-center h-full flex flex-col items-center justify-center gap-2 group hover:border-slate-700 transition-colors"
							>
								<div className="w-8 h-8 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-600 group-hover:text-slate-500 transition-colors">
									<span className="text-lg">💤</span>
								</div>
								<span className="text-xs text-slate-600 font-medium">Oczekiwanie na zadania</span>
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				{/* Queue */}
				<div className="flex-1 flex flex-col min-h-0">
					<div className="flex items-center justify-between mb-2">
						<span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
							Kolejka <span className="bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded text-[10px]">{machine.queue.length}</span>
						</span>
						{metrics?.eta && (
							<span className="text-[10px] text-cyan-500/80 font-mono bg-cyan-950/30 px-1.5 py-0.5 rounded border border-cyan-900/50">
								ETA: {metrics.eta}m
							</span>
						)}
					</div>

					<div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar relative">
						<AnimatePresence mode="popLayout">
							{machine.queue.length === 0 ? (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className="text-center py-8 text-xs text-slate-700 absolute inset-0 flex flex-col items-center justify-center"
								>
									<span>Brak zadań w kolejce</span>
								</motion.div>
							) : (
								machine.queue.map((task, i) => (
									<motion.div
										layout
										key={task.id}
										initial={{ opacity: 0, x: -20, scale: 0.9 }}
										animate={{ opacity: 1, x: 0, scale: 1 }}
										exit={{ opacity: 0, scale: 0.9 }}
										transition={{
											type: "spring",
											stiffness: 500,
											damping: 30
										}}
										className={`
											bg-slate-800/40 border-l-[3px] ${priorityColors[task.priority]} 
											rounded-r-md p-2.5 text-xs hover:bg-slate-800/60 transition-colors
											group relative overflow-hidden
										`}
									>
										<div className="flex justify-between items-center mb-1 relative z-10">
											<span className="font-medium text-slate-300 truncate flex-1 mr-2 group-hover:text-slate-200 transition-colors">
												{task.displayName}
											</span>
											<span className="text-slate-500 font-mono bg-slate-950/30 px-1 rounded">
												{Math.round(task.workloadMinutes * machine.effectiveTimeMultiplier)}m
											</span>
										</div>
										<div className="flex justify-between items-center text-slate-600 relative z-10">
											<span className="font-mono text-[10px]">#{i + 1}</span>
											{task.priority !== 'normal' && (
												<span className={`uppercase text-[9px] font-bold tracking-wider ${task.priority === 'critical' ? 'text-red-400' : 'text-amber-400'}`}>
													{task.priority}
												</span>
											)}
										</div>
									</motion.div>
								))
							)}
						</AnimatePresence>
					</div>
				</div>
			</div>
		</motion.div>
	);
}

