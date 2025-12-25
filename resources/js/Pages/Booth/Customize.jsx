import { Head, router } from '@inertiajs/react';
import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, ArrowRight, Image, Sparkles, Check, Loader2, Save, ChevronLeft, ChevronRight } from 'lucide-react';
import html2canvas from 'html2canvas';

// Available frames organized by layout count
const FRAME_LIBRARY = {
    2: [
        { id: 'none', name: 'No Frame', path: null },
        { id: '2v-1', name: 'Classic', path: '/frames/2-vertical/1.png' },
        { id: '2v-2', name: 'Modern', path: '/frames/2-vertical/2.png' },
        { id: '2v-3', name: 'Vintage', path: '/frames/2-vertical/3.png' },
    ],
    3: [
        { id: 'none', name: 'No Frame', path: null },
        { id: '3v-1', name: 'Classic', path: '/frames/3-vertical/1.png' },
        { id: '3v-2', name: 'Film', path: '/frames/3-vertical/2.png' },
        { id: '3v-3', name: 'Retro', path: '/frames/3-vertical/3.png' },
        { id: '3v-4', name: 'Polaroid', path: '/frames/3-vertical/4.png' },
        { id: '3v-5', name: 'Minimal', path: '/frames/3-vertical/5.png' },
        { id: '3v-6', name: 'Elegant', path: '/frames/3-vertical/6.png' },
        { id: '3v-7', name: 'Simple', path: '/frames/3-vertical/7.png' },
    ],
    4: [
        { id: 'none', name: 'No Frame', path: null },
        { id: '4v-1', name: 'Classic', path: '/frames/4-vertical/1.png' },
        { id: '4v-2', name: 'Film', path: '/frames/4-vertical/2.png' },
        { id: '4v-3', name: 'Retro', path: '/frames/4-vertical/3.png' },
        { id: '4v-4', name: 'Polaroid', path: '/frames/4-vertical/4.png' },
        { id: '4v-5', name: 'Minimal', path: '/frames/4-vertical/5.png' },
        { id: '4v-6', name: 'Elegant', path: '/frames/4-vertical/6.png' },
        { id: '4v-7', name: 'Simple', path: '/frames/4-vertical/7.png' },
    ],
};

// Filter presets
const FILTERS = [
    { id: 'none', name: 'Original', css: '' },
    { id: 'bw', name: 'B&W', css: 'grayscale(100%)' },
    { id: 'sepia', name: 'Sepia', css: 'sepia(80%)' },
    { id: 'vivid', name: 'Vivid', css: 'contrast(120%) saturate(130%)' },
    { id: 'fade', name: 'Fade', css: 'contrast(90%) brightness(110%) saturate(80%)' },
];

export default function Customize({ auth }) {
    const captureRef = useRef(null);
    const [isReady, setIsReady] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [isFinishing, setIsFinishing] = useState(false);
    const [exportSuccess, setExportSuccess] = useState(false);
    const [exportError, setExportError] = useState(null);

    // Data from localStorage
    const [layoutConfig, setLayoutConfig] = useState(null);
    const [photos, setPhotos] = useState([]);

    // Customization state
    const [selectedFrame, setSelectedFrame] = useState('none');
    const [selectedFilter, setSelectedFilter] = useState('none');
    const [availableFrames, setAvailableFrames] = useState([]);

    // Validate data on mount
    useEffect(() => {
        const savedConfig = localStorage.getItem('blu_layout_config');
        const savedPhotos = localStorage.getItem('blu_captured_photos');

        if (!savedConfig || !savedPhotos) {
            console.warn('Missing session data, redirecting...');
            router.visit(route('booth.select'));
            return;
        }

        try {
            const config = JSON.parse(savedConfig);
            const photosData = JSON.parse(savedPhotos);

            if (!config.frames || photosData.length === 0) {
                throw new Error('Invalid session data');
            }

            setLayoutConfig(config);
            setPhotos(photosData.filter(p => p !== null)); // Only non-null photos

            // Load frames based on layout count
            const frames = FRAME_LIBRARY[config.frames] || FRAME_LIBRARY[4];
            setAvailableFrames(frames);

            setIsReady(true);
        } catch (error) {
            console.error('Invalid session data:', error);
            router.visit(route('booth.select'));
        }
    }, []);

    // Get current selections
    const currentFrame = availableFrames.find(f => f.id === selectedFrame);
    const currentFilter = FILTERS.find(f => f.id === selectedFilter) || FILTERS[0];

    // Generate canvas helper
    const generateCanvas = async () => {
        const canvas = await html2canvas(captureRef.current, {
            useCORS: true,
            allowTaint: true,
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false,
            imageTimeout: 15000,
        });
        return canvas.toDataURL('image/jpeg', 0.95);
    };

    // Save to server using fetch (more reliable for async flow)
    const saveToServer = async (dataUrl) => {
        try {
            // Get CSRF token from meta tag
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

            if (!csrfToken) {
                console.error('CSRF token not found');
                return { success: false, error: 'Session expired - please refresh' };
            }

            const response = await fetch(route('booth.export'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({ image: dataUrl }),
                credentials: 'same-origin',
            });

            if (response.ok || response.status === 302 || response.status === 303) {
                // Success - photo was saved
                return { success: true };
            } else if (response.status === 419) {
                // CSRF token mismatch
                return { success: false, error: 'Session expired - please refresh page' };
            } else if (response.status === 422) {
                // Validation error
                const data = await response.json().catch(() => ({}));
                return { success: false, error: data.message || 'Validation failed' };
            } else {
                return { success: false, error: `Server error: ${response.status}` };
            }
        } catch (err) {
            console.error('Save error:', err);
            return { success: false, error: 'Network error - please try again' };
        }
    };


    // Export with download
    const handleExport = async () => {
        if (!captureRef.current || isExporting || isFinishing) return;

        setIsExporting(true);
        setExportError(null);

        try {
            const dataUrl = await generateCanvas();

            // Trigger download first
            const link = document.createElement('a');
            link.download = `blubooth_strip_${Date.now()}.jpg`;
            link.href = dataUrl;
            link.click();

            // Save to server using Inertia
            const result = await saveToServer(dataUrl);
            if (result.success) {
                setExportSuccess(true);
                setTimeout(() => router.visit('/gallery'), 1500);
            } else {
                // Download worked, server failed - still show success but log error
                console.warn('Server save failed:', result.error);
                setExportSuccess(true);
            }
        } catch (error) {
            console.error('Export error:', error);
            setExportError(error.message || 'Export failed');
        } finally {
            setIsExporting(false);
        }
    };

    // Finish without download - just save to gallery
    const handleFinish = async () => {
        if (!captureRef.current || isExporting || isFinishing) return;

        setIsFinishing(true);
        setExportError(null);

        try {
            const dataUrl = await generateCanvas();
            const result = await saveToServer(dataUrl);

            if (result.success) {
                // Redirect to gallery
                router.visit('/gallery');
            } else {
                setExportError(result.error || 'Could not save to archive');
                setTimeout(() => setExportError(null), 4000);
            }
        } catch (error) {
            console.error('Finish error:', error);
            setExportError(error.message || 'Save failed');
            setTimeout(() => setExportError(null), 4000);
        } finally {
            setIsFinishing(false);
        }
    };


    // Loading state
    if (!isReady || !layoutConfig) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-neutral-900 text-sm uppercase tracking-widest"
                >
                    Loading...
                </motion.div>
            </div>
        );
    }

    return (
        <>
            <Head title="Customize Your Strip" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
            `}</style>

            <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-black selection:text-white flex flex-col">

                {/* Header */}
                <div className="flex-shrink-0 px-6 py-4 flex items-center justify-between border-b border-neutral-100">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <span className="w-6 h-6 bg-black text-white text-[10px] font-bold flex items-center justify-center rounded-full">3</span>
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-500">Customize</span>
                        </div>
                        <h1 className="text-xl font-bold tracking-tighter uppercase hidden md:block">
                            Blu<span className="font-serif italic font-normal text-neutral-400">Booth.</span>
                        </h1>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        {/* Finish Button - Save without download */}
                        <motion.button
                            onClick={handleFinish}
                            disabled={isFinishing || isExporting || exportSuccess}
                            whileHover={!isFinishing ? { scale: 1.02 } : {}}
                            className={`
                                px-5 py-2.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest rounded-full border transition-all
                                ${isFinishing
                                    ? 'border-neutral-200 text-neutral-400 cursor-not-allowed'
                                    : 'border-neutral-200 text-neutral-600 hover:border-black hover:text-neutral-900'}
                            `}
                        >
                            {isFinishing ? (
                                <>
                                    <Loader2 size={12} className="animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={12} />
                                    Finish
                                </>
                            )}
                        </motion.button>

                        {/* Download Button - Save + Download */}
                        <motion.button
                            onClick={handleExport}
                            disabled={isExporting || isFinishing || exportSuccess}
                            whileHover={!isExporting ? { scale: 1.02 } : {}}
                            whileTap={!isExporting ? { scale: 0.98 } : {}}
                            className={`
                                px-6 py-2.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all
                                ${isExporting || isFinishing || exportSuccess
                                    ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                                    : 'bg-black text-white hover:bg-neutral-800'}
                            `}
                        >
                            {isExporting ? (
                                <>
                                    <Loader2 size={12} className="animate-spin" />
                                    Saving...
                                </>
                            ) : exportSuccess ? (
                                <>
                                    <Check size={12} />
                                    Done!
                                </>
                            ) : (
                                <>
                                    <Download size={12} />
                                    Download
                                </>
                            )}
                        </motion.button>
                    </div>
                </div>

                {/* Main Content - Preview Canvas */}
                <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden bg-neutral-50">

                    {/* The Strip to Capture */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="relative"
                    >
                        {/* Capture Node - This is what html2canvas captures */}
                        <div
                            ref={captureRef}
                            id="capture-node"
                            className="relative bg-white p-3 shadow-2xl border border-neutral-200"
                            style={{
                                minWidth: '200px',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 12px 24px -8px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            {/* Photos Stack */}
                            <div
                                className="flex flex-col gap-1"
                                style={{ filter: currentFilter.css }}
                            >
                                {photos.map((photo, index) => (
                                    <div
                                        key={index}
                                        className="w-48 md:w-56 aspect-[4/3] overflow-hidden bg-neutral-100"
                                    >
                                        {photo && (
                                            <img
                                                src={photo}
                                                alt={`Frame ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Branding */}
                            <div className="text-center mt-2 pb-1">
                                <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-neutral-400">
                                    BluBooth
                                </span>
                            </div>

                            {/* Frame Overlay - Absolute positioned */}
                            {currentFrame?.path && (
                                <img
                                    src={currentFrame.path}
                                    alt="Frame"
                                    className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
                                    crossOrigin="anonymous"
                                />
                            )}
                        </div>
                    </motion.div>

                    {/* Error Toast - Bottom Right, Luxury Black Pill */}
                    <AnimatePresence>
                        {exportError && (
                            <motion.div
                                initial={{ opacity: 0, y: 20, x: 20 }}
                                animate={{ opacity: 1, y: 0, x: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-black/90 backdrop-blur-sm text-white px-5 py-3 rounded-full shadow-2xl"
                            >
                                <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                </svg>
                                <span className="text-[10px] font-bold uppercase tracking-widest">
                                    {exportError}
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Bottom Control Bar - Glassmorphism */}
                <div className="flex-shrink-0 bg-white/80 backdrop-blur-md border-t border-neutral-100 p-4">

                    {/* Filter Row */}
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles size={12} className="text-neutral-400" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Filters</span>
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {FILTERS.map((filter) => (
                                <motion.button
                                    key={filter.id}
                                    onClick={() => setSelectedFilter(filter.id)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`
                                        flex-shrink-0 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all
                                        ${selectedFilter === filter.id
                                            ? 'bg-black text-white'
                                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}
                                    `}
                                >
                                    {filter.name}
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Frame Row */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Image size={12} className="text-neutral-400" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                                Frames ({availableFrames.length})
                            </span>
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {availableFrames.map((frame) => (
                                <motion.button
                                    key={frame.id}
                                    onClick={() => setSelectedFrame(frame.id)}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`
                                        flex-shrink-0 relative w-16 h-20 rounded-lg overflow-hidden transition-all bg-white
                                        ${selectedFrame === frame.id
                                            ? 'ring-2 ring-black ring-offset-2 ring-offset-white shadow-lg'
                                            : 'ring-1 ring-neutral-200 hover:ring-neutral-400 hover:shadow-md'}
                                    `}
                                >
                                    {frame.path ? (
                                        <img
                                            src={frame.path}
                                            alt={frame.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-neutral-50 flex items-center justify-center">
                                            <span className="text-[8px] text-neutral-400 uppercase">None</span>
                                        </div>
                                    )}

                                    {/* Selection indicator */}
                                    {selectedFrame === frame.id && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute top-1 right-1 w-4 h-4 bg-black rounded-full flex items-center justify-center"
                                        >
                                            <Check size={10} className="text-white" />
                                        </motion.div>
                                    )}
                                </motion.button>
                            ))}
                        </div>

                        {/* Frame name */}
                        <p className="text-center text-[10px] text-neutral-500 mt-2">
                            {currentFrame?.name || 'No Frame'}
                        </p>
                    </div>
                </div>

            </div>
        </>
    );
}
