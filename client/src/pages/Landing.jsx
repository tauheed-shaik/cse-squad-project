import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Lock, Map, ArrowRight, Star, TreePine, MapPin, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import groupPhoto from '../assets/WhatsApp Image 2026-04-04 at 10.08.12 PM.jpeg';

const Landing = () => {
    const { token } = useAuth();
    const [showPhoto, setShowPhoto] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowPhoto(true), 1000);
        return () => clearTimeout(timer);
    }, []);
    
    const memories = [
        { id: 1, type: 'image', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80', title: 'The Great Lab Trial' },
        { id: 2, type: 'image', url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80', title: 'Midnight Brain Fog' },
        { id: 3, type: 'image', url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80', title: 'Victory Lap' },
        { id: 4, type: 'image', url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&q=80', title: 'Final Boss Arena' },
    ];

    return (
        <div className="flex flex-col items-center overflow-x-hidden relative w-full pt-10">
            {/* Hanging Class Photo Frame */}
            <AnimatePresence>
                {showPhoto && (
                    <motion.div 
                        initial={{ y: -600, x: 0, rotate: -10 }}
                        animate={{ y: 0, x: 0, rotate: [-5, -3, -5] }}
                        exit={{ y: -600, opacity: 0 }}
                        transition={{ 
                            y: { type: 'spring', damping: 15, stiffness: 100 },
                            rotate: { repeat: Infinity, duration: 4, ease: "easeInOut" }
                        }}
                        className="fixed top-[100px] md:top-[140px] left-[5%] md:left-10 z-[60] w-[90%] md:w-[550px] pointer-events-none"
                    >
                        {/* Hanging Ropes */}
                        <div className="absolute -top-16 left-[15%] md:left-[20%] w-1 md:w-1.5 h-20 bg-[#8B5A2B] border-x-2 border-ink/20 -z-10"></div>
                        <div className="absolute -top-16 right-[15%] md:right-[20%] w-1 md:w-1.5 h-20 bg-[#8B5A2B] border-x-2 border-ink/20 -z-10"></div>
                        
                        <div className="cartoon-card p-2 md:p-3 bg-white relative pointer-events-auto border-[4px] md:border-[6px] shadow-cartoon">
                            {/* Close Button */}
                            <button 
                                onClick={() => setShowPhoto(false)}
                                className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 border-4 border-ink rounded-full flex items-center justify-center text-white shadow-cartoon-sm hover:scale-110 active:scale-90 transition-transform z-20"
                            >
                                <X size={18} strokeWidth={3} />
                            </button>

                            <div className="border-4 border-ink rounded-xl overflow-hidden shadow-inner relative">
                                <img 
                                    src={groupPhoto} 
                                    alt="CSE Class Photo" 
                                    className="w-full h-auto object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-ink/80 backdrop-blur-sm p-2 text-white text-center border-t-2 border-ink">
                                    <p className="font-display font-bold text-sm md:text-base leading-tight">Class of 2026<br/>CSE A 🎓</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* The Sun */}
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                className="absolute top-10 right-20 w-48 h-48 bg-gold border-8 border-ink rounded-full -z-10 shadow-cartoon"
            >
                {/* Sun Rays */}
                <div className="absolute top-[-20px] left-1/2 w-4 h-10 bg-gold border-4 border-ink -translate-x-1/2 rounded-full"></div>
                <div className="absolute bottom-[-20px] left-1/2 w-4 h-10 bg-gold border-4 border-ink -translate-x-1/2 rounded-full"></div>
                <div className="absolute left-[-20px] top-1/2 w-10 h-4 bg-gold border-4 border-ink -translate-y-1/2 rounded-full"></div>
                <div className="absolute right-[-20px] top-1/2 w-10 h-4 bg-gold border-4 border-ink -translate-y-1/2 rounded-full"></div>
            </motion.div>

            {/* Hero Section */}
            <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 relative w-full pt-48 pb-32 z-30">
                <motion.div
                    initial={{ scale: 0.8, y: 50, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="max-w-4xl z-10 relative flex flex-col items-center"
                >
                    <div className="inline-flex items-center gap-2 px-4 md:px-6 py-1.5 md:py-2 rounded-2xl border-4 border-ink bg-white font-bold text-ink mb-6 md:mb-10 shadow-cartoon-sm rotate-[-2deg]">
                        <Star size={18} className="md:w-5 md:h-5" fill="#fbbf24" stroke="#1e293b" strokeWidth={2} /> 
                        <span className="font-display text-sm md:text-base">Welcome Adventurer!</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-[120px] font-display font-black leading-none text-white text-stroke mb-8 relative">
                        CSE-A <br/>
                        <span className="relative inline-block mt-2">
                            <span className="relative z-10 text-gold text-stroke border-b-4 md:border-b-8 border-ink pb-2 border-dashed">JOURNEY</span>
                        </span>
                    </h1>
                    
                    <p className="text-lg md:text-2xl font-bold text-ink mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed bg-white/60 backdrop-blur-sm p-4 rounded-3xl border-4 border-ink shadow-cartoon-sm">
                        A magical map recording 4 years of epic quests, boss fights (exams), and legendary loot (memories).
                    </p>
                    
                    {!token && (
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 w-full sm:w-auto px-4">
                            <Link 
                                to="/register" 
                                className="cartoon-btn text-xl md:text-2xl !px-8 md:!px-12 !py-4 md:!py-6 w-full sm:w-auto shadow-cartoon"
                            >
                                Start Quest <Map size={24} className="md:w-7 md:h-7 ml-2" />
                            </Link>

                            <Link 
                                to="/login" 
                                className="cartoon-btn !bg-white text-xl md:text-2xl !px-8 md:!px-12 !py-4 md:!py-6 w-full sm:w-auto shadow-cartoon"
                            >
                                Open Map (Login)
                            </Link>
                        </div>
                    )}
                    
                    {token && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-12 bg-wood text-white px-8 py-4 border-4 border-ink rounded-2xl shadow-cartoon">
                            <Link to="/dashboard" className="flex items-center gap-3 font-display text-2xl group">
                                <MapPin size={28} className="group-hover:animate-bounce fill-gold stroke-ink" />
                                Go to the Encampment
                            </Link>
                        </motion.div>
                    )}
                </motion.div>
            </section>

            {/* Green Hills Transition */}
            <div className="w-full h-32 bg-grass rounded-t-[100%] border-t-8 border-ink mt-[-50px] relative z-20 shadow-[inset_0_20px_0_0_#86efac]"></div>

            {/* Content Section on Hills */}
            <section className="pb-32 pt-20 px-6 w-full bg-grass border-b-8 border-ink relative z-10 m-0">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-16 gap-4">
                    <div className="bg-paper p-6 border-4 border-ink shadow-cartoon rounded-3xl rotate-1">
                        <h2 className="text-5xl font-display font-black text-ink mb-2">Treasure Chests</h2>
                        <p className="text-ink font-bold text-xl">{token ? "Click any chest to continue to the World Map." : "Sneak peek at the epic loot. Requires key (Login) to fully view."}</p>
                    </div>
                    <TreePine size={100} className="text-grassDark" />
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {memories.map((mem, i) => (
                        <motion.div
                            key={mem.id}
                            initial={{ y: 50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                            className={`cartoon-card p-4 aspect-[3/4] cursor-pointer bg-white group ${i % 2 === 0 ? '-rotate-2' : 'rotate-2'}`}
                        >
                            <div className="w-full h-full rounded-xl overflow-hidden relative border-4 border-ink bg-sky">
                                <img 
                                    src={mem.url} 
                                    alt={mem.title} 
                                    className="w-full h-full object-cover blur-md scale-110 opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-300"
                                />
                                <div className="absolute inset-0 bg-ink/30 flex flex-col items-center justify-center p-6 text-center">
                                    <div className={`w-16 h-16 rounded-[20px] ${token ? 'bg-grass' : 'bg-gold'} border-4 border-ink flex items-center justify-center mb-6 shadow-cartoon group-hover:scale-110 transition-transform`}>
                                        {token ? <MapPin className="text-ink" size={32} /> : <Lock className="text-ink" size={32} />}
                                    </div>
                                    <h3 className="font-display font-bold text-2xl text-white text-stroke leading-tight">{mem.title}</h3>
                                </div>
                            </div>
                            <Link to={token ? "/timeline" : "/login"} className="absolute inset-0 z-10" />
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Dirt Path Footer */}
            <footer className="py-16 bg-[#8B5A2B] border-t-8 border-[#5C3A21] w-full text-center relative z-10 shadow-[inset_0_20px_0_0_#A0522D]">
                <div className="bg-paper inline-block px-10 py-4 border-4 border-ink shadow-cartoon rounded-2xl -rotate-1">
                    <p className="text-ink font-display font-black text-2xl">Quest Log • Created for CSE A</p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
