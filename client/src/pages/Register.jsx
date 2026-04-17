import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Hash, Scroll } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        rollNumber: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/api/auth/register', formData);
            login(res.data.token, res.data.user);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to craft sign up.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center p-6 relative flex-col pt-24 z-10">
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="w-full max-w-xl cartoon-paper p-10 relative"
            >
                {/* Pins */}
                <div className="absolute top-4 left-4 w-4 h-4 rounded-full bg-red-500 border-2 border-ink shadow-[0_2px_0_0_#1e293b]"></div>
                <div className="absolute top-4 right-4 w-4 h-4 rounded-full bg-red-500 border-2 border-ink shadow-[0_2px_0_0_#1e293b]"></div>

                <div className="mb-10 text-center mt-4">
                    <div className="w-20 h-20 bg-grass border-4 border-ink rounded-[24px] flex items-center justify-center mx-auto mb-6 shadow-cartoon -rotate-3">
                        <Scroll size={40} className="text-ink" />
                    </div>
                    <h2 className="text-5xl font-display font-black text-ink mb-2">New Adventurer</h2>
                    <p className="text-xl font-bold text-ink/70">Sign the guild registry.</p>
                </div>

                {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 p-4 bg-red-200 border-4 border-ink text-ink font-bold rounded-2xl text-lg text-center shadow-cartoon-sm rotate-1">
                        Yikes: {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-lg font-display font-bold text-ink flex items-center gap-2">
                                <User size={20} /> True Name
                            </label>
                            <input 
                                type="text" 
                                placeholder="Hero's Name" 
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="cartoon-input"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-lg font-display font-bold text-ink flex items-center gap-2">
                                <Hash size={20} /> Guild ID
                            </label>
                            <input 
                                type="text" 
                                placeholder="22CSEA01" 
                                value={formData.rollNumber}
                                onChange={(e) => setFormData({...formData, rollNumber: e.target.value})}
                                className="cartoon-input"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-lg font-display font-bold text-ink flex items-center gap-2">
                            <Mail size={20} /> Carrier Pigeon
                        </label>
                        <input 
                            type="email" 
                            placeholder="you@college.edu" 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="cartoon-input"
                            required
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-lg font-display font-bold text-ink flex items-center gap-2">
                            <Lock size={20} /> Secret Word
                        </label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            className="cartoon-input"
                            required
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className="cartoon-btn cartoon-btn-wood w-full !text-2xl mt-8 !py-4"
                    >
                        {loading ? 'Scribing...' : 'Join Party'}
                    </button>
                    
                    <div className="text-center text-lg font-bold text-ink/80 pt-6">
                        Already have a path? <br/>
                        <Link to="/login" className="text-skyDark hover:text-ink transition-colors font-black underline decoration-4 underline-offset-4 mt-2 inline-block">Use your key</Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Register;
