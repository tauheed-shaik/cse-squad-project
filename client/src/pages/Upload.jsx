import React, { useState } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Upload as UploadIcon, X, Tag, Calendar, Type, CheckCircle, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Upload = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [year, setYear] = useState('2022');
    const [tags, setTags] = useState('');
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;

        // Check file size (e.g. warn if > 10MB)
        if (file.size > 10 * 1024 * 1024) {
            if (!window.confirm("This file is quite large (>10MB). It might take a while to scribe onto the map, or it might fail if your connection is slow. Continue?")) {
                return;
            }
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('media', file);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('year', year);
        formData.append('tags', tags);

        try {
            await api.post('/api/memories', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setSuccess(true);
            setTimeout(() => navigate('/timeline'), 1500);
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.error || err.message || 'The scroll failed to save.';
            alert(`Failed to save to Map: ${errorMsg}`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-16 min-h-screen flex items-center justify-center relative z-10 pt-20 md:pt-28 pb-24 md:pb-12">
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="w-full cartoon-card p-6 md:p-12 relative overflow-hidden bg-[#87CEEB] md:rotate-1"
            >
                {/* Clouds pattern in background */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'10\' fill=\'white\' opacity=\'0.2\'/%3E%3C/svg%3E')] opacity-50 z-0"></div>

                {success ? (
                    <div className="text-center py-12 md:py-20 relative z-10 bg-white border-4 border-ink rounded-3xl m-2 md:m-8 shadow-cartoon">
                        <div className="w-16 h-16 md:w-24 md:h-24 bg-grass rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 border-4 border-ink shadow-[0_4px_0_0_#1e293b]">
                            <CheckCircle className="text-ink" size={32} />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-display font-black text-ink mb-2">Saved to the Map!</h2>
                        <p className="text-lg md:text-xl font-bold text-ink/70">Your memory is now part of the lore.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="relative z-10">
                        <div className="mb-6 md:mb-8 bg-paper p-4 md:p-6 border-4 border-ink rounded-3xl shadow-cartoon md:rotate-[-1deg] w-max max-w-full">
                            <h2 className="text-2xl md:text-4xl font-display font-black text-ink mb-1">Log Discovery</h2>
                            <p className="text-base md:text-lg font-bold text-ink">Upload a photo to the map.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
                            {/* File Upload Area */}
                            <div className="md:col-span-2">
                                <label className="block w-full aspect-[4/5] relative cursor-pointer overflow-hidden rounded-[32px] bg-white border-4 border-dashed border-ink hover:bg-gold/20 transition-colors group shadow-cartoon-sm">
                                    {preview ? (
                                        <div className="w-full h-full relative p-2 bg-white">
                                            <div className="w-full h-full rounded-[24px] border-4 border-ink overflow-hidden bg-sky relative">
                                                {file.type.startsWith('video') ? (
                                                    <video 
                                                        src={preview} 
                                                        className="w-full h-full object-cover" 
                                                        autoPlay 
                                                        muted 
                                                        loop 
                                                        playsInline
                                                    />
                                                ) : (
                                                    <img src={preview} className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                            <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[32px]">
                                                <button 
                                                    onClick={(e) => { e.preventDefault(); setFile(null); setPreview(null); }}
                                                    className="w-16 h-16 bg-red-500 border-4 border-ink rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-[0_4px_0_0_#1e293b]"
                                                >
                                                    <X size={32} />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-ink p-6 text-center">
                                            <div className="w-20 h-20 bg-gold border-4 border-ink shadow-[0_4px_0_0_#1e293b] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                                                <Camera size={40} className="text-ink" />
                                            </div>
                                            <span className="text-2xl font-display font-black">Snap a Pic / Clip</span>
                                            <span className="text-base font-bold text-ink/70 mt-2">JPG, PNG, or MP4</span>
                                        </div>
                                    )}
                                    <input type="file" className="hidden" onChange={handleFileChange} accept="image/*,video/*" required />
                                </label>
                            </div>

                            {/* Details Area bg */}
                            <div className="md:col-span-3 space-y-4 md:space-y-6 bg-white border-4 border-ink p-4 md:p-8 rounded-[32px] shadow-cartoon md:rotate-1">
                                <div className="space-y-2">
                                    <label className="text-lg font-display font-bold text-ink flex items-center gap-2">
                                        <Type size={20} /> Name the Memory
                                    </label>
                                    <input 
                                        type="text" 
                                        placeholder="A cool title..." 
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="cartoon-input"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-lg font-display font-bold text-ink flex items-center gap-2">
                                            <Calendar size={20} /> Arc / Level
                                        </label>
                                        <select 
                                            value={year}
                                            onChange={(e) => setYear(e.target.value)}
                                            className="cartoon-input cursor-pointer bg-white"
                                        >
                                            <option value="2022">Level 1 (2022)</option>
                                            <option value="2023">Level 2 (2023)</option>
                                            <option value="2024">Level 3 (2024)</option>
                                            <option value="2025">Level 4 (2025)</option>
                                            <option value="2026">Boss Stage (2026)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-lg font-display font-bold text-ink flex items-center gap-2">
                                            <Tag size={20} /> Labels
                                        </label>
                                        <input 
                                            type="text" 
                                            placeholder="fun, lab..." 
                                            value={tags}
                                            onChange={(e) => setTags(e.target.value)}
                                            className="cartoon-input"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-lg font-display font-bold text-ink flex items-center gap-2">
                                        The Story
                                    </label>
                                    <textarea 
                                        placeholder="What's the tale behind this?" 
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="cartoon-input min-h-[140px] resize-none"
                                    />
                                </div>

                                <button 
                                    type="submit"
                                    disabled={uploading || !file}
                                    className={`cartoon-btn w-full !text-2xl !py-4 shadow-cartoon mt-4 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {uploading ? 'Scribing Map...' : 'Save to Map'} <UploadIcon size={24} className="ml-2" />
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </motion.div>
        </div>
    );
};

export default Upload;
