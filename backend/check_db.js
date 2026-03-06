const mongoose = require('mongoose');
const Machine = require('./models/Machine');
const Inventory = require('./models/Inventory');
const ProductionLog = require('./models/ProductionLog');
const MaintenanceLog = require('./models/MaintenanceLog');
const Order = require('./models/Order');

async function checkData() {
    await mongoose.connect('mongodb://127.0.0.1:27017/smartfactory');
    console.log('Connected to MongoDB');

    const counts = {
        machines: await Machine.countDocuments(),
        inventory: await Inventory.countDocuments(),
        production: await ProductionLog.countDocuments(),
        maintenance: await MaintenanceLog.countDocuments(),
        orders: await Order.countDocuments()
    };

    console.log('Data Counts:', JSON.stringify(counts, null, 2));
    process.exit(0);
}

checkData();
