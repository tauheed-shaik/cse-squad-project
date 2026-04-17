import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Film, Heart, MessageCircle, MapPin, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Timeline = () => {
    const { user } = useAuth();
    const [memories, setMemories] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMemories();
    }, []);

    const fetchMemories = async () => {
        try {
            const res = await api.get('/api/memories');
            const grouped = res.data.reduce((acc, memory) => {
                const year = memory.year;
                if (!acc[year]) acc[year] = [];
                acc[year].push(memory);
                return acc;
            }, {});
            setMemories(grouped);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMemory = async (id) => {
        if (!window.confirm("Bury this relic forever? (Delete memory)")) return;
        try {
            await api.delete(`/api/memories/${id}`);
            fetchMemories();
        } catch (err) {
            console.error(err);
            alert("Failed to delete the memory.");
        }
    };

    const years = ['2022', '2023', '2024', '2025', '2026'];

    return (
        <div className="relative min-h-screen pt-20 md:pt-24 pb-24 md:pb-20">
            <div className="max-w-6xl mx-auto px-4 md:px-6 relative w-full">
                <div className="text-center mb-16 md:mb-24 max-w-2xl mx-auto cartoon-paper p-6 md:p-8 shadow-cartoon rotate-[-1deg]">
                    <h1 className="text-4xl md:text-7xl font-display font-black text-ink mb-2 md:mb-4">
                        World Map
                    </h1>
                    <p className="text-ink font-bold text-xl">
                        Follow the dotted trail to see the relics we left behind on each expedition.
                    </p>
                </div>

                <div className="relative">
                    {/* Dotted Trail */}
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-2 border-r-4 md:border-r-8 border-dashed border-ink opacity-30 md:opacity-50 -translate-x-1/2"></div>

                    {years.map((year, yIdx) => (
                        <div key={year} className="mb-32 relative z-10">
                            {/* Year Marker */}
                            <motion.div 
                                initial={{ scale: 0.8, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ margin: "-100px" }}
                                className="sticky top-20 md:top-32 z-20 flex justify-start md:justify-center mb-10 md:mb-16 ml-8 md:ml-0"
                            >
                                <div className="bg-wood text-white border-4 border-ink px-6 md:px-10 py-3 md:py-4 shadow-[0_6px_0_0_#1e293b] flex items-center gap-2 md:gap-3 rounded-2xl rotate-2">
                                    <MapPin size={24} className="md:w-8 md:h-8 text-gold fill-ink" />
                                    <h2 className="text-2xl md:text-4xl font-display font-black">{year}</h2>
                                </div>
                            </motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-x-16 gap-y-12 md:gap-y-16 pl-8 md:pl-0">
                                {memories[year]?.map((memory, mIdx) => (
                                    <motion.div
                                        key={memory._id}
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        className={`cartoon-card p-3 md:p-4 group bg-white ${mIdx % 2 === 0 ? 'md:mt-0 rotate-1' : 'md:mt-24 -rotate-1'}`}
                                    >
                                        <div className="aspect-[4/3] rounded-xl overflow-hidden relative border-4 border-ink bg-sky">
                                            {memory.mediaType === 'image' ? (
                                                <img 
                                                    src={memory.mediaUrl} 
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                                    alt={memory.title} 
                                                    crossOrigin="anonymous"
                                                />
                                            ) : (
                                                <video 
                                                    src={memory.mediaUrl} 
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                                    autoPlay 
                                                    muted 
                                                    loop 
                                                    playsInline 
                                                    crossOrigin="anonymous"
                                                />
                                            )}
                                            
                                            <div className="absolute top-4 right-4 bg-white border-4 border-ink p-3 rounded-full shadow-cartoon-sm text-ink group-hover:scale-110 transition-transform">
                                                {memory.mediaType === 'image' ? <ImageIcon size={24} /> : <Film size={24} />}
                                            </div>

                                            {/* Delete Button for Owner */}
                                            {user?._id === memory.userId?._id && (
                                                <button 
                                                    onClick={() => handleDeleteMemory(memory._id)}
                                                    className="absolute top-4 left-4 bg-red-500 border-4 border-ink p-2 rounded-full shadow-cartoon-sm text-white hover:scale-110 active:scale-95 transition-all z-20"
                                                    title="Bury this relic"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            )}
                                        </div>
                                        
                                        <div className="pt-6 px-4">
                                            <div className="flex flex-wrap gap-1.5 mb-3 md:mb-4">
                                                {memory.tags?.map(tag => (
                                                    <span key={tag} className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-ink bg-paper px-2 md:px-3 py-1 border-2 border-ink rounded-full">#{tag}</span>
                                                ))}
                                            </div>
                                            <h3 className="text-2xl md:text-3xl font-display font-black text-ink mb-2 leading-tight">{memory.title}</h3>
                                            <p className="text-ink font-bold text-base md:text-lg mb-4 md:mb-6 leading-relaxed bg-slate-100 p-3 md:p-4 border-4 border-ink rounded-2xl">{memory.description}</p>
                                            
                                            <div className="flex items-center justify-between pt-4 pb-2">
                                                <div className="flex gap-6">
                                                    <button className="flex items-center gap-2 text-ink/70 hover:text-woodLight transition-colors font-display font-bold text-xl">
                                                        <Heart size={24} /> <span>{memory.likes.length}</span>
                                                    </button>
                                                    <button className="flex items-center gap-2 text-ink/70 hover:text-ink transition-colors font-display font-bold text-xl">
                                                        <MessageCircle size={24} /> <span>{memory.comments.length}</span>
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-2 bg-gold px-3 py-1 border-4 border-ink rounded-full shadow-[0_2px_0_0_#1e293b]">
                                                    <img src={memory.userId?.profilePic} className="w-6 h-6 rounded-full border border-ink object-cover" />
                                                    <span className="text-sm font-bold text-ink">{memory.userId?.name.split(' ')[0]}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                
                                {(!memories[year] || memories[year].length === 0) && (
                                    <div className="col-span-full py-16 flex flex-col items-center justify-center opacity-70">
                                        <div className="cartoon-paper p-6 text-center border-dashed">
                                            <h4 className="text-xl font-display font-bold text-ink">No uncharted paths discovered here yet.</h4>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Timeline;
