import { create } from 'zustand';
import type { SystemState, TaskInstance, Machine, GlobalMetrics, MachineMetrics, SystemEvent, AnalyticsSnapshot, EventType, AlertRecipient, MachineTypeFilters } from './types';
import { MACHINES, TASK_TYPES, SYSTEM_CONFIG, CLIENT_NAMES } from './config';

let eventIdCounter = 0;

// === WAVE SYSTEM FOR DYNAMIC LOAD ===
// Oscillates between high and low load phases for realistic demo
let wavePhase: 'surge' | 'normal' | 'calm' = 'normal';
let waveTimer = 0;
const WAVE_DURATION_MIN = 15000; // 15 seconds minimum per phase
const WAVE_DURATION_MAX = 45000; // 45 seconds maximum per phase

function updateWavePhase(): void {
	const now = Date.now();
	if (now - waveTimer > randomInRange(WAVE_DURATION_MIN, WAVE_DURATION_MAX)) {
		waveTimer = now;
		const rand = Math.random();
		if (rand < 0.3) {
			wavePhase = 'surge'; // 30% chance - high load burst
		} else if (rand < 0.7) {
			wavePhase = 'normal'; // 40% chance - normal operation
		} else {
			wavePhase = 'calm'; // 30% chance - low activity
		}
	}
}

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
				SYSTEM_CONFIG.FAST_MACHINE_MULT_MIN,
				SYSTEM_CONFIG.FAST_MACHINE_MULT_MAX
			);
		} else if (machine.baseTimeMultiplier > 1.1) {
			// Slow machine
			effectiveMultiplier = randomInRange(
				SYSTEM_CONFIG.SLOW_MACHINE_MULT_MIN,
				SYSTEM_CONFIG.SLOW_MACHINE_MULT_MAX
			);
		} else {
			// Normal machine
			effectiveMultiplier = randomInRange(
				SYSTEM_CONFIG.NORMAL_MACHINE_MULT_MIN,
				SYSTEM_CONFIG.NORMAL_MACHINE_MULT_MAX
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

function generateTask(idCounter: number, targetCategory?: 'CNC' | 'Assembly' | 'Test'): TaskInstance {
	// BALANCED task type selection - adjusted for realistic machine utilization
	// CNC (5 machines, slow 0.25-0.6x): ~35% of tasks
	// Assembly (2 machines, normal 1.0x): ~35% of tasks
	// Test (1 machine, fast 1.1-1.3x): ~30% of tasks
	const rand = Math.random();
	let selectedTypes: typeof TASK_TYPES = [];

	if (targetCategory) {
		if (targetCategory === 'CNC') {
			selectedTypes = TASK_TYPES.filter(t => t.taskTypeId.startsWith('CNC-'));
		} else if (targetCategory === 'Assembly') {
			selectedTypes = TASK_TYPES.filter(t => t.taskTypeId.startsWith('ASM-') || t.taskTypeId.startsWith('WLD-'));
		} else {
			selectedTypes = TASK_TYPES.filter(t =>
				t.taskTypeId.startsWith('TST-') ||
				t.taskTypeId.startsWith('CAL-') ||
				t.taskTypeId.startsWith('PKG-') ||
				t.taskTypeId.startsWith('RWK-')
			);
		}
	}

	// Fallback if no target or empty filter
	// More balanced proportions for realistic demo
	if (selectedTypes.length === 0) {
		if (rand < 0.35) {
			// 35% CNC (5 machines)
			selectedTypes = TASK_TYPES.filter(t => t.taskTypeId.startsWith('CNC-'));
		} else if (rand < 0.70) {
			// 35% Assembly & Welding (2 machines)
			selectedTypes = TASK_TYPES.filter(t => t.taskTypeId.startsWith('ASM-') || t.taskTypeId.startsWith('WLD-'));
		} else {
			// 30% Test, Calibration, Packaging, Rework (1 machine)
			selectedTypes = TASK_TYPES.filter(t =>
				t.taskTypeId.startsWith('TST-') ||
				t.taskTypeId.startsWith('CAL-') ||
				t.taskTypeId.startsWith('PKG-') ||
				t.taskTypeId.startsWith('RWK-')
			);
		}
	}

	// Fallback if filter returns empty (shouldn't happen with current config)
	if (selectedTypes.length === 0) {
		selectedTypes = TASK_TYPES;
	}

	const taskType = selectedTypes[Math.floor(Math.random() * selectedTypes.length)];
	const workload = applyVariance(taskType.baseWorkloadMinutes, taskType.durationVariancePercent);

	// Generate random client data
	const clientName = CLIENT_NAMES[Math.floor(Math.random() * CLIENT_NAMES.length)];
	const orderValue = Math.round((workload * 50) + (Math.random() * 500)); // Rough calculation based on workload
	const orderDate = Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 2); // Random time in last 2 days

	return {
		id: `TASK-${String(idCounter).padStart(4, '0')}`,
		typeId: taskType.taskTypeId,
		displayName: taskType.displayName,
		workloadMinutes: Math.round(workload * 10) / 10,
		remainingMinutes: Math.round(workload * 10) / 10,
		createdAtSystemTime: 0,
		createdAtRealTime: Date.now(),
		status: 'waiting',
		priority: taskType.priority,
		preferredMachines: taskType.preferredMachines,
		assignedMachine: null,
		progress: 0,
		clientName,
		orderValue,
		orderDate,
	};
}

function generateInitialTasks(): TaskInstance[] {
	const count = Math.floor(
		randomInRange(SYSTEM_CONFIG.INITIAL_BATCH_MIN, SYSTEM_CONFIG.INITIAL_BATCH_MAX)
	);

	// Initial distribution: more balanced for visible activity on all machines
	// CNC: ~60%, Assembly: ~25%, Test: ~15%
	return Array.from({ length: count }, (_, i) => {
		const rand = Math.random();
		let category: 'CNC' | 'Assembly' | 'Test' | undefined;

		if (rand < 0.60) {
			category = 'CNC';
		} else if (rand < 0.85) {
			category = 'Assembly';
		} else {
			category = 'Test';
		}

		return generateTask(i + 1, category);
	});
}

/**
 * ForgeFlow™ MCT-S Scheduling Algorithm
 * (Minimum Completion Time with Setup Awareness)
 * 
 * Multi-objective optimization engine for real-time production scheduling.
 * 
 * Algorithm phases:
 * 1. SORT: Priority → Constraint Tightness → LPT (Longest Processing Time)
 * 2. SCORE: ETA × priorityWeight + setupPenalty + transportTime - preferenceBonus
 * 3. ASSIGN: Select machine with lowest score, tie-break on setup time
 * 4. STEAL: Idle machines dynamically steal from overloaded queues
 * 
 * Theoretical foundations:
 * - Johnson's Rule (optimal 2-machine flow shop)
 * - List Scheduling (priority-based greedy assignment)
 * - Work Stealing (parallel computing load balancing)
 * - Bin Packing LPT heuristic (makespan minimization)
 * 
 * Performance targets:
 * - Scheduling latency: <200ms
 * - Rebalance time: <500ms
 * - Work steal rate: ~15%
 * - Setup optimization: ~40% reduction
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
	return SYSTEM_CONFIG.SETUP_TIME_MINUTES;
}

// Helper function to log events
function logEvent(
	get: () => SystemState,
	set: (partial: Partial<SystemState>) => void,
	type: EventType,
	message: string,
	severity: 'info' | 'warning' | 'critical',
	data?: Record<string, unknown>
) {
	const state = get();
	const event: SystemEvent = {
		id: `EVT-${String(++eventIdCounter).padStart(6, '0')}`,
		timestamp: Date.now(),
		productionTime: state.productionTime,
		type,
		message,
		severity,
		data
	};

	// Optimization: Cap event log size to prevent memory issues
	const newLog = [...state.eventLog, event];
	if (newLog.length > 500) {
		newLog.shift(); // Remove oldest
	}

	set({ eventLog: newLog });
}

// Helper function to capture analytics snapshot
function captureAnalytics(get: () => SystemState, set: (partial: Partial<SystemState>) => void) {
	const state = get();
	const snapshot: AnalyticsSnapshot = {
		timestamp: Date.now(),
		productionTime: state.productionTime,
		hallLoad: 0,
		throughput: 0,
		waitingTasks: state.taskPool.length,
		activeTasks: state.machines.filter((m: Machine) => m.status === 'processing').length,
		completedTasks: state.totalCompletedCount,
		machineUtilization: {}
	};

	// Calculate hall load and machine utilization
	let totalLoad = 0;
	state.machines.forEach((m: Machine) => {
		const util = state.productionTime > 0 ? (m.totalProcessingTime / state.productionTime) * 100 : 0;
		snapshot.machineUtilization[m.id] = Math.round(util);
		if (m.status === 'processing' || m.queue.length > 0) totalLoad++;
	});

	snapshot.hallLoad = Math.round((totalLoad / state.machines.length) * 100);

	// Calculate throughput
	const simHours = state.productionTime / 60;
	snapshot.throughput = simHours > 0 ? Math.round((state.totalCompletedCount / simHours) * 10) / 10 : 0;

	// Keep last 60 snapshots (matches chart display)
	const history = [...state.analyticsHistory, snapshot].slice(-60);
	set({ analyticsHistory: history });
}

interface SystemStore extends SystemState {
	// Actions
	startSystem: () => void;
	pauseSystem: () => void;
	resetSystem: () => void;
	tick: () => void;
	assignAllTasks: () => void;
	addTaskBatch: () => void;
	toggleMachineBreakdown: (machineId: string) => void;
	toggleAutoAllocation: () => void;
	toggleTaskGeneration: () => void;
	toggleAutoAllocationFilter: (machineType: keyof MachineTypeFilters) => void;
	toggleTaskGenerationFilter: (machineType: keyof MachineTypeFilters) => void;
	manualAssignTask: (taskId: string, machineId: string) => void;
	cancelTask: (taskId: string) => void;

	// Metrics
	getGlobalMetrics: () => GlobalMetrics;
	getMachineMetrics: (machineId: string) => MachineMetrics | null;
}

export const useSystemStore = create<SystemStore>((set, get) => ({
	// Initial state
	isRunning: false,
	autoAllocationEnabled: true,
	taskGenerationEnabled: true,
	autoAllocationFilters: { CNC: true, Assembly: true, Test: true },
	taskGenerationFilters: { CNC: true, Assembly: true, Test: true },
	productionTime: 0,
	realStartTime: 0,
	lastUpdateTime: 0,
	timeScale: SYSTEM_CONFIG.TIME_SCALE,
	taskPool: [],
	machines: initializeMachines(),
	completedTasks: [],
	totalCompletedCount: 0,
	totalTasksGenerated: 0,
	eventLog: [],
	analyticsHistory: [],

	startSystem: () => {
		const now = Date.now();
		set({
			isRunning: true,
			realStartTime: now,
			lastUpdateTime: now,
		});
	},

	pauseSystem: () => {
		set({ isRunning: false });
	},

	resetSystem: () => {
		const initialTasks = generateInitialTasks();
		set({
			isRunning: false,
			productionTime: 0,
			realStartTime: 0,
			lastUpdateTime: 0,
			taskPool: initialTasks,
			machines: initializeMachines(),
			completedTasks: [],
			totalCompletedCount: 0,
			totalTasksGenerated: initialTasks.length,
		});
	},

	assignAllTasks: () => {
		const state = get();
		if (!state.autoAllocationEnabled) return;

		const now = Date.now();

		// Filter tasks that are ready for assignment (wait period passed)
		const readyTasks = state.taskPool.filter(t =>
			(now - t.createdAtRealTime) >= SYSTEM_CONFIG.ASSIGNMENT_DELAY_MS
		);

		const notReadyTasks = state.taskPool.filter(t =>
			(now - t.createdAtRealTime) < SYSTEM_CONFIG.ASSIGNMENT_DELAY_MS
		);

		if (readyTasks.length === 0) return;

		// --- OPTIMIZED SORTING STRATEGY ---
		// 1. Priority: Critical > Rush > Normal
		// 2. Constraint Tightness: Tasks with fewer capable machines first (Hardest to place)
		// 3. Workload: Longest Processing Time (LPT) first (Best for packing)

		const sortedTasks = [...readyTasks].sort((a, b) => {
			// 1. Priority
			const priorityScore = { critical: 3, rush: 2, normal: 1 };
			if (priorityScore[a.priority] !== priorityScore[b.priority]) {
				return priorityScore[b.priority] - priorityScore[a.priority];
			}

			// 2. Constraint Tightness (Fewer preferred machines = Higher priority)
			// If preferredMachines is empty, it means ALL machines (low tightness)
			const aTightness = a.preferredMachines.length || 999;
			const bTightness = b.preferredMachines.length || 999;
			if (aTightness !== bTightness) {
				return aTightness - bTightness; // Ascending (fewer options first)
			}

			// 3. Workload (LPT)
			return b.workloadMinutes - a.workloadMinutes;
		});

		const remainingReadyTasks: TaskInstance[] = [];

		// Create a deep copy of machines structure for the system step
		const newMachines = state.machines.map(m => ({
			...m,
			queue: [...m.queue]
		}));

		// --- OPTIMIZED ASSIGNMENT STRATEGY (MCT-S) ---
		// Minimum Completion Time with Setup Awareness

		for (const task of sortedTasks) {
			// 1. Identify Candidates - respecting autoAllocationFilters
			const operationalMachines = newMachines.filter(m => {
				if (m.status === 'breakdown' || m.status === 'maintenance') return false;
				// Check if this machine type is enabled for auto-allocation
				const machineType = m.type as keyof typeof state.autoAllocationFilters;
				if (!state.autoAllocationFilters[machineType]) return false;
				return true;
			});
			let candidates = operationalMachines.filter(m => task.preferredMachines.includes(m.id));
			if (candidates.length === 0) candidates = operationalMachines; // Fallback

			if (candidates.length === 0) {
				remainingReadyTasks.push(task);
				continue;
			}

			let bestMachine: Machine | null = null;
			let bestScore = Infinity;

			// 2. Evaluate each candidate using MCT-S scoring
			for (const machine of candidates) {
				// Calculate when machine becomes free (ETA)
				const currentRemaining = machine.currentTask?.remainingMinutes || 0;
				const queueTime = machine.queue.reduce((sum, t) => {
					return sum + (t.estimatedDuration || (t.workloadMinutes * machine.effectiveTimeMultiplier + SYSTEM_CONFIG.TRANSPORT_TIME_MINUTES));
				}, 0);
				const availableAt = currentRemaining + queueTime;

				// Calculate duration components
				const setupTime = calculateSetupTime(machine, task.typeId);
				const processingTime = task.workloadMinutes * machine.effectiveTimeMultiplier;
				const transportTime = SYSTEM_CONFIG.TRANSPORT_TIME_MINUTES;

				// Completion time (ETA)
				const completionTime = availableAt + processingTime + setupTime + transportTime;

				// Preference bonus: -10% if this is a preferred machine
				const isPreferred = task.preferredMachines.includes(machine.id);
				const preferenceBonus = isPreferred ? completionTime * 0.10 : 0;

				// Priority weight multiplier
				const priorityWeight = { critical: 1, rush: 1.5, normal: 2 };

				// Final score: lower = better
				// Score = (completionTime - preferenceBonus) × priorityWeight
				const score = (completionTime - preferenceBonus) * priorityWeight[task.priority];

				// 3. Selection: minimize score with setup tie-breaker
				if (score < bestScore) {
					bestScore = score;
					bestMachine = machine;
				} else if (Math.abs(score - bestScore) < 0.5) {
					// Tie-breaker: prefer no setup change
					const currentBestSetup = bestMachine ? calculateSetupTime(bestMachine, task.typeId) : Infinity;
					if (setupTime < currentBestSetup) {
						bestMachine = machine;
						bestScore = score;
					}
				}
			}

			// 4. Assign
			if (bestMachine) {
				const setupTime = calculateSetupTime(bestMachine, task.typeId);
				const baseDuration = task.workloadMinutes * bestMachine.effectiveTimeMultiplier;
				const totalDuration = baseDuration + SYSTEM_CONFIG.TRANSPORT_TIME_MINUTES + setupTime;

				const updatedTask: TaskInstance = {
					...task,
					status: 'assigned',
					assignedMachine: bestMachine.id,
					estimatedDuration: totalDuration,
				};
				bestMachine.queue.push(updatedTask);
			} else {
				remainingReadyTasks.push(task);
			}
		}

		set({
			machines: newMachines,
			taskPool: [...remainingReadyTasks, ...notReadyTasks],
		});

		const assignedCount = sortedTasks.length - remainingReadyTasks.length;
		if (assignedCount > 0) {
			logEvent(get, set, 'task_assigned',
				`Optimized schedule (MCT-S): Assigned ${assignedCount} tasks`,
				'info'
			);
		}
	},

	tick: () => {
		const state = get();
		if (!state.isRunning) return;

		const now = Date.now();
		const realTimeDelta = (now - state.lastUpdateTime) / 1000; // seconds
		const productionTimeDelta = realTimeDelta * state.timeScale; // production minutes

		const tasksCompletedInThisTick: TaskInstance[] = [];
		let hasUpdates = false;

		// --- WORK STEALING & REBALANCING PHASE ---
		// Before processing, check if any idle machine can help a busy one.
		// This handles the "one machine empty, other busy" scenario dynamically.
		const machinesForTick = [...state.machines];

		const idleMachines = machinesForTick.filter(m => m.status === 'idle' && m.queue.length === 0);
		const busyMachines = machinesForTick.filter(m => m.queue.length > 1).sort((a, b) => b.queue.length - a.queue.length);

		if (idleMachines.length > 0 && busyMachines.length > 0) {
			for (const idleMachine of idleMachines) {
				// Skip if machine type is not enabled for auto-allocation
				const idleMachineType = idleMachine.type as keyof typeof state.autoAllocationFilters;
				if (!state.autoAllocationFilters[idleMachineType]) continue;

				// Find best task to steal (prefer tasks that match idle machine's capabilities)
				let bestStealCandidate: { task: TaskInstance; index: number; machine: Machine; benefit: number } | null = null;

				for (const busyMachine of busyMachines) {
					if (busyMachine.queue.length <= 1) continue; // Keep at least 1 task

					// Evaluate each task in queue for stealing
					for (let i = 0; i < busyMachine.queue.length; i++) {
						const task = busyMachine.queue[i];

						// Check capability: preferred or universal
						const canProcess = task.preferredMachines.includes(idleMachine.id) || task.preferredMachines.length === 0;
						if (!canProcess) continue;

						// Calculate benefit: how much earlier will this task complete?
						const currentETA = busyMachine.queue.slice(0, i + 1).reduce((sum, t) =>
							sum + (t.estimatedDuration || t.workloadMinutes * busyMachine.effectiveTimeMultiplier), 0);
						const newDuration = task.workloadMinutes * idleMachine.effectiveTimeMultiplier + SYSTEM_CONFIG.TRANSPORT_TIME_MINUTES;
						const benefit = currentETA - newDuration;

						// Only steal if there's actual benefit
						if (benefit > 0 && (!bestStealCandidate || benefit > bestStealCandidate.benefit)) {
							bestStealCandidate = { task, index: i, machine: busyMachine, benefit };
						}
					}
				}

				// Execute the steal if we found a good candidate
				if (bestStealCandidate) {
					const { task: stolenTask, index, machine: sourceMachine } = bestStealCandidate;
					sourceMachine.queue.splice(index, 1);

					// Update task metadata
					stolenTask.assignedMachine = idleMachine.id;
					const setupTime = calculateSetupTime(idleMachine, stolenTask.typeId);
					const baseDuration = stolenTask.workloadMinutes * idleMachine.effectiveTimeMultiplier;
					stolenTask.estimatedDuration = baseDuration + SYSTEM_CONFIG.TRANSPORT_TIME_MINUTES + setupTime;

					idleMachine.queue.push(stolenTask);
					hasUpdates = true;

					logEvent(get, set, 'rebalance_triggered',
						`Work stealing: ${stolenTask.id} moved ${sourceMachine.id} → ${idleMachine.id} (benefit: ${Math.round(bestStealCandidate.benefit)}min)`,
						'info'
					);
				}
			}
		} const newMachines = machinesForTick.map(machine => {
			// Skip broken or maintenance machines
			if (machine.status === 'breakdown' || machine.status === 'maintenance') {
				return machine;
			}

			const updatedMachine = { ...machine };
			let didUpdate = false;

			// If idle and has queue, start next task
			if (updatedMachine.status === 'idle' && updatedMachine.queue.length > 0) {
				const [nextTask, ...remainingQueue] = updatedMachine.queue;

				const taskToStart: TaskInstance = {
					...nextTask,
					status: 'in_progress',
					remainingMinutes: nextTask.workloadMinutes * updatedMachine.effectiveTimeMultiplier
				};

				updatedMachine.queue = remainingQueue;
				updatedMachine.currentTask = taskToStart;
				updatedMachine.status = 'processing';
				didUpdate = true;

				// Log event
				logEvent(get, set, 'task_started',
					`Task ${taskToStart.id} started on ${updatedMachine.id}`,
					'info',
					{ taskId: taskToStart.id, machineId: updatedMachine.id }
				);
			}			// If processing, update progress
			if (updatedMachine.status === 'processing' && updatedMachine.currentTask) {
				const task = { ...updatedMachine.currentTask };
				const previousRemaining = task.remainingMinutes;
				task.remainingMinutes = Math.max(0, task.remainingMinutes - productionTimeDelta);

				const totalDuration = task.estimatedDuration || task.workloadMinutes * updatedMachine.effectiveTimeMultiplier;
				task.progress = 1 - (task.remainingMinutes / totalDuration);

				// Track processing time
				const actualTimeDelta = previousRemaining - task.remainingMinutes;
				updatedMachine.totalProcessingTime += actualTimeDelta;
				updatedMachine.currentTask = task;
				didUpdate = true;

				// If task completed
				if (task.remainingMinutes <= 0) {
					const completedTask: TaskInstance = {
						...task,
						status: 'done',
						progress: 1
					};

					tasksCompletedInThisTick.push(completedTask);
					updatedMachine.completedTasks += 1;
					updatedMachine.currentTask = null;
					updatedMachine.status = 'idle';

					// Log event
					logEvent(get, set, 'task_completed',
						`Task ${completedTask.id} completed on ${updatedMachine.id}`,
						'info',
						{ taskId: completedTask.id, machineId: updatedMachine.id, recipients: ['supervisor'] as AlertRecipient[] }
					);
				}
			}

			if (didUpdate) {
				hasUpdates = true;
				return updatedMachine;
			}
			return machine;
		});

		if (hasUpdates || productionTimeDelta > 0) {
			// Optimization: Cap completed tasks array to prevent memory bloat
			// We only keep the last 100 for potential UI display, but track total count separately
			let newCompletedTasks = state.completedTasks;
			let newTotalCount = state.totalCompletedCount;

			if (tasksCompletedInThisTick.length > 0) {
				newCompletedTasks = [...state.completedTasks, ...tasksCompletedInThisTick];
				newTotalCount += tasksCompletedInThisTick.length;

				if (newCompletedTasks.length > 100) {
					newCompletedTasks = newCompletedTasks.slice(-100);
				}
			}

			set({
				productionTime: state.productionTime + productionTimeDelta,
				lastUpdateTime: now,
				machines: hasUpdates ? newMachines : state.machines,
				completedTasks: newCompletedTasks,
				totalCompletedCount: newTotalCount,
			});
		}

		// Capture analytics every tick for smooth real-time chart
		captureAnalytics(get, set);
	},

	addTaskBatch: () => {
		const state = get();
		if (!state.taskGenerationEnabled) return;

		// Check if ANY machine type is enabled for generation
		const { CNC, Assembly, Test } = state.taskGenerationFilters;
		if (!CNC && !Assembly && !Test) return; // All disabled, skip

		// === UPDATE WAVE PHASE FOR DYNAMIC LOAD ===
		updateWavePhase();

		const waitingCount = state.getGlobalMetrics().waitingCount;

		// --- WAVE-BASED BATCH SIZE ---
		// Oscillates between surge (many tasks), normal, and calm (few tasks)
		let batchSize = 1;

		if (wavePhase === 'surge') {
			// SURGE: High activity burst - fill up queues
			if (waitingCount < 20) {
				batchSize = Math.floor(Math.random() * 4) + 5; // 5-8 tasks
			} else if (waitingCount < 40) {
				batchSize = Math.floor(Math.random() * 3) + 3; // 3-5 tasks
			} else {
				batchSize = Math.floor(Math.random() * 2) + 2; // 2-3 tasks
			}
		} else if (wavePhase === 'normal') {
			// NORMAL: Steady flow
			if (waitingCount < 10) {
				batchSize = Math.floor(Math.random() * 3) + 2; // 2-4 tasks
			} else if (waitingCount < 25) {
				batchSize = Math.floor(Math.random() * 2) + 1; // 1-2 tasks
			} else {
				batchSize = 1;
			}
		} else {
			// CALM: Low activity - let queues drain
			if (waitingCount < 5) {
				batchSize = Math.floor(Math.random() * 2) + 1; // 1-2 tasks (prevent empty)
			} else {
				batchSize = Math.random() < 0.3 ? 1 : 0; // 30% chance of 1 task
			}
		}

		if (batchSize === 0) return;

		// Generate batch of tasks with BALANCED distribution for visible activity
		// CNC: 5 machines (fast), Assembly: 2 machines (normal), Test: 1 machine (slow)
		// Distribution: CNC ~78%, Assembly ~14%, Test ~8%
		const newTasks: TaskInstance[] = [];

		for (let i = 0; i < batchSize; i++) {
			// Balanced distribution: 78% CNC, 14% Assembly, 8% Test
			const rand = Math.random();
			let taskCategory: 'CNC' | 'Assembly' | 'Test';

			if (rand < 0.78) {
				taskCategory = CNC ? 'CNC' : (Assembly ? 'Assembly' : 'Test');
			} else if (rand < 0.92) {
				taskCategory = Assembly ? 'Assembly' : (Test ? 'Test' : 'CNC');
			} else {
				taskCategory = Test ? 'Test' : (Assembly ? 'Assembly' : 'CNC');
			}

			const task = generateTask(
				state.totalTasksGenerated + i + 1,
				taskCategory
			);
			task.createdAtSystemTime = state.productionTime;
			newTasks.push(task);
		}

		set({
			taskPool: [...state.taskPool, ...newTasks],
			totalTasksGenerated: state.totalTasksGenerated + batchSize,
		});

		// Schedule assignment check after the delay
		setTimeout(() => {
			if (get().isRunning) {
				get().assignAllTasks();
			}
		}, SYSTEM_CONFIG.ASSIGNMENT_DELAY_MS + 100); // Small buffer to ensure time check passes
	},

	toggleMachineBreakdown: (machineId: string) => {
		const state = get();
		const machineIndex = state.machines.findIndex(m => m.id === machineId);

		if (machineIndex === -1) return;

		const machine = state.machines[machineIndex];

		if (machine.status === 'breakdown') {
			// ============ REPAIR MACHINE ============
			logEvent(get, set, 'machine_repaired',
				`Machine ${machineId} repaired and back online`,
				'info',
				{ machineId, recipients: ['technician', 'supervisor'] as AlertRecipient[] }
			);

			const allTasksToRedistribute: TaskInstance[] = [];

			// Create new machines array with cleared queues for operational machines
			const redistributedMachines = state.machines.map(m => {
				if (m.status !== 'breakdown' && m.status !== 'maintenance' && m.id !== machineId) {
					// Take all queued tasks
					m.queue.forEach(t => {
						const task = { ...t };
						task.status = 'waiting';
						task.assignedMachine = null;
						task.createdAtRealTime = Date.now();
						allTasksToRedistribute.push(task);
					});
					return { ...m, queue: [] };
				}
				return m;
			});

			// Repair the broken machine
			const repairedMachine = {
				...machine,
				status: 'idle' as const,
				currentTask: null,
				queue: []
			};

			const finalMachines = redistributedMachines.map(m => m.id === machineId ? repairedMachine : m);

			set({
				machines: finalMachines,
				taskPool: [...state.taskPool, ...allTasksToRedistribute]
			});

			logEvent(get, set, 'rebalance_triggered',
				`Production rebalance initiated: ${allTasksToRedistribute.length} tasks redistributed`,
				'warning',
				{ tasksAffected: allTasksToRedistribute.length, recipients: ['supervisor'] as AlertRecipient[] }
			);

			setTimeout(() => {
				if (get().isRunning) {
					get().assignAllTasks();
				}
			}, SYSTEM_CONFIG.ASSIGNMENT_DELAY_MS + 100);

		} else {
			// ============ BREAK MACHINE ============
			const tasksToReturn: TaskInstance[] = [];

			// Return current task
			if (machine.currentTask) {
				const task = { ...machine.currentTask };
				task.status = 'waiting';
				task.assignedMachine = null;
				task.progress = 0;
				task.remainingMinutes = task.workloadMinutes;
				task.createdAtRealTime = Date.now();
				tasksToReturn.push(task);
			}

			// Return queue tasks
			machine.queue.forEach(t => {
				const task = { ...t };
				task.status = 'waiting';
				task.assignedMachine = null;
				task.createdAtRealTime = Date.now();
				tasksToReturn.push(task);
			});

			const brokenMachine = {
				...machine,
				status: 'breakdown' as const,
				currentTask: null,
				queue: []
			};

			const newMachines = state.machines.map(m => m.id === machineId ? brokenMachine : m);

			set({
				machines: newMachines,
				taskPool: [...state.taskPool, ...tasksToReturn]
			});

			logEvent(get, set, 'machine_breakdown',
				`ALERT: Machine ${machineId} breakdown! ${tasksToReturn.length} tasks returned to pool`,
				'critical',
				{ machineId, tasksAffected: tasksToReturn.length, recipients: ['technician', 'supervisor', 'manager'] as AlertRecipient[] }
			);

			logEvent(get, set, 'alert_sent',
				`Critical alert dispatched: Machine ${machineId} requires immediate attention`,
				'warning',
				{ machineId, recipients: ['technician'] as AlertRecipient[] }
			);

			setTimeout(() => {
				if (get().isRunning) {
					get().assignAllTasks();
				}
			}, SYSTEM_CONFIG.ASSIGNMENT_DELAY_MS + 100);
		}
	},

	toggleAutoAllocation: () => {
		set(state => ({ autoAllocationEnabled: !state.autoAllocationEnabled }));
	},

	toggleTaskGeneration: () => {
		set(state => ({ taskGenerationEnabled: !state.taskGenerationEnabled }));
	},

	toggleAutoAllocationFilter: (machineType: keyof MachineTypeFilters) => {
		set(state => ({
			autoAllocationFilters: {
				...state.autoAllocationFilters,
				[machineType]: !state.autoAllocationFilters[machineType]
			}
		}));
	},

	toggleTaskGenerationFilter: (machineType: keyof MachineTypeFilters) => {
		set(state => ({
			taskGenerationFilters: {
				...state.taskGenerationFilters,
				[machineType]: !state.taskGenerationFilters[machineType]
			}
		}));
	},

	manualAssignTask: (taskId: string, machineId: string) => {
		const state = get();
		const taskIndex = state.taskPool.findIndex(t => t.id === taskId);
		const machineIndex = state.machines.findIndex(m => m.id === machineId);

		if (taskIndex === -1 || machineIndex === -1) return;

		const task = state.taskPool[taskIndex];
		const machine = state.machines[machineIndex];

		// Check if machine is available (not breakdown)
		if (machine.status === 'breakdown') {
			logEvent(get, set, 'alert_sent', `Cannot assign task to broken machine ${machineId}`, 'warning');
			return;
		}

		// Calculate duration
		const setupTime = calculateSetupTime(machine, task.typeId);
		const baseDuration = task.workloadMinutes * machine.effectiveTimeMultiplier;
		const totalDuration = baseDuration + SYSTEM_CONFIG.TRANSPORT_TIME_MINUTES + setupTime;

		const updatedTask: TaskInstance = {
			...task,
			status: 'assigned',
			assignedMachine: machine.id,
			estimatedDuration: totalDuration,
		};

		// Update machine queue
		const newMachines = [...state.machines];
		newMachines[machineIndex] = {
			...machine,
			queue: [...machine.queue, updatedTask]
		};

		// Remove from pool
		const newPool = [...state.taskPool];
		newPool.splice(taskIndex, 1);


		set({
			machines: newMachines,
			taskPool: newPool
		});

		logEvent(get, set, 'task_assigned',
			`Manual assignment: Task ${task.id} assigned to ${machine.id}`,
			'info',
			{ taskId: task.id, machineId: machine.id }
		);
	},

	cancelTask: (taskId: string) => {
		const state = get();

		// Check Task Pool
		const poolIndex = state.taskPool.findIndex(t => t.id === taskId);
		if (poolIndex !== -1) {
			const newPool = [...state.taskPool];
			newPool.splice(poolIndex, 1);
			set({ taskPool: newPool });
			logEvent(get, set, 'task_cancelled', `Order ${taskId} cancelled from pool`, 'warning', { taskId });
			return;
		}

		// Check Machine Queues
		const newMachines = state.machines.map(m => {
			const queueIndex = m.queue.findIndex(t => t.id === taskId);
			if (queueIndex !== -1) {
				const newQueue = [...m.queue];
				newQueue.splice(queueIndex, 1);
				logEvent(get, set, 'task_cancelled', `Order ${taskId} cancelled from machine ${m.id} queue`, 'warning', { taskId, machineId: m.id });
				return { ...m, queue: newQueue };
			}
			return m;
		});

		set({ machines: newMachines });
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
		const completedCount = state.totalCompletedCount;
		const inProgressCount = machines.filter(m => m.status === 'processing').length;
		const waitingCount = state.taskPool.length + machines.reduce((sum, m) => sum + m.queue.length, 0);

		// Calculate throughput (tasks completed per hour)
		const simHours = state.productionTime / 60;
		const throughput = simHours > 0 ? completedCount / simHours : 0;

		return {
			hallLoad: Math.round(hallLoad),
			estimatedCompletionTime: Math.round(maxETA),
			completedCount,
			inProgressCount,
			waitingCount,
			throughput: Math.round(throughput * 10) / 10,
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
		const simMinutes = state.productionTime;
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
