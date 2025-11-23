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
		<div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 flex flex-col h-full overflow-hidden shadow-xl relative">
			{/* Header */}
			<div className="p-4 border-b border-slate-800 bg-slate-900/50 flex-none">
				<div className="flex items-center justify-between mb-1">
					<h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
						<span className="text-xl">📋</span> Pula Zleceń
					</h2>
					<span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-xs font-mono text-slate-400 border border-slate-700 shadow-inner">
						{tasks.length}
					</span>
				</div>
				<p className="text-xs text-slate-500">Oczekujące na przypisanie</p>
			</div>

			{/* List */}
			<div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar relative">
				<AnimatePresence mode="popLayout">
					{tasks.length === 0 ? (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="flex flex-col items-center justify-center h-full text-slate-500 absolute inset-0"
						>
							<div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center mb-3 border border-slate-700/50">
								<span className="text-2xl">✓</span>
							</div>
							<span className="text-sm font-medium">Wszystkie zlecenia przypisane</span>
						</motion.div>
					) : (
						tasks.map((task) => (
							<motion.div
								key={task.id}
								layout
								initial={{ opacity: 0, x: -20, scale: 0.95 }}
								animate={{ opacity: 1, x: 0, scale: 1 }}
								exit={{ opacity: 0, x: 20, scale: 0.95, transition: { duration: 0.2 } }}
								transition={{
									type: "spring",
									stiffness: 500,
									damping: 30
								}}
								className={`
									group relative border-l-[3px] ${priorityColors[task.priority]} 
									rounded-r-lg p-3 transition-all duration-200 
									border-y border-r border-slate-800/50 hover:border-slate-700 
									hover:shadow-lg hover:translate-x-0.5 cursor-default
								`}
								style={{ zIndex: task.priority === 'critical' ? 20 : 10 }}
							>
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.2 }}
								>
									<div className="flex justify-between items-start mb-2">
										<h3 className="font-medium text-slate-200 text-sm leading-tight pr-2 group-hover:text-white transition-colors">
											{task.displayName}
										</h3>
										<span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${priorityBadges[task.priority]}`}>
											{task.priority}
										</span>
									</div>

									<div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-2">
										<span>{task.id}</span>
										<span className="flex items-center gap-1 text-slate-400 bg-slate-950/30 px-1.5 py-0.5 rounded">
											⏱️ {Math.round(task.workloadMinutes)}m
										</span>
									</div>

									<div className="pt-2 border-t border-slate-800/50 flex flex-wrap gap-1.5">
										{task.preferredMachines.map(m => (
											<span key={m} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/50 group-hover:border-slate-600 transition-colors">
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
