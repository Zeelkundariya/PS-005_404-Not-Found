import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'operator' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, isAuthenticated, user, loading } = useAuth();
    const navigate = useNavigate();

    // Access Helper: Map roles to entry points
    const getEntryPoint = (role) => ({
        owner: '/owner-dashboard',
        manager: '/manager-dashboard',
        operator: '/operator-dashboard'
    }[role] || '/dashboard');

    // Auto-Rescue: If already authenticated, bypass register
    useEffect(() => {
        if (!loading && isAuthenticated && user) {
            navigate(getEntryPoint(user.role));
        }
    }, [isAuthenticated, user, loading, navigate]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            const data = await register(formData.name, formData.email, formData.password, formData.role);
            navigate(getEntryPoint(data.user.role));
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed. Protocol mismatch.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#020617',
            padding: '20px',
            fontFamily: 'Inter, sans-serif'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '440px',
                background: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '24px',
                padding: '2.5rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        background: 'rgba(99, 102, 241, 0.1)',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        border: '1px solid rgba(99, 102, 241, 0.2)'
                    }}>
                        <Shield size={32} color="#6366f1" />
                    </div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'white', marginBottom: '0.5rem' }}>Deploy Node</h1>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Initialize your SmartFactory node</p>
                </div>

                {error && (
                    <div style={{
                        padding: '12px 16px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: '12px',
                        color: '#f87171',
                        fontSize: '0.85rem',
                        marginBottom: '1.5rem',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <User style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} size={18} />
                            <input
                                type="text"
                                name="name"
                                required
                                placeholder="Node Admin Name"
                                style={{
                                    width: '100%',
                                    padding: '14px 16px 14px 48px',
                                    background: 'rgba(2, 6, 23, 0.4)',
                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                    borderRadius: '14px',
                                    color: 'white',
                                    fontSize: '0.95rem',
                                    outline: 'none'
                                }}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Access Email</label>
                        <div style={{ position: 'relative' }}>
                            <Mail style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} size={18} />
                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="admin@node.ai"
                                style={{
                                    width: '100%',
                                    padding: '14px 16px 14px 48px',
                                    background: 'rgba(2, 6, 23, 0.4)',
                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                    borderRadius: '14px',
                                    color: 'white',
                                    fontSize: '0.95rem',
                                    outline: 'none'
                                }}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Access Crypt</label>
                        <div style={{ position: 'relative' }}>
                            <Lock style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} size={18} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                required
                                placeholder="••••••••"
                                style={{
                                    width: '100%',
                                    padding: '14px 16px 14px 48px',
                                    background: 'rgba(2, 6, 23, 0.4)',
                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                    borderRadius: '14px',
                                    color: 'white',
                                    fontSize: '0.95rem',
                                    outline: 'none'
                                }}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>System Access Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                background: 'rgba(2, 6, 23, 0.4)',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                borderRadius: '14px',
                                color: 'white',
                                fontSize: '0.95rem',
                                outline: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="owner">Strategic Owner</option>
                            <option value="manager">Plant Manager</option>
                            <option value="operator">Node Operator</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{
                            width: '100%',
                            padding: '16px',
                            background: '#6366f1',
                            color: 'white',
                            border: 'none',
                            borderRadius: '14px',
                            fontWeight: '900',
                            fontSize: '1rem',
                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                            marginTop: '1rem',
                            boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.4)',
                            opacity: isSubmitting ? 0.7 : 1,
                            transition: 'all 0.2s'
                        }}
                    >
                        {isSubmitting ? 'PROVISIONING...' : 'INITIALIZE NODE'}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: '#94a3b8' }}>
                    Already an Operator? <Link to="/login" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 'bold' }}>Authorize Session</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
