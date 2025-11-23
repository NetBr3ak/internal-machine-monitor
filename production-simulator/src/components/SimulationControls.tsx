import React from 'react';
import { Play, Pause, RotateCcw, Power, Settings2 } from 'lucide-react';
import { useSystemStore } from '../store';

interface SimulationControlsProps {
	isRunning: boolean;
	onStart: () => void;
	onPause: () => void;
	onReset: () => void;
}

export const SimulationControls = React.memo(function SimulationControls({ isRunning, onStart, onPause, onReset }: SimulationControlsProps) {
	const autoAllocationEnabled = useSystemStore(state => state.autoAllocationEnabled);
	const taskGenerationEnabled = useSystemStore(state => state.taskGenerationEnabled);
	const toggleAutoAllocation = useSystemStore(state => state.toggleAutoAllocation);
	const toggleTaskGeneration = useSystemStore(state => state.toggleTaskGeneration);

	// Keyboard shortcuts
	React.useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			if (e.code === 'Space') {
				e.preventDefault();
				if (isRunning) {
					onPause();
				} else {
					onStart();
				}
			} else if (e.code === 'KeyR' && e.ctrlKey) {
				e.preventDefault();
				onReset();
			}
		};

		window.addEventListener('keydown', handleKeyPress);
		return () => window.removeEventListener('keydown', handleKeyPress);
	}, [isRunning, onStart, onPause, onReset]);

	return (
		<div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
			{/* Toggles Section */}
			<div className="flex items-center gap-3 mr-4 border-r border-[var(--color-border-dim)] pr-6">
				<button
					onClick={toggleTaskGeneration}
					className={`
						relative group flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-300
						border
						${taskGenerationEnabled
							? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] border-[var(--color-accent)]/30 shadow-[0_0_20px_rgba(0,212,255,0.15)]'
							: 'bg-[var(--color-subtle)] text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-[var(--color-border-bright)] hover:text-[var(--color-text-secondary)]'}
					`}
					title="Toggle new task generation"
				>
					<div className={`absolute inset-0 bg-[var(--color-accent)]/20 blur-xl transition-opacity duration-300 ${taskGenerationEnabled ? 'opacity-50' : 'opacity-0'}`} />
					<Power size={15} className={`relative z-10 ${taskGenerationEnabled ? 'drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]' : ''}`} />
					<span className="hidden xl:inline relative z-10">New Orders</span>
					{taskGenerationEnabled && <div className="absolute right-2 top-2 w-1.5 h-1.5 bg-[var(--color-accent)] shadow-[0_0_6px_var(--color-accent)]" />}
				</button>

				<button
					onClick={toggleAutoAllocation}
					className={`
						relative group flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-300
						border
						${autoAllocationEnabled
							? 'bg-[var(--color-info)]/10 text-[var(--color-info)] border-[var(--color-info)]/30 shadow-[0_0_20px_rgba(123,97,255,0.15)]'
							: 'bg-[var(--color-subtle)] text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-[var(--color-border-bright)] hover:text-[var(--color-text-secondary)]'}
					`}
					title="Toggle automatic task allocation"
				>
					<div className={`absolute inset-0 bg-[var(--color-info)]/20 blur-xl transition-opacity duration-300 ${autoAllocationEnabled ? 'opacity-50' : 'opacity-0'}`} />
					<Settings2 size={15} className={`relative z-10 ${autoAllocationEnabled ? 'drop-shadow-[0_0_8px_rgba(123,97,255,0.8)]' : ''}`} />
					<span className="hidden xl:inline relative z-10">Auto Assign</span>
					{autoAllocationEnabled && <div className="absolute right-2 top-2 w-1.5 h-1.5 bg-[var(--color-info)] shadow-[0_0_6px_var(--color-info)]" />}
				</button>
			</div>

			{/* Main Controls */}
			<div className="flex items-center gap-3">
				<button
					onClick={isRunning ? onPause : onStart}
					className={`
						relative group overflow-hidden px-6 py-2.5 
						transition-all duration-300 flex items-center gap-3
						font-bold text-xs tracking-widest uppercase border
						${isRunning
							? 'bg-[var(--color-warning)]/10 text-[var(--color-warning)] border-[var(--color-warning)]/30 hover:bg-[var(--color-warning)]/20 hover:border-[var(--color-warning)]/50 hover:shadow-[0_0_25px_rgba(255,170,0,0.2)]'
							: 'bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/30 hover:bg-[var(--color-success)]/20 hover:border-[var(--color-success)]/50 hover:shadow-[0_0_25px_rgba(0,255,136,0.2)]'
						}
					`}
				>
					<div className={`absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100 ${isRunning ? 'bg-[var(--color-warning)]/10' : 'bg-[var(--color-success)]/10'}`} />

					{isRunning ? (
						<Pause size={16} className="relative z-10" fill="currentColor" />
					) : (
						<Play size={16} className="relative z-10" fill="currentColor" />
					)}
					<span className="hidden xs:inline relative z-10">
						{isRunning ? 'Pause System' : 'Start System'}
					</span>
				</button>

				<button
					onClick={onReset}
					className="
						relative group px-4 py-2.5 
						bg-[var(--color-subtle)] border border-[var(--color-border)] 
						text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-elevated)] hover:border-[var(--color-border-bright)]
						transition-all duration-300 flex items-center gap-2
					"
				>
					<RotateCcw size={16} className="group-hover:-rotate-180 transition-transform duration-500" />
					<span className="hidden sm:inline font-bold text-xs tracking-widest uppercase">
						Reset
					</span>
				</button>
			</div>

			{/* Divider */}
			<div className="hidden lg:block h-8 w-px bg-[var(--color-border-dim)] mx-2" />

			{/* Shortcuts Hint - Desktop only */}
			<div className="hidden lg:flex items-center gap-4 text-[10px] text-[var(--color-text-muted)] font-mono">
				<div className="flex items-center gap-2 group cursor-help" title="Press Space to Toggle">
					<div className="px-2 py-1 bg-[var(--color-subtle)] border border-[var(--color-border)] text-[var(--color-text-muted)] font-bold group-hover:text-[var(--color-text-primary)] group-hover:border-[var(--color-border-bright)] transition-colors">SPACE</div>
					<span className="uppercase tracking-wider opacity-60">Toggle</span>
				</div>
				<div className="flex items-center gap-2 group cursor-help" title="Press Ctrl+R to Reset">
					<div className="px-2 py-1 bg-[var(--color-subtle)] border border-[var(--color-border)] text-[var(--color-text-muted)] font-bold group-hover:text-[var(--color-text-primary)] group-hover:border-[var(--color-border-bright)] transition-colors">CTRL+R</div>
					<span className="uppercase tracking-wider opacity-60">Reset</span>
				</div>
			</div>
		</div>
	);
});
