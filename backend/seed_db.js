const mongoose = require('mongoose');
const Machine = require('./models/Machine');
const Inventory = require('./models/Inventory');
const ProductionLog = require('./models/ProductionLog');
const MaintenanceLog = require('./models/MaintenanceLog');
const Order = require('./models/Order');
const Factory = require('./models/Factory');
const MarketData = require('./models/MarketData');

async function seedDB() {
    await mongoose.connect('mongodb://127.0.0.1:27017/smartfactory');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Machine.deleteMany({});
    await Inventory.deleteMany({});
    await ProductionLog.deleteMany({});
    await MaintenanceLog.deleteMany({});
    await Order.deleteMany({});
    await Factory.deleteMany({});
    await MarketData.deleteMany({});

    await MarketData.insertMany([
        { commodity: "Cotton Yarn (30s)", price: 185.50, unit: "kg" },
        { commodity: "Polyester Yarn", price: 110.20, unit: "kg" }
    ]);

    const factory = await Factory.create({
        name: "TexTech Smart Factory",
        location: "Industrial Hub, Gujarat",
        ownerId: "admin",
        targetOutput: 6000,
        powerCostPerKwh: 7.5,
        investmentCr: 12,
        turnoverCr: 45
    });

    const machines = await Machine.insertMany([
        { factoryId: factory._id, name: "Loom-01", uptimeHours: 1200, breakdownCount: 5 },
        { factoryId: factory._id, name: "Loom-02", uptimeHours: 850, breakdownCount: 2 },
        { factoryId: factory._id, name: "Dyeing-A1", uptimeHours: 500, breakdownCount: 8 },
        { factoryId: factory._id, name: "Finisher-03", uptimeHours: 1100, breakdownCount: 3 },
        { factoryId: factory._id, name: "Spinner-01", uptimeHours: 2000, breakdownCount: 1 }
    ]);

    await Inventory.insertMany([
        { material: "Raw Cotton", quantity: 1500, minThreshold: 500 },
        { material: "Polyester Yarn", quantity: 800, minThreshold: 300 },
        { material: "Dyeing Chemicals", quantity: 50, minThreshold: 100 },
        { material: "Industrial Oil", quantity: 200, minThreshold: 50 }
    ]);

    // Seed Production Logs for the last 7 days
    const productionLogs = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        machines.forEach(m => {
            productionLogs.push({
                machineId: m._id,
                date: date,
                shift: "Morning",
                output: Math.floor(Math.random() * (100 - 80 + 1)) + 80
            });
            productionLogs.push({
                machineId: m._id,
                date: date,
                shift: "Evening",
                output: Math.floor(Math.random() * (90 - 70 + 1)) + 70
            });
        });
    }
    await ProductionLog.insertMany(productionLogs);

    await MaintenanceLog.insertMany([
        { machineId: machines[2]._id, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), note: "Pump replacement in Dyeing unit" },
        { machineId: machines[0]._id, date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), note: "Regular oiling and belt check" }
    ]);

    await Order.insertMany([
        { product: "Silk Fabric", quantity: 500, deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), status: "Pending" },
        { product: "Cotton Sheets", quantity: 1200, deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), status: "In Progress" },
        { product: "Denim Roll", quantity: 300, deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), status: "Completed" }
    ]);

    console.log('Database seeded successfully!');
    process.exit(0);
}

seedDB();
