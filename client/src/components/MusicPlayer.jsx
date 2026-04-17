import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import backgroundMusic from '../assets/Music.mp3';

const MusicPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isExternallyPaused, setIsExternallyPaused] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        const handleExternalPause = () => {
            if (isPlaying && audioRef.current) {
                audioRef.current.pause();
                setIsExternallyPaused(true);
            }
        };

        const handleExternalResume = () => {
            if (isExternallyPaused && audioRef.current) {
                audioRef.current.play().catch(() => {});
                setIsExternallyPaused(false);
            }
        };

        window.addEventListener('pauseBackgroundMusic', handleExternalPause);
        window.addEventListener('resumeBackgroundMusic', handleExternalResume);

        return () => {
            window.removeEventListener('pauseBackgroundMusic', handleExternalPause);
            window.removeEventListener('resumeBackgroundMusic', handleExternalResume);
        };
    }, [isPlaying, isExternallyPaused]);

    useEffect(() => {
        // Attempt to autoplay on mount (will likely be blocked by browser)
        const playAttempt = setInterval(() => {
            if (audioRef.current && !isPlaying && !hasInteracted && !isExternallyPaused) {
                audioRef.current.play()
                    .then(() => {
                        setIsPlaying(true);
                        setHasInteracted(true);
                        clearInterval(playAttempt);
                    })
                    .catch(() => {
                        // Autoplay blocked, wait for user interaction
                    });
            }
        }, 1000);

        return () => clearInterval(playAttempt);
    }, [isPlaying, hasInteracted]);

    const togglePlay = () => {
        if (isPlaying || isExternallyPaused) {
            audioRef.current.pause();
            setIsPlaying(false);
            setIsExternallyPaused(false);
        } else {
            audioRef.current.play();
            setIsPlaying(true);
        }
        setHasInteracted(true);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] group">
            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-paper border-4 border-ink px-4 py-2 rounded-2xl shadow-cartoon whitespace-nowrap rotate-2">
                    <p className="font-display font-black text-ink">
                        {isPlaying ? "Pause the Vibe" : "Start the Aura"}
                    </p>
                </div>
            </div>

            <button
                onClick={togglePlay}
                className={`w-14 h-14 md:w-16 md:h-16 rounded-full border-4 border-ink shadow-cartoon flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${
                    isPlaying ? 'bg-gold animate-bounce-slow' : 'bg-slate-200 opacity-80'
                }`}
            >
                <audio ref={audioRef} src={backgroundMusic} loop />
                {isPlaying ? (
                    <div className="relative">
                        <Volume2 size={32} className="text-ink" />
                        <span className="absolute -top-1 -right-1 block w-3 h-3 bg-red-500 border-2 border-ink rounded-full animate-ping"></span>
                    </div>
                ) : (
                    <VolumeX size={32} className="text-ink" />
                )}
            </button>

            {/* Floating Music Notes when playing */}
            {isPlaying && (
                <div className="absolute -top-4 -left-4 pointer-events-none">
                    <div className="animate-float-slow opacity-60">
                        <Music size={24} className="text-ink rotate-12" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default MusicPlayer;
