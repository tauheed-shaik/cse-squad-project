import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Key } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/api/auth/login', { email, password });
            login(res.data.token, res.data.user);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid map coordinates.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center p-6 relative flex-col z-10 pt-20">
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="w-full max-w-md cartoon-paper p-10 relative"
            >
                {/* Pins */}
                <div className="absolute top-4 left-4 w-4 h-4 rounded-full bg-red-500 border-2 border-ink shadow-[0_2px_0_0_#1e293b]"></div>
                <div className="absolute top-4 right-4 w-4 h-4 rounded-full bg-red-500 border-2 border-ink shadow-[0_2px_0_0_#1e293b]"></div>

                <div className="mb-10 text-center mt-4">
                    <div className="w-20 h-20 bg-gold border-4 border-ink rounded-[24px] flex items-center justify-center mx-auto mb-6 shadow-cartoon rotate-3">
                        <Key size={40} className="text-ink" />
                    </div>
                    <h2 className="text-5xl font-display font-black text-ink mb-2">Gate Key</h2>
                    <p className="text-xl font-bold text-ink/70">Unlock the camp bounds.</p>
                </div>

                {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 p-4 bg-red-200 border-4 border-ink text-ink font-bold rounded-2xl text-lg text-center shadow-cartoon-sm -rotate-1">
                        Uh oh! {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-lg font-display font-bold text-ink flex items-center gap-2">
                            <Mail size={20} /> Courier Address
                        </label>
                        <input 
                            type="email" 
                            placeholder="you@college.edu" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="cartoon-input"
                            autoComplete="email"
                            required
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-lg font-display font-bold text-ink flex items-center gap-2">
                            <Lock size={20} /> Secret Code
                        </label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="cartoon-input"
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className="cartoon-btn w-full !text-2xl mt-4 !py-4"
                    >
                        {loading ? 'Unlocking...' : 'Open Gate'} 
                    </button>
                    
                    <div className="text-center text-lg font-bold text-ink/80 pt-6">
                        New around here? <br/>
                        <Link to="/register" className="text-woodLight hover:text-wood transition-colors font-black underline decoration-4 underline-offset-4 mt-2 inline-block">Join the Party</Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
