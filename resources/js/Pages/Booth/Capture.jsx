import { Head, router } from '@inertiajs/react';
import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, RefreshCw, ArrowRight, Check, FlipHorizontal, Timer, Aperture } from 'lucide-react';

export default function Capture({ auth }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [isCameraFlipped, setIsCameraFlipped] = useState(true);
    const [isReady, setIsReady] = useState(false);

    // Layout configuration - MUST exist or redirect
    const [layoutConfig, setLayoutConfig] = useState(null);

    // Photo state - initialized after config is loaded
    const [photos, setPhotos] = useState([]);
    const [activeFrameIndex, setActiveFrameIndex] = useState(0);

    // Camera effects state
    const [isFlashing, setIsFlashing] = useState(false);
    const [countdown, setCountdown] = useState(null);
    const [countdownDuration, setCountdownDuration] = useState(3);
    const [isCapturing, setIsCapturing] = useState(false);

    // Step 1: Validate layout config exists - redirect if not
    useEffect(() => {
        const savedConfig = localStorage.getItem('blu_layout_config');

        if (!savedConfig) {
            // No config found - redirect to selection page
            console.warn('No layout config found, redirecting to selection...');
            router.visit(route('booth.select'));
            return;
        }

        try {
            const config = JSON.parse(savedConfig);

            // Validate config structure
            if (!config.frames || config.frames < 2 || config.frames > 4) {
                throw new Error('Invalid frame count');
            }

            setLayoutConfig(config);
            // Initialize photos array with EXACTLY the number of frames from config
            setPhotos(Array(config.frames).fill(null));
            setIsReady(true);
        } catch (error) {
            console.error('Invalid layout config:', error);
            localStorage.removeItem('blu_layout_config');
            router.visit(route('booth.select'));
        }
    }, []);

    // Step 2: Initialize camera after config is ready
    useEffect(() => {
        if (!isReady) return;

        let mediaStream = null;

        const startCamera = async () => {
            try {
                mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                        facingMode: "user"
                    },
                    audio: false,
                });
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                    videoRef.current.play();
                }
            } catch (err) {
                console.error("Camera Error:", err);
                alert("Unable to access camera. Please grant camera permissions.");
            }
        };

        startCamera();

        return () => {
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [isReady]);

    // Countdown logic
    const startCountdown = useCallback(() => {
        return new Promise((resolve) => {
            if (countdownDuration === 0) {
                resolve();
                return;
            }

            setIsCapturing(true);
            let count = countdownDuration;
            setCountdown(count);

            const interval = setInterval(() => {
                count--;
                if (count > 0) {
                    setCountdown(count);
                } else {
                    clearInterval(interval);
                    setCountdown(null);
                    resolve();
                }
            }, 1000);
        });
    }, [countdownDuration]);

    // Capture photo
    const capturePhoto = useCallback(async () => {
        if (!layoutConfig || activeFrameIndex === -1 || isCapturing) return;

        await startCountdown();

        // Flash effect
        setIsFlashing(true);
        setTimeout(() => setIsFlashing(false), 150);

        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (video && canvas) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');

            if (isCameraFlipped) {
                ctx.translate(canvas.width, 0);
                ctx.scale(-1, 1);
            }

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageSrc = canvas.toDataURL('image/jpeg', 0.9);

            // Update photos array
            const newPhotos = [...photos];
            newPhotos[activeFrameIndex] = imageSrc;
            setPhotos(newPhotos);

            // Save to localStorage
            localStorage.setItem('blu_captured_photos', JSON.stringify(newPhotos));

            // Auto-advance logic - respect the frame limit
            const nextEmptyIndex = newPhotos.findIndex(p => p === null);
            if (nextEmptyIndex !== -1) {
                setActiveFrameIndex(nextEmptyIndex);
            } else {
                // All frames captured! Stop capturing
                setActiveFrameIndex(-1);
            }
        }

        setIsCapturing(false);
    }, [layoutConfig, activeFrameIndex, isCapturing, isCameraFlipped, photos, startCountdown]);

    // Handle frame click for retake
    const handleFrameClick = (index) => {
        setActiveFrameIndex(index);
    };

    // Finish session
    const handleFinish = () => {
        if (photos.includes(null)) {
            if (!confirm('You haven\'t captured all frames. Continue anyway?')) return;
        }

        // Save final photos
        localStorage.setItem('blu_captured_photos', JSON.stringify(photos));
        localStorage.setItem('blu_capture_time', new Date().toISOString());

        router.visit('/gallery');
    };

    // Toggle camera flip
    const toggleFlip = () => {
        setIsCameraFlipped(prev => !prev);
    };

    // Loading state while checking config
    if (!isReady || !layoutConfig) {
        return (
            <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
                <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-white text-sm uppercase tracking-widest"
                >
                    Loading...
                </motion.div>
            </div>
        );
    }

    const isFull = !photos.includes(null);
    const capturedCount = photos.filter(p => p !== null).length;

    return (
        <>
            <Head title="Capture Session" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
            `}</style>

            <div className="min-h-screen bg-neutral-900 text-white flex flex-col md:flex-row overflow-hidden font-sans">

                {/* LEFT: Live Camera Section */}
                <div className="flex-1 relative flex flex-col items-center justify-center p-6 bg-black">

                    {/* Header with Step Indicator */}
                    <div className="absolute top-6 left-6 z-20">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="w-6 h-6 bg-white text-black text-[10px] font-bold flex items-center justify-center rounded-full">2</span>
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400">Capture</span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tighter uppercase">
                            Blu<span className="font-serif italic font-normal text-neutral-400">Booth.</span>
                        </h1>
                        <p className="text-[10px] uppercase tracking-widest text-neutral-500 mt-1">
                            Session: {layoutConfig.name} • {layoutConfig.frames} Frames
                        </p>
                    </div>

                    {/* Camera Viewport */}
                    <div className="relative w-full max-w-4xl aspect-video bg-neutral-800 rounded-sm overflow-hidden shadow-2xl ring-1 ring-neutral-700">

                        {/* Flash Effect */}
                        <AnimatePresence>
                            {isFlashing && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.075 }}
                                    className="absolute inset-0 bg-white z-50 pointer-events-none"
                                />
                            )}
                        </AnimatePresence>

                        {/* Countdown Overlay */}
                        <AnimatePresence>
                            {countdown !== null && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 1.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    className="absolute inset-0 bg-black/70 z-40 flex items-center justify-center"
                                >
                                    <motion.span
                                        key={countdown}
                                        initial={{ scale: 1.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.5, opacity: 0 }}
                                        className="text-8xl font-bold text-white font-serif"
                                    >
                                        {countdown}
                                    </motion.span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Live Indicator */}
                        <div className="absolute top-4 right-4 z-10">
                            <motion.span
                                animate={{ opacity: [1, 0.5, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/90 text-white text-[10px] font-bold uppercase tracking-widest rounded-full"
                            >
                                <div className="w-2 h-2 bg-white rounded-full" />
                                Live
                            </motion.span>
                        </div>

                        {activeFrameIndex !== -1 ? (
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className={`w-full h-full object-cover transition-transform duration-300 ${isCameraFlipped ? '-scale-x-100' : ''}`}
                            />
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 text-neutral-500"
                            >
                                <Check size={48} className="mb-4 text-green-500" />
                                <p className="font-serif text-2xl italic text-white">Session Complete</p>
                                <p className="text-xs uppercase tracking-widest mt-2">Tap a photo on the right to retake</p>
                            </motion.div>
                        )}

                        {/* Composition Guides */}
                        <div className="absolute inset-0 pointer-events-none opacity-15">
                            <div className="absolute top-1/3 left-0 w-full h-px bg-white" />
                            <div className="absolute top-2/3 left-0 w-full h-px bg-white" />
                            <div className="absolute left-1/3 top-0 h-full w-px bg-white" />
                            <div className="absolute left-2/3 top-0 h-full w-px bg-white" />
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="mt-8 flex items-center gap-6">

                        {/* Countdown Selector */}
                        <div className="flex items-center gap-2 text-neutral-400">
                            <Timer size={16} />
                            <select
                                value={countdownDuration}
                                onChange={(e) => setCountdownDuration(Number(e.target.value))}
                                className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-xs uppercase tracking-widest text-white focus:outline-none focus:ring-1 focus:ring-white/30"
                            >
                                <option value={0}>Instant</option>
                                <option value={3}>3 sec</option>
                                <option value={5}>5 sec</option>
                                <option value={10}>10 sec</option>
                            </select>
                        </div>

                        {/* Shutter Button */}
                        {activeFrameIndex !== -1 && (
                            <motion.button
                                onClick={capturePhoto}
                                disabled={isCapturing}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center hover:bg-white/10 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <motion.div
                                    animate={isCapturing ? { scale: [1, 0.8, 1] } : {}}
                                    transition={{ duration: 0.5, repeat: isCapturing ? Infinity : 0 }}
                                    className="w-16 h-16 bg-white rounded-full group-hover:scale-95 transition-transform flex items-center justify-center"
                                >
                                    <Aperture size={24} className="text-neutral-900" />
                                </motion.div>
                            </motion.button>
                        )}

                        {/* Flip Button */}
                        <motion.button
                            onClick={toggleFlip}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`p-3 rounded-full border transition-colors ${isCameraFlipped ? 'border-white/30 text-white' : 'border-neutral-600 text-neutral-400'}`}
                        >
                            <FlipHorizontal size={20} />
                        </motion.button>
                    </div>

                    {/* Status Text */}
                    <p className="mt-6 text-neutral-500 text-xs uppercase tracking-widest font-bold">
                        {activeFrameIndex !== -1
                            ? `Capturing Frame ${activeFrameIndex + 1} of ${layoutConfig.frames}`
                            : `All ${layoutConfig.frames} frames captured`}
                    </p>

                    <canvas ref={canvasRef} className="hidden" />
                </div>

                {/* RIGHT: Film Strip Sidebar - DYNAMIC based on layoutConfig */}
                <div className="w-full md:w-80 lg:w-96 bg-white text-neutral-900 border-l border-neutral-200 p-6 flex flex-col h-[35vh] md:h-screen overflow-y-auto">

                    <div className="mb-6 flex justify-between items-end">
                        <h3 className="text-neutral-900 font-bold uppercase tracking-widest text-xs">Film Strip</h3>
                        <span className="text-neutral-400 text-[10px] font-serif italic">
                            {capturedCount} / {layoutConfig.frames}
                        </span>
                    </div>

                    {/* Dynamic Photo Frames - EXACTLY layoutConfig.frames slots */}
                    <div className="flex-1 space-y-4">
                        {photos.map((imgSrc, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => handleFrameClick(index)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`
                                    relative aspect-[3/2] w-full cursor-pointer overflow-hidden transition-all duration-300 group
                                    ${imgSrc
                                        ? 'bg-neutral-100'
                                        : 'bg-neutral-50 border-2 border-dashed border-neutral-200'}
                                    ${activeFrameIndex === index
                                        ? 'ring-2 ring-offset-2 ring-black shadow-xl scale-[1.02] z-10'
                                        : 'hover:shadow-md'}
                                `}
                            >
                                {imgSrc ? (
                                    <>
                                        <img src={imgSrc} alt={`Frame ${index + 1}`} className="w-full h-full object-cover" />
                                        {/* Retake Overlay */}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <div className="flex items-center gap-2 text-white text-xs font-bold uppercase tracking-widest">
                                                <RefreshCw size={14} /> Retake
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-neutral-300">
                                        <Camera size={24} className="mb-2" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Frame {index + 1}</span>
                                    </div>
                                )}

                                {/* Frame Number Badge */}
                                <div className="absolute top-2 left-2 w-5 h-5 bg-black/80 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                                    {index + 1}
                                </div>

                                {/* Active Indicator */}
                                <AnimatePresence>
                                    {activeFrameIndex === index && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            className="absolute bottom-2 right-2 w-2 h-2 bg-green-500 rounded-full"
                                        />
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-6 pt-6 border-t border-neutral-100">
                        <motion.button
                            onClick={handleFinish}
                            disabled={!isFull}
                            whileHover={isFull ? { y: -2, scale: 1.02 } : {}}
                            whileTap={isFull ? { scale: 0.98 } : {}}
                            className={`
                                w-full py-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest transition-all rounded-sm
                                ${isFull
                                    ? 'bg-black text-white hover:bg-neutral-800 shadow-lg'
                                    : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'}
                            `}
                        >
                            <span>Finish Session</span>
                            <ArrowRight size={14} />
                        </motion.button>
                    </div>

                </div>
            </div>
        </>
    );
}
