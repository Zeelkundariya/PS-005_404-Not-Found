const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/factory", require("./routes/factoryRoutes"));
app.use("/api/machine", require("./routes/machineRoutes"));
app.use("/api/production", require("./routes/productionRoutes"));
app.use("/api/inventory", require("./routes/inventoryRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));

app.listen(5000, () => console.log("Server running on port 5000"));