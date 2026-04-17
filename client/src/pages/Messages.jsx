import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Map, Search, CheckCircle, Bird, Feather } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Messages = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [messageText, setMessageText] = useState('');
    const [sent, setSent] = useState(false);

    useEffect(() => {
        fetchMyMessages();
        fetchAllUsers();
    }, []);

    const fetchMyMessages = async () => {
        try {
            const res = await api.get('/api/messages/my-messages');
            setMessages(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchAllUsers = async () => {
        try {
            const res = await api.get('/api/users/all');
            setUsers(res.data);
        } catch (err) {
            setUsers([]);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!selectedUser || !messageText.trim()) return;

        try {
            await api.post('/api/messages/send', {
                toUserId: selectedUser._id,
                message: messageText
            });
            setSent(true);
            setMessageText('');
            setTimeout(() => {
                setSent(false);
                setSelectedUser(null);
            }, 3000);
        } catch (err) {
            alert('Failed to send bird');
        }
    };

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) && u._id !== user?._id
    );

    return (
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12 relative pt-20 md:pt-24 z-10 pb-24 md:pb-12">
            <div className="text-center mb-10 md:mb-16 cartoon-paper p-6 md:p-10 max-w-4xl mx-auto shadow-cartoon md:rotate-1">
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-white border-4 border-ink flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-[inset_0_4px_0_0_rgba(0,0,0,0.1)]">
                    <Bird className="text-skyDark animate-bob w-10 h-10 md:w-16 md:h-16" />
                </div>
                <h1 className="text-4xl md:text-7xl font-display font-black text-ink mb-2 md:mb-4">
                    Messenger Owls
                </h1>
                <p className="text-ink font-bold text-lg md:text-xl">
                    Send anonymous letters via owl. They carry no trace of the sender!
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* Received Messages */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center gap-3 px-6 py-3 bg-white border-4 border-ink rounded-full w-max shadow-cartoon-sm -rotate-2">
                        <Map className="text-woodLight" size={24} />
                        <h2 className="text-xl font-display font-bold text-ink">
                            Delivered Scrolls ({messages.length})
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <AnimatePresence>
                            {messages.map((msg, idx) => (
                                    <motion.div 
                                        key={msg._id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className={`cartoon-paper p-6 md:p-8 flex flex-col hover:-translate-y-2 transition-transform shadow-cartoon ${idx % 2 === 0 ? 'rotate-1' : '-rotate-1'}`}
                                    >
                                        <Feather className="absolute top-4 right-4 text-ink/20 rotate-45" size={32} />
                                        <p className="text-lg md:text-xl text-ink font-bold mb-6 md:mb-8 leading-relaxed z-10 w-full whitespace-pre-wrap break-words overflow-hidden">"{msg.message}"</p>
                                        <div className="flex justify-between items-end border-t-4 border-ink/20 pt-4 mt-auto">
                                            <div className="bg-white text-ink border-2 border-ink px-3 py-1 font-bold rounded-full text-sm md:text-base">Secret Sender</div>
                                            <span className="text-xs md:text-sm text-ink/70 font-bold">{new Date(msg.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </motion.div>
                            ))}
                        </AnimatePresence>
                        {messages.length === 0 && (
                            <div className="col-span-full py-16 bg-white/50 border-4 border-dashed border-ink rounded-[24px] flex flex-col items-center justify-center opacity-80 backdrop-blur-sm">
                                <Bird size={64} className="text-ink/40 mb-4" />
                                <h3 className="text-xl font-display font-bold text-ink/60">No owls are perching here yet.</h3>
                            </div>
                        )}
                    </div>
                </div>

                {/* Send Message Section */}
                <div className="lg:col-span-5">
                    <div className="cartoon-card p-8 bg-[#87CEEB] sticky top-28 border-4 border-ink shadow-cartoon rotate-1 relative z-10">
                        {/* Clouds pattern in background */}
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'10\' fill=\'white\' opacity=\'0.2\'/%3E%3C/svg%3E')] opacity-50 z-0"></div>
                        
                        <div className="relative z-10">
                            <h3 className="text-2xl md:text-3xl font-display font-black text-ink mb-6 flex items-center gap-3">
                                <Send size={24} className="md:w-7 md:h-7 text-woodLight" /> Tie a scroll
                            </h3>

                            {!selectedUser ? (
                                <div className="space-y-4 bg-white border-4 border-ink p-4 rounded-3xl">
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/50" size={24} />
                                        <input 
                                            type="text" 
                                            placeholder="Find a villager..." 
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full bg-slate-100 border-4 border-ink rounded-2xl py-3 pl-14 pr-4 font-bold text-lg focus:outline-none focus:bg-paper"
                                        />
                                    </div>
                                    <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                        {filteredUsers.map(u => (
                                            <button 
                                                key={u._id}
                                                onClick={() => setSelectedUser(u)}
                                                className="w-full flex items-center gap-4 p-3 rounded-[20px] bg-slate-50 border-4 border-transparent hover:bg-gold hover:border-ink transition-colors text-left"
                                            >
                                                <img src={u.profilePic} className="w-12 h-12 rounded-xl border-2 border-ink object-cover shadow-[0_2px_0_0_#1e293b]" />
                                                <span className="font-display text-xl text-ink font-bold truncate">{u.name}</span>
                                            </button>
                                        ))}
                                        {filteredUsers.length === 0 && searchTerm && (
                                            <p className="text-center text-ink/70 py-4 font-bold text-lg">No villager found.</p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                    <div className="flex items-center justify-between bg-white p-4 rounded-2xl border-4 border-ink shadow-[0_4px_0_0_#1e293b]">
                                        <div className="flex items-center gap-4">
                                            <img src={selectedUser.profilePic} className="w-12 h-12 rounded-xl object-cover border-2 border-ink" />
                                            <span className="font-display font-bold text-xl text-ink">{selectedUser.name}</span>
                                        </div>
                                        <button onClick={() => setSelectedUser(null)} className="cartoon-btn !bg-red-500 !text-white !p-2">✕</button>
                                    </div>

                                    {sent ? (
                                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="py-12 text-center bg-white border-4 border-ink rounded-3xl shadow-cartoon">
                                            <CheckCircle className="mx-auto mb-4 text-grassDark" size={48} />
                                            <p className="text-2xl font-display font-black text-ink">The Owl is off!</p>
                                        </motion.div>
                                    ) : (
                                        <form onSubmit={handleSendMessage} className="space-y-4">
                                            <textarea 
                                                placeholder={`Write a friendly letter to ${selectedUser.name.split(' ')[0]}...`}
                                                value={messageText}
                                                onChange={(e) => setMessageText(e.target.value)}
                                                className="cartoon-input min-h-[160px] resize-none text-xl placeholder:opacity-70"
                                                required
                                            />
                                            <button 
                                                type="submit"
                                                className="cartoon-btn w-full !text-2xl !py-4 shadow-cartoon"
                                            >
                                                Send Owl <Bird size={24} />
                                            </button>
                                        </form>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messages;
