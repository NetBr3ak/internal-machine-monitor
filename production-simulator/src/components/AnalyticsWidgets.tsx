import React from 'react';
import type { SystemEvent } from '../types';

// Helper Components

export function KPICard({ title, value, icon, color, className = '' }: { title: string; value: string | number; icon: React.ReactNode; color: string; className?: string }) {
	const colorStyles = {
		cyan: 'border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5 text-[var(--color-accent)]',
		emerald: 'border-[var(--color-success)]/30 bg-[var(--color-success)]/5 text-[var(--color-success)]',
		amber: 'border-[var(--color-warning)]/30 bg-[var(--color-warning)]/5 text-[var(--color-warning)]',
		slate: 'border-[var(--color-text-muted)]/30 bg-[var(--color-text-muted)]/5 text-[var(--color-text-secondary)]',
		purple: 'border-[var(--color-info)]/30 bg-[var(--color-info)]/5 text-[var(--color-info)]',
	};

	return (
		<div className={`relative p-5 border transition-all duration-300 hover:bg-[var(--color-elevated)] bg-[var(--color-surface)] ${colorStyles[color as keyof typeof colorStyles]} ${className}`}>
			<div className="flex items-center justify-between gap-3 mb-2">
				<span className="opacity-80">{icon}</span>
				<span className="text-2xl font-bold font-mono tracking-tight">{value}</span>
			</div>
			<div className="text-xs uppercase tracking-wider font-bold opacity-70">{title}</div>
		</div>
	);
}

export function ChartCard({ title, children, timeRange, onTimeRangeChange, fullWidth }: { title: string; children: React.ReactNode; timeRange?: string; onTimeRangeChange?: (range: '5m' | '15m' | '30m' | '1h') => void; fullWidth?: boolean }) {
	return (
		<div className={`bg-[var(--color-surface)] p-5 border border-[var(--color-border)] relative overflow-hidden hud-panel ${fullWidth ? 'col-span-1 lg:col-span-2' : ''}`}>
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-5">
				<h3 className="text-sm font-bold text-[var(--color-text-primary)] uppercase tracking-wider flex items-center gap-2">
					<span className="w-2 h-2 bg-[var(--color-accent)]" />
					{title}
				</h3>
				{onTimeRangeChange && (
					<div className="flex p-1 bg-[var(--color-abyss)] border border-[var(--color-border-dim)]">
						{(['5m', '15m', '30m', '1h'] as const).map(range => (
							<button
								key={range}
								onClick={() => onTimeRangeChange(range)}
								className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${timeRange === range
									? 'bg-[var(--color-accent)]/20 text-[var(--color-accent)] border border-[var(--color-accent)]/30'
									: 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-elevated)] border border-transparent'
									}`}
							>
								{range}
							</button>
						))}
					</div>
				)}
			</div>
			<div>
				{children}
			</div>
		</div>
	);
}

export function AlertDistributionPanel({ events }: { events: SystemEvent[] }) {
	const counts = {
		task_created: events.filter(e => e.type === 'task_created').length,
		task_completed: events.filter(e => e.type === 'task_completed').length,
		machine_breakdown: events.filter(e => e.type === 'machine_breakdown').length,
		machine_repaired: events.filter(e => e.type === 'machine_repaired').length,
		alert_sent: events.filter(e => e.type === 'alert_sent').length,
		rebalance_triggered: events.filter(e => e.type === 'rebalance_triggered').length,
	};

	const maxCount = Math.max(...Object.values(counts), 1);

	return (
		<div className="bg-[var(--color-surface)] p-5 border border-[var(--color-border)] relative overflow-hidden hud-panel h-full">
			<h3 className="text-sm font-bold text-[var(--color-text-primary)] uppercase tracking-wider mb-5 flex items-center gap-2">
				<span className="w-2 h-2 bg-[var(--color-info)]" />
				Event Distribution
			</h3>
			<div className="space-y-3">
				{Object.entries(counts).map(([type, count]) => (
					<div key={type} className="group relative">
						<div className="flex items-center justify-between mb-1.5">
							<span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-semibold group-hover:text-[var(--color-text-secondary)] transition-colors">
								{type.replace(/_/g, ' ')}
							</span>
							<span className="text-sm font-mono text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)] transition-colors font-bold">
								{count}
							</span>
						</div>
						<div className="h-2 w-full bg-[var(--color-abyss)] overflow-hidden border border-[var(--color-border-dim)]">
							<div
								className="h-full bg-gradient-to-r from-[var(--color-info)] to-[var(--color-accent)] transition-all duration-500"
								style={{ width: `${(count / maxCount) * 100}%` }}
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export function RecipientCard({ name, role, count, icon }: { name: string; role: string; count: number; icon: React.ReactNode }) {
	return (
		<div className="group flex items-center justify-between p-3 bg-[var(--color-abyss)] border border-[var(--color-border-dim)] hover:border-[var(--color-accent)]/30 hover:bg-[var(--color-accent)]/5 transition-all duration-300">
			<div className="flex items-center gap-3 min-w-0">
				<div className="p-2 bg-[var(--color-elevated)] text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] group-hover:bg-[var(--color-accent)]/10 transition-colors border border-[var(--color-border-dim)] group-hover:border-[var(--color-accent)]/20">
					{icon}
				</div>
				<div className="min-w-0">
					<div className="text-sm font-bold text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] truncate transition-colors">{name}</div>
					<div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-medium">{role}</div>
				</div>
			</div>
			<div className="text-xl font-mono font-bold text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-all flex-shrink-0 ml-3">
				{count}
			</div>
		</div>
	);
}
