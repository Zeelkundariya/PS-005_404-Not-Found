import React, { useState, useEffect } from 'react';
import { 
  Activity, AlertTriangle, Settings, ShieldCheck, 
  BarChart3, Cpu, Thermometer, Zap, Clock, 
  Bell, ChevronRight, TrendingDown, Wrench, Factory
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area, ComposedChart
} from 'recharts';
import './MaintenanceHub.css';

const MaintenanceHub = () => {
  const navigate = useNavigate();
  
  // --- Simulation Logic ---
  const [machineData, setMachineData] = useState({
    temperature: 45,
    vibration: 2,
    status: 'Healthy',
    runtime: 1240,
    prediction: 12, // days until maintenance
    risk: 5 // percentage
  });
  const [history, setHistory] = useState([]);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      // Create subtle data fluctuations
      const tempVar = (Math.random() - 0.5) * 5;
      const vibVar = (Math.random() - 0.5) * 0.5;
      
      setMachineData(prev => {
        const newTemp = Math.max(30, Math.min(100, prev.temperature + tempVar));
        const newVib = Math.max(0.5, Math.min(10, prev.vibration + vibVar));
        
        let risk = 5;
        if (newTemp > 80) risk += 40;
        if (newVib > 6) risk += 40;
        
        let status = 'Healthy';
        if (risk > 60) status = 'Critical';
        else if (risk > 30) status = 'Warning';

        if (status === 'Critical' && !alert) {
          setAlert({ message: 'CRITICAL ANOMALY: Motor Overheating Detected' });
        } else if (status === 'Healthy') {
          setAlert(null);
        }

        return {
          ...prev,
          temperature: parseFloat(newTemp.toFixed(1)),
          vibration: Math.round(newVib),
          status,
          risk
        };
      });

      setHistory(h => {
        const newEntry = { 
          time: new Date().toLocaleTimeString().split(' ')[0], 
          temp: machineData.temperature,
          risk: machineData.risk
        };
        const newH = [...h, newEntry];
        return newH.length > 20 ? newH.slice(1) : newH;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [machineData.temperature, machineData.risk, alert]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="maintenance-hub-container">
      <div className="bg-grid"></div>
      <div className="bg-glow"></div>

      {/* Hero Section */}
      <section className="hero-section fade-in">
        <div className="icon-box">
          <Activity size={32} />
        </div>
        <h1 className="hero-title">Predictive Maintenance AI</h1>
        <p className="hero-subtitle">
          Next-generation mechanical intelligence for textile factories. 
          Analyze loom health in real-time and prevent downtime before it happens.
        </p>
        <div className="flex gap-4">
          <button className="btn-primary" onClick={() => scrollToSection('dashboard')}>
            Monitor Machines
          </button>
          <button className="px-8 py-4 rounded-full border border-white/10 hover:bg-white/5 transition-all text-white" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </section>

      {/* Live Dashboard Section */}
      <section id="dashboard" className="section-container">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="section-title">Live Machine Monitoring</h2>
            <p className="text-gray-400">Unit ID: TX-ALPHA-042 (High-Speed Loom)</p>
          </div>
          <div className="glass-panel px-6 py-3 flex gap-6 items-center">
            <div className="flex items-center gap-2">
              <div className="status-indicator status-healthy"></div>
              <span className="text-xs font-bold font-mono">312 HEALTHY</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="status-indicator status-warning"></div>
              <span className="text-xs font-bold font-mono">4 WARNING</span>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="glass-panel p-8">
            <div className="flex justify-between items-center mb-8">
               <h3 className="font-bold flex items-center gap-2">
                 <Activity className="text-electric-blue" size={20} /> Real-time Stress Analysis
               </h3>
               <div className="flex gap-4 text-xs">
                 <span className="text-electric-blue">● RISK %</span>
                 <span className="text-orange-400">● TEMP °C</span>
               </div>
            </div>

            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={history}>
                    <defs>
                      <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a202c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    />
                    <Area type="monotone" dataKey="risk" stroke="#00f2ff" fillOpacity={1} fill="url(#colorRisk)" strokeWidth={2} />
                    <Line type="monotone" dataKey="temp" stroke="#ed8936" strokeWidth={1} dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={`glass-panel p-8 flex flex-col ${machineData.status === 'Critical' ? 'critical-card' : ''}`}>
              <div className="mb-8">
                <h3 className="font-bold mb-4">Machine Verdict</h3>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`status-indicator status-${machineData.status.toLowerCase()}`}></div>
                  <span className="font-black text-xl tracking-wider uppercase">{machineData.status}</span>
                </div>
                <p className="text-xs text-gray-400">Maintenance prediction: {machineData.prediction} days</p>
              </div>

              <div className="space-y-6 mb-8">
                 <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Temperature</span>
                    <span className="value-display font-medium">{machineData.temperature}°C</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Vibration</span>
                    <span className="value-display font-medium">{machineData.vibration}Hz</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Runtime</span>
                    <span className="value-display font-medium">{machineData.runtime}h</span>
                 </div>
              </div>

              <button 
                onClick={() => alert("Maintenance request sent to shop floor technicians.")}
                className="btn-primary w-full py-3 rounded-lg flex items-center justify-center gap-2">
                <Wrench size={18} /> REQUEST SERVICE
              </button>
            </div>
        </div>
      </section>

      {/* Failure Reports Section */}
      <section className="section-container mt-20">
        <h2 className="section-title mb-8">Active Failure Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              "machineId": "TX-LOOM-01",
              "failureMode": "Spindle Bearing Friction",
              "probability": 88,
              "financialImpact": "₹1,25,000",
              "recoveryPotential": "85%",
              "solution": "Lubrication + Active Load Re-balancing",
              "priority": "Critical"
            },
            {
              "machineId": "TX-DYE-04",
              "failureMode": "Hydraulic Pressure Leak",
              "probability": 42,
              "financialImpact": "₹89,000",
              "recoveryPotential": "40%",
              "solution": "Seal Replacement + Valve Recalibration",
              "priority": "Warning"
            },
            {
              "machineId": "TX-WARP-02",
              "failureMode": "Logic Controller Overheating",
              "probability": 94,
              "financialImpact": "₹2,10,000",
              "recoveryPotential": "92%",
              "solution": "Heat-sink Upgrade + Firmware Throttling",
              "priority": "Critical"
            }
          ].map((report, idx) => (
            <div key={idx} className={`glass-panel p-6 border-l-4 ${report.priority === 'Critical' ? 'border-l-red-500' : 'border-l-amber-500'}`}>
              <div className="flex justify-between mb-4">
                <span className="font-bold text-lg">{report.machineId}</span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${report.priority === 'Critical' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {report.priority}
                </span>
              </div>
              <h4 className="text-md font-semibold mb-2">{report.failureMode}</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>Probability: <span className="text-white">{report.probability}%</span></p>
                <p>Financial Impact: <span className="text-white">{report.financialImpact}</span></p>
                <p>Recovery Potential: <span className="text-white">{report.recoveryPotential}</span></p>
              </div>
              <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-xs font-bold text-electric-blue uppercase">Solution</p>
                <p className="text-sm italic">{report.solution}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Operational Metrics */}
      <section className="section-container mt-20 mb-20">
        <div className="glass-panel p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <p className="text-xs text-gray-400 uppercase mb-2">Total Downtime Prevented</p>
            <p className="text-3xl font-black text-electric-blue">48h</p>
            <p className="text-xs text-gray-500">Last 30 days</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase mb-2">Estimated Cost Savings</p>
            <p className="text-3xl font-black text-healthy-green">₹4.7L</p>
            <p className="text-xs text-gray-500">Direct impact</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase mb-2">Prediction Accuracy</p>
            <p className="text-3xl font-black text-white">98.2%</p>
            <p className="text-xs text-gray-500">AI confidence score</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase mb-2">Next Window</p>
            <p className="text-md font-bold text-white">Shift B</p>
            <p className="text-xs text-gray-500">Tech: Raj Patel</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MaintenanceHub;
