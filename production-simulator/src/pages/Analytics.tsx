import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSimulationStore } from '../store';
import { GlobalMetricsPanel } from '../components/GlobalMetricsPanel';
import type { SystemEvent } from '../types';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface AnalyticsProps {
	onBack?: () => void;
}

export function Analytics({ onBack }: AnalyticsProps) {
	const { eventLog, analyticsHistory, simulationTime, machines, getGlobalMetrics, isRunning } = useSimulationStore();
	const [selectedTimeRange, setSelectedTimeRange] = useState<'5m' | '15m' | '30m' | '1h'>('15m');

	const metrics = getGlobalMetrics();

	// Filter analytics data based on time range
	const getFilteredData = () => {
		const now = simulationTime;
		const ranges = { '5m': 5, '15m': 15, '30m': 30, '1h': 60 };
		const cutoff = now - ranges[selectedTimeRange];
		return analyticsHistory.filter(snap => snap.simTime >= cutoff);
	};

	const chartData = getFilteredData();

	// Recent events (last 50)
	const recentEvents = [...eventLog].reverse().slice(0, 50);

	// Export logs
	const exportLogs = () => {
		const data = eventLog.map(e => ({
			timestamp: new Date(e.timestamp).toLocaleString(),
			simTime: `${Math.floor(e.simTime)}m`,
			type: e.type,
			severity: e.severity,
			message: e.message,
			machine: e.data?.machineId || '-',
			task: e.data?.taskId || '-',
		}));

		const csv = [
			Object.keys(data[0]).join(','),
			...data.map(row => Object.values(row).join(','))
		].join('\n');

		const blob = new Blob([csv], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `forgegrid-logs-${Date.now()}.csv`;
		a.click();
	};

	return (
		<div className="flex flex-col h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans selection:bg-cyan-500/30 relative">
			{/* Global Cyberpunk Background */}
			<div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,23,42,0)_0%,rgba(2,6,23,0.8)_100%)] pointer-events-none" />

			{/* View Toggle */}
			<div className="absolute top-4 right-4 z-20 flex gap-2">
				<button
					onClick={onBack}
					className="px-4 py-2 border text-xs font-bold uppercase tracking-widest transition-all bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700 backdrop-blur-sm"
				>
					🏭 Production
				</button>
				<button
					className="px-4 py-2 border text-xs font-bold uppercase tracking-widest transition-all bg-cyan-500 text-white border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
				>
					📊 Analytics
				</button>
			</div>

			{/* Top Bar - Global Metrics */}
			<header className="flex-none p-4 pb-2 z-10">
				<GlobalMetricsPanel
					metrics={metrics}
					simulationTime={simulationTime}
					isRunning={isRunning}
				/>
			</header>			{/* Main Content */}
			<main className="flex-1 overflow-y-auto p-4 space-y-4 z-10">
				{/* KPIs Row */}
				<section className="grid grid-cols-5 gap-4">
					<KPICard title="Throughput" value={`${metrics.throughput} /hr`} icon="⚡" color="cyan" />
					<KPICard title="Completed" value={metrics.completedCount} icon="✓" color="emerald" />
					<KPICard title="In Progress" value={metrics.inProgressCount} icon="⚙️" color="amber" />
					<KPICard title="Waiting" value={metrics.waitingCount} icon="📋" color="slate" />
					<KPICard title="Events Logged" value={eventLog.length} icon="📝" color="purple" />
				</section>

				{/* Charts Row */}
				<section className="grid grid-cols-2 gap-4">
					{/* Hall Load Over Time */}
					<ChartCard title="Hall Load Trend" timeRange={selectedTimeRange} onTimeRangeChange={setSelectedTimeRange}>
						<ResponsiveContainer width="100%" height={250}>
							<AreaChart data={chartData}>
								<defs>
									<linearGradient id="hallLoadGradient" x1="0" y1="0" x2="0" y2="1">
										<stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
										<stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
									</linearGradient>
								</defs>
								<CartesianGrid strokeDasharray="3 3" stroke="#334155" />
								<XAxis dataKey="simTime" stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(val) => `${Math.floor(val)}m`} />
								<YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 100]} />
								<Tooltip
									contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '4px' }}
									labelStyle={{ color: '#06b6d4' }}
								/>
								<Area type="monotone" dataKey="hallLoad" stroke="#06b6d4" fillOpacity={1} fill="url(#hallLoadGradient)" strokeWidth={2} />
							</AreaChart>
						</ResponsiveContainer>
					</ChartCard>

					{/* Throughput Over Time */}
					<ChartCard title="Task Throughput" timeRange={selectedTimeRange} onTimeRangeChange={setSelectedTimeRange}>
						<ResponsiveContainer width="100%" height={250}>
							<LineChart data={chartData}>
								<CartesianGrid strokeDasharray="3 3" stroke="#334155" />
								<XAxis dataKey="simTime" stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(val) => `${Math.floor(val)}m`} />
								<YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
								<Tooltip
									contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '4px' }}
									labelStyle={{ color: '#10b981' }}
								/>
								<Line type="monotone" dataKey="completedTasks" stroke="#10b981" strokeWidth={2} dot={false} name="Completed" />
								<Line type="monotone" dataKey="activeTasks" stroke="#f59e0b" strokeWidth={2} dot={false} name="Active" />
								<Line type="monotone" dataKey="waitingTasks" stroke="#64748b" strokeWidth={2} dot={false} name="Waiting" />
								<Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
							</LineChart>
						</ResponsiveContainer>
					</ChartCard>
				</section>

				{/* Machine Utilization Chart */}
				<section>
					<ChartCard title="Machine Utilization Distribution" fullWidth>
						<ResponsiveContainer width="100%" height={250}>
							<BarChart data={machines.map(m => ({
								name: m.id,
								utilization: Math.round((m.totalProcessingTime / (simulationTime || 1)) * 100),
								status: m.status
							}))}>
								<CartesianGrid strokeDasharray="3 3" stroke="#334155" />
								<XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
								<YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 100]} />
								<Tooltip
									contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '4px' }}
								/>
								<Bar dataKey="utilization" fill="#06b6d4" radius={[4, 4, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</ChartCard>
				</section>

				{/* Alert Distribution Panel */}
				<section className="grid grid-cols-2 gap-4">
					<AlertDistributionPanel events={eventLog} />
					<div className="bg-slate-900/60 border border-slate-800 p-5 backdrop-blur-sm">
						<h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 font-mono">Notification Recipients</h3>
						<div className="space-y-3">
							<RecipientCard name="Production Floor" role="Technicians" count={eventLog.filter(e => e.data?.recipients?.includes('technician')).length} icon="🔧" />
							<RecipientCard name="Operations" role="Supervisors" count={eventLog.filter(e => e.data?.recipients?.includes('supervisor')).length} icon="👷" />
							<RecipientCard name="Management" role="Managers" count={eventLog.filter(e => e.data?.recipients?.includes('manager')).length} icon="💼" />
							<RecipientCard name="Quality Assurance" role="QC Team" count={eventLog.filter(e => e.data?.recipients?.includes('quality_control')).length} icon="🔬" />
						</div>
					</div>
				</section>

				{/* Event Log */}
				<section className="bg-slate-900/60 border border-slate-800 overflow-hidden backdrop-blur-sm">
					<div className="p-5 border-b border-slate-800 flex items-center justify-between">
						<div>
							<h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">System Event Log</h3>
							<p className="text-[10px] text-slate-600 mt-1 uppercase tracking-widest font-mono">Real-time production monitoring & traceability</p>
						</div>
						<button
							onClick={exportLogs}
							className="px-4 py-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold uppercase tracking-widest hover:bg-cyan-500/20 transition-all hover:shadow-[0_0_10px_rgba(6,182,212,0.3)]"
						>
							📥 Export CSV
						</button>
					</div>
					<div className="overflow-x-auto">
						<table className="w-full text-xs font-mono">
							<thead className="bg-slate-950/50 border-b border-slate-800">
								<tr>
									<th className="text-left p-3 text-slate-500 font-bold uppercase tracking-widest text-[10px]">Timestamp</th>
									<th className="text-left p-3 text-slate-500 font-bold uppercase tracking-widest text-[10px]">Sim Time</th>
									<th className="text-left p-3 text-slate-500 font-bold uppercase tracking-widest text-[10px]">Type</th>
									<th className="text-left p-3 text-slate-500 font-bold uppercase tracking-widest text-[10px]">Severity</th>
									<th className="text-left p-3 text-slate-500 font-bold uppercase tracking-widest text-[10px]">Message</th>
									<th className="text-left p-3 text-slate-500 font-bold uppercase tracking-widest text-[10px]">Context</th>
								</tr>
							</thead>
							<tbody>
								{recentEvents.map((event, idx) => (
									<motion.tr
										key={event.id}
										initial={{ opacity: 0, x: -10 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: idx * 0.02 }}
										className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
									>
										<td className="p-3 text-slate-400 text-[11px]">{new Date(event.timestamp).toLocaleTimeString()}</td>
										<td className="p-3 text-cyan-400 text-[11px]">{Math.floor(event.simTime)}m</td>
										<td className="p-3">
											<span className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-slate-300 text-[10px] uppercase tracking-wider">
												{event.type.replace(/_/g, ' ')}
											</span>
										</td>
										<td className="p-3">
											<span className={`px-2 py-0.5 font-bold text-[10px] uppercase tracking-wider ${event.severity === 'critical' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
												event.severity === 'warning' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
													'bg-slate-700/50 text-slate-400 border border-slate-700'
												}`}>
												{event.severity}
											</span>
										</td>
										<td className="p-3 text-slate-300 text-[11px]">{event.message}</td>
										<td className="p-3 text-slate-500 text-[9px] font-mono">
											{event.data?.machineId && `M: ${event.data.machineId}`}
											{event.data?.taskId && ` | T: ${event.data.taskId}`}
										</td>
									</motion.tr>
								))}
							</tbody>
						</table>
					</div>
				</section>
			</main>
		</div>
	);
}

// Helper Components
function KPICard({ title, value, icon, color }: { title: string; value: string | number; icon: string; color: string }) {
	const colors = {
		cyan: 'border-cyan-500/30 bg-cyan-500/5 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]',
		emerald: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]',
		amber: 'border-amber-500/30 bg-amber-500/5 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.1)]',
		slate: 'border-slate-500/30 bg-slate-500/5 text-slate-400',
		purple: 'border-purple-500/30 bg-purple-500/5 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.1)]',
	};

	return (
		<div className={`p-4 border bg-slate-900/60 backdrop-blur-sm transition-all hover:bg-slate-900/80 ${colors[color as keyof typeof colors]}`}>
			<div className="flex items-center justify-between mb-2">
				<span className="text-2xl">{icon}</span>
				<span className="text-2xl font-black font-mono">{value}</span>
			</div>
			<div className="text-[9px] uppercase tracking-widest font-bold font-mono">{title}</div>
		</div>
	);
}

function ChartCard({ title, children, timeRange, onTimeRangeChange, fullWidth }: any) {
	return (
		<div className={`bg-slate-900/60 border border-slate-800 backdrop-blur-sm p-5 ${fullWidth ? 'col-span-2' : ''}`}>
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">{title}</h3>
				{onTimeRangeChange && (
					<div className="flex gap-1">
						{(['5m', '15m', '30m', '1h'] as const).map(range => (
							<button
								key={range}
								onClick={() => onTimeRangeChange(range)}
								className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest transition-all border ${timeRange === range
									? 'bg-cyan-500 text-white border-cyan-400'
									: 'bg-slate-800 text-slate-500 hover:text-slate-300 border-slate-700'
									}`}
							>
								{range}
							</button>
						))}
					</div>
				)}
			</div>
			{children}
		</div>
	);
}

function AlertDistributionPanel({ events }: { events: SystemEvent[] }) {
	const counts = {
		task_created: events.filter(e => e.type === 'task_created').length,
		task_completed: events.filter(e => e.type === 'task_completed').length,
		machine_breakdown: events.filter(e => e.type === 'machine_breakdown').length,
		machine_repaired: events.filter(e => e.type === 'machine_repaired').length,
		alert_sent: events.filter(e => e.type === 'alert_sent').length,
		rebalance_triggered: events.filter(e => e.type === 'rebalance_triggered').length,
	};

	return (
		<div className="bg-slate-900/60 border border-slate-800 p-5 backdrop-blur-sm">
			<h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 font-mono">Event Distribution</h3>
			<div className="space-y-2">
				{Object.entries(counts).map(([type, count]) => (
					<div key={type} className="flex items-center justify-between p-2 bg-slate-950/30 border border-slate-800/50">
						<span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">{type.replace(/_/g, ' ')}</span>
						<span className="text-sm font-mono text-slate-300 font-bold">{count}</span>
					</div>
				))}
			</div>
		</div>
	);
}

function RecipientCard({ name, role, count, icon }: { name: string; role: string; count: number; icon: string }) {
	return (
		<div className="flex items-center justify-between p-3 bg-slate-950/50 border border-slate-800">
			<div className="flex items-center gap-3">
				<span className="text-xl">{icon}</span>
				<div>
					<div className="text-sm font-bold text-slate-200">{name}</div>
					<div className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">{role}</div>
				</div>
			</div>
			<div className="text-lg font-mono font-bold text-cyan-400">{count}</div>
		</div>
	);
}
