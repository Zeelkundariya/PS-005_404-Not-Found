const mongoose = require('mongoose');
const FYPMachine = require('./models/FYPMachine');
const FYPJob = require('./models/FYPJob');
const Inventory = require('./models/Inventory');
const Machine = require('./models/Machine');
require('dotenv').config();

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/smartfactory';

const seedData = async () => {
    try {
        await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await FYPMachine.deleteMany({});
        await FYPJob.deleteMany({});
        await Inventory.deleteMany({});
        await Machine.deleteMany({});

        // 1. Seed FYP Machines (Textile Cluster)
        const fypMachines = [
            { machineId: 'L-101', machineName: 'Jacquard Loom #01', status: 'running', color: '#6366f1' },
            { machineId: 'L-102', machineName: 'Jacquard Loom #02', status: 'running', color: '#8b5cf6' },
            { machineId: 'L-104', machineName: 'Dobby Loom #04', status: 'maintenance', color: '#f59e0b' },
            { machineId: 'S-201', machineName: 'Stenter Finishing #01', status: 'running', color: '#10b981' },
            { machineId: 'D-302', machineName: 'Dyeing Jet #02', status: 'idle', color: '#06b6d4' },
            { machineId: 'I-403', machineName: 'Master Inspection #03', status: 'running', color: '#ec4899' },
            { machineId: 'SP-501', machineName: 'Open-End Spinning #01', status: 'running', color: '#3b82f6' }
        ];
        await FYPMachine.insertMany(fypMachines);
        console.log('Seeded FYP Machines');

        // 2. Seed FYP Jobs (Bhilwara Textile Orders)
        const fypJobs = [
            {
                jobId: 'ORD-701',
                jobName: 'Premium Denim (Wedding Collection)',
                priority: 5,
                color: '#6366f1',
                operations: [
                    { machineId: 'L-101', duration: 6, task: 'High-Density Weaving' },
                    { machineId: 'S-201', duration: 4, task: 'Heat Setting' },
                    { machineId: 'I-403', duration: 2, task: 'Point Audit' }
                ]
            },
            {
                jobId: 'ORD-702',
                jobName: 'Silk Saree Export Batch (Surat)',
                priority: 4,
                color: '#ec4899',
                operations: [
                    { machineId: 'L-102', duration: 10, task: 'Intricate Patterning' },
                    { machineId: 'D-302', duration: 5, task: 'Reactive Dyeing' },
                    { machineId: 'S-201', duration: 3, task: 'Soft Finishing' }
                ]
            },
            {
                jobId: 'ORD-703',
                jobName: 'Uniform Twill (Rajasthan Govt)',
                priority: 3,
                color: '#10b981',
                operations: [
                    { machineId: 'L-101', duration: 8, task: 'Standard Weaving' },
                    { machineId: 'S-201', duration: 4, task: 'Pressing' }
                ]
            },
            {
                jobId: 'ORD-704',
                jobName: 'Linen Blend Grey-Stock',
                priority: 2,
                color: '#8b5cf6',
                operations: [
                    { machineId: 'SP-501', duration: 12, task: 'Yarn Spinning' },
                    { machineId: 'L-104', duration: 6, task: 'Grey Weaving' }
                ]
            },
            {
                jobId: 'ORD-705',
                jobName: 'Indigo Wash Raw Denim',
                priority: 5,
                color: '#06b6d4',
                operations: [
                    { machineId: 'D-302', duration: 8, task: 'Indigo Immersion' },
                    { machineId: 'S-201', duration: 4, task: 'Drying' }
                ]
            }
        ];
        await FYPJob.insertMany(fypJobs);
        console.log('Seeded FYP Jobs');

        // 3. Seed Inventory (Raw Materials)
        const inventoryItems = [
            { material: 'Cotton Yarn (30s)', quantity: 4200, minThreshold: 1000 },
            { material: 'Polyester Filament', quantity: 1800, minThreshold: 500 },
            { material: 'Indigo Dye Concentrate', quantity: 450, minThreshold: 100 },
            { material: 'Packaging Rolls', quantity: 850, minThreshold: 200 },
            { material: 'Softening Agent', quantity: 320, minThreshold: 80 }
        ];
        await Inventory.insertMany(inventoryItems);
        console.log('Seeded Inventory');

        // 4. Seed General Machines (Infrastructure)
        const generalMachines = [
            { name: '11KV Substation Grid', factoryId: 'FAC-01', uptimeHours: 2450, breakdownCount: 1 },
            { name: 'Effluent Treatment Plant (ETP)', factoryId: 'FAC-01', uptimeHours: 1980, breakdownCount: 2 },
            { name: 'Air Compressor Bank B', factoryId: 'FAC-01', uptimeHours: 840, breakdownCount: 4 },
            { name: 'Solar Thermal Array', factoryId: 'FAC-01', uptimeHours: 3200, breakdownCount: 0 }
        ];
        await Machine.insertMany(generalMachines);
        console.log('Seeded General Machines');

        console.log('All Production Data Seeded Successfully!');
        process.exit();
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
};

seedData();
