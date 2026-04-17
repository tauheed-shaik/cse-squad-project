import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Film, Edit3, Settings, Shield, X, Camera, Save, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { id } = useParams();
    const { user: currentUser, login } = useAuth(); // login to update local storage user info
    const [profile, setProfile] = useState(null);
    const [memories, setMemories] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Edit Profile State
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ name: '', bio: '' });
    const [newPic, setNewPic] = useState(null);
    const [picPreview, setPicPreview] = useState(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, [id]);

    useEffect(() => {
        if (isEditing) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isEditing]);

    const fetchProfile = async () => {
        if (!id || id === 'undefined') return;
        try {
            const res = await api.get(`/api/users/${id}`);
            if (!res.data.user) throw new Error("Hero not found");
            setProfile(res.data.user);
            setMemories(res.data.memories);
            setEditData({ name: res.data.user.name, bio: res.data.user.bio || '' });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMemory = async (memoryId) => {
        if (!window.confirm("Bury this relic forever?")) return;
        try {
            await api.delete(`/api/memories/${memoryId}`);
            fetchProfile(); // Refresh profile and inventory
        } catch (err) {
            console.error(err);
            alert("Failed to delete the memory.");
        }
    };

    const handlePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewPic(file);
            setPicPreview(URL.createObjectURL(file));
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!editData.name || editData.name.trim().length < 2) {
            alert('Hero name must be at least 2 characters long.');
            return;
        }
        
        if (newPic && !newPic.type.startsWith('image/')) {
            alert('Please upload a valid image file.');
            return;
        }
        
        setUpdating(true);
        const formData = new FormData();
        formData.append('name', editData.name.trim());
        formData.append('bio', editData.bio.trim());
        if (newPic) {
            formData.append('profilePic', newPic);
        }

        try {
            console.log('Sending update request...');
            const res = await api.put('/api/users/update', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log('Update successful:', res.data);
            
            // Update local state
            setProfile(res.data);
            
            // Update global auth state
            login(localStorage.getItem('token'), res.data); 
            
            setIsEditing(false);
            setNewPic(null);
            setPicPreview(null);
        } catch (err) {
            console.error('Profile update error:', err);
            const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to update stats.';
            alert(errorMessage);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center bg-sky">
            <div className="w-24 h-24 bg-gold rounded-full border-4 border-ink shadow-[0_6px_0_0_#1e293b] flex items-center justify-center animate-spin mb-4">
                <span className="text-4xl text-stroke">⭐</span>
            </div>
            <h2 className="font-display text-4xl text-ink font-black text-stroke">Identifying Hero...</h2>
        </div>
    );

    const isOwnProfile = currentUser?._id === id;

    return (
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-16 relative pt-20 md:pt-24 z-10 w-full overflow-x-hidden pb-24 md:pb-12">
            
            {/* Profile Header Block */}
            <div className="w-full cartoon-paper p-6 md:p-12 mb-10 md:mb-16 relative mt-10">
                {/* Decorative Pins */}
                <div className="absolute top-4 left-4 w-4 h-4 md:w-5 md:h-5 rounded-full bg-woodLight border-4 border-ink shadow-[0_2px_0_0_#1e293b]"></div>
                <div className="absolute top-4 right-4 w-4 h-4 md:w-5 md:h-5 rounded-full bg-woodLight border-4 border-ink shadow-[0_2px_0_0_#1e293b]"></div>

                <div className="absolute -top-8 md:-top-12 left-1/2 -translate-x-1/2 bg-gold px-6 md:px-8 py-2 md:py-3 rounded-[24px] border-4 border-ink shadow-cartoon rotate-[-2deg] whitespace-nowrap">
                    <h2 className="font-display font-black text-xl md:text-2xl text-ink">Hero Stats</h2>
                </div>
                
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-10 mt-6 md:mt-8 relative z-10">
                    <div className="relative">
                        <img 
                            src={profile?.profilePic} 
                            alt={profile?.name} 
                            className="w-32 h-32 md:w-48 md:h-48 rounded-[32px] object-cover border-4 border-ink shadow-cartoon bg-white rotate-2"
                        />
                        <div className="absolute -left-4 md:-left-6 bottom-4 bg-[#87CEEB] border-4 border-ink rounded-full p-1.5 md:p-2 shadow-cartoon-sm -rotate-12">
                            <Shield size={24} className="md:w-8 md:h-8 text-ink fill-white" />
                        </div>
                    </div>
                    
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                            <h1 className="text-4xl md:text-6xl font-display font-black text-ink">{profile?.name}</h1>
                            {isOwnProfile && (
                                <button 
                                    onClick={() => { console.log('Change Gear clicked! isOwnProfile:', isOwnProfile); setIsEditing(true); }}
                                    className="cartoon-btn !bg-white !text-ink !py-2 !px-4 !text-lg md:!text-xl !shadow-[0_4px_0_0_#1e293b] hover:!bg-gray-100 active:!translate-y-1"
                                >
                                    <Edit3 size={18} className="mr-2" /> Change Gear
                                </button>
                            )}
                        </div>
                        <p className="text-ink font-bold text-lg md:text-2xl mb-6 md:mb-8 leading-relaxed bg-white/60 inline-block p-3 md:p-4 rounded-xl border-4 border-ink shadow-cartoon-sm -rotate-1">
                            {profile?.bio || "A mysterious wanderer with no backstory."}
                        </p>
                        
                        <div className="flex justify-center md:justify-start gap-4 md:gap-6">
                            <div className="bg-white border-4 border-ink px-4 md:px-6 py-2 md:py-4 rounded-[24px] shadow-cartoon-sm rotate-1">
                                <p className="text-xs md:text-lg font-display font-black text-ink/60 uppercase tracking-widest mb-1">Quests</p>
                                <p className="text-2xl md:text-4xl font-black text-ink">{memories.length}</p>
                            </div>
                            <div className="bg-grass border-4 border-ink px-4 md:px-6 py-2 md:py-4 rounded-[24px] shadow-cartoon-sm -rotate-1">
                                <p className="text-xs md:text-lg font-display font-black text-ink/60 uppercase tracking-widest mb-1">Guild ID</p>
                                <p className="text-2xl md:text-4xl font-black text-ink">{profile?.rollNumber || '????'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* User's Dumps Grid */}
            <div className="relative z-10 w-full mb-20 bg-grass p-6 md:p-12 border-4 border-ink shadow-cartoon rounded-[32px] md:rounded-[40px]">
                <h3 className="text-2xl md:text-4xl font-display font-black text-ink mb-8 md:mb-10 text-stroke inline-block bg-white p-3 md:p-4 border-4 border-ink rounded-2xl rotate-2">Inventory Items</h3>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                    {memories.map((memory, idx) => (
                        <motion.div 
                            key={memory._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`cartoon-card p-2 bg-white ${idx % 3 === 0 ? '-rotate-2' : 'rotate-2'}`}
                        >
                            <div className="relative aspect-square rounded-[16px] overflow-hidden bg-sky border-4 border-ink group">
                                {memory.mediaType === 'image' ? (
                                    <img 
                                        src={memory.mediaUrl} 
                                        className="w-full h-full object-cover" 
                                        crossOrigin="anonymous" 
                                    />
                                ) : (
                                    <video 
                                        src={memory.mediaUrl} 
                                        className="w-full h-full object-cover" 
                                        autoPlay 
                                        muted 
                                        loop 
                                        playsInline 
                                        crossOrigin="anonymous" 
                                    />
                                )}
                                <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                                    <p className="text-xl font-display font-black text-white leading-tight text-shadow-sm truncate">{memory.title}</p>
                                    
                                    {isOwnProfile && (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleDeleteMemory(memory._id); }}
                                            className="absolute top-2 left-2 bg-red-500 border-2 border-ink p-2 rounded-full text-white shadow-cartoon-sm hover:scale-110 active:scale-90 transition-transform z-20"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                                <div className="absolute top-2 right-2 bg-gold border-2 border-ink p-2 rounded-full text-ink shadow-[0_2px_0_0_#1e293b]">
                                    {memory.mediaType === 'image' ? <ImageIcon size={20} /> : <Film size={20} />}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {memories.length === 0 && (
                    <div className="py-24 text-center cartoon-paper border-dashed bg-white/50 flex flex-col items-center rotate-[-1deg]">
                        <ImageIcon className="text-ink/30 mb-6" size={64} />
                        <h3 className="font-display font-black text-3xl text-ink/50">Inventory is empty.</h3>
                    </div>
                )}
            </div>

            {/* Edit Profile Modal (Inline instead of Portal for better Render compatibility) */}
            <AnimatePresence>
                {isEditing && (
                    <div className="fixed inset-0 z-[1000] flex items-start justify-center p-4 bg-ink/90 backdrop-blur-md overflow-y-auto">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, rotate: 5 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            exit={{ scale: 0.8, opacity: 0, rotate: -5 }}
                            className="bg-paper border-4 border-ink p-6 md:p-10 max-w-xl w-full rounded-3xl shadow-cartoon relative my-10 scrollbar-hide"
                        >
                            <button 
                                onClick={() => { console.log('Closing modal'); setIsEditing(false); }}
                                className="absolute -top-4 -right-4 w-12 h-12 bg-red-500 border-4 border-ink rounded-full flex items-center justify-center text-white shadow-cartoon transition-transform hover:scale-110 z-[110]"
                            >
                                <X size={28} strokeWidth={3} />
                            </button>

                            <h2 className="text-4xl font-display font-black text-ink mb-8">Update Gear</h2>

                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                {/* Pic Upload */}
                                <div className="flex justify-center mb-6">
                                    <label className="relative cursor-pointer group">
                                        <div className="w-32 h-32 rounded-3xl border-4 border-ink overflow-hidden bg-white shadow-cartoon-sm rotate-3 group-hover:rotate-0 transition-transform">
                                            <img 
                                                src={picPreview || profile?.profilePic} 
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-ink/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Camera size={32} className="text-white" />
                                            </div>
                                        </div>
                                        <input type="file" className="hidden" onChange={handlePicChange} accept="image/*" />
                                    </label>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-lg font-display font-bold text-ink">Hero Image Name</label>
                                    <input 
                                        type="text"
                                        value={editData.name}
                                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                                        className="cartoon-input"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-lg font-display font-bold text-ink">Adventure Bio</label>
                                    <textarea 
                                        value={editData.bio}
                                        onChange={(e) => setEditData({...editData, bio: e.target.value})}
                                        className="cartoon-input min-h-[100px] resize-none"
                                        placeholder="Tell us your tale..."
                                    />
                                </div>

                                <button 
                                    type="submit"
                                    disabled={updating}
                                    className="cartoon-btn w-full !text-2xl !py-4 shadow-cartoon mt-4"
                                >
                                    {updating ? 'Scribing Stats...' : 'Save Changes'} <Save size={24} className="ml-2" />
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Profile;
