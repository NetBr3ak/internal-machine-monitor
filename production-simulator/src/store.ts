import { create } from 'zustand';
import type { SimulationState, TaskInstance, Machine, GlobalMetrics, MachineMetrics } from './types';
import { MACHINES, TASK_TYPES, SIMULATION_CONFIG, PRIORITY_WEIGHTS } from './config';

// Helper functions
function randomInRange(min: number, max: number): number {
	return Math.random() * (max - min) + min;
}

function applyVariance(base: number, variancePercent: number): number {
	const variance = base * variancePercent;
	return base + randomInRange(-variance, variance);
}

function initializeMachines(): Machine[] {
	return MACHINES.map(machine => {
		let effectiveMultiplier: number;

		if (machine.baseTimeMultiplier < 0.9) {
			// Fast machine
			effectiveMultiplier = randomInRange(
				SIMULATION_CONFIG.FAST_MACHINE_MULT_MIN,
				SIMULATION_CONFIG.FAST_MACHINE_MULT_MAX
			);
		} else if (machine.baseTimeMultiplier > 1.1) {
			// Slow machine
			effectiveMultiplier = randomInRange(
				SIMULATION_CONFIG.SLOW_MACHINE_MULT_MIN,
				SIMULATION_CONFIG.SLOW_MACHINE_MULT_MAX
			);
		} else {
			// Normal machine
			effectiveMultiplier = randomInRange(
				SIMULATION_CONFIG.NORMAL_MACHINE_MULT_MIN,
				SIMULATION_CONFIG.NORMAL_MACHINE_MULT_MAX
			);
		}

		return {
			...machine,
			effectiveTimeMultiplier: effectiveMultiplier,
			status: 'idle',
			currentTask: null,
			queue: [],
			completedTasks: 0,
			totalProcessingTime: 0,
		};
	});
}

function generateTask(idCounter: number): TaskInstance {
	// Weighted task type selection optimized for machine capacity
	// CNC (5 machines): 80%
	// Assembly/Welding (2 machines): 10%
	// Test/Quality/Packaging (1 machine + shared): 10%
	const rand = Math.random();
	let selectedTypes: typeof TASK_TYPES;

	if (rand < 0.85) {
		// 85% CNC (Increased from 80%)
		selectedTypes = TASK_TYPES.filter(t => t.taskTypeId.startsWith('CNC-'));
	} else if (rand < 0.90) {
		// 5% Assembly & Welding (Reduced from 10%)
		selectedTypes = TASK_TYPES.filter(t => t.taskTypeId.startsWith('ASM-') || t.taskTypeId.startsWith('WLD-'));
	} else {
		// 10% Test, Calibration, Packaging, Rework
		selectedTypes = TASK_TYPES.filter(t =>
			t.taskTypeId.startsWith('TST-') ||
			t.taskTypeId.startsWith('CAL-') ||
			t.taskTypeId.startsWith('PKG-') ||
			t.taskTypeId.startsWith('RWK-')
		);
	}

	// Fallback if filter returns empty (shouldn't happen with current config)
	if (selectedTypes.length === 0) {
		selectedTypes = TASK_TYPES;
	}

	const taskType = selectedTypes[Math.floor(Math.random() * selectedTypes.length)];
	const workload = applyVariance(taskType.baseWorkloadMinutes, taskType.durationVariancePercent);

	return {
		id: `TASK-${String(idCounter).padStart(4, '0')}`,
		typeId: taskType.taskTypeId,
		displayName: taskType.displayName,
		workloadMinutes: Math.round(workload * 10) / 10,
		remainingMinutes: Math.round(workload * 10) / 10,
		createdAtSimTime: 0,
		status: 'waiting',
		priority: taskType.priority,
		preferredMachines: taskType.preferredMachines,
		assignedMachine: null,
		progress: 0,
	};
}

function generateInitialTasks(): TaskInstance[] {
	const count = Math.floor(
		randomInRange(SIMULATION_CONFIG.INITIAL_TASKS_MIN, SIMULATION_CONFIG.INITIAL_TASKS_MAX)
	);

	return Array.from({ length: count }, (_, i) => generateTask(i + 1));
}

/**
 * Advanced Production Scheduling Algorithm - Multi-Objective Optimization
 * 
 * This algorithm implements realistic production planning principles:
 * 1. Priority-weighted scheduling (Critical > Rush > Normal)
 * 2. Machine capability matching with preference scoring
 * 3. Load balancing across production hall (Time-based, not count-based)
 * 4. Setup time optimization (minimize task type changes)
 * 5. Transport time overhead accounting
 * 6. Makespan minimization with weighted scoring
 * 7. Batch processing hints for similar tasks
 * 
 * Scoring formula: score = (ETA × priorityWeight) + setupPenalty + loadBalancePenalty - preferenceBonus
 * Lower score = better assignment
 */
function calculateSetupTime(machine: Machine, newTaskType: string): number {
	// Check if last task in queue (or current) is same type - no setup needed
	if (machine.queue.length > 0) {
		const lastTask = machine.queue[machine.queue.length - 1];
		if (lastTask.typeId === newTaskType) {
			return 0; // Same type, no setup
		}
	} else if (machine.currentTask?.typeId === newTaskType) {
		return 0; // Same type as current, no setup
	}
	return SIMULATION_CONFIG.SETUP_TIME_MINUTES;
}

function getMachineAvailableTime(machine: Machine): number {
	const currentRemaining = machine.currentTask?.remainingMinutes || 0;
	const queueTime = machine.queue.reduce((sum, t) => {
		// Use estimatedDuration if available (it includes setup/transport), otherwise raw calculation
		return sum + (t.estimatedDuration || (t.workloadMinutes * machine.effectiveTimeMultiplier + SIMULATION_CONFIG.TRANSPORT_TIME_MINUTES));
	}, 0);
	return currentRemaining + queueTime;
}

function assignTask(task: TaskInstance, machines: Machine[]): string | null {
	// 1. Filter candidates
	const preferredMachines = machines.filter(m => task.preferredMachines.includes(m.id));
	// Fallback to all machines only if absolutely necessary
	const candidates = preferredMachines.length > 0 ? preferredMachines : machines;

	// 2. Calculate context for load balancing
	// We use time-based load, not count-based
	const loads = candidates.map(m => getMachineAvailableTime(m));
	const minLoad = Math.min(...loads);
	const avgLoad = loads.reduce((a, b) => a + b, 0) / loads.length;

	let bestMachine: Machine | null = null;
	let minScore = Infinity;

	for (const machine of candidates) {
		const availableAt = getMachineAvailableTime(machine);
		const setupTime = calculateSetupTime(machine, task.typeId);

		// Raw processing time on this specific machine
		const processingTime = task.workloadMinutes * machine.effectiveTimeMultiplier;

		// Total time this task will occupy on the machine
		const taskTotalDuration = processingTime + setupTime + SIMULATION_CONFIG.TRANSPORT_TIME_MINUTES;

		// When this task would finish
		const completionTime = availableAt + taskTotalDuration;

		// --- SCORING FACTORS ---

		// 1. Makespan / Availability Score
		// How much does this delay the machine?
		// For Critical tasks, we want minimal completionTime.
		// For Normal tasks, we care more about not creating huge imbalances.
		// let timeScore = completionTime; // Unused variable removed

		// 2. Efficiency Score
		// We want to minimize the actual processing time (use fast machines for heavy tasks).
		const efficiencyScore = processingTime * 2.0;

		// 3. Setup Score
		// We want to minimize setups.
		const setupScore = setupTime * 15.0; // Very High penalty for setup to force batching

		// 4. Load Balancing Score
		// Penalize if this machine is already much busier than others.
		// Use exponential penalty for severe imbalance
		const loadDiff = Math.max(0, availableAt - minLoad);
		const loadRatio = avgLoad > 0 ? availableAt / avgLoad : 1;

		// If machine is > 50% busier than average, apply massive penalty
		const overloadPenalty = loadRatio > 1.5 ? loadDiff * 5 : 0;
		const loadScore = (loadDiff * 2.0) + overloadPenalty;

		// 5. Priority Adjustments
		let finalScore = 0;

		if (task.priority === 'critical') {
			// Critical: Finish ASAP. Ignore efficiency if needed.
			// Heavily weight completionTime.
			finalScore = (completionTime * 20.0) + setupScore + (loadScore * 0.2);
		} else if (task.priority === 'rush') {
			// Rush: Balance speed and efficiency.
			finalScore = (completionTime * 8.0) + efficiencyScore + setupScore + loadScore;
		} else {
			// Normal: Optimize for global efficiency and throughput (batching).
			// We can wait a bit if it means using a faster machine or avoiding setup.
			// BUT: If load imbalance is huge, force distribution.
			finalScore = (completionTime * 1.5) + (efficiencyScore * 4.0) + (setupScore * 3.0) + (loadScore * 4.0);
		}

		if (finalScore < minScore) {
			minScore = finalScore;
			bestMachine = machine;
		}
	}

	return bestMachine?.id || null;
} interface SimulationStore extends SimulationState {
	// Actions
	startSimulation: () => void;
	pauseSimulation: () => void;
	resetSimulation: () => void;
	tick: () => void;
	assignAllTasks: () => void;
	addNewTask: () => void;
	addTaskBatch: () => void;

	// Metrics
	getGlobalMetrics: () => GlobalMetrics;
	getMachineMetrics: (machineId: string) => MachineMetrics | null;
}

export const useSimulationStore = create<SimulationStore>((set, get) => ({
	// Initial state
	isRunning: false,
	simulationTime: 0,
	realStartTime: 0,
	lastUpdateTime: 0,
	speed: SIMULATION_CONFIG.SPEED,
	taskPool: [],
	machines: initializeMachines(),
	completedTasks: [],
	totalTasksGenerated: 0,

	startSimulation: () => {
		const now = Date.now();
		set({
			isRunning: true,
			realStartTime: now,
			lastUpdateTime: now,
		});
	},

	pauseSimulation: () => {
		set({ isRunning: false });
	},

	resetSimulation: () => {
		const initialTasks = generateInitialTasks();
		set({
			isRunning: false,
			simulationTime: 0,
			realStartTime: 0,
			lastUpdateTime: 0,
			taskPool: initialTasks,
			machines: initializeMachines(),
			completedTasks: [],
			totalTasksGenerated: initialTasks.length,
		});
	},

	assignAllTasks: () => {
		const state = get();
		const machines = [...state.machines];
		const taskPool = [...state.taskPool];

		if (taskPool.length === 0) return;

		// Multi-criteria sorting for optimal batch processing:
		// 1. Priority (critical > rush > normal)
		// 2. Machine type grouping (CNC together, Assembly together, etc.)
		// 3. Similar workload (batch similar duration tasks)
		const sortedTasks = taskPool.sort((a, b) => {
			// Primary: Priority
			const priorityDiff = PRIORITY_WEIGHTS[b.priority] - PRIORITY_WEIGHTS[a.priority];
			if (priorityDiff !== 0) return priorityDiff;

			// Secondary: Group by Task Type ID (for setup optimization)
			const typeDiff = a.typeId.localeCompare(b.typeId);
			if (typeDiff !== 0) return typeDiff;

			// Tertiary: Workload (LPT - Longest Processing Time first)
			return b.workloadMinutes - a.workloadMinutes;
		});

		const assignedTasks: TaskInstance[] = [];
		const remainingTasks: TaskInstance[] = [];

		// Batch optimization: analyze multiple tasks together
		for (const task of sortedTasks) {
			const machineId = assignTask(task, machines);

			if (machineId) {
				const machine = machines.find(m => m.id === machineId);
				if (machine) {
					// Calculate realistic duration with all overheads
					const baseDuration = task.workloadMinutes * machine.effectiveTimeMultiplier;
					const setupTime = calculateSetupTime(machine, task.typeId);
					const totalDuration = baseDuration + SIMULATION_CONFIG.TRANSPORT_TIME_MINUTES + setupTime;

					const updatedTask: TaskInstance = {
						...task,
						status: 'assigned',
						assignedMachine: machineId,
						estimatedDuration: totalDuration,
					};
					machine.queue.push(updatedTask);
					assignedTasks.push(updatedTask);
				}
			} else {
				remainingTasks.push(task);
			}
		}

		set({
			machines,
			taskPool: remainingTasks,
		});
	},

	tick: () => {
		const state = get();
		if (!state.isRunning) return;

		const now = Date.now();
		const realTimeDelta = (now - state.lastUpdateTime) / 1000; // seconds
		const simTimeDelta = realTimeDelta * state.speed; // simulation minutes

		const machines = [...state.machines];
		const completedTasks = [...state.completedTasks];

		// Update each machine
		for (const machine of machines) {
			// If idle and has queue, start next task
			if (machine.status === 'idle' && machine.queue.length > 0) {
				const nextTask = machine.queue.shift()!;
				nextTask.status = 'in_progress';
				nextTask.remainingMinutes = nextTask.workloadMinutes * machine.effectiveTimeMultiplier;
				machine.currentTask = nextTask;
				machine.status = 'processing';
			}

			// If processing, update progress
			if (machine.status === 'processing' && machine.currentTask) {
				const task = machine.currentTask;
				const previousRemaining = task.remainingMinutes;
				task.remainingMinutes = Math.max(0, task.remainingMinutes - simTimeDelta);

				const totalDuration = task.estimatedDuration || task.workloadMinutes * machine.effectiveTimeMultiplier;
				task.progress = 1 - (task.remainingMinutes / totalDuration);

				// Track processing time
				const actualTimeDelta = previousRemaining - task.remainingMinutes;
				machine.totalProcessingTime += actualTimeDelta;

				// If task completed
				if (task.remainingMinutes <= 0) {
					task.status = 'done';
					task.progress = 1;
					completedTasks.push(task);
					machine.completedTasks += 1;
					machine.currentTask = null;
					machine.status = 'idle';
				}
			}
		}

		set({
			simulationTime: state.simulationTime + simTimeDelta,
			lastUpdateTime: now,
			machines,
			completedTasks,
		});
	},

	addNewTask: () => {
		const state = get();
		const newTask = generateTask(state.totalTasksGenerated + 1);
		newTask.createdAtSimTime = state.simulationTime;

		set({
			taskPool: [...state.taskPool, newTask],
			totalTasksGenerated: state.totalTasksGenerated + 1,
		});

		// Realistic delay: Planning department needs time to analyze and assign
		// This simulates real production planning workflow
		setTimeout(() => {
			if (get().isRunning) {
				get().assignAllTasks();
			}
		}, SIMULATION_CONFIG.ASSIGNMENT_DELAY_MS);
	},

	addTaskBatch: () => {
		const state = get();

		// Determine batch size using weighted random selection
		const rand = Math.random();
		let batchSize = 1;
		let cumulative = 0;

		for (let i = 0; i < SIMULATION_CONFIG.BATCH_SIZE_WEIGHTS.length; i++) {
			cumulative += SIMULATION_CONFIG.BATCH_SIZE_WEIGHTS[i];
			if (rand < cumulative) {
				batchSize = i + 1; // +1 because array is 0-indexed
				break;
			}
		}

		// Generate batch of tasks
		const newTasks: TaskInstance[] = [];
		for (let i = 0; i < batchSize; i++) {
			const task = generateTask(state.totalTasksGenerated + i + 1);
			task.createdAtSimTime = state.simulationTime;
			newTasks.push(task);
		}

		set({
			taskPool: [...state.taskPool, ...newTasks],
			totalTasksGenerated: state.totalTasksGenerated + batchSize,
		});

		// Staggered assignment: assign tasks with small delays between them
		// This creates a more natural flow
		newTasks.forEach((_, index) => {
			setTimeout(() => {
				if (get().isRunning) {
					get().assignAllTasks();
				}
			}, SIMULATION_CONFIG.ASSIGNMENT_DELAY_MS + (index * 800)); // 800ms stagger
		});
	},

	getGlobalMetrics: (): GlobalMetrics => {
		const state = get();
		const machines = state.machines;

		// Calculate hall load (average machine utilization)
		let totalLoad = 0;
		let maxETA = 0;

		for (const machine of machines) {
			const queueTime = machine.queue.reduce((sum, t) => {
				return sum + (t.workloadMinutes * machine.effectiveTimeMultiplier);
			}, 0);

			const currentRemaining = machine.currentTask?.remainingMinutes || 0;
			const eta = currentRemaining + queueTime;

			if (eta > maxETA) maxETA = eta;

			// Simple utilization: is it busy?
			if (machine.status === 'processing' || machine.queue.length > 0) {
				totalLoad += 1;
			}
		}

		const hallLoad = (totalLoad / machines.length) * 100;

		// Count tasks
		const completedCount = state.completedTasks.length;
		const inProgressCount = machines.filter(m => m.status === 'processing').length;
		const waitingCount = state.taskPool.length + machines.reduce((sum, m) => sum + m.queue.length, 0);

		// Calculate throughput (tasks completed per hour)
		const simHours = state.simulationTime / 60;
		const throughput = simHours > 0 ? completedCount / simHours : 0;

		return {
			hallLoad: Math.round(hallLoad),
			estimatedCompletionTime: Math.round(maxETA),
			completedCount,
			inProgressCount,
			waitingCount,
			throughput: Math.round(throughput * 10) / 10,
			totalThroughput: [], // TODO: track over time
		};
	},

	getMachineMetrics: (machineId: string): MachineMetrics | null => {
		const state = get();
		const machine = state.machines.find(m => m.id === machineId);
		if (!machine) return null;

		const queueTime = machine.queue.reduce((sum, t) => {
			return sum + (t.workloadMinutes * machine.effectiveTimeMultiplier);
		}, 0);

		const currentRemaining = machine.currentTask?.remainingMinutes || 0;
		const eta = currentRemaining + queueTime;

		// Calculate utilization
		const simMinutes = state.simulationTime;
		const utilization = simMinutes > 0 ? (machine.totalProcessingTime / simMinutes) * 100 : 0;

		return {
			machineId: machine.id,
			currentProgress: machine.currentTask?.progress || 0,
			eta: Math.round(eta * 10) / 10,
			utilization: Math.round(utilization),
			completedTasks: machine.completedTasks,
			queueLength: machine.queue.length,
			queueTime: Math.round(queueTime),
		};
	},
}));
