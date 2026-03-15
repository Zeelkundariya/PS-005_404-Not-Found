import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import ExcelUpload from '../components/ExcelUpload';
import {
    Save, AlertCircle, TrendingUp, Cpu, Droplets, Trash2,
    Users, Zap, DollarSign, Activity, Settings, Info, Briefcase
} from 'lucide-react';
import { Plus } from 'lucide-react';

const DataEntry = () => {
    const navigate = useNavigate();

    // Industrial Initial State (All Zeros) 
    const [formData, setFormData] = useState({
        actualOutput: 0, expectedOutput: 0,
        uptime: 0, breakdowns: 0, daysSince: 0, vibration: 40, temp: 35,
        activeWorkers: 0, trainingHours: 0, accidentFreeDays: 120,
        ppeCompliance: 95, safetyDrills: 2, unresolvedHazards: 0,
        powerConsumedKwh: 0, solarContribution: 0,
        waterUsage: 0, recycledWater: 0,
        fabricProducedMeters: 0, yarnUsedKg: 0, loomHours: 0,
        defectsCount: 0, totalUnitsTested: 100, gsmDeviation: 0.5,
        colorVariance: 0.2, shrinkage: 0.1, certification: 'Oeko-Tex-100',
        operatingCost: 0, revenue: 0, yarnPrice: 0, wasteResaleValue: 0,
        subcontractorProgress: 60, subcontractorDeadline: 5,
        exportOrders: 2, clusterParticipation: 1
    });

    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);
    const [lang, setLang] = useState(localStorage.getItem('sf_root_lang') || 'EN');
    const [activeSection, setActiveSection] = useState('production');

    useEffect(() => {
        localStorage.setItem('sf_root_lang', lang);
    }, [lang]);

    const [liveSignal, setLiveSignal] = useState({ vibration: 42, temp: 38 });

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const { data } = await api.get('/iot/live');
                setLiveSignal({
                    vibration: data.gauges.vibration,
                    temp: data.gauges.avgTemp
                });
            } catch (err) { console.error(err); }
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const saved = localStorage.getItem('manualFactoryData');
        if (saved) setFormData(JSON.parse(saved));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    };

    const handleReset = () => {
        if (window.confirm("Clear all factory data?")) {
            const zeros = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: 0 }), {});
            setFormData(zeros);
            localStorage.removeItem('manualFactoryData');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg("Syncing data...");
        localStorage.setItem('manualFactoryData', JSON.stringify(formData));
        setTimeout(() => {
            setLoading(false);
            setMsg("Success! Redirecting...");
            setTimeout(() => navigate('/'), 1000);
        }, 1000);
    };

    const sections = [
        { id: 'production', label: lang === 'EN' ? 'Production' : 'उत्पादन', icon: <TrendingUp size={18} /> },
        { id: 'machine', label: lang === 'EN' ? 'Machine' : 'मशीन', icon: <Activity size={18} /> },
        { id: 'workforce', label: lang === 'EN' ? 'Workforce' : 'कार्यबल', icon: <Users size={18} /> },
        { id: 'textile', label: lang === 'EN' ? 'Textile' : 'वस्त्र', icon: <Briefcase size={18} /> },
        { id: 'finance', label: lang === 'EN' ? 'Finance' : 'वित्त', icon: <DollarSign size={18} /> },
        { id: 'sustainability', label: lang === 'EN' ? 'Sustainability' : 'स्थिरता', icon: <Zap size={18} /> },
        { id: 'supply', label: lang === 'EN' ? 'Supply Chain' : 'सप्लाई चेन', icon: <AlertCircle size={18} /> }
    ];

    return (
        <div className="dashboard-container" style={{ background: '#070b14', minHeight: '100vh', color: 'white' }}>
            <nav className="sidebar" style={{ borderRight: '1px solid rgba(255,255,255,0.05)', background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(40px)' }}>
                <div className="logo" style={{ padding: '2.5rem 1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '10px', display: 'flex' }}>
                        <Plus size={20} color="white" />
                    </div>
                    <span style={{ fontWeight: '900', letterSpacing: '2px', color: 'white', fontSize: '1.2rem' }}>DATA HUB</span>
                </div>
                <div className="nav-links" style={{ padding: '0 1rem' }}>
                    {sections.map(s => (
                        <button
                            key={s.id}
                            onClick={() => {
                                setActiveSection(s.id);
                                document.getElementById(s.id).scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }}
                            style={{
                                width: '100%',
                                marginBottom: '8px',
                                border: 'none',
                                textAlign: 'left',
                                background: activeSection === s.id ? 'var(--primary)' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 18px',
                                borderRadius: '12px',
                                color: activeSection === s.id ? 'white' : 'rgba(255,255,255,0.5)',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                boxShadow: activeSection === s.id ? '0 10px 15px -3px rgba(99, 102, 241, 0.3)' : 'none'
                            }}
                        >
                            <span style={{ display: 'flex', alignItems: 'center' }}>{s.icon}</span>
                            <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{s.label.toUpperCase()}</span>
                        </button>
                    ))}

                    <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem' }}>
                        <button onClick={() => navigate('/')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', borderRadius: '12px', border: '1px solid var(--primary)', background: 'transparent', color: 'var(--primary)', cursor: 'pointer', fontWeight: '700' }}>
                            <Save size={18} /> {lang === 'EN' ? 'EXIT & VIEW' : 'बाहर निकलें'}
                        </button>
                    </div>
                </div>
            </nav>

            <main className="main-content" style={{ padding: '3rem 4rem 6rem 4rem' }}>
                <header style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '2.8rem', fontWeight: '900', letterSpacing: '-1.5px', marginBottom: '8px' }}>
                            {lang === 'EN' ? 'Industrial Data Hub' : 'इंडस्ट्रियल डेटा हब'}
                        </h1>
                        <p style={{ opacity: 0.6, fontSize: '1.1rem' }}>{lang === 'EN' ? 'Precision Telemetry Input for Bhilwara Cluster AI' : 'भीलवाड़ा क्लस्टर AI के लिए सटीक टेलीमेट्री इनपुट'}</p>
                        
                        {/* Live Signal Preview */}
                        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '20px' }}>
                            <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '8px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ width: '8px', height: '8px', background: '#3b82f6', borderRadius: '50%', animation: 'pulse 1s infinite' }}></span>
                                <span style={{ fontSize: '0.7rem', fontWeight: '900', color: '#3b82f6', letterSpacing: '1px' }}>VIB: {liveSignal.vibration.toFixed(1)} Hz</span>
                            </div>
                            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '8px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></span>
                                <span style={{ fontSize: '0.7rem', fontWeight: '900', color: '#10b981', letterSpacing: '1px' }}>TEMP: {liveSignal.temp.toFixed(1)}°C</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '10px' }}>
                                <span style={{ fontSize: '0.65rem', fontWeight: '700', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Live Signal Sync Active</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')} className="mini-btn">
                            {lang}
                        </button>
                        <button onClick={handleReset} className="mini-btn danger">
                            <Trash2 size={16} /> RESET
                        </button>
                    </div>
                </header>

                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    {/* Add Bulk Import Section */}
                    <div style={{ marginBottom: '3rem' }}>
                        <ExcelUpload onUploadSuccess={() => {
                            setMsg("Excel data synchronized successfully.");
                            setTimeout(() => setMsg(null), 3000);
                        }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', alignItems: 'stretch' }}>
                        {/* Production Card */}
                        <div id="production" className="glass-card">
                            <div className="card-accent" style={{ background: 'var(--primary)' }} />
                            <h3 className="card-title"><TrendingUp size={20} color="var(--primary)" /> Production Metrics</h3>
                            <div className="input-grid">
                                <div className="input-field">
                                    <label>Actual Daily (Units)</label>
                                    <input type="number" name="actualOutput" value={formData.actualOutput} onChange={handleChange} />
                                </div>
                                <div className="input-field">
                                    <label>Target Daily (Units)</label>
                                    <input type="number" name="expectedOutput" value={formData.expectedOutput} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        {/* Machine Card */}
                        <div id="machine" className="glass-card">
                            <div className="card-accent" style={{ background: 'var(--accent)' }} />
                            <h3 className="card-title"><Activity size={20} color="var(--accent)" /> Machine Health</h3>
                            <div className="input-grid">
                                <div className="input-field" style={{ gridColumn: 'span 2' }}>
                                    <label>Cumulative Uptime (Hours)</label>
                                    <input type="number" name="uptime" value={formData.uptime} onChange={handleChange} />
                                </div>
                                <div className="input-field">
                                    <label>Vibration (Hz)</label>
                                    <input type="number" name="vibration" value={formData.vibration} onChange={handleChange} />
                                </div>
                                <div className="input-field">
                                    <label>Temp (°C)</label>
                                    <input type="number" name="temp" value={formData.temp} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        {/* Workforce Card */}
                        <div id="workforce" className="glass-card" style={{ gridColumn: 'span 2' }}>
                            <div className="card-accent" style={{ background: '#8b5cf6' }} />
                            <h3 className="card-title"><Users size={20} color="#8b5cf6" /> Workforce & Safety Strategy</h3>
                            <div className="input-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                                <div className="input-field">
                                    <label>Active Staff</label>
                                    <input type="number" name="activeWorkers" value={formData.activeWorkers} onChange={handleChange} />
                                </div>
                                <div className="input-field">
                                    <label>Training Hours</label>
                                    <input type="number" name="trainingHours" value={formData.trainingHours} onChange={handleChange} />
                                </div>
                                <div className="input-field">
                                    <label>Accident-Free</label>
                                    <input type="number" name="accidentFreeDays" value={formData.accidentFreeDays} onChange={handleChange} />
                                </div>
                                <div className="input-field">
                                    <label>PPE Comp (%)</label>
                                    <input type="number" name="ppeCompliance" value={formData.ppeCompliance} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        {/* Textile & Quality Card */}
                        <div id="textile" className="glass-card">
                            <div className="card-accent" style={{ background: '#06b6d4' }} />
                            <h3 className="card-title"><Briefcase size={20} color="#06b6d4" /> Textile & Quality IQ</h3>
                            <div className="input-grid">
                                <div className="input-field">
                                    <label>GSM Deviation</label>
                                    <input type="number" step="0.1" name="gsmDeviation" value={formData.gsmDeviation} onChange={handleChange} />
                                </div>
                                <div className="input-field">
                                    <label>Color Delta-E</label>
                                    <input type="number" step="0.1" name="colorVariance" value={formData.colorVariance} onChange={handleChange} />
                                </div>
                                <div className="input-field">
                                    <label>Measured Defects</label>
                                    <input type="number" name="defectsCount" value={formData.defectsCount} onChange={handleChange} />
                                </div>
                                <div className="input-field">
                                    <label>Shrinkage %</label>
                                    <input type="number" step="0.1" name="shrinkage" value={formData.shrinkage} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        {/* Finance Card */}
                        <div id="finance" className="glass-card">
                            <div className="card-accent" style={{ background: '#10b981' }} />
                            <h3 className="card-title"><DollarSign size={20} color="#10b981" /> Financial Intelligence</h3>
                            <div className="input-grid">
                                <div className="input-field" style={{ gridColumn: 'span 2' }}>
                                    <label>Op Cost Daily (₹)</label>
                                    <input type="number" name="operatingCost" value={formData.operatingCost} onChange={handleChange} />
                                </div>
                                <div className="input-field">
                                    <label>Rev Daily (₹)</label>
                                    <input type="number" name="revenue" value={formData.revenue} onChange={handleChange} />
                                </div>
                                <div className="input-field">
                                    <label>Yarn ₹/kg</label>
                                    <input type="number" name="yarnPrice" value={formData.yarnPrice} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        {/* Sustainability Card */}
                        <div id="sustainability" className="glass-card">
                            <div className="card-accent" style={{ background: '#f59e0b' }} />
                            <h3 className="card-title"><Zap size={20} color="#f59e0b" /> Sustainability Metrics</h3>
                            <div className="input-grid">
                                <div className="input-field">
                                    <label>Solar Contrib</label>
                                    <input type="number" name="solarContribution" value={formData.solarContribution} onChange={handleChange} />
                                </div>
                                <div className="input-field">
                                    <label>Grid Power</label>
                                    <input type="number" name="powerConsumedKwh" value={formData.powerConsumedKwh} onChange={handleChange} />
                                </div>
                                <div className="input-field">
                                    <label>Recycled Water</label>
                                    <input type="number" name="recycledWater" value={formData.recycledWater} onChange={handleChange} />
                                </div>
                                <div className="input-field">
                                    <label>Waste Resale</label>
                                    <input type="number" name="wasteResaleValue" value={formData.wasteResaleValue} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        {/* Supply Chain Card */}
                        <div id="supply" className="glass-card">
                            <div className="card-accent" style={{ background: '#f97316' }} />
                            <h3 className="card-title"><AlertCircle size={20} color="#f97316" /> Supply Chain IQ</h3>
                            <div className="input-grid">
                                <div className="input-field">
                                    <label>Subcontractor %</label>
                                    <input type="number" name="subcontractorProgress" value={formData.subcontractorProgress} onChange={handleChange} />
                                </div>
                                <div className="input-field">
                                    <label>Deadline (Days)</label>
                                    <input type="number" name="subcontractorDeadline" value={formData.subcontractorDeadline} onChange={handleChange} />
                                </div>
                                <div className="input-field" style={{ gridColumn: 'span 2' }}>
                                    <label>Active Export Orders</label>
                                    <input type="number" name="exportOrders" value={formData.exportOrders} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '6rem', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '4rem' }}>
                        <button type="submit" className="huge-primary-btn" disabled={loading} style={{ width: '400px' }}>
                            {loading ? 'PROCESSING...' : 'COMMIT DATA TO AI ENGINE'}
                        </button>
                        {msg && <p style={{ marginTop: '1.5rem', color: 'var(--accent)', fontWeight: '800', fontSize: '1.1rem' }}>{msg}</p>}
                    </div>
                </form>
            </main>

            <style>{`
                .sidebar-link.active {
                    background: var(--primary) !important;
                    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
                }
                .sidebar-link:hover:not(.active) {
                    background: rgba(255,255,255,0.05) !important;
                }
                .mini-btn {
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: white;
                    padding: 10px 20px;
                    border-radius: 10px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    cursor: pointer;
                    display: flex;
                    alignItems: center;
                    gap: 8px;
                    transition: 0.2s;
                }
                .mini-btn:hover {
                    background: rgba(255,255,255,0.1);
                    border-color: rgba(255,255,255,0.2);
                }
                .mini-btn.danger:hover {
                    background: rgba(239, 68, 68, 0.1);
                    border-color: #ef4444;
                    color: #ef4444;
                }
                .glass-card {
                    background: rgba(15, 23, 42, 0.6);
                    backdrop-filter: blur(16px);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 20px;
                    padding: 2rem;
                    position: relative;
                    overflow: hidden;
                    transition: 0.3s;
                }
                .glass-card:hover {
                    border-color: rgba(255,255,255,0.1);
                    transform: translateY(-5px);
                }
                .card-accent {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 4px;
                    height: 100%;
                }
                .card-title {
                    font-size: 1.1rem;
                    font-weight: 800;
                    margin-bottom: 2rem;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    letter-spacing: 0.5px;
                }
                .input-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1.5rem;
                }
                .input-field {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    min-width: 0;
                }
                .input-field label {
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    color: rgba(255,255,255,0.4);
                    font-weight: 800;
                    white-space: normal;
                    line-height: 1.4;
                }
                .input-field input {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.08);
                    color: white;
                    padding: 12px 16px;
                    border-radius: 10px;
                    font-size: 1rem;
                    font-weight: 600;
                    transition: all 0.2s;
                    width: 100%;
                }
                .input-field input:focus {
                    outline: none;
                    border-color: var(--primary);
                    background: rgba(99, 102, 241, 0.05);
                }
                .huge-primary-btn {
                    background: var(--primary);
                    color: white;
                    border: none;
                    padding: 1.5rem 4rem;
                    border-radius: 15px;
                    font-size: 1.1rem;
                    font-weight: 800;
                    cursor: pointer;
                    box-shadow: 0 15px 35px rgba(99, 102, 241, 0.4);
                    transition: 0.3s;
                }
                .huge-primary-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 20px 40px rgba(99, 102, 241, 0.5);
                }
                .huge-primary-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
};

export default DataEntry;
