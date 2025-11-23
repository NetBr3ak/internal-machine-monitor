import { motion, AnimatePresence } from 'framer-motion';
import type { TaskInstance } from '../types';

interface TaskPoolPanelProps {
	tasks: TaskInstance[];
}

const priorityColors = {
	critical: 'border-l-red-500 bg-red-500/5 hover:bg-red-500/10',
	rush: 'border-l-amber-500 bg-amber-500/5 hover:bg-amber-500/10',
	normal: 'border-l-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10',
};

const priorityBadges = {
	critical: 'text-red-400 bg-red-500/10 border-red-500/20 shadow-[0_0_10px_-3px_rgba(239,68,68,0.2)]',
	rush: 'text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-[0_0_10px_-3px_rgba(245,158,11,0.2)]',
	normal: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_10px_-3px_rgba(16,185,129,0.2)]',
};

export function TaskPoolPanel({ tasks }: TaskPoolPanelProps) {
	return (
		<div className="bg-slate-950 border border-slate-800 flex flex-col h-full overflow-hidden shadow-2xl relative">
			{/* Cyberpunk Grid Background */}
			<div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.9)_2px,transparent_2px),linear-gradient(90deg,rgba(15,23,42,0.9)_2px,transparent_2px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />

			{/* Header */}
			<div className="p-5 border-b border-slate-800 bg-slate-900/80 flex-none relative z-10">
				<div className="flex items-center justify-between mb-2">
					<h2 className="text-lg font-black text-slate-100 flex items-center gap-3 uppercase tracking-tight">
						<span className="text-2xl text-cyan-500">📋</span> Task Pool
					</h2>
					<span className="px-3 py-1 bg-slate-900 text-xs font-mono text-cyan-400 border border-slate-700 shadow-inner">
						{tasks.length}
					</span>
				</div>
				<p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium pl-1">Awaiting Assignment</p>
			</div>

			{/* List */}
			<div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar relative z-10">
				<AnimatePresence mode="popLayout">
					{tasks.length === 0 ? (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="flex flex-col items-center justify-center h-full text-slate-600 absolute inset-0"
						>
							<div className="w-16 h-16 border border-slate-800 flex items-center justify-center mb-4 bg-slate-900/50 rounded-full">
								<span className="text-3xl text-emerald-500/50">✓</span>
							</div>
							<span className="text-xs font-mono uppercase tracking-widest">System Clean</span>
						</motion.div>
					) : (
						tasks.map((task) => (
							<motion.div
								key={task.id}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: 20 }}
								transition={{
									duration: 0.2
								}}
								className={`
									group relative border-l-[3px] ${priorityColors[task.priority]} 
									p-4 transition-all duration-200 
									bg-slate-900/40 hover:bg-slate-800/60
									border-y border-r border-slate-800/50 hover:border-slate-700 
									cursor-default shadow-sm hover:shadow-md
								`}
							>
								{/* Corner Accents */}
								<div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-slate-700 group-hover:border-slate-500 transition-colors" />
								<div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-slate-700 group-hover:border-slate-500 transition-colors" />

								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.2 }}
								>
									<div className="flex justify-between items-start mb-3">
										<h3 className="font-bold text-slate-200 text-sm leading-tight pr-2 group-hover:text-white transition-colors uppercase tracking-tight">
											{task.displayName}
										</h3>
										<span className={`text-[10px] font-bold px-2 py-0.5 border uppercase tracking-wider ${priorityBadges[task.priority]}`}>
											{task.priority}
										</span>
									</div>

									<div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mb-3">
										<span className="bg-slate-950/30 px-1.5 py-0.5 rounded text-slate-600">{task.id}</span>
										<span className="flex items-center gap-1.5 text-slate-400 bg-slate-950/50 px-2 py-1 border border-slate-800">
											EST: {Math.round(task.workloadMinutes)}m
										</span>
									</div>

									<div className="pt-3 border-t border-slate-800/50 flex flex-wrap gap-1.5">
										{task.preferredMachines.map(m => (
											<span key={m} className="text-[10px] px-2 py-0.5 bg-slate-950 text-slate-500 border border-slate-800 group-hover:border-slate-700 transition-colors font-mono">
												{m}
											</span>
										))}
									</div>
								</motion.div>
							</motion.div>
						))
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}
