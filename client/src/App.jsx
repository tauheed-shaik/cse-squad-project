import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Timeline from './pages/Timeline';
import Profile from './pages/Profile';
import Upload from './pages/Upload';
import Messages from './pages/Messages';
import Videos from './pages/Videos';
import Navbar from './components/Navbar';
import MusicPlayer from './components/MusicPlayer';

const ProtectedRoute = ({ children }) => {
    const { token, loading } = useAuth();
    if (loading) return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-sky">
            <div className="w-24 h-24 bg-gold rounded-full border-4 border-ink shadow-[0_6px_0_0_#1e293b] flex items-center justify-center animate-spin mb-4">
                <span className="text-4xl">🧭</span>
            </div>
            <h2 className="font-display text-4xl text-ink font-black text-stroke">Loading Map...</h2>
        </div>
    );
    return token ? children : <Navigate to="/login" />;
};

const PageTransition = ({ children }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-full h-full"
        >
            {children}
        </motion.div>
    );
};

function AnimatedRoutes() {
    const location = useLocation();
    
    return (
        <main className="relative pt-32 pb-20">
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
                    <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
                    <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
                    
                    <Route path="/dashboard" element={<ProtectedRoute><PageTransition><Dashboard /></PageTransition></ProtectedRoute>} />
                    <Route path="/timeline" element={<ProtectedRoute><PageTransition><Timeline /></PageTransition></ProtectedRoute>} />
                    <Route path="/videos" element={<ProtectedRoute><PageTransition><Videos /></PageTransition></ProtectedRoute>} />
                    <Route path="/profile/:id" element={<ProtectedRoute><PageTransition><Profile /></PageTransition></ProtectedRoute>} />
                    <Route path="/upload" element={<ProtectedRoute><PageTransition><Upload /></PageTransition></ProtectedRoute>} />
                    <Route path="/messages" element={<ProtectedRoute><PageTransition><Messages /></PageTransition></ProtectedRoute>} />
                </Routes>
            </AnimatePresence>
        </main>
    );
}

function App() {
    return (
        <AuthProvider>
            <div className="relative min-h-screen text-ink overflow-hidden font-sans">
                <MusicPlayer />
                {/* Global Parallax Clouds */}
                <div className="fixed top-20 w-[200vw] h-40 opacity-40 pointer-events-none z-0 animate-cloud-move flex justify-around">
                    <span className="text-8xl">☁️</span>
                    <span className="text-6xl mt-12">☁️</span>
                    <span className="text-9xl -mt-4">☁️</span>
                    <span className="text-7xl mt-8">☁️</span>
                </div>

                <Router>
                    <Navbar />
                    <AnimatedRoutes />
                </Router>
            </div>
        </AuthProvider>
    );
}

export default App;
