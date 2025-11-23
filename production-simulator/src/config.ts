import type { Machine, TaskType } from './types';

// Machine configurations based on ELPLC realistic parameters
export const MACHINES: Omit<Machine, 'effectiveTimeMultiplier' | 'status' | 'currentTask' | 'queue' | 'completedTasks' | 'totalProcessingTime'>[] = [
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
		id: 'M3',
		name: 'Assembly Line A (Kuka)',
		type: 'Assembly',
		description: 'Assembly Line - Assembly and welding',
		baseTimeMultiplier: 1.0, // Normal speed
	},
	{
		id: 'M4',
		name: 'Test Station B (EOL)',
		type: 'Test',
		description: 'Test Station - EOL testing and quality control',
		baseTimeMultiplier: 1.2, // Slower machine
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
	{
		id: 'M7',
		name: 'Assembly Line B (Fanuc)',
		type: 'Assembly',
		description: 'Assembly Line - Assembly and welding',
		baseTimeMultiplier: 1.0,
	},
	{
		id: 'M8',
		name: 'CNC Mill-05 (Haas VF-4)',
		type: 'CNC',
		description: 'CNC Milling - Precision aluminum machining',
		baseTimeMultiplier: 0.8,
	},
];

// Task types - Professional manufacturing operations with technical nomenclature
export const TASK_TYPES: TaskType[] = [
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
		taskTypeId: 'CNC-HSG-AL60',
		displayName: 'CNC: Controller Housing IP67',
		baseWorkloadMinutes: 38,
		durationVariancePercent: 0.10,
		preferredMachines: ['M1', 'M2', 'M5', 'M6', 'M8'],
		priority: 'normal',
		description: '5-axis milling - Aluminum enclosure IP67',
	},
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
		displayName: 'Rework: Paint Defects',
		baseWorkloadMinutes: 25,
		durationVariancePercent: 0.25,
		preferredMachines: ['M1', 'M2', 'M3', 'M5', 'M6', 'M7', 'M8'],
		priority: 'rush',
		description: 'Rework minor QC issues + re-inspection',
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
		taskTypeId: 'CNC-WHL-AL50',
		displayName: 'CNC: Wheel Rim AL5052',
		baseWorkloadMinutes: 35,
		durationVariancePercent: 0.13,
		preferredMachines: ['M1', 'M2', 'M5', 'M6', 'M8'],
		priority: 'normal',
		description: 'High-precision rim machining + surface finish',
	},
	{
		taskTypeId: 'CNC-BRK-ST45',
		displayName: 'CNC: Brake Caliper',
		baseWorkloadMinutes: 40,
		durationVariancePercent: 0.11,
		preferredMachines: ['M1', 'M2', 'M5', 'M6', 'M8'],
		priority: 'critical',
		description: 'Precision boring - Brake caliper body',
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
		taskTypeId: 'TST-VIB-A01',
		displayName: 'Test: Vibration Analysis',
		baseWorkloadMinutes: 30,
		durationVariancePercent: 0.16,
		preferredMachines: ['M4'],
		priority: 'normal',
		description: 'Dynamic vibration testing + spectrum analysis',
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
];

// Simulation parameters
export const SIMULATION_CONFIG = {
	SPEED: 2, // simulation minutes per real second
	TICK_INTERVAL: 300, // ms between simulation ticks
	INITIAL_TASKS_MIN: 17,
	INITIAL_TASKS_MAX: 28,

	// Realistic batch arrival system (Poisson-like distribution)
	// Increased frequency (2x faster) as requested
	BATCH_ARRIVAL_INTERVAL_MIN: 4000, // ms (was 8000)
	BATCH_ARRIVAL_INTERVAL_MAX: 10000, // ms (was 20000)
	BATCH_SIZE_MIN: 1,
	BATCH_SIZE_MAX: 4, // Increased for more throughput
	BATCH_SIZE_WEIGHTS: [0.35, 0.30, 0.25, 0.10], // Adjusted for 4-item batches

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
	ASSIGNMENT_DELAY_MS: 2000, // Delay before assigning new task (planning)
	BATCH_OPTIMIZATION_WINDOW: 5, // How many tasks to analyze simultaneously for optimization
};

// Priority weights for scheduling
export const PRIORITY_WEIGHTS = {
	critical: 3,
	rush: 2,
	normal: 1,
};
