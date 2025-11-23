import React from 'react';
import { motion } from 'framer-motion';

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
		<motion.div
			initial={{ y: 20, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			className="bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-2 shadow-2xl flex items-center justify-between gap-4 max-w-4xl mx-auto w-full"
		>
			<div className="flex items-center gap-2">
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={isRunning ? onPause : onStart}
					className={`
						px-6 py-2.5 font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg
						${isRunning
							? 'bg-amber-500 hover:bg-amber-400 text-slate-900 shadow-[0_0_20px_-5px_rgba(245,158,11,0.4)]'
							: 'bg-emerald-500 hover:bg-emerald-400 text-slate-900 shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)]'
						}
					`}
				>
					{isRunning ? (
						<>
							<span className="text-xl">⏸️</span>
							<span className="hidden sm:inline">PAUZA</span>
						</>
					) : (
						<>
							<span className="text-xl">▶️</span>
							<span className="hidden sm:inline">START</span>
						</>
					)}
				</motion.button>

				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={onReset}
					className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg border border-slate-700 hover:border-slate-600"
					title="Zresetuj symulację (Ctrl+R)"
				>
					<span className="text-xl">🔄</span>
					<span className="hidden sm:inline">RESET</span>
				</motion.button>
			</div>

			<div className="flex items-center gap-6 text-sm text-slate-400 px-4 border-l border-slate-700/50">
				<div className="hidden md:flex items-center gap-2">
					<span className="font-semibold text-slate-300">Prędkość:</span>
					<span className="text-cyan-400 font-mono bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-900/50">
						2 min/s
					</span>
				</div>
				<div className="hidden lg:flex items-center gap-3">
					<span className="text-slate-500">Skróty:</span>
					<div className="flex gap-2">
						<kbd className="px-2 py-1 bg-slate-800 rounded-md border border-slate-700 font-mono text-xs text-slate-300 shadow-sm">Space</kbd>
						<kbd className="px-2 py-1 bg-slate-800 rounded-md border border-slate-700 font-mono text-xs text-slate-300 shadow-sm">Ctrl+R</kbd>
					</div>
				</div>
			</div>

			<div className="text-right px-4">
				<div className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">FailSafe</div>
				<div className="text-[10px] text-slate-700">System v2.0</div>
			</div>
		</motion.div>
	);
}
