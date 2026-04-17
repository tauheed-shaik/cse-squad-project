import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, Filter, Search, Tv } from 'lucide-react';

const Videos = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [yearFilter, setYearFilter] = useState('All');
    const [tagSearch, setTagSearch] = useState('');

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            const res = await api.get('/api/memories');
            const onlyVideos = res.data.filter(val => val.mediaType === 'video');
            setVideos(onlyVideos);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredVideos = videos.filter(v => {
        if (yearFilter !== 'All' && v.year.toString() !== yearFilter) return false;
        if (tagSearch) {
            const searchStr = tagSearch.toLowerCase().replace('#', '');
            const hasTag = v.tags && v.tags.some(tag => tag.toLowerCase().includes(searchStr));
            if (!hasTag) return false;
        }
        return true;
    });

    const years = ['All', '2022', '2023', '2024', '2025', '2026'];

    return (
        <div className="relative min-h-screen pt-20 md:pt-24 pb-24 md:pb-20 z-10 w-full overflow-hidden">
            {/* Global Parallax Clouds */}
            <div className="fixed top-32 left-0 w-full h-full opacity-30 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30,70 A20,20 0 0,1 70,70 A20,20 0 0,1 30,70 Z\' fill=\'white\'/%3E%3C/svg%3E')] opacity-30 invert"></div>
            </div>

            <div className="max-w-6xl mx-auto px-4 md:px-6 relative w-full z-10">
                
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 md:mb-12">
                    <div className="cartoon-paper p-4 md:p-6 shadow-cartoon md:rotate-[-1deg] w-full md:w-auto">
                        <div className="flex items-center gap-3 md:gap-4 mb-2">
                            <div className="bg-wood p-2.5 md:p-3 rounded-2xl border-4 border-ink shadow-[0_4px_0_0_#1e293b]">
                                <Tv className="text-white w-6 h-6 md:w-8 md:h-8" />
                            </div>
                            <h1 className="text-3xl md:text-5xl font-display font-black text-ink">Camp Cinema</h1>
                        </div>
                        <p className="text-ink font-bold text-lg md:text-xl">All recordings captured on the journey.</p>
                    </div>

                    {/* Filters Block */}
                    <div className="bg-white p-4 md:p-6 border-4 border-ink rounded-3xl shadow-cartoon flex flex-col sm:flex-row items-center gap-4 md:rotate-1 w-full md:w-auto">
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Filter size={20} className="text-ink" />
                            <select 
                                value={yearFilter}
                                onChange={(e) => setYearFilter(e.target.value)}
                                className="cartoon-input !py-2 !px-4 w-full sm:!w-32 cursor-pointer shadow-none"
                            >
                                {years.map(y => <option key={y} value={y}>{y === 'All' ? 'All Arcs' : y}</option>)}
                            </select>
                        </div>
                        <div className="flex items-center gap-2 relative w-full sm:w-auto">
                            <Search size={20} className="absolute left-3 text-ink/50" />
                            <input 
                                type="text"
                                placeholder="Search #tag..."
                                value={tagSearch}
                                onChange={(e) => setTagSearch(e.target.value)}
                                className="cartoon-input !py-2 !pl-10 shadow-none w-full sm:!w-40"
                            />
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center font-display text-3xl text-ink font-black animate-pulse">Setting up the projector...</div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            <AnimatePresence>
                                {filteredVideos.map((video, idx) => (
                                    <motion.div
                                        key={video._id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                        className={`cartoon-card p-4 bg-white ${idx % 2 === 0 ? '-rotate-1' : 'rotate-1'}`}
                                    >
                                        {/* TV Screen styling */}
                                        <div className="w-full aspect-video border-4 border-ink bg-ink rounded-2xl overflow-hidden relative shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] p-2">
                                            <div className="w-full h-full bg-slate-900 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(135,206,235,0.2)]">
                                                <video 
                                                    src={video.mediaUrl} 
                                                    controls 
                                                    controlsList="nodownload"
                                                    className="w-full h-full object-contain bg-slate-950" 
                                                    crossOrigin="anonymous"
                                                    playsInline
                                                    onPlay={() => window.dispatchEvent(new Event('pauseBackgroundMusic'))}
                                                    onPause={() => window.dispatchEvent(new Event('resumeBackgroundMusic'))}
                                                    onEnded={() => window.dispatchEvent(new Event('resumeBackgroundMusic'))}
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="pt-4 md:pt-6 px-1 md:px-2">
                                            <div className="flex flex-wrap items-center gap-2 mb-3 md:mb-4">
                                                <span className="bg-gold border-2 border-ink text-ink font-bold text-xs md:text-sm px-2 md:px-3 py-1 rounded-full shadow-[0_2px_0_0_#1e293b]">Arc: {video.year}</span>
                                                {video.tags?.map(tag => (
                                                    <span key={tag} className="bg-slate-100 border-2 border-ink text-ink font-bold text-[10px] md:text-xs uppercase px-2 md:px-3 py-1 rounded-full">#{tag}</span>
                                                ))}
                                            </div>
                                            
                                            <h3 className="text-2xl md:text-3xl font-display font-black text-ink mb-1 md:mb-2 leading-tight">{video.title}</h3>
                                            <p className="text-ink/80 font-bold text-base md:text-lg leading-relaxed mb-4">{video.description}</p>
                                            
                                            <div className="flex items-center gap-3 pt-4 border-t-4 border-slate-200">
                                                <img src={video.userId?.profilePic} className="w-10 h-10 rounded-full border-2 border-ink object-cover shadow-[0_2px_0_0_#1e293b]" />
                                                <div>
                                                    <span className="block text-base font-bold text-ink leading-none">{video.userId?.name}</span>
                                                    <span className="block text-xs font-bold text-ink/50 mt-1">{new Date(video.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                        
                        {filteredVideos.length === 0 && (
                            <div className="col-span-full py-20 mt-10 bg-white/50 border-4 border-dashed border-ink rounded-[40px] flex flex-col items-center justify-center opacity-80 backdrop-blur-sm shadow-cartoon">
                                <Film size={64} className="text-ink/30 mb-6 animate-pulse" />
                                <h3 className="text-3xl font-display font-black text-ink">No tapes found!</h3>
                                <p className="text-ink font-bold text-xl mt-2">Try adjusting your filters or upload a new tape in the Journal.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Videos;
