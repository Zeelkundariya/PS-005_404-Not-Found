const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.get("/test", (req, res) => res.json({ message: "Server is alive" }));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/factory", require("./routes/factoryRoutes"));
app.use("/api/machine", require("./routes/machineRoutes"));
app.use("/api/production", require("./routes/productionRoutes"));
app.use("/api/inventory", require("./routes/inventoryRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/whatsapp", require("./routes/whatsapp"));
app.use("/owner", require("./routes/ownerRoutes"));

app.listen(3001, () => console.log("Owner Server running on port 3001"));