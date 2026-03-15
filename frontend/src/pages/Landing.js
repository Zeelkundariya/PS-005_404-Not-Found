import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    ArrowRight, Factory, Zap, ShieldCheck,
    MessageCircle, Globe, Layers,
    Sparkles, Award, CheckCircle2,
    TrendingUp, Clock
} from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [livePulse, setLivePulse] = useState({ oee: 78.5, active: 18 });

    const handleEnterDashboard = () => {
        navigate('/login');
    };

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                // We'll use a fetch directly here to avoid potential circular/missing api import issues if it's not exported
                // but usually api.js is standard. Let's try fetching from the origin
                const res = await fetch('http://localhost:3001/api/iot/live');
                const data = await res.json();
                setLivePulse({
                    oee: data.kpis.oeeScore,
                    active: data.machines.filter(m => m.status === 'Running').length
                });
            } catch (err) { /* silent on landing */ }
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const features = [
        {
            icon: <Clock size={24} />,
            title: "'EM4' Scheduler",
            desc: "Dynamic production scheduling optimizer using RL to plan jobs across machines and staff."
        },
        {
            icon: <MessageCircle size={24} />,
            title: "Maha-Connect WhatsApp",
            desc: "Native WhatsApp integration for real-time inventory alerts and autonomous reordering."
        },
        {
            icon: <Zap size={24} />,
            title: "'Bijli' Surcharge Predictor",
            desc: "Peak-load voltage surge forecasting specifically tuned for Bhilwara's power grid."
        },
        {
            icon: <Layers size={24} />,
            title: "'Vastra' Design IP",
            desc: "Steganographic protection for textile patterns using generative AI to safeguard heritage."
        },
        {
            icon: <Globe size={24} />,
            title: "'Vamsh' Traceability",
            desc: "Blockchain-backed farm-to-fabric audit trail for premium export compliance."
        },
        {
            icon: <TrendingUp size={24} />,
            title: "'Mandi' Pulse AI",
            desc: "Rumor sentiment swarm analysis for global yarn price arbitrage and profit protection."
        }
    ];

    return (
        <div className="landing-root" style={{ background: '#05070a', color: 'white', fontFamily: 'Inter, sans-serif' }}>
            {/* Navbar */}
            <nav style={{
                position: 'fixed',
                top: 0,
                width: '100%',
                padding: scrolled ? '1rem 5%' : '2rem 5%',
                background: scrolled ? 'rgba(5, 7, 10, 0.8)' : 'transparent',
                backdropFilter: scrolled ? 'blur(20px)' : 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 1000,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <div style={{
                        background: 'linear-gradient(45deg, #6366f1, #a855f7)',
                        padding: '8px',
                        borderRadius: '12px',
                        boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)'
                    }}>
                        <Factory size={24} color="white" />
                    </div>
                    <span style={{ fontWeight: '900', fontSize: '1.4rem', letterSpacing: '-0.5px' }}>SmartFactory AI</span>
                </div>

                <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                    <button
                        onClick={handleEnterDashboard}
                        style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: 'white',
                            padding: '10px 24px',
                            borderRadius: '12px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: '0.3s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    >
                        Launch Command Center
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '0 5%',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '20%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '600px',
                    height: '600px',
                    background: 'rgba(99, 102, 241, 0.15)',
                    filter: 'blur(150px)',
                    borderRadius: '50%',
                    zIndex: 0
                }}></div>

                <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px' }}>
                    <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(16, 185, 129, 0.1)', padding: '6px 16px', borderRadius: '100px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                            <div style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%', animate: 'pulse 1s infinite' }}></div>
                            <span style={{ fontSize: '0.7rem', fontWeight: '900', color: '#10b981', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                LIVE OEE: {livePulse.oee.toFixed(1)}%
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(99, 102, 241, 0.1)', padding: '6px 16px', borderRadius: '100px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: '900', color: '#818cf8', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                RELIABILITY: {(livePulse.oee + 5).toFixed(1)}%
                            </span>
                        </div>
                    </div>

                    <span style={{
                        display: 'inline-block',
                        padding: '6px 16px',
                        background: 'rgba(99, 102, 241, 0.1)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        borderRadius: '100px',
                        color: '#818cf8',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        marginBottom: '1rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        <Sparkles size={14} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                        The Future of Textile Manufacturing
                    </span>

                    <h1 style={{
                        fontSize: 'max(4rem, 6vw)',
                        fontWeight: '900',
                        lineHeight: 1.1,
                        letterSpacing: '-2px',
                        marginBottom: '1.5rem',
                        background: 'linear-gradient(to bottom right, #fff 30%, rgba(255,255,255,0.5))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Powering the Bhilwara <br />
                        <span style={{ color: '#6366f1' }}>Nirvana Tier</span> Factory
                    </h1>

                    <p style={{
                        fontSize: '1.25rem',
                        color: 'rgba(255,255,255,0.6)',
                        lineHeight: 1.6,
                        maxWidth: '700px',
                        margin: '0 auto 3rem auto'
                    }}>
                        The world's first specialized MSME production orchestrator. 52 autonomous AI agents designed to transform traditional textile units into world-class smart factories.
                    </p>

                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                        <button
                            onClick={handleEnterDashboard}
                            style={{
                                background: '#6366f1',
                                border: 'none',
                                color: 'white',
                                padding: '16px 40px',
                                borderRadius: '14px',
                                fontWeight: '800',
                                fontSize: '1.1rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)',
                                transition: '0.3s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            Enter Dashboard <ArrowRight size={20} />
                        </button>
                        <button
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'white',
                                padding: '16px 40px',
                                borderRadius: '14px',
                                fontWeight: '800',
                                fontSize: '1.1rem',
                                cursor: 'pointer',
                                transition: '0.3s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                        >
                            Watch Video
                        </button>
                    </div>
                </div>

                {/* Floating Badges */}
                <div style={{ display: 'flex', gap: '40px', marginTop: '6rem', opacity: 0.4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} /> 52 AI Agents Deployed</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><ShieldCheck size={18} /> Bhilwara SME Optimized</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Award size={18} /> Digital Maturity: Nirvana</div>
                </div>
            </section>

            {/* Features Grid */}
            <section style={{ padding: '10rem 10%', background: '#080a0f' }}>
                <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <h2 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}>The Power of 52</h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: '600px', margin: '0 auto' }}>A comprehensive suite of autonomous agents working in harmony to solve local manufacturing challenges.</p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '30px'
                }}>
                    {features.map((f, i) => (
                        <div key={i} className="feature-card" style={{
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            padding: '2.5rem',
                            borderRadius: '24px',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            cursor: 'default'
                        }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.05)';
                                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)';
                                e.currentTarget.style.transform = 'translateY(-10px)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            <div style={{
                                background: 'rgba(99, 102, 241, 0.1)',
                                width: '50px',
                                height: '50px',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#6366f1',
                                marginBottom: '1.5rem'
                            }}>{f.icon}</div>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '1rem' }}>{f.title}</h3>
                            <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, fontSize: '0.95rem' }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section style={{ padding: '10rem 10%', textAlign: 'center' }}>
                <div style={{
                    background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.1) 0%, transparent 100%)',
                    padding: '5rem',
                    borderRadius: '40px',
                    border: '1px solid rgba(99, 102, 241, 0.2)'
                }}>
                    <h2 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '1.5rem' }}>Ready to reach Nirvana?</h2>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.2rem', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>Join the textile revolution and optimize your factory in minutes. No complex hardware required.</p>
                    <button
                        onClick={handleEnterDashboard}
                        style={{
                            background: 'white',
                            border: 'none',
                            color: 'black',
                            padding: '18px 48px',
                            borderRadius: '16px',
                            fontWeight: '900',
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                            transition: '0.3s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        Launch Command Center Now
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ padding: '5rem 10%', borderTop: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Factory size={18} />
                    <span style={{ fontWeight: '800', color: 'rgba(255,255,255,0.8)' }}>SmartFactory AI</span>
                </div>
                <div>© 2026 SmartFactory AI. Built for the Bhilwara Textile Hackathon.</div>
            </footer>
        </div>
    );
};

// Add helper icon for landing
const Infinity = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z" />
    </svg>
);

export default Landing;
