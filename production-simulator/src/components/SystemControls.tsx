import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Power, Settings2, ChevronDown, Cpu, Wrench, Microscope } from 'lucide-react';
import { useSystemStore } from '../store';
import type { MachineTypeFilters } from '../types';

interface SystemControlsProps {
	isRunning: boolean;
	onStart: () => void;
	onPause: () => void;
	onReset: () => void;
}

const MachineTypeIcon = ({ type }: { type: keyof MachineTypeFilters }) => {
	switch (type) {
		case 'CNC': return <Cpu size={14} />;
		case 'Assembly': return <Wrench size={14} />;
		case 'Test': return <Microscope size={14} />;
	}
};

export const SystemControls = function SystemControls({ isRunning, onStart, onPause, onReset }: SystemControlsProps) {
	const [showOrdersMenu, setShowOrdersMenu] = useState(false);
	const [showAssignMenu, setShowAssignMenu] = useState(false);

	const autoAllocationEnabled = useSystemStore(state => state.autoAllocationEnabled);
	const taskGenerationEnabled = useSystemStore(state => state.taskGenerationEnabled);
	const autoAllocationFilters = useSystemStore(state => state.autoAllocationFilters);
	const taskGenerationFilters = useSystemStore(state => state.taskGenerationFilters);
	const toggleAutoAllocation = useSystemStore(state => state.toggleAutoAllocation);
	const toggleTaskGeneration = useSystemStore(state => state.toggleTaskGeneration);
	const toggleAutoAllocationFilter = useSystemStore(state => state.toggleAutoAllocationFilter);
	const toggleTaskGenerationFilter = useSystemStore(state => state.toggleTaskGenerationFilter);

	// Count enabled filters
	const ordersEnabledCount = Object.values(taskGenerationFilters).filter(Boolean).length;
	const assignEnabledCount = Object.values(autoAllocationFilters).filter(Boolean).length;

	// Keyboard shortcuts
	useEffect(() => {
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
		<div className="flex items-center gap-4 sm:gap-5 lg:gap-8">
			{/* Toggles with Dropdowns */}
			<div className="flex items-center gap-3 mr-4 border-r border-[var(--color-border)] pr-6">
				{/* New Orders Toggle with Dropdown */}
				<div className="relative">
					<div className="flex">
						<button
							onClick={toggleTaskGeneration}
							className={`
								flex items-center gap-2 px-4 py-3 text-sm font-bold uppercase tracking-wider transition-all
								${taskGenerationEnabled
									? 'bg-[var(--color-info)]/15 text-[var(--color-info)] ring-1 ring-[var(--color-info)]/40 hover:bg-[var(--color-info)]/25'
									: 'bg-[var(--color-elevated)] text-[var(--color-text-muted)] ring-1 ring-[var(--color-border)] hover:text-[var(--color-text-secondary)]'}
							`}
							title="Toggle new task generation"
						>
							<Power size={16} />
							<span className="hidden xl:inline">Orders</span>
							{taskGenerationEnabled && ordersEnabledCount < 3 && (
								<span className="text-xs opacity-70">{ordersEnabledCount}/3</span>
							)}
						</button>
						<button
							onClick={() => { setShowOrdersMenu(!showOrdersMenu); setShowAssignMenu(false); }}
							className={`
								px-2 py-3 text-sm transition-all border-l border-black/20
								${taskGenerationEnabled
									? 'bg-[var(--color-info)]/15 text-[var(--color-info)] ring-1 ring-[var(--color-info)]/40 hover:bg-[var(--color-info)]/25'
									: 'bg-[var(--color-elevated)] text-[var(--color-text-muted)] ring-1 ring-[var(--color-border)] hover:text-[var(--color-text-secondary)]'}
							`}
						>
							<ChevronDown size={14} className={`transition-transform ${showOrdersMenu ? 'rotate-180' : ''}`} />
						</button>
					</div>
					{showOrdersMenu && (
						<div className="absolute bottom-full mb-2 left-0 bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xl z-50 min-w-[160px] overflow-hidden">
							<div className="text-xs text-[var(--color-text-muted)] px-4 py-2 border-b border-[var(--color-border-dim)] font-bold uppercase tracking-wider">Machine Types</div>
							{(['CNC', 'Assembly', 'Test'] as const).map(type => (
								<button
									key={type}
									onClick={() => toggleTaskGenerationFilter(type)}
									className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-[var(--color-elevated)] ${taskGenerationFilters[type] ? 'text-[var(--color-info)]' : 'text-[var(--color-text-muted)]'}`}
								>
									<div className={`w-4 h-4 border flex items-center justify-center ${taskGenerationFilters[type] ? 'bg-[var(--color-info)] border-[var(--color-info)]' : 'border-[var(--color-border)]'}`}>
										{taskGenerationFilters[type] && <span className="text-white text-xs">✓</span>}
									</div>
									<MachineTypeIcon type={type} />
									<span className="font-medium">{type}</span>
								</button>
							))}
						</div>
					)}
				</div>

				{/* Auto Assign Toggle with Dropdown */}
				<div className="relative">
					<div className="flex">
						<button
							onClick={toggleAutoAllocation}
							className={`
								flex items-center gap-2 px-4 py-3 text-sm font-bold uppercase tracking-wider transition-all
								${autoAllocationEnabled
									? 'bg-purple-500/15 text-purple-400 ring-1 ring-purple-500/40 hover:bg-purple-500/25'
									: 'bg-[var(--color-elevated)] text-[var(--color-text-muted)] ring-1 ring-[var(--color-border)] hover:text-[var(--color-text-secondary)]'}
							`}
							title="Toggle automatic task allocation"
						>
							<Settings2 size={16} />
							<span className="hidden xl:inline">Assign</span>
							{autoAllocationEnabled && assignEnabledCount < 3 && (
								<span className="text-xs opacity-70">{assignEnabledCount}/3</span>
							)}
						</button>
						<button
							onClick={() => { setShowAssignMenu(!showAssignMenu); setShowOrdersMenu(false); }}
							className={`
								px-2 py-3 text-sm transition-all border-l border-black/20
								${autoAllocationEnabled
									? 'bg-purple-500/15 text-purple-400 ring-1 ring-purple-500/40 hover:bg-purple-500/25'
									: 'bg-[var(--color-elevated)] text-[var(--color-text-muted)] ring-1 ring-[var(--color-border)] hover:text-[var(--color-text-secondary)]'}
							`}
						>
							<ChevronDown size={14} className={`transition-transform ${showAssignMenu ? 'rotate-180' : ''}`} />
						</button>
					</div>
					{showAssignMenu && (
						<div className="absolute bottom-full mb-2 left-0 bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xl z-50 min-w-[160px] overflow-hidden">
							<div className="text-xs text-[var(--color-text-muted)] px-4 py-2 border-b border-[var(--color-border-dim)] font-bold uppercase tracking-wider">Machine Types</div>
							{(['CNC', 'Assembly', 'Test'] as const).map(type => (
								<button
									key={type}
									onClick={() => toggleAutoAllocationFilter(type)}
									className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-[var(--color-elevated)] ${autoAllocationFilters[type] ? 'text-purple-400' : 'text-[var(--color-text-muted)]'}`}
								>
									<div className={`w-4 h-4 border flex items-center justify-center ${autoAllocationFilters[type] ? 'bg-purple-500 border-purple-500' : 'border-[var(--color-border)]'}`}>
										{autoAllocationFilters[type] && <span className="text-white text-xs">✓</span>}
									</div>
									<MachineTypeIcon type={type} />
									<span className="font-medium">{type}</span>
								</button>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Main Controls */}
			<div className="flex items-center gap-4">
				<button
					onClick={isRunning ? onPause : onStart}
					className={`
						relative group overflow-hidden px-8 py-4 
						transition-all duration-300 flex items-center gap-4
						font-bold text-base tracking-wide shadow-xl
						${isRunning
							? 'bg-[var(--color-warning)]/15 text-[var(--color-warning)] ring-2 ring-[var(--color-warning)]/50 hover:bg-[var(--color-warning)]/25 hover:ring-[var(--color-warning)]/70 glow-warning'
							: 'bg-[var(--color-success)]/15 text-[var(--color-success)] ring-2 ring-[var(--color-success)]/50 hover:bg-[var(--color-success)]/25 hover:ring-[var(--color-success)]/70 glow-success'
						}
					`}
				>
					{isRunning ? (
						<Pause size={22} fill="currentColor" />
					) : (
						<Play size={22} fill="currentColor" />
					)}
					<span className="hidden xs:inline uppercase">
						{isRunning ? 'Pause' : 'Start'}
					</span>
				</button>

				<button
					onClick={onReset}
					className="px-6 py-4 bg-[var(--color-elevated)] ring-1 ring-[var(--color-border)] 
						text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-subtle)] hover:ring-[var(--color-border-bright)]
						transition-all duration-300 flex items-center gap-3 shadow-xl
						group"
				>
					<RotateCcw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
					<span className="hidden sm:inline font-bold text-base tracking-wide uppercase">
						Reset
					</span>
				</button>
			</div>

			{/* Divider */}
			<div className="hidden lg:block h-10 w-px bg-[var(--color-border)]" />

			<div className="hidden lg:flex items-center gap-5 text-sm text-[var(--color-text-muted)] font-mono">
				<div className="flex items-center gap-2">
					<kbd className="px-2.5 py-1.5 bg-[var(--color-elevated)] ring-1 ring-[var(--color-border)] text-[var(--color-text-secondary)] text-xs font-bold">Space</kbd>
					<span className="uppercase tracking-wider text-xs">Toggle</span>
				</div>
				<div className="flex items-center gap-2">
					<kbd className="px-2.5 py-1.5 bg-[var(--color-elevated)] ring-1 ring-[var(--color-border)] text-[var(--color-text-secondary)] text-xs font-bold">Ctrl+R</kbd>
					<span className="uppercase tracking-wider text-xs">Reset</span>
				</div>
			</div>
		</div>
	);
};
