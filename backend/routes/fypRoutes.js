const express = require('express');
const router = express.Router();
const FYPJob = require('../models/FYPJob');
const FYPMachine = require('../models/FYPMachine');
const FYPSchedule = require('../models/FYPSchedule');
const { optimizeScheduling } = require('../ai/schedulerOptimizer'); // Use existing GA logic

// --- Job Management ---
router.get('/jobs', async (req, res) => {
  try {
    const jobs = await FYPJob.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/jobs', async (req, res) => {
  try {
    const newJob = new FYPJob(req.body);
    await newJob.save();
    res.status(201).json(newJob);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/jobs/:id', async (req, res) => {
  try {
    await FYPJob.findOneAndDelete({ jobId: req.params.id });
    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Machine Management ---
router.get('/machines', async (req, res) => {
  try {
    const machines = await FYPMachine.find();
    res.json(machines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/machines', async (req, res) => {
  try {
    const newMachine = new FYPMachine(req.body);
    await newMachine.save();
    res.status(201).json(newMachine);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- Optimizer ---
router.post('/optimize', async (req, res) => {
  try {
    const jobs = await FYPJob.find();
    const machines = await FYPMachine.find();

    if (!jobs.length || !machines.length) {
        return res.status(400).json({ error: "Need both jobs and machines in database to optimize." });
    }

    // Adapt schema for GA logic
    const gaInputJobs = jobs.map(j => ({
        id: j.jobId,
        name: j.jobName,
        priority: j.priority,
        color: j.color,
        operations: j.operations
    }));

    const gaInputMachines = machines.map(m => ({
        id: m.machineId,
        name: m.machineName
    }));

    const result = optimizeScheduling({ jobs: gaInputJobs, machines: gaInputMachines });

    // Save results
    await FYPSchedule.deleteMany({});
    const scheduleToSave = result.schedule.map(s => ({
        jobId: s.jobId,
        jobName: s.jobName,
        machineId: s.machineId,
        task: s.task,
        start: s.start,
        duration: s.duration,
        end: s.end,
        color: s.color
    }));
    await FYPSchedule.insertMany(scheduleToSave);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/schedule', async (req, res) => {
  try {
    const schedule = await FYPSchedule.find();
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
