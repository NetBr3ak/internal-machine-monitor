// Types for the production simulation system

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
	createdAtSimTime: number;
	status: TaskStatus;
	priority: Priority;
	preferredMachines: string[];
	assignedMachine: string | null;
	progress: number; // 0 to 1
	estimatedDuration?: number; // calculated when assigned
}

// Global simulation state
export interface SimulationState {
	isRunning: boolean;
	simulationTime: number; // in simulation minutes
	realStartTime: number; // timestamp
	lastUpdateTime: number; // timestamp
	speed: number; // simulation minutes per real second
	taskPool: TaskInstance[];
	machines: Machine[];
	completedTasks: TaskInstance[];
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
	totalThroughput: number[];
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
	| 'machine_breakdown'
	| 'machine_repaired'
	| 'alert_sent'
	| 'rebalance_triggered';

export type AlertRecipient = 'technician' | 'supervisor' | 'manager' | 'quality_control';

export interface SystemEvent {
	id: string;
	timestamp: number; // real time
	simTime: number; // simulation time
	type: EventType;
	severity: 'info' | 'warning' | 'critical';
	message: string;
	data?: {
		machineId?: string;
		taskId?: string;
		recipients?: AlertRecipient[];
		[key: string]: any;
	};
}

// Analytics data points for charts
export interface AnalyticsSnapshot {
	timestamp: number;
	simTime: number;
	hallLoad: number;
	throughput: number;
	waitingTasks: number;
	activeTasks: number;
	completedTasks: number;
	machineUtilization: { [machineId: string]: number };
}
