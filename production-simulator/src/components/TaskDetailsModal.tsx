import { motion } from 'framer-motion';
import { X, Calendar, DollarSign, User, ArrowRight, Factory, Trash2, Clock } from 'lucide-react';
import { useSystemStore } from '../store';
import { PRIORITY_STYLES } from '../config';
import type { TaskInstance } from '../types';

export const TaskDetailsModal = ({ task, onClose }: { task: TaskInstance; onClose: () => void }) => {
	const machines = useSystemStore(state => state.machines);
	const autoAllocationEnabled = useSystemStore(state => state.autoAllocationEnabled);
	const manualAssignTask = useSystemStore(state => state.manualAssignTask);
	const cancelTask = useSystemStore(state => state.cancelTask);

	const compatibleMachines = machines.filter(m =>
		(task.preferredMachines.length === 0 || task.preferredMachines.includes(m.id)) &&
		m.status !== 'breakdown'
	);

	const handleAssign = (machineId: string) => {
		manualAssignTask(task.id, machineId);
		onClose();
	};

	const handleCancel = () => {
		cancelTask(task.id);
		onClose();
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85" onClick={onClose}>
			<motion.div
				initial={{ opacity: 0, scale: 0.95, y: 20 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				exit={{ opacity: 0, scale: 0.95, y: 20 }}
				onClick={(e) => e.stopPropagation()}
				className="bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl w-full max-w-md overflow-hidden relative hud-panel glow-cyan"
			>
				{/* Modal Header Background */}
				<div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-info)] to-[var(--color-accent)] opacity-60" />

				<div className="p-6 border-b border-[var(--color-border-dim)] flex justify-between items-start bg-white/[0.03]">
					<div>
						<div className="flex items-center gap-3 mb-2">
							<span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider border ${PRIORITY_STYLES[task.priority].badge} bg-opacity-10 border-opacity-20`}>
								{task.priority}
							</span>
							<span className="text-[var(--color-text-muted)] text-sm font-mono">{task.id}</span>
						</div>
						<h3 className="text-xl font-bold text-[var(--color-text-primary)] leading-tight tracking-tight">{task.displayName}</h3>
					</div>
					<button onClick={onClose} className="p-2 hover:bg-white/10 text-[var(--color-text-muted)] hover:text-white transition-colors">
						<X size={22} />
					</button>
				</div>

				<div className="p-6 space-y-6 relative">
					{/* Grid Background */}
					<div className="absolute inset-0 hud-grid pointer-events-none opacity-30" />

					{/* Client Info */}
					<div className="grid grid-cols-2 gap-4 relative z-10">
						<div className="bg-[var(--color-abyss)] p-4 border border-[var(--color-border-dim)] hover:border-[var(--color-border)] transition-colors">
							<div className="flex items-center gap-2 text-[var(--color-text-muted)] mb-1.5 text-xs font-bold uppercase tracking-wider">
								<User size={14} /> Client
							</div>
							<div className="text-[var(--color-text-secondary)] font-semibold truncate text-sm" title={task.clientName || 'Unknown'}>
								{task.clientName || 'Unknown Corp'}
							</div>
						</div>
						<div className="bg-[var(--color-abyss)] p-4 border border-[var(--color-border-dim)] hover:border-[var(--color-border)] transition-colors">
							<div className="flex items-center gap-2 text-[var(--color-text-muted)] mb-1.5 text-xs font-bold uppercase tracking-wider">
								<DollarSign size={14} /> Value
							</div>
							<div className="text-[var(--color-success)] font-mono font-bold text-base">
								${(task.orderValue || 0).toLocaleString()}
							</div>
						</div>
						<div className="bg-[var(--color-abyss)] p-4 border border-[var(--color-border-dim)] hover:border-[var(--color-border)] transition-colors">
							<div className="flex items-center gap-2 text-[var(--color-text-muted)] mb-1.5 text-xs font-bold uppercase tracking-wider">
								<Calendar size={14} /> Order Date
							</div>
							<div className="text-[var(--color-text-secondary)] text-sm font-mono">
								{task.orderDate ? new Date(task.orderDate).toLocaleDateString() : 'N/A'}
							</div>
						</div>
						<div className="bg-[var(--color-abyss)] p-4 border border-[var(--color-border-dim)] hover:border-[var(--color-border)] transition-colors">
							<div className="flex items-center gap-2 text-[var(--color-text-muted)] mb-1.5 text-xs font-bold uppercase tracking-wider">
								<Clock size={14} /> Workload
							</div>
							<div className="text-[var(--color-text-secondary)] text-sm font-mono">
								{task.workloadMinutes} mins
							</div>
						</div>
					</div>

					{/* Actions */}
					<div className="space-y-4 relative z-10">
						{/* Only show assignment options if task is waiting (not assigned/in_progress) */}
						{task.status === 'waiting' && !autoAllocationEnabled && (
							<>
								<h4 className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider flex items-center gap-2">
									<Factory size={16} /> Assign to Machine
								</h4>
								<div className="max-h-48 overflow-y-auto custom-scrollbar space-y-2 pr-1">
									{compatibleMachines.map(machine => (
										<button
											key={machine.id}
											onClick={() => handleAssign(machine.id)}
											className="w-full flex items-center justify-between p-4 bg-[var(--color-elevated)] hover:bg-[var(--color-subtle)] border border-[var(--color-border-dim)] hover:border-[var(--color-accent)]/40 transition-all group text-left"
										>
											<div>
												<div className="text-sm font-bold text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent)] transition-colors">
													{machine.name}
												</div>
												<div className="text-xs text-[var(--color-text-muted)] flex items-center gap-2 uppercase tracking-wider mt-1">
													<span className={machine.queue.length === 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-warning)]'}>
														Queue: {machine.queue.length}
													</span>
													<span>•</span>
													<span>{machine.type}</span>
												</div>
											</div>
											<ArrowRight size={18} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors transform group-hover:translate-x-1" />
										</button>
									))}
									{compatibleMachines.length === 0 && (
										<div className="text-center py-4 text-[var(--color-text-muted)] text-sm italic border border-dashed border-[var(--color-border)]">
											No compatible machines available
										</div>
									)}
								</div>
							</>
						)}

						{task.status === 'waiting' && autoAllocationEnabled && (
							<div className="p-4 bg-[var(--color-accent-dim)] border border-[var(--color-accent)]/30 text-[var(--color-accent)] text-sm text-center relative z-10">
								<span className="font-bold uppercase tracking-wider block mb-1">Auto-Allocation Active</span>
								Disable it in settings to manually assign tasks.
							</div>
						)}

						<div className="pt-4 border-t border-[var(--color-border-dim)]">
							<button
								onClick={handleCancel}
								className="w-full flex items-center justify-center gap-3 p-4 bg-[var(--color-danger)]/10 hover:bg-[var(--color-danger)]/20 text-[var(--color-danger)] border border-[var(--color-danger)]/30 hover:border-[var(--color-danger)]/50 transition-all font-bold text-sm uppercase tracking-wider"
							>
								<Trash2 size={16} />
								Cancel Order
							</button>
						</div>
					</div>
				</div>
			</motion.div>
		</div>
	);
};
