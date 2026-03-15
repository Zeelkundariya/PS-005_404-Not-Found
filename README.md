# 🏭 SmartFactory AI Orchestrator v4.0
**The Strategic Command Center for Next-Gen Manufacturing | Bhilwara Hackathon Special**

---

## 🚀 Project Vision
SmartFactory AI is an enterprise-grade Digital Twin and Orchestration platform designed specifically for SME industrial clusters. It transforms traditional, reactive factory management into a proactive, AI-driven autonomous ecosystem. Our mission is to democratize high-end manufacturing tech for every textile unit in Bhilwara.

---

## 🏗️ Technical Architecture & Data Flow
The system operates on a **Distributed Intelligence Model**:

1.  **The Persistent Layer (MongoDB Atlas)**: Stores mission-critical data:
    *   **User Identities**: Secured with Argon2/Bcrypt hashing.
    *   **Machine Registry**: Master specs for all factory looms.
    *   *Orders & Jobs**: The backlog of textile orders awaiting processing.
2.  **The Live-State Engine (Node.js/Express)**: 
    *   Maintains a high-frequency **Digital Twin Pulse**.
    *   Simulates real-world sensor drift (Vibration/temp/RPM).
    *   Provides sub-second telemetry to the frontend via the `/api/iot/live` bus.
3.  **The Neural Frontend (React/Vite)**: 
    *   Pollying Architecture: Synchronizes 52+ internal states every 2.5 seconds.
    *   Conditional Intelligence: Role-based dashboards (Owner, Manager, Operator) that dynamically reconfigure based on JWT claims.

---

## 🏗️ The Tech Stack (Industrial Grade)
- **Frontend**: React 18+, Recharts, Lucide-React.
- **Backend**: Node.js, Express, Mongoose.
- **Database**: MongoDB Atlas.
- **Communication**: REST API + JWT + Twilio (WhatsApp Relay).
- **Design System**: Industrial Glassmorphism with deep-space accents.

---

## 🧩 Dashboard Sections & Core Features

### 🏢 1. Strategic Owner Dashboard (The ROI Cockpit)
*Visualizing the factory as a financial engine.*
- **Feature: Global KPIs**: Real-time monitoring of **OEE** and **PEI** across all units.
- **Feature: Financial Arbitrage**: Live revenue vs. cost tracking with automatic profit margin calculation and tax estimations.
- **Feature: Mandi-Pulse AI**: Strategic insights into raw material price fluctuations (Yarn/Dyes) and market export trends.
- **Feature: Strategic Risk Assessment**: Bayesian probability models showing potential disruptions in the supply chain.

### 🏭 2. Plant Manager Dashboard (The Operational Brain)
*Optimizing workflows and minimizing waste.*
- **Feature: GA Scheduler (EM4)**: A **Genetic Algorithm-based** job optimizer. It doesn't just sort jobs—it *evolves* them across 50+ generations to minimize "Makespan" and energy usage.
- **Feature: Inventory JIT (Just-In-Time)**: Smart threshold monitoring for Cotton, Polyester, and Dye stocks. Automatically triggers alerts when stock falls below 3-day production requirements.
- **Feature: Workforce Analytics**: Live tracking of operator presence, machine-to-man ratios, and shift output targets.

### ⚙️ 3. Node Operator Dashboard (The Plant Floor)
*Real-time machine-level execution.*
- **Feature: Machine Pulse Grid**: A sub-second cluster view of 15+ machines. Tracks Temperature, Vibration, Power, and RPM in real-time.
- **Feature: Proactive Maintenance (PdM)**: An AI engine that predicts machine health degradation, flagging assets for service *hours before* a failure occurs.
- **Feature: Safety Compliance Bot**: Real-time PPE monitoring and environmental monitoring (AQI/Humidity).

---

## ✨ Unique Features & Hackathon Wins

### 🧬 Genetic Algorithm Scheduler
Unlike standard schedulers, our system uses **Evolutionary Biology principles** (Crossover, Mutation, Selection) to solve the NP-Hard job-machine matching problem.

### 📱 AI WhatsApp Factory Relay
Integrated with **Twilio**, allow AI agents to "chat" directly with the owner's phone for critical approvals, bridging the gap between the shop floor and the owner terminal.

### 🧬 Flexible Yield Planning (FYP) Optimizer
A dedicated specialized module that calculates the "Yield-at-Risk" for every textile order, helping owners choose which orders to prioritize during peak wedding seasons or market surges.

### 🌡️ Intelligent Fail-State Automation
The system features a built-in **Industrial State Machine**. If a machine's vibration exceeds a safe threshold, the system autonomously transitions the UI into "Alert Mode" and dispatches a maintenance ticket.

---

## 📊 Initialized Production Data (Seeded)
The system comes pre-loaded with realistic textile data for a robust demonstration:
- **Loom Registry**: Jacquard and Dobby looms with historical health logs.
- **Order Backlog**: Premium Denim, Silk Saree Export, and Govt Uniform Twill batches.
- **Inventory Matrix**: Current stock levels for Cotton Yarn, Dyes, and Polyester Fiber.

---

## 🛠️ Launch Guide
1. `npm install && npm run install-all`
2. Configure `.env` with `MONGO_URI` and `JWT_SECRET`.
3. `npm start` (Runs both Frontend and Backend concurrently).
4. Run `node backend/seed.js` to populate the production environment.

---
**Built by Team Nirvana | Empowering the Textile Revolution in Bhilwara**

