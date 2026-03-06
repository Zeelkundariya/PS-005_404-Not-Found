import api from "../api";
import { useEffect, useState } from "react";
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
  BarChart, Bar, Cell, Legend, PieChart, Pie
} from 'recharts';
import {
  LayoutDashboard, Users, Zap, DollarSign, Activity, Settings, Info, Briefcase,
  ShieldCheck, CheckCircle2, Factory, BarChart3, Play,
  Cpu, TrendingUp, Droplets, Wind, Package, Plus, Award,
  ShieldAlert, BrainCircuit, Layers, CheckCircle, Thermometer, Globe, Building2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';


export default function Dashboard() {
  const navigate = useNavigate();
  // --- AI States ---
  // Overview & Ops
  const [delay, setDelay] = useState("");
  const [pei, setPei] = useState(0);
  const [peiTrend, setPeiTrend] = useState([]);
  const [maintenanceScore, setMaintenanceScore] = useState(0);
  const [anomaly, setAnomaly] = useState("");
  const [reliability, setReliability] = useState(0);
  const [digitalMaturity, setDigitalMaturity] = useState(0);
  const [benchmark, setBenchmark] = useState({});
  const [solar, setSolar] = useState({});
  const [workforce, setWorkforce] = useState({});
  const [safety, setSafety] = useState({});
  const [maintenance, setMaintenance] = useState({});

  // Supply Chain
  const [yarnPrice, setYarnPrice] = useState({});
  const [subcontractor, setSubcontractor] = useState({});
  const [season, setSeason] = useState({});
  const [exportScore, setExportScore] = useState(0);
  const [cluster, setCluster] = useState({});
  const [inventoryAlerts, setInventoryAlerts] = useState([]);

  // Sustainability
  const [esg, setEsg] = useState(0);
  const [water, setWater] = useState({});
  const [waterTrend, setWaterTrend] = useState([]);
  const [waste, setWaste] = useState({});
  const [heatwave, setHeatwave] = useState("");
  // Finance & Risk
  const [costOptimization, setCostOptimization] = useState({});
  const [costBreakdown, setCostBreakdown] = useState([]);
  const [creditRisk, setCreditRisk] = useState({});
  const [profit, setProfit] = useState({});
  const [buyerRisk, setBuyerRisk] = useState({});
  const [govSchemes, setGovSchemes] = useState({});

  // Textile Specific
  const [textileMetrics, setTextileMetrics] = useState({});
  const [textileTrend, setTextileTrend] = useState([]);
  const [textileFlow, setTextileFlow] = useState({});
  const [quality, setQuality] = useState({});
  const [yarnOpt, setYarnOpt] = useState({});
  const [laborSkill, setLaborSkill] = useState({});
  const [manualData, setManualData] = useState(JSON.parse(localStorage.getItem('manualFactoryData')) || {});

  // UI States
  const [activeTab, setActiveTab] = useState('overview');
  const [userRole, setUserRole] = useState('Owner'); // Admin, Manager, Operator
  const [isAiLearningMode, setIsAiLearningMode] = useState(true);
  const [lang, setLang] = useState('EN'); // EN, HI
  const [executiveSummary, setExecutiveSummary] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [machineStatus, setMachineStatus] = useState([]);
  const [simulation, setSimulation] = useState("");
  const [systemEvents, setSystemEvents] = useState([
    { id: 1, time: '10:42:15', msg: 'AI: Shift 1 Production Optimized (+5.2%)', type: 'info' },
    { id: 2, time: '10:40:02', msg: 'System: Solar Battery grid-sync complete', type: 'success' },
    { id: 3, time: '10:35:44', msg: 'Wear-Audit: Stenter Processor vibration high', type: 'warning' },
    { id: 4, time: '10:30:12', msg: 'Quality: AQL 2.5 Batch-42 passed', type: 'success' },
    { id: 5, time: '10:25:05', msg: 'Alert: Grid power fluctuation detected', type: 'danger' }
  ]);

  useEffect(() => {
    // Check for user-driven data overrides from LocalStorage
    const rawManualData = localStorage.getItem('manualFactoryData');
    const localManualData = rawManualData ? JSON.parse(rawManualData) : null;
    if (localManualData) setManualData(localManualData);

    // Prepare standardized payloads
    const prodPayload = localManualData ? {
      actualOutput: localManualData.actualOutput,
      expectedOutput: localManualData.expectedOutput
    } : {};

    const maintPayload = localManualData ? {
      uptime: localManualData.uptime,
      breakdowns: localManualData.breakdowns,
      daysSince: localManualData.daysSince
    } : {};

    const textilePayload = localManualData ? {
      fabricProduced: localManualData.fabricProducedMeters,
      loomHours: localManualData.loomHours,
      yarnUsed: localManualData.yarnUsedKg
    } : {};

    const financePayload = localManualData ? {
      cost: localManualData.operatingCost,
      price: localManualData.revenue
    } : {};

    const qualityPayload = localManualData ? {
      defects: localManualData.defectsCount,
      totalUnits: localManualData.totalUnitsTested
    } : {};

    /*
     * Phase 4: Winner's Final Final Polish - SaaS & Strategy
     * - [x] Implement Dynamic Role-Based Layouts (Operator/Manager/Owner)
     * - [x] Create "Strategic Intelligence" Tab (SaaS/ESG/Maturity)
     * - [x] Build "Bhilwara Gov-Portal" Section (Local Schemes)
     * - [x] Upgrade "What-If" Tool into interactive Simulation Hub
     * - [x] Final Aesthetic Sweep (Glow effects & Command Center feel)
     */

    // Basic Data
    api.get("/machine/status").then(r => setMachineStatus(r.data));
    api.get("/inventory/alerts").then(r => setInventoryAlerts(r.data));

    // Operations & Overview
    api.post("/ai/delay", { avgOutput: manualData?.actualOutput }).then(r => setDelay(r.data.result));
    api.post("/ai/efficiency", prodPayload).then(r => {
      setPei(r.data.current);
      if (r.data.trend) setPeiTrend(r.data.trend);
    });
    api.post("/ai/maintenance", {
      uptimeHours: manualData?.uptime,
      breakdowns: manualData?.breakdowns,
      vibration: manualData?.vibration,
      temp: manualData?.temp
    }).then(r => setMaintenance(r.data));
    api.post("/ai/quality", {
      defects: manualData?.defectsCount,
      totalUnits: manualData?.totalUnitsTested,
      gsmDeviation: manualData?.gsmDeviation,
      colorVariance: manualData?.colorVariance,
      shrinkage: manualData?.shrinkage,
      certification: manualData?.certification
    }).then(r => setQuality(r.data));
    api.post("/ai/safety", {
      accidentFreeDays: manualData?.accidentFreeDays,
      ppeComplianceRate: manualData?.ppeCompliance,
      hazards: manualData?.unresolvedHazards
    }).then(r => setSafety(r.data));
    api.post("/ai/maintenance-score", maintPayload).then(r => setMaintenanceScore(r.data.score));
    api.post("/ai/anomaly", { todayValue: manualData?.actualOutput }).then(r => setAnomaly(r.data.result));
    api.post("/ai/reliability", { uptime: manualData?.uptime }).then(r => setReliability(r.data.availability));
    api.post("/ai/digital-maturity", {}).then(r => setDigitalMaturity(r.data.score));
    api.post("/ai/benchmark", { actualOutput: manualData?.actualOutput }).then(r => setBenchmark(r.data));
    api.post("/ai/power", {
      powerUsed: manualData?.powerConsumedKwh,
      solarContribution: manualData?.solarContribution
    }).then(r => setSolar(r.data));
    api.post("/ai/workforce", { actualOutput: manualData?.actualOutput, workers: manualData?.activeWorkers }).then(r => setWorkforce(r.data));

    // Supply Chain
    api.post("/ai/yarn-price", { yarnPrice: manualData?.yarnPrice }).then(r => setYarnPrice(r.data));
    api.post("/ai/subcontractor", {}).then(r => setSubcontractor(r.data));
    api.post("/ai/seasonal-demand", {}).then(r => setSeason(r.data));
    api.post("/ai/export-score", {}).then(r => setExportScore(r.data.score));
    api.post("/ai/cluster", {
      actualOutput: manualData?.actualOutput,
      targetOutput: manualData?.expectedOutput
    }).then(r => setCluster(r.data));

    // Sustainability
    api.post("/ai/esg", { wasteKg: manualData?.wasteResaleValue, downtimeHours: (manualData?.breakdowns || 0) * 4 }).then(r => setEsg(r.data.esgScore));
    api.post("/ai/water", {
      waterUsage: manualData?.waterUsage,
      recycledWater: manualData?.recycledWater
    }).then(r => {
      setWater(r.data);
      if (r.data.trend) setWaterTrend(r.data.trend);
    });
    api.post("/ai/waste", { actualOutput: manualData?.actualOutput }).then(r => setWaste(r.data));
    api.post("/ai/heatwave", {}).then(r => setHeatwave(r.data.result));

    // Finance
    api.post("/ai/cost-optimization", { actualOutputToday: manualData?.actualOutput }).then(r => {
      setCostOptimization(r.data);
      if (r.data.breakdown) setCostBreakdown(r.data.breakdown);
    });
    api.post("/ai/credit-risk", {}).then(r => setCreditRisk(r.data));
    api.post("/ai/profit", financePayload).then(r => setProfit(r.data));
    api.post("/ai/buyer-risk", {}).then(r => setBuyerRisk(r.data));
    api.post("/ai/gov-schemes", {}).then(r => setGovSchemes(r.data));

    // Textile
    api.post("/ai/textile-metrics", textilePayload).then(r => {
      setTextileMetrics(r.data);
      if (r.data.trend) setTextileTrend(r.data.trend);
    });
    api.post("/ai/textile-flow", {}).then(r => setTextileFlow(r.data));
    api.post("/ai/quality", qualityPayload).then(r => setQuality(r.data));
    api.post("/ai/yarn-optimize", {}).then(r => setYarnOpt(r.data));
    api.post("/ai/labor-skill", { trainingHours: manualData?.trainingHours }).then(r => setLaborSkill(r.data));

    api.post("/ai/executive-summary", prodPayload).then(r => setExecutiveSummary(r.data));
    api.post("/ai/recommendations", maintPayload).then(r => setRecommendations(r.data.actions));
  }, []);

  return (
    <div className="dashboard-container" style={{ display: 'flex', background: '#070b14', minHeight: '100vh', color: 'white', overflow: 'hidden' }}>
      {/* Sidebar */}
      <nav className="sidebar">
        <div className="logo">
          <Factory size={24} />
          <span>SmartFactory AI</span>
          <div style={{ fontSize: '0.7rem', color: 'var(--accent)', marginTop: '4px' }}>
            Live: {executiveSummary.pei || 0}% Efficiency
          </div>
        </div>
        <ul className="nav-links">
          <li className={`sidebar-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <LayoutDashboard size={18} />
            {lang === 'EN' ? 'Overview' : 'अवलोकन'}
          </li>

          {(userRole === 'Operator' || userRole === 'Manager' || userRole === 'Owner') && (
            <li className={`sidebar-link ${activeTab === 'operations' ? 'active' : ''}`} onClick={() => setActiveTab('operations')}>
              <Cpu size={18} />
              {lang === 'EN' ? 'Plant Floor' : 'प्लांट फ्लोर'}
            </li>
          )}

          {(userRole === 'Manager' || userRole === 'Owner') && (
            <li className={`sidebar-link ${activeTab === 'quality' ? 'active' : ''}`} onClick={() => setActiveTab('quality')}>
              <ShieldCheck size={18} />
              {lang === 'EN' ? 'Export Quality' : 'निर्यात गुणवत्ता'}
            </li>
          )}

          {(userRole === 'Operator' || userRole === 'Manager' || userRole === 'Owner') && (
            <li className={`sidebar-link ${activeTab === 'maintenance' ? 'active' : ''}`} onClick={() => setActiveTab('maintenance')}>
              <Settings size={18} />
              {lang === 'EN' ? 'Maintenance' : 'रखरखाव'}
            </li>
          )}

          {(userRole === 'Manager' || userRole === 'Owner') && (
            <li className={`sidebar-link ${activeTab === 'supply' ? 'active' : ''}`} onClick={() => setActiveTab('supply')}>
              <TrendingUp size={18} />
              {lang === 'EN' ? 'Supply Chain' : 'सप्लाई चेन'}
            </li>
          )}

          {(userRole === 'Manager' || userRole === 'Owner') && (
            <li className={`sidebar-link ${activeTab === 'sustainability' ? 'active' : ''}`} onClick={() => setActiveTab('sustainability')}>
              <Wind size={20} />
              {lang === 'EN' ? 'Sustainability' : 'स्थिरता'}
            </li>
          )}

          {userRole === 'Owner' && (
            <li className={`sidebar-link ${activeTab === 'finance' ? 'active' : ''}`} onClick={() => setActiveTab('finance')}>
              <DollarSign size={20} />
              {lang === 'EN' ? 'Finance & Risk' : 'वित्त और जोखिम'}
            </li>
          )}

          {(userRole === 'Operator' || userRole === 'Manager' || userRole === 'Owner') && (
            <li className={`sidebar-link ${activeTab === 'textile' ? 'active' : ''}`} onClick={() => setActiveTab('textile')}>
              <Briefcase size={18} />
              {lang === 'EN' ? 'Textile Specific' : 'वस्त्र विशेष'}
            </li>
          )}

          {userRole === 'Owner' && (
            <li className={`sidebar-link ${activeTab === 'strategy' ? 'active' : ''}`} onClick={() => setActiveTab('strategy')}>
              <BarChart3 size={18} />
              {lang === 'EN' ? 'Strategic Insights' : 'रणनीतिक अंतर्दृष्टि'}
            </li>
          )}

          {userRole === 'Owner' && (
            <li className={`sidebar-link ${activeTab === 'gov' ? 'active' : ''}`} onClick={() => setActiveTab('gov')} style={{ color: '#0ea5e9' }}>
              <Factory size={18} />
              {lang === 'EN' ? 'Bhilwara Gov-Portal' : 'भीलवाड़ा सरकार पोर्टल'}
            </li>
          )}

          <li className="sidebar-link" onClick={() => navigate("/entry")} style={{ marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1.25rem', color: 'var(--accent)', fontWeight: '700' }}>
            <Plus size={18} />
            {lang === 'EN' ? 'Industrial Data Hub' : 'इंडस्ट्रियल डेटा हब'}
          </li>
        </ul>

        <div className="sidebar-footer" style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: '800', letterSpacing: '1px' }}>SYSTEM ACCESS</div>

          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value)}
            style={{ width: '100%', background: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid var(--border)', padding: '10px', borderRadius: '8px', fontSize: '0.75rem', marginBottom: '1rem', cursor: 'pointer' }}
          >
            <option value="Operator">👷 OPERATOR VIEW</option>
            <option value="Manager">📊 MANAGER VIEW</option>
            <option value="Owner">👑 STRATEGIC OWNER</option>
          </select>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>{lang === 'EN' ? 'AI Learning' : 'AI लर्निंग'}</span>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              onClick={() => setIsAiLearningMode(!isAiLearningMode)}
            >
              <div className={`learning-dot ${isAiLearningMode ? 'active' : ''}`} />
              <div style={{ width: '32px', height: '18px', background: isAiLearningMode ? 'var(--primary)' : '#334155', borderRadius: '10px', position: 'relative', transition: '0.3s' }}>
                <div style={{ width: '14px', height: '14px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: isAiLearningMode ? '16px' : '2px', transition: '0.3s' }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>{lang === 'EN' ? 'Interface' : 'भाषा'}</span>
            <button
              onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')}
              className="lang-indicator"
              style={{ cursor: 'pointer', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.65rem' }}
            >
              {lang}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div className="welcome-text">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <span className="badge" style={{ background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '1px' }}>
                {userRole.toUpperCase()} ACCESS
              </span>
              {userRole === 'Owner' && <span className="badge" style={{ background: 'rgba(234, 179, 8, 0.1)', color: '#eab308', border: '1px solid #eab308' }}>PREMIUM ROLE</span>}
            </div>
            <h1>{lang === 'EN' ? `Welcome, ${userRole === 'Owner' ? 'Strategic Owner' : userRole}` : `${userRole === 'Owner' ? 'रणनीतिक मालिक' : userRole} का स्वागत है`}</h1>
            <p>{lang === 'EN' ? 'Real-time intelligence and AI-driven optimization' : 'रीयल-टाइम इंटेलिजेंस और एआई-संचालित अनुकूलन'}</p>
          </div>
          <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="btn-primary" onClick={() => {
              api.post("/ai/simulate", { outputPerShift: 80, shifts: 3, deadlineDays: 5 })
                .then(r => {
                  setSimulation(r.data.result);
                  alert("Simulation Complete: " + r.data.result);
                })
                .catch(err => alert("Simulation error: " + err.message));
            }}>
              <Play size={16} style={{ marginRight: '8px' }} />
              Simulate Shift
            </button>
          </div>
        </header>

        {activeTab === 'overview' && (
          <>
            <div className="executive-banner" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #0f172a 100%)', padding: '2.5rem', borderRadius: '1.5rem', marginBottom: '2.5rem', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
              <div style={{ position: 'relative', zIndex: 2 }}>
                <h2 style={{ fontSize: '2.4rem', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>TexTech Intelligence Hub</h2>
                <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '700px', fontSize: '1.1rem', lineHeight: '1.6' }}>
                  The factory is performing at <span style={{ color: 'var(--accent)', fontWeight: '700' }}>{pei}%</span> efficiency.
                  AI predicts <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{delay.includes('High') ? 'moderate' : 'zero'}</span> disruption risk in the current production cycle.
                </p>
                <div style={{ display: 'flex', gap: '3rem', marginTop: '2.5rem' }}>
                  <div className="hero-stat">
                    <div style={{ fontSize: '0.75rem', fontWeight: '600', opacity: 0.6, letterSpacing: '0.05em', marginBottom: '4px' }}>PLANT HEALTH</div>
                    <div style={{ fontSize: '2rem', fontWeight: '800' }}>{maintenanceScore}%</div>
                  </div>
                  <div className="hero-stat">
                    <div style={{ fontSize: '0.75rem', fontWeight: '600', opacity: 0.6, letterSpacing: '0.05em', marginBottom: '4px' }}>LIVE ALERTS</div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: inventoryAlerts.length > 0 ? 'var(--danger)' : 'white' }}>{inventoryAlerts.length}</div>
                  </div>
                  <div className="hero-stat">
                    <div style={{ fontSize: '0.75rem', fontWeight: '600', opacity: 0.6, letterSpacing: '0.05em', marginBottom: '4px' }}>RELIABILITY</div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent)' }}>{reliability}%</div>
                  </div>
                </div>
              </div>
              <div style={{ position: 'absolute', right: '-80px', top: '-80px', width: '400px', height: '400px', background: 'var(--primary)', filter: 'blur(100px)', opacity: 0.15 }}></div>
              <div style={{ position: 'absolute', left: '40%', bottom: '-50px', width: '250px', height: '250px', background: 'var(--accent)', filter: 'blur(80px)', opacity: 0.1 }}></div>
            </div>

            {/* FEATURE: Executive Summary Panel (Big Impression) */}
            <div className="alert alert-info" style={{
              marginBottom: '2rem',
              border: 'none',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
              borderLeft: '4px solid var(--primary)',
              padding: '1.5rem',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ background: 'var(--primary)', color: 'white', padding: '12px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }}>
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '4px' }}>Executive Strategy Summary</h2>
                  <p style={{ fontSize: '0.95rem', opacity: 0.8, lineHeight: '1.4' }}>
                    {executiveSummary.summary || "Analyzing plant telemetry... Overall production is stable with a 12% projected growth in net margin this month. Workforce skill index in Bhilwara cluster is up by 4%."}
                  </p>
                </div>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, padding: '10px' }}>
                  <div className="pulse" style={{ width: '8px', height: '8px', background: pei > 80 ? 'var(--accent)' : 'var(--danger)', borderRadius: '50%' }}></div>
                </div>
                <div className="stat-header">
                  <div className="stat-icon"><Activity size={20} /></div>
                  <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent)' }}>AI REAL-TIME</span>
                </div>
                <div className="stat-value">{pei || 0}%</div>
                <div className="stat-label">Production Efficiency Index</div>
              </div>

              {/* FEATURE: AI Anomaly Detection */}
              <div className="stat-card" style={{ border: anomaly.hasAnomaly ? '1px solid var(--danger)' : '1px solid rgba(255,255,255,0.05)' }}>
                <div className="stat-header">
                  <div className="stat-icon" style={{ color: anomaly.hasAnomaly ? 'var(--danger)' : 'var(--accent)' }}>
                    <ShieldAlert size={20} />
                  </div>
                  <span className="badge" style={{ background: anomaly.hasAnomaly ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: anomaly.hasAnomaly ? 'var(--danger)' : 'var(--accent)' }}>
                    {anomaly.hasAnomaly ? 'ANOMALY DETECTED' : 'SECURE'}
                  </span>
                </div>
                <div className="stat-value">{anomaly.type || 'Normal'}</div>
                <div className="stat-label">AI Anomaly Monitor</div>
              </div>
              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon"><ShieldCheck size={20} /></div>
                  <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>PREDICTIVE</span>
                </div>
                <div className="stat-value">{reliability || 0}%</div>
                <div className="stat-label">System Reliability Score</div>
              </div>
              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon"><Zap size={20} /></div>
                  <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>RISK LEVEL</span>
                </div>
                <div className="stat-value">{delay.includes('High') ? 'Elevated' : 'Stable'}</div>
                <div className="stat-label">Delivery Delay Prediction</div>
              </div>
              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon"><Briefcase size={20} /></div>
                  <span className="badge" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>STRATEGIC</span>
                </div>
                <div className="stat-value">{digitalMaturity || 0}/100</div>
                <div className="stat-label">MSME Digital Maturity</div>
              </div>
            </div>

            <div className="charts-grid">
              <div className="chart-container">
                <h3 className="section-title">Production Efficiency Trend (7D)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={peiTrend.length > 0 ? peiTrend : [
                    { name: 'Mon', pei: 82 }, { name: 'Tue', pei: 85 }, { name: 'Wed', pei: 83 },
                    { name: 'Thu', pei: 88 }, { name: 'Fri', pei: 84 }, { name: 'Sat', pei: 86 }, { name: 'Sun', pei: 84 },
                  ]}>
                    <defs>
                      <linearGradient id="colorPei" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} itemStyle={{ color: '#f8fafc' }} />
                    <Area type="monotone" dataKey="pei" stroke="var(--primary)" fillOpacity={1} fill="url(#colorPei)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-container" style={{ display: 'flex', flexDirection: 'column' }}>
                <h3 className="section-title">Factory Risk Heatmap</h3>
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(3, 1fr)', gap: '12px' }}>
                  {[...Array(9)].map((_, i) => {
                    const colors = ['rgba(6, 95, 70, 0.6)', 'rgba(6, 95, 70, 0.6)', 'rgba(5, 150, 105, 0.6)', 'rgba(217, 119, 6, 0.6)', 'rgba(5, 150, 105, 0.6)', 'rgba(5, 150, 105, 0.6)', 'rgba(153, 27, 27, 0.6)', 'rgba(217, 119, 6, 0.6)', 'rgba(5, 150, 105, 0.6)'];
                    const labels = ['Stable', 'Stable', 'Healthy', 'Warning', 'Healthy', 'Healthy', 'CRITICAL', 'Alert', 'Healthy'];
                    const zones = ['Prod-A', 'Prod-B', 'Logistics', 'Supply', 'Core', 'QA', 'Energy', 'Labor', 'IT'];
                    return (
                      <div key={i} style={{ background: colors[i], borderRadius: '12px', padding: '10px', fontSize: '0.7rem', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                        <div style={{ fontWeight: '800', marginBottom: '2px', letterSpacing: '0.02em', fontSize: '0.65rem' }}>{labels[i]}</div>
                        <div style={{ opacity: 0.6, fontSize: '0.55rem' }}>{zones[i]}</div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '1.25rem', fontStyle: 'italic' }}>
                  Live visual analysis across nine factory dimensions.
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'strategy' && (
          <div className="strategy-panel animate-fade-in">
            <div className="stats-grid">
              <div className="stat-card" style={{ borderLeft: '4px solid #8b5cf6' }}>
                <div className="stat-header"><span className="stat-label">SaaS Business Readiness</span><LayoutDashboard size={20} color="#8b5cf6" /></div>
                <div className="stat-value">Tier 1 Ready</div>
                <div className="stat-label">Multi-tenant architecture active</div>
              </div>
              <div className="stat-card" style={{ borderLeft: '4px solid #10b981' }}>
                <div className="stat-header"><span className="stat-label">Export Credit Insurance</span><ShieldCheck size={20} color="#10b981" /></div>
                <div className="stat-value">ECGC Grade A</div>
                <div className="stat-label">Low-risk buyer network detected</div>
              </div>
              <div className="stat-card" style={{ borderLeft: '4px solid #f59e0b' }}>
                <div className="stat-header"><span className="stat-label">Profit Projection (30D)</span><DollarSign size={20} color="#f59e0b" /></div>
                <div className="stat-value">₹ {profit.monthlyProfit || '0'} Cr</div>
                <div className="stat-label">Expected growth: +12%</div>
              </div>
            </div>

            <div className="stat-card" style={{ marginTop: '1.5rem' }}>
              <h3 className="section-title">Investment & Digital Maturity</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(0,0,0,0.1)', borderRadius: '1rem' }}>
                  <div style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--primary)' }}>{digitalMaturity}%</div>
                  <div style={{ fontWeight: '700', marginTop: '1rem' }}>Digital Maturity Score</div>
                  <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>Top 5% in Bhilwara Cluster</p>
                </div>
                <div>
                  <h4 style={{ marginBottom: '1rem' }}>Strategic Recommendations</h4>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <CheckCircle2 size={16} color="var(--primary)" /> Upgrade Yarn Mix Optimization for 5% cost reduction.
                    </li>
                    <li style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <CheckCircle2 size={16} color="var(--primary)" /> Deploy Solar Batch Shifting to save ₹4.5L monthly.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Consolidated Benchmark Data */}
            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginTop: '1.5rem' }}>
              <div className="stat-card" style={{ gridColumn: 'span 2', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(16, 185, 129, 0.1))' }}>
                <h3 className="section-title">MSME Industry Benchmarking (Bhilwara District)</h3>
                <div style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.9rem' }}>Your Efficiency Index (PEI)</span>
                    <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{pei}%</span>
                  </div>
                  <div style={{ height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden', marginBottom: '20px' }}>
                    <div style={{ width: `${pei}%`, height: '100%', background: 'var(--accent)' }}></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.9rem' }}>Bhilwara Average (Textile Cluster)</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>78%</span>
                  </div>
                  <div style={{ height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{ width: '78%', height: '100%', background: 'var(--primary)' }}></div>
                  </div>
                  <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Intelligence Note: Your plant is outperforming the cluster average by <span style={{ color: 'var(--accent)' }}>{pei - 78}%</span>.
                  </p>
                </div>
              </div>

              <div className="stat-card">
                <h3 className="section-title">Government Scheme Eligibility</h3>
                <div className="alerts-list" style={{ border: 'none', padding: 0 }}>
                  <div className="alert-item" style={{ background: 'rgba(16, 185, 129, 0.05)', borderRadius: '10px' }}>
                    <div className="alert-indicator indicator-low" style={{ background: 'var(--accent)' }}></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '700', fontSize: '1rem' }}>ATUFS (Eligible)</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Technology Upgradation Fund Scheme</div>
                    </div>
                    <div style={{ color: 'var(--accent)', fontWeight: 'bold' }}>₹25L Est.</div>
                  </div>
                  <div className="alert-item" style={{ background: 'rgba(99, 102, 241, 0.05)', borderRadius: '10px', marginTop: '10px' }}>
                    <div className="alert-indicator indicator-low" style={{ background: 'var(--primary)' }}></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '700', fontSize: '1rem' }}>PLI Scheme Eligibility</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Production Linked Incentive for Textiles</div>
                    </div>
                    <div style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Pending</div>
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <h3 className="section-title">Cluster Collaboration Insight</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="mini-card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)' }}>14</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.6, letterSpacing: '0.1em' }}>SHARED RESOURCES</div>
                  </div>
                  <div className="mini-card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent)' }}>High</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.6, letterSpacing: '0.1em' }}>TRUST SCORE</div>
                  </div>
                </div>
                <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                  Collaborative logistics optimization achieved a 12% reduction in cluster transportation costs last quarter.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'gov' && (
          <div className="gov-panel animate-fade-in">
            <div className="stat-card" style={{ background: 'linear-gradient(rgba(14, 165, 233, 0.1), transparent)' }}>
              <h3 className="section-title" style={{ color: '#0ea5e9', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Factory size={22} /> Rajasthan MSME Policy Support
              </h3>
              <div className="stats-grid" style={{ marginTop: '2rem' }}>
                <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                  <div style={{ fontWeight: '800', color: '#0ea5e9' }}>PMEGP Eligibility</div>
                  <div style={{ fontSize: '1.2rem', margin: '0.5rem 0' }}>{govSchemes.pmegpEligible ? 'Qualified ✅' : 'Review Needed ⏳'}</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>Subsidy: Up to 35% of project cost.</div>
                </div>
                <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                  <div style={{ fontWeight: '800', color: '#0ea5e9' }}>CLCSS (Tech Upgrade)</div>
                  <div style={{ fontSize: '1.2rem', margin: '0.5rem 0' }}>High Probability</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>15% capital subsidy for machinery.</div>
                </div>
                <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                  <div style={{ fontWeight: '800', color: '#0ea5e9' }}>RIPS 2022 Benefits</div>
                  <div style={{ fontSize: '1.2rem', margin: '0.5rem 0' }}>Eligible (Textile Focus)</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>Electricity duty & Land tax exemptions.</div>
                </div>
              </div>
            </div>

            <div className="stat-card" style={{ marginTop: '1.5rem', background: 'rgba(16, 185, 129, 0.05)' }}>
              <h4 style={{ marginBottom: '1rem' }}>Live Government Insights for Bhilwara</h4>
              <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>AI recommends applying for **M-SME Excellence Awards** based on your current PEI of {pei}% and ZLD compliance status.</p>
              <button className="btn-primary" style={{ marginTop: '1.5rem', background: '#0ea5e9' }}>Download Compliance Report</button>
            </div>
          </div>
        )}
        {activeTab === 'operations' && (
          <>
            <div className="stats-grid">
              <div className="stat-card" style={{ borderLeft: '4px solid var(--primary)' }}>
                <div className="stat-header"><span className="stat-label">Predictive Maintenance</span><Activity size={20} color="var(--primary)" /></div>
                <div className="stat-value" style={{ color: maintenance.maintenanceProbability?.includes('critical') ? 'var(--danger)' : 'white' }}>
                  {maintenance.maintenanceProbability || '0%'}
                </div>
                <div className="stat-label">{maintenance.status || 'Optimizing...'}</div>
              </div>
              <div className="stat-card" style={{ borderLeft: '4px solid #10b981' }}>
                <div className="stat-header"><span className="stat-label">Power Fluctuation Risk</span><Zap size={20} color="#f59e0b" /></div>
                <div className="stat-value">Low</div>
                <div className="stat-label">Grid Stability: 98.5%</div>
              </div>
              <div className="stat-card" style={{ borderLeft: '4px solid var(--accent)' }}>
                <div className="stat-header"><span className="stat-label">Active Loom Count</span><LayoutDashboard size={20} color="var(--accent)" /></div>
                <div className="stat-value">18 / 20</div>
                <div className="stat-label">2 Looms in Cycle-Maint</div>
              </div>
              <div className="stat-card" style={{ borderLeft: '4px solid #8b5cf6' }}>
                <div className="stat-header"><span className="stat-label">Workforce Safety Index</span><ShieldCheck size={20} color="#10b981" /></div>
                <div className="stat-value">{safety.safetyScore || 0}/100</div>
                <div className="stat-label">PPE Compliance: {manualData?.ppeCompliance || 95}%</div>
              </div>
            </div>

            <div className="charts-grid" style={{ marginTop: '1.5rem' }}>
              <div className="chart-container">
                <h3 className="section-title">Live System Events Log</h3>
                <div style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '10px' }}>
                  {systemEvents.map(ev => (
                    <div key={ev.id} style={{ display: 'flex', gap: '1rem', padding: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--text-muted)', fontWeight: '600', minWidth: '60px' }}>{ev.time}</span>
                      <span style={{
                        color: ev.type === 'danger' ? 'var(--danger)' :
                          ev.type === 'warning' ? '#f59e0b' :
                            ev.type === 'success' ? 'var(--accent)' : 'white',
                        fontWeight: ev.type === 'danger' || ev.type === 'warning' ? '700' : '400'
                      }}>
                        {ev.msg}
                      </span>
                    </div>
                  ))}
                </div>
                <button className="btn-primary" style={{ width: '100%', marginTop: '1rem', background: 'rgba(255,255,255,0.05)', fontSize: '0.75rem', padding: '0.5rem' }}>
                  View Full Audit Log
                </button>
              </div>
              <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'linear-gradient(rgba(16, 185, 129, 0.1), transparent)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent)', marginBottom: '0.5rem' }}>SAFETY PULSE</div>
                  <div style={{ fontSize: '3rem', fontWeight: '900', color: '#10b981' }}>{safety.accidentFreeRecord || '120'}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>Accident-Free Days</div>
                  <div className="learning-dot active" style={{ margin: '1rem auto' }}></div>
                  <p style={{ fontSize: '0.7rem', opacity: 0.6 }}>Top 1% National Excellence</p>
                </div>
              </div>
            </div>

            <div className="stat-card" style={{ marginTop: '1.5rem' }}>
              <h3 className="section-title">Plant Floor Status</h3>
              <div className="machine-grid">
                {machineStatus.map(m => (
                  <div key={m.id} className="stat-card" style={{ padding: '1.25rem', border: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
                    {m.status === 'Running' && (
                      <div className="learning-dot active" style={{ position: 'absolute', top: '15px', right: '15px' }}></div>
                    )}
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '4px' }}>{m.name}</div>
                      <span className={`badge ${m.status === 'Running' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.6rem' }}>{m.status}</span>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        <span>Loom Health</span>
                        <span>{m.health}%</span>
                      </div>
                      <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                        <div style={{ height: '100%', width: `${m.health}%`, background: m.health > 70 ? 'var(--accent)' : 'var(--danger)', borderRadius: '3px', boxShadow: `0 0 10px ${m.health > 70 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}` }}></div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Temp</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: '800', color: m.temp > 80 && m.name.includes('Loom') ? 'var(--danger)' : 'white' }}>{m.temp}°C</div>
                      </div>
                      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>RPM/Spd</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: '800' }}>{m.rpm}</div>
                      </div>
                    </div>

                    <div style={{ marginTop: '0.75rem', fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '5px', opacity: 0.6 }}>
                      <Activity size={10} /> Vibration: <span style={{ color: m.vibration === 'High' ? 'var(--danger)' : 'var(--accent)' }}>{m.vibration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'maintenance' && (
          <div className="maintenance-panel animate-fade-in">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-header"><span className="stat-label">System Health</span><Activity size={20} color="var(--primary)" /></div>
                <div className="stat-value">{maintenanceScore}%</div>
                <div className="stat-label">Overall Plant Condition</div>
              </div>
              <div className="stat-card">
                <div className="stat-header"><span className="stat-label">Repair Probability</span><Zap size={20} color="var(--danger)" /></div>
                <div className="stat-value">{maintenance.maintenanceProbability || '0%'}</div>
                <div className="stat-label">{maintenance.status || 'Stable'}</div>
              </div>
              <div className="stat-card">
                <div className="stat-header"><span className="stat-label">Safety Score</span><ShieldCheck size={20} color="var(--accent)" /></div>
                <div className="stat-value">{safety.safetyScore || 0}/100</div>
                <div className="stat-label">Accident-Free: {safety.accidentFreeRecord}</div>
              </div>
            </div>

            <div className="chart-container" style={{ marginTop: '1.5rem' }}>
              <h3 className="section-title">AI Maintenance Recommendations</h3>
              <div className="recommendations-list">
                {recommendations.length > 0 ? recommendations.map((rec, i) => (
                  <div key={i} className="alert alert-info" style={{ marginBottom: '1rem', borderLeft: '4px solid var(--primary)' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      <Settings size={18} style={{ marginTop: '2px' }} />
                      <div>
                        <div style={{ fontWeight: '700', marginBottom: '4px' }}>Recommendation #{i + 1}</div>
                        <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{rec}</div>
                      </div>
                    </div>
                  </div>
                )) : (
                  <p style={{ opacity: 0.6 }}>Running deep diagnostics... No immediate actions required.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'quality' && (
          <div className="quality-panel animate-fade-in">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-header"><span className="stat-label">AQL 2.5 Status</span><ShieldCheck size={20} color="var(--accent)" /></div>
                <div className="stat-value">{quality.aqlStatus || 'PASS'}</div>
                <div className="stat-label">Export Quality Standard</div>
              </div>
              <div className="stat-card">
                <div className="stat-header"><span className="stat-label">Defect Rate</span><Zap size={20} color="var(--danger)" /></div>
                <div className="stat-value">{quality.defectsCount || 0}</div>
                <div className="stat-label">Items flagged per batch</div>
              </div>
              <div className="stat-card">
                <div className="stat-header"><span className="stat-label">Export Readiness</span><Award size={20} color="var(--primary)" /></div>
                <div className="stat-value">{exportScore}/100</div>
                <div className="stat-label">Global Compliance Grade</div>
              </div>
            </div>

            <div className="charts-grid" style={{ marginTop: '1.5rem' }}>
              <div className="chart-container">
                <h3 className="section-title">Quality Variance (Batch Analysis)</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { name: 'GSM', val: manualData?.gsmDeviation || 2 },
                    { name: 'Color', val: manualData?.colorVariance || 1.5 },
                    { name: 'Shrink', val: manualData?.shrinkage || 0.8 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155' }} />
                    <Bar dataKey="val" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="stat-card">
                <h3 className="section-title">Certification Status</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <CheckCircle2 size={18} color="var(--accent)" /> Oeko-Tex Standard 100
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <CheckCircle2 size={18} color="var(--accent)" /> GOTS Certification
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid var(--text-muted)' }}></div> ISO 9001:2015 (Renewing)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'textile' && (
          <div className="textile-panel animate-fade-in">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-header"><span className="stat-label">Production Flow</span><Cpu size={20} color="var(--primary)" /></div>
                <div className="stat-value">{textileFlow.rejectionRate || '0'}%</div>
                <div className="stat-label">Rejection Rate (Grey to Finished)</div>
              </div>
              <div className="stat-card">
                <div className="stat-header"><span className="stat-label">Compliance Monitor</span><ShieldCheck size={20} color="var(--accent)" /></div>
                <div className="stat-value">{quality.aqlStatus || 'AQL 2.5'}</div>
                <div className="stat-label">{quality.defectsCount || 0} defects in latest batch</div>
              </div>
              <div className="stat-card">
                <div className="stat-header"><span className="stat-label">Labor skill index</span><Users size={20} color="var(--primary)" /></div>
                <div className="stat-value">{laborSkill.overallScore || '78'}/100</div>
                <div className="stat-label">Bhilwara Cluster Avg: 72</div>
              </div>
            </div>

            {/* FEATURE: Grey to Finished Fabric Tracking */}
            <div className="stat-card" style={{ marginTop: '1.5rem', padding: '2rem' }}>
              <h3 className="section-title">Grey Fabric to Finished Fabric Flow</h3>
              {/* AI Learning Mode / Simulation Banner */}
              {isAiLearningMode && (
                <div style={{
                  marginBottom: '1.5rem',
                  padding: '1rem',
                  background: 'linear-gradient(90deg, rgba(14, 165, 233, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)',
                  border: '1px solid rgba(14, 165, 233, 0.3)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  animation: 'pulse-glow 2s infinite'
                }}>
                  <BrainCircuit size={20} color="#0ea5e9" />
                  <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0ea5e9' }}>
                    AI LEARNING MODE ACTIVE:
                  </span>
                  <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                    Simulator is modeling "What-If" scenarios based on current production data. Insights are projected.
                  </span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ textAlign: 'center', zIndex: 1 }}>
                  <div style={{ width: '60px', height: '60px', background: 'rgba(99, 102, 241, 0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}><Layers size={24} color="var(--primary)" /></div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>Grey</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{textileFlow.greyProduced || 0}m</div>
                </div>
                <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', margin: '0 10px', marginTop: '-30px', position: 'relative' }}>
                  <div style={{ width: '100%', height: '100%', background: 'var(--primary)', opacity: 0.3 }}></div>
                </div>
                <div style={{ textAlign: 'center', zIndex: 1 }}>
                  <div style={{ width: '60px', height: '60px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}><Droplets size={24} color="var(--accent)" /></div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>Dyed</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{textileFlow.dyedCompleted || 0}m</div>
                </div>
                <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', margin: '0 10px', marginTop: '-30px', position: 'relative' }}>
                  <div style={{ width: '100%', height: '100%', background: 'var(--accent)', opacity: 0.3 }}></div>
                </div>
                <div style={{ textAlign: 'center', zIndex: 1 }}>
                  <div style={{ width: '60px', height: '60px', background: 'rgba(139, 92, 246, 0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}><CheckCircle size={24} color="#8b5cf6" /></div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>Finished</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{textileFlow.finishedCompleted || 0}m</div>
                </div>
              </div>
              <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', borderRadius: '12px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Zap size={16} color="var(--danger)" />
                <span><strong>AI Flow Analytics:</strong> {textileFlow.bottleneck || 'Analyzing production steps for bottlenecks...'}</span>
              </div>
            </div>

            <div className="stat-card" style={{ marginTop: '1.5rem', background: 'rgba(99, 102, 241, 0.05)' }}>
              <h3 className="section-title">Yarn Count & Fabric Mix Optimization</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Suggested Count</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800' }}>{yarnOpt.suggestedCount || '30s Cotton'}</div>
                </div>
                <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Cost Saving per kg</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent)' }}>₹{yarnOpt.costSavingPerKg || '12.5'}</div>
                </div>
                <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Blend Quality Factor</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800' }}>{yarnOpt.qualityFactor || 'Exquisite'}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sustainability' && (
          <div className="sustainability-panel animate-fade-in">
            {/* FEATURE: Heatwave Impact Alert (VERY BHILWARA SPECIFIC) */}
            {heatwave.isHeatwave && (
              <div className="alert alert-danger" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', borderRadius: '16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)' }}>
                <Thermometer size={32} />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>HEATWAVE IMPACT ALERT (Action Required)</h3>
                  <p style={{ margin: '5px 0 0', opacity: 0.8, fontSize: '0.9rem' }}>{heatwave.recommendation}</p>
                </div>
              </div>
            )}

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-header"><span className="stat-label">ESG Score</span><Globe size={20} color="var(--accent)" /></div>
                <div className="stat-value">{esg.score || 0}/100</div>
                <div className="stat-label">Social & Climate Responsibility</div>
              </div>
              <div className="stat-card">
                <div className="stat-header"><span className="stat-label">Zero Liquid Discharge</span><Droplets size={20} color="var(--primary)" /></div>
                <div className="stat-value">{esg.zldStatus || 'ACTIVE'}</div>
                <div className="stat-label">Water recycling compliance active</div>
              </div>
              <div className="stat-card">
                <div className="stat-header"><span className="stat-label">Solar Optimization</span><Zap size={20} color="#f59e0b" /></div>
                <div className="stat-value">{solar.solarSavings || 0}%</div>
                <div className="stat-label">Grid reduction via rooftop solar</div>
              </div>
            </div>

            <div className="charts-grid" style={{ marginTop: '1.5rem' }}>
              <div className="chart-container">
                <h3 className="section-title">Water Usage & Recycling Intelligence</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Fresh Water', value: manualData?.waterUsage || 1000 },
                        { name: 'Recycled Water', value: manualData?.recycledWater || 800 }
                      ]}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      <Cell fill="var(--primary)" stroke="none" />
                      <Cell fill="var(--accent)" stroke="none" />
                    </Pie>
                    <Tooltip contentStyle={{ background: '#1e293b', border: 'none' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: '12px', height: '12px', background: 'var(--primary)', borderRadius: '2px' }}></div> Fresh</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: '12px', height: '12px', background: 'var(--accent)', borderRadius: '2px' }}></div> Recycled</div>
                </div>
              </div>

              <div className="stat-card">
                <h3 className="section-title">Textile Waste Recycling Intelligence</h3>
                <div style={{ textAlign: 'center', padding: '1rem' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--accent)' }}>₹{manualData?.wasteResaleValue || 0}</div>
                  <div style={{ fontWeight: '700', opacity: 0.6 }}>Monthly Resale Value</div>
                  <div style={{ marginTop: '1.5rem', fontSize: '0.85rem', padding: '1rem', background: 'rgba(0,0,0,0.1)', borderRadius: '12px' }}>
                    <p style={{ marginBottom: '5px' }}><strong>AI Suggested Action:</strong></p>
                    <p style={{ opacity: 0.8 }}>Resale values for cotton waste are peaking in Bhilwara cluster. Consider bulk contract for next quarter.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'supply' && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <h3 className="section-title">Yarn Price Intelligence</h3>
                <div className="stat-value">₹{yarnPrice.currentPrice || '195'}/kg</div>
                <p style={{ color: yarnPrice.trend === 'Rising' ? 'var(--danger)' : 'var(--accent)', fontSize: '0.9rem' }}>{yarnPrice.trend || 'Trending Stable'}</p>
              </div>
              <div className="stat-card">
                <h3 className="section-title">Supply Chain Flow</h3>
                <div className="stat-value">{subcontractor.status || 'On-Track'}</div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Export Readiness: {exportScore}/100</p>
              </div>
              <div className="stat-card">
                <h3 className="section-title">Seasonal Prediction</h3>
                <div className="stat-value">{season.prediction || 'High Demand'}</div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Cluster Efficiency: {cluster.score || '92'}%</p>
              </div>
              <div className="alerts-list">
                <h3 className="section-title">Inventory Alerts</h3>
                {inventoryAlerts.map(a => (
                  <div key={a._id} style={{ fontSize: '0.85rem', marginBottom: '8px', borderLeft: '3px solid var(--danger)', paddingLeft: '8px' }}>
                    {a.material} critical level
                  </div>
                ))}
              </div>
            </div>

            <div className="charts-grid" style={{ marginTop: '1.5rem' }}>
              <div className="chart-container">
                <h3 className="section-title">Yarn Price Trend (Market Intelligence)</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={[
                    { name: 'Week 1', price: 180 },
                    { name: 'Week 2', price: 185 },
                    { name: 'Week 3', price: 190 },
                    { name: 'Week 4', price: 188 },
                    { name: 'Current', price: 195 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155' }} />
                    <Area type="monotone" dataKey="price" stroke="var(--primary)" fill="rgba(99, 102, 241, 0.1)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="stat-card">
                <h3 className="section-title">Subcontractor Progress</h3>
                <div className="stat-value" style={{ fontSize: '1.8rem' }}>{subcontractor.progress || '60'}%</div>
                <div style={{ height: '8px', background: '#334155', borderRadius: '4px', marginTop: '10px' }}>
                  <div style={{ height: '100%', width: `${subcontractor.progress || 60}%`, background: 'var(--primary)', borderRadius: '4px' }}></div>
                </div>
                <p style={{ fontSize: '0.8rem', marginTop: '10px' }}>Estimated Delivery: 4 days</p>
              </div>
            </div>
          </>
        )}

        {activeTab === 'sustainability' && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <h3 className="section-title">ESG Compliance</h3>
                <div className="stat-value">{esg}/100</div>
                <p style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>Carbon Footprint: Low</p>
              </div>
              <div className="stat-card">
                <h3 className="section-title">ZLD Water Intelligence</h3>
                <div className="stat-value">{water.recyclingRate || '0%'}</div>
                <p style={{ color: 'var(--accent)', fontSize: '0.8rem' }}>ZLD Score: {water.zldScore || '0'}/100</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{water.alert}</p>
              </div>
              <div className="stat-card">
                <h3 className="section-title">Solar Optimization</h3>
                <div className="stat-value">{solar.solarContribution || '0%'}</div>
                <p style={{ color: 'var(--accent)', fontSize: '0.8rem' }}>Daily ROI: {solar.solarSavings || '₹0'}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{solar.optimizationTip}</p>
              </div>
              <div className="stat-card">
                <h3 className="section-title">Climate Alert</h3>
                <div className="stat-value" style={{ fontSize: '1rem', color: 'var(--danger)' }}>{heatwave}</div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Heatwave protection active</p>
              </div>
            </div>
            <div className="charts-grid" style={{ marginTop: '1.5rem' }}>
              <div className="chart-container">
                <h3 className="section-title">Water Usage vs Recycling</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={waterTrend.length > 0 ? waterTrend : [
                    { name: 'Phase 1', used: 4000, recycled: 1500 },
                    { name: 'Phase 2', used: 5000, recycled: 2000 },
                    { name: 'Phase 3', used: 4500, recycled: 2200 },
                    { name: 'Phase 4', used: 4800, recycled: 2500 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155' }} />
                    <Area type="monotone" dataKey="used" stroke="#ef4444" fill="rgba(239, 68, 68, 0.1)" />
                    <Area type="monotone" dataKey="recycled" stroke="var(--accent)" fill="rgba(16, 185, 129, 0.1)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="stat-card">
                <h3 className="section-title">Environmental ROI</h3>
                <div className="stat-value" style={{ color: 'var(--accent)' }}>₹{waste.resaleValue || '0'}</div>
                <p style={{ fontSize: '0.8rem' }}>Daily Savings from Recycling</p>
              </div>
            </div>
          </>
        )}

        {activeTab === 'finance' && (
          <div className="finance-panel animate-fade-in">
            <div className="stats-grid">
              <div className="stat-card" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(30, 41, 59, 0) 100%)' }}>
                <div className="stat-header"><span className="stat-label">Real-Time Profit Margin</span><DollarSign size={20} color="var(--accent)" /></div>
                <div className="stat-value">₹{profit.monthlyProfit || '0'} Cr</div>
                <div className="stat-label">Projection (Next 30D)</div>
              </div>
              <div className="stat-card">
                <div className="stat-header"><span className="stat-label">Credit & Payment Risk</span><ShieldCheck size={20} color="var(--accent)" /></div>
                <div className="stat-value">{creditRisk.riskScore || 'Low'}</div>
                <div className="stat-label">Status: {creditRisk.status || 'Excellent'}</div>
              </div>
              <div className="stat-card">
                <div className="stat-header"><span className="stat-label">Cost Optimization</span><Cpu size={20} color="var(--primary)" /></div>
                <div className="stat-value">₹{costOptimization.totalSavings || '1.2'}L</div>
                <div className="stat-label">Potential Monthly Savings</div>
              </div>
            </div>

            <div className="charts-grid" style={{ marginTop: '1.5rem' }}>
              <div className="stat-card">
                <h3 className="section-title">Payment Cycle & Credit Risk Tracker</h3>
                <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Avg. Payment Collection Period</span>
                    <span style={{ fontWeight: '700' }}>{creditRisk.avgCollectionDays || '28'} Days</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>ECGC Export Insurance</span>
                    <span style={{ color: 'var(--accent)', fontWeight: '700' }}>COVERED (Grade A)</span>
                  </div>
                  <div style={{ marginTop: '1rem', padding: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--accent)' }}>
                    High-trust buyer network detected in current pipeline.
                  </div>
                </div>
              </div>

              <div className="chart-container">
                <h3 className="section-title">Cost Breakdown & Optimization Target</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={costBreakdown.length > 0 ? costBreakdown : [
                    { name: 'Labor', target: 80, actual: 70 },
                    { name: 'Yarn', target: 90, actual: 85 },
                    { name: 'Power', target: 60, actual: 40 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ background: '#1e293b', border: 'none' }} />
                    <Bar dataKey="actual" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="target" fill="rgba(255,255,255,0.1)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'supply' && (
          <div className="supply-panel animate-fade-in">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-header"><span className="stat-label">Raw Material Intelligence</span><Layers size={20} color="var(--primary)" /></div>
                <div className="stat-value">₹{yarnPrice.currentPrice || '195'}/kg</div>
                <div className="stat-label">{yarnPrice.trend || 'Trending Stable'}</div>
              </div>
              <div className="stat-card">
                <div className="stat-header"><span className="stat-label">Subcontractor Tracking</span><Briefcase size={20} color="var(--accent)" /></div>
                <div className="stat-value">{subcontractor.progress || '60'}%</div>
                <div className="stat-label">Job Work: {subcontractor.status || 'Active'}</div>
              </div>
              <div className="stat-card">
                <div className="stat-header"><span className="stat-label">Seasonal Demand</span><TrendingUp size={20} color="var(--primary)" /></div>
                <div className="stat-value">{season.prediction || 'High'}</div>
                <div className="stat-label">Quarterly Focus Tier 1</div>
              </div>
            </div>

            <div className="charts-grid" style={{ marginTop: '1.5rem' }}>
              <div className="chart-container">
                <h3 className="section-title">Market Price Volatility (30D)</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={[
                    { name: 'Day 1', price: 180 }, { name: 'Day 10', price: 185 }, { name: 'Day 20', price: 190 }, { name: 'Day 30', price: 195 }
                  ]}>
                    <XAxis dataKey="name" hide />
                    <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                    <Tooltip contentStyle={{ background: '#1e293b', border: 'none' }} />
                    <Area type="monotone" dataKey="price" stroke="var(--primary)" fill="rgba(99, 102, 241, 0.1)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="stat-card">
                <h3 className="section-title">Active Risk Alerts</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {inventoryAlerts.length > 0 ? inventoryAlerts.map((a, i) => (
                    <div key={i} style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderLeft: '3px solid var(--danger)', borderRadius: '4px', fontSize: '0.85rem' }}>
                      <strong>{a.material}:</strong> {a.status || 'Critical Level'}
                    </div>
                  )) : (
                    <div style={{ opacity: 0.6, fontSize: '0.85rem' }}>No major supply risks detected.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'strategy' && (
          <div className="strategy-panel animate-fade-in">
            <div className="stats-grid">
              <div className="stat-card" style={{ borderLeft: '4px solid #8b5cf6' }}>
                <div className="stat-header"><span className="stat-label">Strategic Collaboration</span><Users size={20} color="#8b5cf6" /></div>
                <div className="stat-value">{cluster.clusterPercentile || 'Top 10'}%</div>
                <div className="stat-label">Cluster Leader Ranking</div>
              </div>
              <div className="stat-card" style={{ borderLeft: '4px solid #10b981' }}>
                <div className="stat-header"><span className="stat-label">SaaS/Digital Tier</span><Cpu size={20} color="#10b981" /></div>
                <div className="stat-value">Enterprise</div>
                <div className="stat-label">Business Readiness Level</div>
              </div>
              <div className="stat-card" style={{ borderLeft: '4px solid #f59e0b' }}>
                <div className="stat-header"><span className="stat-label">Government Portal</span><Building2 size={20} color="#f59e0b" /></div>
                <div className="stat-value">{govSchemes.eligible || '4'} Schemes</div>
                <div className="stat-label">Application Status: Open</div>
              </div>
            </div>

            <div className="stat-card" style={{ marginTop: '1.5rem', background: 'rgba(139, 92, 246, 0.05)' }}>
              <h3 className="section-title">Cluster Node Collaboration Logic</h3>
              <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem' }}>
                  <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '50%', opacity: 0.4 }}></div>
                  <div style={{ width: '60px', height: '60px', background: 'var(--primary)', borderRadius: '50%', border: '4px solid var(--primary)', boxShadow: '0 0 20px var(--primary)' }}></div>
                  <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '50%', opacity: 0.4 }}></div>
                </div>
                <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', opacity: 0.8 }}>
                  Integrated with {cluster.nodeCount || '15'} neighboring units in the Bhilwara Synthetic Cluster.
                </p>
                <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                  <span style={{ fontSize: '0.85rem' }}><strong>Collaborative Intelligence:</strong> Excess loom capacity (12%) detected in Cluster Node #4. Consider outsourcing overflow orders.</span>
                </div>
              </div>
            </div>
          </div>
        )}



      </main >
    </div >
  );
}
