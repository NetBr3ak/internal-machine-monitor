import type { Machine, TaskType } from './types';

// Machine configurations based on ELPLC realistic parameters
export const MACHINES: Omit<Machine, 'effectiveTimeMultiplier' | 'status' | 'currentTask' | 'queue' | 'completedTasks' | 'totalProcessingTime'>[] = [
	// Row 1: CNC Machines (Primary)
	{
		id: 'M1',
		name: 'CNC Mill-01 (Haas VF-2)',
		type: 'CNC',
		description: 'CNC Milling - Precision aluminum machining',
		baseTimeMultiplier: 0.8, // Fast machine
	},
	{
		id: 'M2',
		name: 'CNC Mill-02 (DMG MORI)',
		type: 'CNC',
		description: 'CNC Milling - Precision aluminum machining',
		baseTimeMultiplier: 0.8, // Fast machine
	},
	{
		id: 'M5',
		name: 'CNC Mill-03 (Mazak)',
		type: 'CNC',
		description: 'CNC Milling - Precision aluminum machining',
		baseTimeMultiplier: 0.8,
	},
	{
		id: 'M6',
		name: 'CNC Mill-04 (Okuma)',
		type: 'CNC',
		description: 'CNC Milling - Precision aluminum machining',
		baseTimeMultiplier: 0.8,
	},
	// Row 2: CNC Overflow + Assembly + Test
	{
		id: 'M8',
		name: 'CNC Mill-05 (Haas VF-4)',
		type: 'CNC',
		description: 'CNC Milling - Precision aluminum machining',
		baseTimeMultiplier: 0.8,
	},
	{
		id: 'M3',
		name: 'Assembly Line A (Kuka)',
		type: 'Assembly',
		description: 'Assembly Line - Assembly and welding',
		baseTimeMultiplier: 1.0, // Normal speed
	},
	{
		id: 'M7',
		name: 'Assembly Line B (Fanuc)',
		type: 'Assembly',
		description: 'Assembly Line - Assembly and welding',
		baseTimeMultiplier: 1.0,
	},
	{
		id: 'M4',
		name: 'Test Station B (EOL)',
		type: 'Test',
		description: 'Test Station - EOL testing and quality control',
		baseTimeMultiplier: 1.2, // Slower machine
	},
];

// Task types - Professional manufacturing operations with technical nomenclature
// BALANCED DISTRIBUTION: ~25% CNC, ~45% Assembly, ~30% Test (proportional to machine count & speed)
export const TASK_TYPES: TaskType[] = [
	// === CNC TASKS (3 types - reduced) ===
	{
		taskTypeId: 'CNC-VAR-001',
		displayName: 'CNC: Variator Housing AL7075',
		baseWorkloadMinutes: 32,
		durationVariancePercent: 0.12,
		preferredMachines: ['M1', 'M2', 'M5', 'M6', 'M8'],
		priority: 'critical',
		description: 'Precision milling - Automotive variator housing',
	},
	{
		taskTypeId: 'CNC-HSG-AL60',
		displayName: 'CNC: Controller Housing IP67',
		baseWorkloadMinutes: 38,
		durationVariancePercent: 0.10,
		preferredMachines: ['M1', 'M2', 'M5', 'M6', 'M8'],
		priority: 'normal',
		description: '5-axis milling - Aluminum enclosure IP67',
	},
	{
		taskTypeId: 'CNC-BRK-ST45',
		displayName: 'CNC: Brake Caliper',
		baseWorkloadMinutes: 40,
		durationVariancePercent: 0.11,
		preferredMachines: ['M1', 'M2', 'M5', 'M6', 'M8'],
		priority: 'rush',
		description: 'Precision boring - Brake caliper body',
	},

	// === ASSEMBLY TASKS (7 types - increased) ===
	{
		taskTypeId: 'ASM-BAT-E48',
		displayName: 'Assembly: Battery Pack 48V',
		baseWorkloadMinutes: 45,
		durationVariancePercent: 0.08,
		preferredMachines: ['M3', 'M7'],
		priority: 'rush',
		description: 'E-bike battery module assembly + BMS integration',
	},
	{
		taskTypeId: 'WLD-SHK-H22',
		displayName: 'Welding: Shock Absorber Housing',
		baseWorkloadMinutes: 28,
		durationVariancePercent: 0.15,
		preferredMachines: ['M3', 'M7'],
		priority: 'normal',
		description: 'TIG welding - Hydraulic shock absorber shell',
	},
	{
		taskTypeId: 'ASM-HRN-M16',
		displayName: 'Assembly: Main Harness 16-pin',
		baseWorkloadMinutes: 22,
		durationVariancePercent: 0.18,
		preferredMachines: ['M3', 'M7'],
		priority: 'normal',
		description: 'Main wiring harness assembly 16-pin connector',
	},
	{
		taskTypeId: 'ASM-INV-PWR',
		displayName: 'Assembly: Inverter 5kW',
		baseWorkloadMinutes: 48,
		durationVariancePercent: 0.10,
		preferredMachines: ['M3', 'M7'],
		priority: 'critical',
		description: 'Power inverter assembly with thermal mgmt',
	},
	{
		taskTypeId: 'ASM-MOT-BLDC',
		displayName: 'Assembly: BLDC Motor 2.5kW',
		baseWorkloadMinutes: 52,
		durationVariancePercent: 0.09,
		preferredMachines: ['M3', 'M7'],
		priority: 'normal',
		description: 'Brushless DC motor assembly + encoder',
	},
	{
		taskTypeId: 'WLD-FRM-TIG',
		displayName: 'Welding: Support Frame TIG',
		baseWorkloadMinutes: 36,
		durationVariancePercent: 0.14,
		preferredMachines: ['M3', 'M7'],
		priority: 'normal',
		description: 'TIG welding structural frame components',
	},
	{
		taskTypeId: 'ASM-PCB-CTL',
		displayName: 'Assembly: Control Board PCB',
		baseWorkloadMinutes: 32,
		durationVariancePercent: 0.12,
		preferredMachines: ['M3', 'M7'],
		priority: 'rush',
		description: 'PCB assembly with SMD components + testing',
	},

	// === TEST TASKS (6 types - increased) ===
	{
		taskTypeId: 'TST-EOL-EXT',
		displayName: 'Test: Full EOL Protocol',
		baseWorkloadMinutes: 55,
		durationVariancePercent: 0.12,
		preferredMachines: ['M4'],
		priority: 'normal',
		description: 'Full End-of-Line testing suite + burn-in',
	},
	{
		taskTypeId: 'TST-EOL-STD',
		displayName: 'Test: Basic Inspection',
		baseWorkloadMinutes: 18,
		durationVariancePercent: 0.15,
		preferredMachines: ['M4'],
		priority: 'rush',
		description: 'Standard EOL functional test',
	},
	{
		taskTypeId: 'CAL-SNS-P04',
		displayName: 'Calibration: Sensor Array P',
		baseWorkloadMinutes: 42,
		durationVariancePercent: 0.14,
		preferredMachines: ['M4'],
		priority: 'normal',
		description: 'Multi-point sensor calibration + verification',
	},
	{
		taskTypeId: 'TST-VIB-A01',
		displayName: 'Test: Vibration Analysis',
		baseWorkloadMinutes: 30,
		durationVariancePercent: 0.16,
		preferredMachines: ['M4'],
		priority: 'normal',
		description: 'Dynamic vibration testing + spectrum analysis',
	},
	{
		taskTypeId: 'TST-PWR-LOAD',
		displayName: 'Test: Power Load Cycle',
		baseWorkloadMinutes: 25,
		durationVariancePercent: 0.18,
		preferredMachines: ['M4'],
		priority: 'rush',
		description: 'Power cycling stress test + thermal monitoring',
	},
	{
		taskTypeId: 'TST-EMC-SCAN',
		displayName: 'Test: EMC Compliance Scan',
		baseWorkloadMinutes: 35,
		durationVariancePercent: 0.10,
		preferredMachines: ['M4'],
		priority: 'critical',
		description: 'Electromagnetic compatibility pre-certification',
	},

	// === SHARED/FLEXIBLE TASKS (2 types) ===
	{
		taskTypeId: 'PKG-KIT-STD',
		displayName: 'Packaging: Assembly Kit',
		baseWorkloadMinutes: 15,
		durationVariancePercent: 0.20,
		preferredMachines: ['M3', 'M4', 'M7'],
		priority: 'normal',
		description: 'Final packaging with documentation',
	},
	{
		taskTypeId: 'RWK-QC-MINOR',
		displayName: 'Rework: QC Corrections',
		baseWorkloadMinutes: 25,
		durationVariancePercent: 0.25,
		preferredMachines: ['M3', 'M4', 'M7'],
		priority: 'rush',
		description: 'Rework minor QC issues + re-inspection',
	},
];

// System parameters
export const SYSTEM_CONFIG = {
	TIME_SCALE: 2, // system minutes per real second
	REFRESH_RATE: 200, // ms between system ticks
	INITIAL_BATCH_MIN: 17,
	INITIAL_BATCH_MAX: 28,

	// Realistic batch arrival system (Poisson-like distribution)
	BATCH_ARRIVAL_INTERVAL_MIN: 2000, // ms
	BATCH_ARRIVAL_INTERVAL_MAX: 6000, // ms
	BATCH_SIZE_MIN: 1,
	BATCH_SIZE_MAX: 4,
	BATCH_SIZE_WEIGHTS: [0.15, 0.35, 0.30, 0.20], // Balanced distribution

	// Machine time multiplier variance
	FAST_MACHINE_MULT_MIN: 0.25,
	FAST_MACHINE_MULT_MAX: 0.6,
	NORMAL_MACHINE_MULT_MIN: 0.95,
	NORMAL_MACHINE_MULT_MAX: 1.05,
	SLOW_MACHINE_MULT_MIN: 1.1,
	SLOW_MACHINE_MULT_MAX: 1.3,

	// Realistic production overheads
	TRANSPORT_TIME_MINUTES: 5, // Transport time between stations
	SETUP_TIME_MINUTES: 3, // Setup time when changing task type
	ASSIGNMENT_DELAY_MS: 0, // Immediate assignment
	BATCH_OPTIMIZATION_WINDOW: 5, // How many tasks to analyze simultaneously for optimization
};

// Priority weights for scheduling
export const PRIORITY_WEIGHTS = {
	critical: 3,
	rush: 2,
	normal: 1,
};

// UI Styles for Priorities
export const PRIORITY_STYLES = {
	critical: {
		border: 'border-l-red-500',
		bg: 'bg-red-500/10 hover:bg-red-500/15',
		badge: 'text-red-400 bg-red-500/15 ring-1 ring-red-500/30',
		text: 'text-red-200', // Added for MachineColumn compatibility
		simpleBg: 'bg-red-500/10', // Added for MachineColumn compatibility
	},
	rush: {
		border: 'border-l-amber-500',
		bg: 'bg-amber-500/10 hover:bg-amber-500/15',
		badge: 'text-amber-400 bg-amber-500/15 ring-1 ring-amber-500/30',
		text: 'text-amber-200',
		simpleBg: 'bg-amber-500/10',
	},
	normal: {
		border: 'border-l-emerald-500',
		bg: 'bg-emerald-500/5 hover:bg-emerald-500/10',
		badge: 'text-emerald-400 bg-emerald-500/15 ring-1 ring-emerald-500/30',
		text: 'text-neutral-300',
		simpleBg: 'bg-emerald-500/5',
	},
};

// UI Config for Machine Status
export const MACHINE_STATUS_CONFIG = {
	idle: {
		border: 'border-neutral-700/40',
		indicator: 'bg-neutral-600',
		text: 'text-neutral-400',
		label: 'bg-neutral-800/80 text-neutral-400 ring-1 ring-neutral-700',
		labelText: 'IDLE'
	},
	processing: {
		border: 'border-emerald-500/30',
		indicator: 'bg-emerald-500',
		text: 'text-emerald-400',
		label: 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40',
		labelText: 'ACTIVE'
	},
	maintenance: {
		border: 'border-amber-500/30',
		indicator: 'bg-amber-500',
		text: 'text-amber-400',
		label: 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/40',
		labelText: 'MAINT'
	},
	breakdown: {
		border: 'border-red-500/50',
		indicator: 'bg-red-500 animate-pulse',
		text: 'text-red-400',
		label: 'bg-red-500/25 text-red-300 ring-1 ring-red-500/50 animate-pulse',
		labelText: 'FAULT'
	},
};

export const CLIENT_NAMES = [
	"Apex Industries", "BlueSky Dynamics", "Cyberdyne Systems", "Delta Works", "Echo Logistics",
	"Foxconn Solutions", "Global Tech", "Hyperion Corp", "Initech", "Jupiter Mining",
	"Kinetix", "Lunar Industries", "Massive Dynamic", "North Central Positronics", "Omni Consumer Products",
	"Prestige Worldwide", "Quantum Mechanics", "Roxxon Energy", "Stark Industries", "Tyrell Corp",
	"Umbrella Corp", "Vandelay Industries", "Wayne Enterprises", "Xenon Graphics", "Yoyodyne Propulsion",
	"Zorg Industries", "Acme Corp", "Globex Corp", "Soylent Corp", "Hooli",
	"Pied Piper", "Aperture Science", "Black Mesa", "CyberLife", "Delos",
	"E Corp", "Fringe Division", "Gekko & Co", "Hammond Engineering", "Ingen",
	"Jurrasic Systems", "Knight Industries", "LexCorp", "Mombassa Industries", "Nakatomi Trading",
	"Oscorp", "Parker Industries", "Queen Consolidated", "RDA Corp", "Skynet",
	"Tessier-Ashpool", "U.S. Robotics", "Veidt Enterprises", "Weyland-Yutani", "X-Corp"
];
