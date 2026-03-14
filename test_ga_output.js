const { optimizeScheduling } = require("./backend/ai/schedulerOptimizer");

const sampleMachines = [
    { id: "M1", name: "Loom #1" },
    { id: "M2", name: "Loom #2" },
    { id: "M3", name: "Stenter #1" }
];

const sampleJobs = [
    {
        id: "JOB-A",
        name: "Cotton Batch 1",
        priority: 2,
        operations: [
            { machineId: "M1", duration: 3, task: "Warping" },
            { machineId: "M2", duration: 5, task: "Weaving" }
        ]
    },
    {
        id: "JOB-B",
        name: "Silk Batch 2",
        priority: 3,
        operations: [
            { machineId: "M2", duration: 4, task: "Weaving" },
            { machineId: "M3", duration: 6, task: "Finishing" }
        ]
    },
    {
        id: "JOB-C",
        name: "Synthetics Batch 3",
        priority: 5,
        operations: [
            { machineId: "M1", duration: 2, task: "Prep" },
            { machineId: "M3", duration: 4, task: "Dyeing" }
        ]
    }
];

const result = optimizeScheduling({ jobs: sampleJobs, machines: sampleMachines });

console.log("=== GENETIC ALGORITHM OPTIMIZATION RESULT ===");
console.log(`Total Makespan: ${result.makespan} hours`);
console.log(`Optimization Log: ${result.optimizationLog}`);
console.log("\n--- MACHINE SCHEDULE ---");
result.schedule.forEach(op => {
    console.log(`[${op.machineId}] ${op.jobName} - ${op.task}: ${op.start}h -> ${op.end}h (Duration: ${op.duration}h)`);
});

console.log("\n--- MACHINE UTILIZATION ---");
Object.entries(result.machineUtilization).forEach(([id, util]) => {
    console.log(`${id}: ${util}%`);
});

console.log("\n--- JOB COMPLETION TIMES ---");
result.jobCompletionTimes.forEach(j => {
    console.log(`${j.jobName}: T+${j.completionTime}h`);
});
