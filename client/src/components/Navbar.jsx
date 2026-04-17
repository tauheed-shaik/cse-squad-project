import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, Upload, Map, User, MessageCircle, LogOut, Tent, MapPin, Tv } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
    const { token, logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navItems = [
        { path: '/dashboard', icon: <Tent size={24} />, label: 'Camp' },
        { path: '/timeline', icon: <Map size={24} />, label: 'World Map' },
        { path: '/videos', icon: <Tv size={24} />, label: 'Cinema' },
        { path: '/upload', icon: <Upload size={24} />, label: 'Journal' },
        { path: '/messages', icon: <MessageCircle size={24} />, label: 'Owls' },
        ...(user?._id ? [{ path: `/profile/${user._id}`, icon: <User size={24} />, label: 'Hero Context' }] : []),
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-[110] px-2 py-3 bg-white border-t-4 md:border-4 border-ink shadow-cartoon md:rounded-3xl flex items-center justify-around md:justify-between w-full md:w-[95%] md:max-w-6xl md:left-1/2 md:-translate-x-1/2 md:bottom-auto md:top-4 transition-transform">
            <Link to="/" className="hidden md:flex items-center gap-2 group p-2 bg-gold border-4 border-ink rounded-2xl rotate-[-2deg] hover:rotate-2 transition-transform shadow-[0_4px_0_0_#1e293b]">
                <Compass size={28} className="text-ink animate-spin-slow" />
                <span className="text-2xl font-display font-bold text-ink hidden md:block tracking-wide">
                    SQUAD QUEST
                </span>
            </Link>

            <div className="flex items-center justify-around w-full md:flex-1 md:justify-end gap-1 md:gap-3 px-2">
                {token ? (
                    <>
                        {navItems.map((item) => {
                            const isActive = location.pathname.includes(item.path.split('/')[1]);
                            return (
                                <Link 
                                    key={item.label}
                                    to={item.path} 
                                    className={`relative p-3 md:px-4 md:py-2 rounded-2xl transition-all flex flex-col md:flex-row items-center gap-1 md:gap-2 font-bold ${isActive ? 'bg-grass text-ink border-2 md:border-4 border-ink shadow-[0_4px_0_0_#1e293b] -translate-y-1 md:translate-y-[-2px]' : 'bg-transparent text-ink/70 hover:bg-white border-2 border-transparent hover:text-ink hover:-translate-y-1'}`}
                                >
                                    <span className="relative z-10">{item.icon}</span>
                                    <span className="relative z-10 hidden lg:block font-display text-lg">{item.label}</span>
                                    
                                    {isActive && <MapPin fill="#ea580c" className="absolute -top-4 -right-2 text-ink animate-bounce hidden md:block" size={20} />}
                                    <span className="text-[10px] md:hidden font-display leading-none">{item.label.split(' ')[0]}</span>
                                </Link>
                            )
                        })}
                        <div className="hidden md:block w-1 h-8 bg-ink rounded-full mx-1 opacity-20"></div>
                        <button onClick={handleLogout} className="p-3 bg-wood text-white border-2 md:border-4 border-ink shadow-[0_4px_0_0_#1e293b] rounded-2xl hover:bg-woodLight transition-all">
                            <LogOut size={20} className="md:w-6 md:h-6" />
                        </button>
                    </>
                ) : (
                    <div className="flex items-center justify-between w-full md:w-auto gap-4 px-2">
                        <Link to="/" className="md:hidden p-2 bg-gold border-2 border-ink rounded-xl">
                            <Compass size={24} className="text-ink" />
                        </Link>
                        <div className="flex gap-4">
                            <Link to="/login" className="font-display font-bold text-lg md:text-xl text-ink hover:text-woodLight transition-colors py-2">Log In</Link>
                            <Link to="/register" className="cartoon-btn text-base md:text-xl !py-2 !px-4 md:!px-8">
                                Start Journey
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
