import React from 'react';

interface SimulationControlsProps {
	isRunning: boolean;
	onStart: () => void;
	onPause: () => void;
	onReset: () => void;
}

export function SimulationControls({ isRunning, onStart, onPause, onReset }: SimulationControlsProps) {
	// Keyboard shortcuts
	React.useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			if (e.code === 'Space') {
				e.preventDefault();
				isRunning ? onPause() : onStart();
			} else if (e.code === 'KeyR' && e.ctrlKey) {
				e.preventDefault();
				onReset();
			}
		};

		window.addEventListener('keydown', handleKeyPress);
		return () => window.removeEventListener('keydown', handleKeyPress);
	}, [isRunning, onStart, onPause, onReset]);

	return (
		<div className="bg-slate-950 border-t border-slate-800 p-4 flex items-center justify-between relative z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
			{/* Left: Status */}
			<div className="flex items-center gap-6">
				<div className="flex flex-col">
					<span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono mb-1">System Status</span>
					<div className="flex items-center gap-3">
						<div className={`w-3 h-3 rounded-sm ${isRunning ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse' : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]'}`} />
						<span className={`text-sm font-bold tracking-wider ${isRunning ? 'text-emerald-400' : 'text-rose-400'}`}>
							{isRunning ? 'ONLINE' : 'OFFLINE'}
						</span>
					</div>
				</div>

				<div className="h-8 w-px bg-slate-800" />

				<div className="flex flex-col">
					<span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono mb-1">Version</span>
					<span className="text-xs text-slate-400 font-mono">v2.0.4-CYBER</span>
				</div>
			</div>

			{/* Center: Controls */}
			<div className="flex items-center gap-4 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
				<button
					onClick={isRunning ? onPause : onStart}
					className={`
						relative group overflow-hidden px-8 py-3 border transition-all duration-300
						${isRunning
							? 'border-rose-500/50 hover:border-rose-500 bg-rose-950/30 hover:bg-rose-900/40'
							: 'border-emerald-500/50 hover:border-emerald-500 bg-emerald-950/30 hover:bg-emerald-900/40'
						}
					`}
				>
					<div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity ${isRunning ? 'bg-rose-500' : 'bg-emerald-500'}`} />
					<div className="flex items-center gap-3 relative z-10">
						<span className={`text-xl ${isRunning ? 'text-rose-400' : 'text-emerald-400'}`}>
							{isRunning ? '⏹' : '▶'}
						</span>
						<span className={`font-bold tracking-widest uppercase ${isRunning ? 'text-rose-100' : 'text-emerald-100'}`}>
							{isRunning ? 'STOP' : 'START'}
						</span>
					</div>
					{/* Corner accents */}
					<div className={`absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 transition-colors ${isRunning ? 'border-rose-500' : 'border-emerald-500'}`} />
					<div className={`absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 transition-colors ${isRunning ? 'border-rose-500' : 'border-emerald-500'}`} />
				</button>

				<button
					onClick={onReset}
					className="px-6 py-3 border border-slate-700 hover:border-cyan-500 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 transition-all duration-300 group relative overflow-hidden"
				>
					<div className="absolute inset-0 bg-cyan-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
					<span className="relative z-10 font-bold tracking-wider uppercase text-sm flex items-center gap-2">
						<span>↺</span> RESET
					</span>
				</button>
			</div>

			{/* Right: Info */}
			<div className="flex items-center gap-6">
				<div className="text-right">
					<div className="text-[10px] text-slate-500 uppercase tracking-widest font-mono mb-1">Shortcuts</div>
					<div className="flex gap-2">
						<kbd className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-[10px] font-mono text-slate-400">SPACE</kbd>
						<kbd className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-[10px] font-mono text-slate-400">R</kbd>
					</div>
				</div>
			</div>
		</div>
	);
};
