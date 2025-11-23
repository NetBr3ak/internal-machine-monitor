import { motion, AnimatePresence } from 'framer-motion';
import type { Machine, MachineMetrics } from '../types';
import { useSimulationStore } from '../store';

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
		border: 'border-amber-500/30',
		bg: 'bg-slate-800/60',
		glow: 'shadow-[0_0_15px_-3px_rgba(245,158,11,0.15)]',
		text: 'text-amber-400',
		label: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
	},
	breakdown: {
		border: 'border-red-500/30',
		bg: 'bg-red-950/20',
		glow: 'shadow-[0_0_15px_-3px_rgba(239,68,68,0.25)]',
		text: 'text-red-400',
		label: 'bg-red-500/30 text-red-200 border-red-500/50 animate-[pulse_0.8s_ease-in-out_infinite]'
	},
};

const priorityColors = {
	critical: 'border-l-red-500 bg-red-500/10',
	rush: 'border-l-amber-500 bg-amber-500/10',
	normal: 'border-l-emerald-500 bg-emerald-500/5',
};

export function MachineColumn({ machine, metrics }: MachineColumnProps) {
	const toggleMachineBreakdown = useSimulationStore(state => state.toggleMachineBreakdown);
	const icon = machineTypeIcons[machine.type];
	const style = statusStyles[machine.status];

	return (
		<motion.div
			className={`
				relative flex flex-col h-full overflow-hidden transition-all duration-300 group
				bg-slate-900/80 border border-slate-800 hover:border-slate-700
				${machine.status === 'breakdown' ? 'border-red-500/60 bg-red-950/20 animate-[pulse_1.5s_ease-in-out_infinite]' : ''}
			`}
		>
			{/* Cyberpunk Corners */}
			<div className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 transition-colors duration-300 ${machine.status === 'processing' ? 'border-emerald-500' : machine.status === 'breakdown' ? 'border-red-500' : 'border-slate-600'}`} />
			<div className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 transition-colors duration-300 ${machine.status === 'processing' ? 'border-emerald-500' : machine.status === 'breakdown' ? 'border-red-500' : 'border-slate-600'}`} />

			{/* Header */}
			<div className="p-4 border-b border-slate-800 bg-slate-950/50 relative overflow-hidden">
				{/* Status Scan Line */}
				{machine.status === 'processing' && (
					<div className="absolute top-0 left-0 w-full h-[1px] bg-emerald-500/50 animate-pulse shadow-[0_0_10px_#10b981]" />
				)}
				{machine.status === 'breakdown' && (
					<div className="absolute inset-0 bg-red-500/10 animate-[pulse_1s_ease-in-out_infinite] pointer-events-none" />
				)}

				<div className="flex items-center justify-between mb-4 relative z-10">
					<div className="flex items-center gap-3">
						<div className={`
							w-12 h-12 flex items-center justify-center text-2xl bg-slate-900 border border-slate-700
							${machine.status === 'processing' ? 'text-emerald-400 shadow-[0_0_15px_-5px_rgba(16,185,129,0.5)]' : ''}
							${machine.status === 'breakdown' ? 'text-red-500 border-red-900/50 shadow-[0_0_15px_-5px_rgba(239,68,68,0.5)]' : 'text-slate-500'}
						`}>
							{icon}
						</div>
						<div>
							<h2 className="font-black text-slate-100 text-lg leading-tight uppercase tracking-tight">{machine.name}</h2>
							<div className="text-xs text-cyan-500/70 font-mono mt-0.5 tracking-widest">{machine.id}</div>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<motion.div
							key={machine.status}
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest border ${style.label}`}
						>
							{machine.status === 'processing' ? 'BUSY' : machine.status === 'idle' ? 'IDLE' : machine.status === 'breakdown' ? 'FAILURE' : 'MAINT'}
						</motion.div>
						<button
							onClick={() => toggleMachineBreakdown(machine.id)}
							className={`
							w-8 h-8 flex items-center justify-center rounded border transition-all duration-200
							${machine.status === 'breakdown'
									? 'bg-red-500 text-white border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.8)] animate-[pulse_0.8s_ease-in-out_infinite]'
									: 'bg-slate-800 border-slate-700 text-slate-600 hover:text-red-400 hover:border-red-500/50 hover:bg-slate-800/80 animate-pulse-3'}
							`}
							title={machine.status === 'breakdown' ? "Repair Machine" : "Simulate Breakdown"}
						>
							<span className="text-sm">⚠️</span>
						</button>
					</div>
				</div>

				{/* Mini Stats */}
				<div className="grid grid-cols-3 gap-2 text-xs">
					<div className="bg-slate-900/50 p-2 text-center border border-slate-800">
						<div className="text-slate-500 mb-1 text-[9px] uppercase tracking-wider font-mono">Efficiency</div>
						<div className="font-bold font-mono text-slate-200">{Math.round(machine.effectiveTimeMultiplier * 100)}%</div>
					</div>
					<div className="bg-slate-900/50 p-2 text-center border border-slate-800">
						<div className="text-slate-500 mb-1 text-[9px] uppercase tracking-wider font-mono">Utilization</div>
						<div className={`font-bold font-mono ${metrics?.utilization && metrics.utilization > 80 ? 'text-emerald-400' : 'text-slate-200'}`}>
							{metrics?.utilization || 0}%
						</div>
					</div>
					<div className="bg-slate-900/50 p-2 text-center border border-slate-800">
						<div className="text-slate-500 mb-1 text-[9px] uppercase tracking-wider font-mono">Done</div>
						<div className="font-bold font-mono text-emerald-400">{machine.completedTasks}</div>
					</div>
				</div>
			</div>

			{/* Body */}
			<div className="flex-1 flex flex-col p-3 gap-3 overflow-hidden bg-slate-950/30 relative">
				{/* Grid Background for Body */}
				<div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.5)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20 pointer-events-none" />

				{/* Current Task */}
				<div className="flex-none h-20 relative z-10">
					<div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex justify-between items-center px-1">
						<span>Current Task</span>
						{machine.currentTask && (
							<span className="text-emerald-400 font-mono">{Math.round(machine.currentTask.progress * 100)}%</span>
						)}
					</div>

					<AnimatePresence mode="popLayout">
						{machine.currentTask ? (
							<motion.div
								key={machine.currentTask.id}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{
									type: "spring",
									stiffness: 300,
									damping: 30,
								}}
								className="bg-slate-900/80 border border-slate-700/50 h-full relative overflow-hidden group flex flex-col"
							>
								<div className="absolute left-0 top-0 bottom-0 w-0.5 bg-emerald-500 z-20" />

								{/* Content Container - Fades in to prevent layout thrashing during morph */}
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.2, delay: 0.1 }}
									className="flex-1 flex flex-col p-3 relative z-10"
								>
									<div className="flex justify-between items-start mb-2">
										<div className="font-bold text-slate-200 text-sm truncate pr-2 uppercase tracking-tight">
											{machine.currentTask.displayName}
										</div>
										<div className="text-[10px] text-emerald-400 font-mono whitespace-nowrap bg-emerald-950/30 px-1.5 py-0.5 border border-emerald-900/50">
											{Math.round(machine.currentTask.remainingMinutes)}m
										</div>
									</div>

									<div className="mt-auto">
										<div className="flex justify-between text-[9px] text-slate-500 mb-2 px-1 font-mono">
											<span>PROGRESS</span>
											<span>{Math.round(machine.currentTask.workloadMinutes)}m TOTAL</span>
										</div>
										<div className="h-2 bg-slate-950 w-full overflow-hidden relative border border-slate-800">
											<motion.div
												className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]"
												initial={{ width: 0 }}
												animate={{ width: `${machine.currentTask.progress * 100}%` }}
												transition={{ type: "tween", ease: "linear", duration: 0.5 }}
											/>
										</div>
									</div>
								</motion.div>
							</motion.div>
						) : (
							<motion.div
								key="empty"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="bg-slate-900/20 border border-slate-800 border-dashed text-center h-full flex flex-col items-center justify-center gap-2"
							>
								<span className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">System Standby</span>
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				{/* Queue */}
				<div className="flex-1 flex flex-col min-h-0 relative z-10">
					<div className="flex items-center justify-between mb-3 px-2">
						<span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
							Queue <span className="text-slate-300 font-mono">[{machine.queue.length}]</span>
						</span>
						{metrics?.eta && (
							<span className="text-[9px] text-cyan-500/80 font-mono">
								ETA: {metrics.eta}m
							</span>
						)}
					</div>

					<div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
						<AnimatePresence mode="popLayout">
							{machine.queue.length === 0 ? (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className="text-center py-6 text-[10px] text-slate-700 font-mono uppercase"
								>
									-- BUFFER EMPTY --
								</motion.div>
							) : (
								machine.queue.map((task) => (
									<motion.div
										key={task.id}
										initial={{ opacity: 0, x: -10 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: 10 }}
										transition={{
											duration: 0.2
										}}
										className={`
											bg-slate-900/60 border-l-2 ${priorityColors[task.priority]} 
											p-2.5 text-xs hover:bg-slate-800 transition-colors
											group relative border-y border-r border-slate-800/50
										`}
									>
										<motion.div
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											transition={{ duration: 0.2 }}
											className="flex justify-between items-center relative z-10"
										>
											<span className="font-medium text-slate-400 truncate flex-1 mr-2 group-hover:text-slate-200 transition-colors text-[11px] uppercase">
												{task.displayName}
											</span>
											<span className="text-slate-600 font-mono text-[10px]">
												{Math.round(task.workloadMinutes * machine.effectiveTimeMultiplier)}m
											</span>
										</motion.div>
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

