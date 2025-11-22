// Types for the production system

export type MachineType = 'CNC' | 'Assembly' | 'Test' | 'Packaging';

export type TaskStatus = 'waiting' | 'assigned' | 'in_progress' | 'done';

export type Priority = 'normal' | 'rush' | 'critical';

export type MachineStatus = 'idle' | 'processing' | 'maintenance' | 'breakdown';

// Machine definition
export interface Machine {
	id: string;
	name: string;
	type: MachineType;
	description: string;
	baseTimeMultiplier: number; // 0.8 for fast, 1.0 for normal, 1.2 for slow
	effectiveTimeMultiplier: number; // with random variance
	status: MachineStatus;
	currentTask: TaskInstance | null;
	queue: TaskInstance[];
	completedTasks: number;
	totalProcessingTime: number; // for utilization calculation
}

// Task type definition
export interface TaskType {
	taskTypeId: string;
	displayName: string;
	baseWorkloadMinutes: number;
	durationVariancePercent: number;
	preferredMachines: string[]; // machine IDs
	priority: Priority;
	description: string;
}

// Task instance (actual job to be processed)
export interface TaskInstance {
	id: string;
	typeId: string;
	displayName: string;
	workloadMinutes: number; // with variance applied
	remainingMinutes: number;
	createdAtSystemTime: number;
	createdAtRealTime: number; // timestamp for delayed assignment
	status: TaskStatus;
	priority: Priority;
	preferredMachines: string[];
	assignedMachine: string | null;
	progress: number; // 0 to 1
	estimatedDuration?: number; // calculated when assigned
	// New fields for details
	clientName: string;
	orderValue: number;
	orderDate: number; // timestamp
}

// Global system state
export interface MachineTypeFilters {
	CNC: boolean;
	Assembly: boolean;
	Test: boolean;
}

export interface SystemState {
	isRunning: boolean;
	autoAllocationEnabled: boolean;
	taskGenerationEnabled: boolean;
	autoAllocationFilters: MachineTypeFilters; // New: per machine type
	taskGenerationFilters: MachineTypeFilters; // New: per machine type
	productionTime: number; // in production minutes
	realStartTime: number; // timestamp
	lastUpdateTime: number; // timestamp
	timeScale: number; // production minutes per real second
	taskPool: TaskInstance[];
	machines: Machine[];
	completedTasks: TaskInstance[];
	totalCompletedCount: number; // Optimization: track count separately to avoid array length checks on huge arrays
	totalTasksGenerated: number;
	eventLog: SystemEvent[];
	analyticsHistory: AnalyticsSnapshot[];
}

// Metrics
export interface GlobalMetrics {
	hallLoad: number; // percentage
	estimatedCompletionTime: number; // minutes from now
	completedCount: number;
	inProgressCount: number;
	waitingCount: number;
	throughput: number; // tasks per hour
}

export interface MachineMetrics {
	machineId: string;
	currentProgress: number;
	eta: number; // minutes
	utilization: number; // percentage
	completedTasks: number;
	queueLength: number;
	queueTime: number; // total minutes in queue
}

// Event types for logging and analytics
export type EventType =
	| 'task_created'
	| 'task_assigned'
	| 'task_started'
	| 'task_completed'
	| 'task_cancelled'
	| 'machine_breakdown'
	| 'machine_repaired'
	| 'alert_sent'
	| 'rebalance_triggered';

export type AlertRecipient = 'technician' | 'supervisor' | 'manager' | 'quality_control';

export interface SystemEvent {
	id: string;
	timestamp: number; // real time
	productionTime: number; // production time
	type: EventType;
	severity: 'info' | 'warning' | 'critical';
	message: string;
	data?: {
		machineId?: string;
		taskId?: string;
		recipients?: AlertRecipient[];
		[key: string]: unknown;
	};
}

// Analytics data points for charts
export interface AnalyticsSnapshot {
	timestamp: number;
	productionTime: number;
	hallLoad: number;
	throughput: number;
	waitingTasks: number;
	activeTasks: number;
	completedTasks: number;
	machineUtilization: { [machineId: string]: number };
}
