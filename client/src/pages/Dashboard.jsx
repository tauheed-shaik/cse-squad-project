import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Heart, MessageCircle, Sparkles, Plus, AlertCircle, Tent, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState('');
    const [randomMemory, setRandomMemory] = useState(null);
    const [showSurprise, setShowSurprise] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await api.get('/api/posts');
            setPosts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        try {
            await api.post('/api/posts', { content });
            setContent('');
            fetchPosts();
        } catch (err) {
            console.error(err);
        }
    };

    const handleLikePost = async (id) => {
        try {
            await api.post(`/api/posts/${id}/like`);
            fetchPosts();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeletePost = async (id) => {
        if (!window.confirm("Banish this message from the Camp?")) return;
        try {
            await api.delete(`/api/posts/${id}`);
            fetchPosts();
        } catch (err) {
            console.error(err);
            alert("Failed to delete the message.");
        }
    };

    const handleSurprise = async () => {
        try {
            const res = await api.get('/api/memories');
            const memories = res.data;
            if (memories.length > 0) {
                const random = memories[Math.floor(Math.random() * memories.length)];
                setRandomMemory(random);
                setShowSurprise(true);
            } else {
                alert("The map is empty!");
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12 relative pt-20 md:pt-24 z-10 pb-24 md:pb-12">
            <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
                
                {/* Left Sidebar / Profile Brief */}
                <div className="lg:w-1/3 order-2 lg:order-1">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="cartoon-card p-6 md:p-8 lg:sticky lg:top-28 bg-[#87CEEB]"
                    >
                        {/* Clouds pattern in background */}
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'10\' fill=\'white\' opacity=\'0.2\'/%3E%3C/svg%3E')] rotate-180 opacity-50 z-0"></div>

                        <div className="flex flex-col items-center text-center relative z-10">
                            <div className="relative mb-6">
                                <img 
                                    src={user?.profilePic} 
                                    alt={user?.name} 
                                    className="w-32 h-32 object-cover rounded-[32px] border-4 border-ink shadow-cartoon bg-white"
                                />
                            </div>
                            
                            <h3 className="text-3xl font-display font-black text-ink mb-2 bg-white px-4 py-2 border-4 border-ink rounded-2xl rotate-[-2deg]">{user?.name}</h3>
                            <p className="font-bold text-ink mb-6 px-4 py-2 bg-paper rounded-2xl border-4 border-ink shadow-cartoon-sm rotate-1">{user?.bio || "Just exploring."}</p>
                            
                            <div className="w-full space-y-4">
                                <Link 
                                    to={`/profile/${user?._id}`}
                                    className="cartoon-btn w-full !text-xl !bg-paper"
                                >
                                    Hero Detail Context
                                </Link>
                                <button 
                                    onClick={handleSurprise}
                                    className="cartoon-btn w-full !text-xl"
                                >
                                    <Sparkles size={24} /> Magic Scroll
                                </button>
                                <Link 
                                    to="/upload"
                                    className="cartoon-btn cartoon-btn-wood w-full !text-xl"
                                >
                                    <Plus size={24} /> Log Quest
                                </Link>
                                {user?.rollNumber && (
                                    <div className="mt-4 pt-4 border-t-4 border-ink/10">
                                        <p className="font-display font-black text-ink/40 text-sm uppercase tracking-widest">Guild ID</p>
                                        <p className="font-bold text-ink">{user.rollNumber}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Main Feed */}
                <div className="lg:w-2/3 space-y-6 md:space-y-8 order-1 lg:order-2">
                    
                    {/* Create Post */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="cartoon-paper p-6 relative">
                        {/* Pins */}
                        <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-slate-400 border-2 border-ink"></div>
                        <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-slate-400 border-2 border-ink"></div>

                        <form onSubmit={handleCreatePost} className="pt-4">
                            <textarea 
                                placeholder="Write something on the bulletin board..." 
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full bg-white/50 border-4 border-ink rounded-2xl p-4 min-h-[140px] resize-none text-ink font-bold text-xl focus:outline-none focus:bg-white shadow-[inset_0_4px_0_0_rgba(0,0,0,0.05)] transition-colors"
                            />
                            <div className="flex justify-between items-center mt-4">
                                <span className="text-lg font-display text-ink font-bold">Base Camp</span>
                                <button type="submit" disabled={!content.trim()} className="cartoon-btn !py-2 !px-8 text-xl disabled:opacity-50 disabled:cursor-not-allowed">
                                    Pin It <Send size={20} />
                                </button>
                            </div>
                        </form>
                    </motion.div>

                    {/* Feed Header */}
                    <div className="flex items-center gap-3 px-4 py-3 bg-grass border-4 border-ink rounded-2xl w-max shadow-cartoon-sm rotate-1">
                        <Tent className="text-ink" size={28} />
                        <h3 className="text-2xl font-display font-black text-ink">The Campboard</h3>
                    </div>

                    {/* Posts Feed */}
                    <div className="space-y-6">
                        {posts.map((post, idx) => (
                            <motion.div 
                                key={post._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className={`cartoon-card p-4 md:p-8 bg-white hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? '-rotate-1' : 'rotate-1'}`}
                            >
                                <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                                    <img src={post.userId?.profilePic} className="w-12 h-12 md:w-14 md:h-14 rounded-2xl object-cover border-4 border-ink shadow-cartoon-sm" />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between group/header">
                                            <h4 className="font-display font-bold text-xl md:text-2xl text-ink tracking-wide">{post.userId?.name}</h4>
                                            {post.userId?._id === user?._id && (
                                                <button 
                                                    onClick={() => handleDeletePost(post._id)}
                                                    className="p-2 text-ink/30 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                    title="Delete Message"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-xs font-bold text-ink/60 mt-0.5">{new Date(post.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <p className="text-ink font-bold text-base md:text-[18px] mb-6 md:mb-8 leading-relaxed">{post.content}</p>
                                
                                <div className="flex items-center gap-4 md:gap-6 pt-4 md:pt-6 border-t-4 border-ink bg-slate-100 -mx-4 md:-mx-8 -mb-4 md:-mb-8 px-4 md:px-8 pb-4 md:pb-6 rounded-b-[20px]">
                                    <button 
                                        onClick={() => handleLikePost(post._id)}
                                        className={`flex items-center gap-2 font-display font-bold text-xl transition-all hover:scale-105 ${post.likes.includes(user?._id) ? 'text-woodLight' : 'text-ink/60 hover:text-ink'}`}
                                    >
                                        <Heart size={24} className={post.likes.includes(user?._id) ? 'fill-current animate-bob' : ''} /> 
                                        <span>{post.likes.length} Stars</span>
                                    </button>
                                    <button className="flex items-center gap-2 font-display font-bold text-xl text-ink/60 hover:text-ink transition-all hover:scale-105">
                                        <MessageCircle size={24} /> 
                                        <span>{post.comments.length} Replies</span>
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                        
                        {posts.length === 0 && (
                            <div className="cartoon-paper p-12 text-center border-dashed opacity-80 flex flex-col items-center">
                                <AlertCircle size={48} className="text-wood mb-4" />
                                <span className="font-display text-2xl font-bold text-ink">The camp is empty. Be the first to build a fire!</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Surprise Memory Modal */}
            <AnimatePresence>
                {showSurprise && randomMemory && (
                    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-6 bg-ink/90 backdrop-blur-md">
                        {/* Global Close Button (Top Right) */}
                        <button 
                            onClick={() => setShowSurprise(false)}
                            className="fixed top-8 right-8 z-[2100] w-12 h-12 bg-red-500 border-4 border-ink rounded-full flex items-center justify-center text-white shadow-cartoon hover:scale-110 active:scale-95 transition-transform"
                        >
                            <span className="text-2xl font-black">✕</span>
                        </button>

                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0, rotate: 5 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            exit={{ scale: 0.8, opacity: 0, rotate: -5 }}
                            className="bg-paper border-[6px] border-ink p-2 md:p-4 max-w-4xl w-full rounded-[32px] shadow-cartoon relative"
                        >
                            <div className="flex justify-between items-center px-4 py-3 mb-2 border-b-4 border-ink/10">
                                <span className="font-display font-bold text-ink text-xl md:text-2xl bg-gold px-6 py-1 border-4 border-ink rounded-full rotate-[-1deg]">
                                    Arc: {randomMemory.year}
                                </span>
                                <span className="text-ink font-display font-bold text-lg opacity-40">Magic Scroll</span>
                            </div>

                            <div className="aspect-video bg-sky border-4 border-ink rounded-2xl overflow-hidden relative shadow-inner">
                                {randomMemory.mediaType === 'image' ? (
                                    <img src={randomMemory.mediaUrl} className="w-full h-full object-cover" />
                                ) : (
                                    <video src={randomMemory.mediaUrl} controls autoPlay className="w-full h-full object-cover" />
                                )}
                            </div>

                            <div className="p-4 md:p-8">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {randomMemory.tags?.map(t => (
                                        <span key={t} className="bg-white border-2 border-ink text-ink font-bold text-xs px-4 py-1 rounded-full uppercase shadow-cartoon-sm">#{t}</span>
                                    ))}
                                </div>
                                <h2 className="text-3xl md:text-5xl font-display font-black text-ink mb-3">{randomMemory.title}</h2>
                                <p className="text-ink font-bold text-lg md:text-2xl leading-relaxed">{randomMemory.description}</p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
