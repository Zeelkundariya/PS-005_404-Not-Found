const mongoose = require('mongoose');
const FYPJob = require('./models/FYPJob');
const FYPMachine = require('./models/FYPMachine');

const MONGO_URI = 'mongodb://127.0.0.1:27017/smartfactory'; // Use the same DB as server

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    
    await FYPJob.deleteMany({});
    await FYPMachine.deleteMany({});

    const machines = await FYPMachine.insertMany([
      { machineId: 'M-01', machineName: 'High-Temp Stenter', status: 'idle', color: '#3b82f6' },
      { machineId: 'M-02', machineName: 'Air-Jet Loom', status: 'idle', color: '#10b981' },
      { machineId: 'M-03', machineName: 'Dyeing Vat-Alpha', status: 'idle', color: '#f59e0b' },
    ]);

    await FYPJob.insertMany([
      {
        jobId: 'JP-92',
        jobName: 'Export Silk Batch',
        priority: 5,
        color: '#6366f1',
        operations: [
          { machineId: 'M-02', duration: 6, task: 'Weaving' },
          { machineId: 'M-03', duration: 4, task: 'Dyeing' }
        ]
      },
      {
        jobId: 'JP-44',
        jobName: 'Denim Finish-702',
        priority: 3,
        color: '#10b981',
        operations: [
          { machineId: 'M-01', duration: 8, task: 'Finishing' }
        ]
      }
    ]);

    console.log('Main Project FYP Section Seeded successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
