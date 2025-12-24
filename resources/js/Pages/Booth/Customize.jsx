import { Head, router } from '@inertiajs/react';
import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, ArrowRight, Palette, Image, Sparkles, Check, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';

export default function Customize({ auth }) {
    const stripRef = useRef(null);
    const [isReady, setIsReady] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [exportSuccess, setExportSuccess] = useState(false);

    // Data from localStorage
    const [layoutConfig, setLayoutConfig] = useState(null);
    const [photos, setPhotos] = useState([]);

    // Customization state
    const [selectedFrame, setSelectedFrame] = useState('minimal-white');
    const [selectedFilter, setSelectedFilter] = useState('none');

    // Frame options (CSS-based since no image frames exist)
    const frames = [
        { id: 'minimal-white', name: 'Minimal', borderColor: 'white', borderWidth: 16, bg: 'white' },
        { id: 'film-black', name: 'Film Noir', borderColor: '#1a1a1a', borderWidth: 12, bg: '#0a0a0a' },
        { id: 'retro-cream', name: 'Retro', borderColor: '#f5f0e6', borderWidth: 20, bg: '#faf8f3' },
        { id: 'polaroid', name: 'Polaroid', borderColor: 'white', borderWidth: 16, paddingBottom: 48, bg: 'white' },
    ];

    // Filter options
    const filters = [
        { id: 'none', name: 'Original', css: '' },
        { id: 'bw', name: 'B&W', css: 'grayscale(100%)' },
        { id: 'sepia', name: 'Sepia', css: 'sepia(80%)' },
        { id: 'vivid', name: 'Vivid', css: 'contrast(120%) saturate(130%)' },
        { id: 'fade', name: 'Fade', css: 'contrast(90%) brightness(110%) saturate(80%)' },
    ];

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
            setPhotos(photosData);
            setIsReady(true);
        } catch (error) {
            console.error('Invalid session data:', error);
            router.visit(route('booth.select'));
        }
    }, []);

    // Get current frame config
    const currentFrame = frames.find(f => f.id === selectedFrame) || frames[0];
    const currentFilter = filters.find(f => f.id === selectedFilter) || filters[0];

    // Export strip
    const handleExport = async () => {
        if (!stripRef.current || isExporting) return;

        setIsExporting(true);

        try {
            // Generate image from DOM
            const canvas = await html2canvas(stripRef.current, {
                backgroundColor: currentFrame.bg,
                scale: 2, // High quality
                useCORS: true,
                allowTaint: true,
            });

            const dataUrl = canvas.toDataURL('image/jpeg', 0.95);

            // Save to server
            const response = await fetch(route('booth.export'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                },
                body: JSON.stringify({ image: dataUrl }),
            });

            if (response.ok) {
                setExportSuccess(true);

                // Trigger download
                const link = document.createElement('a');
                link.download = `blubooth_strip_${Date.now()}.jpg`;
                link.href = dataUrl;
                link.click();

                // Navigate to gallery after a moment
                setTimeout(() => {
                    router.visit('/gallery');
                }, 2000);
            } else {
                throw new Error('Export failed');
            }
        } catch (error) {
            console.error('Export error:', error);
            alert('Failed to export. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    // Download only (no save)
    const handleDownloadOnly = async () => {
        if (!stripRef.current) return;

        try {
            const canvas = await html2canvas(stripRef.current, {
                backgroundColor: currentFrame.bg,
                scale: 2,
                useCORS: true,
            });

            const link = document.createElement('a');
            link.download = `blubooth_strip_${Date.now()}.jpg`;
            link.href = canvas.toDataURL('image/jpeg', 0.95);
            link.click();
        } catch (error) {
            console.error('Download error:', error);
        }
    };

    // Loading state
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

    return (
        <>
            <Head title="The Darkroom" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
            `}</style>

            <div className="min-h-screen bg-neutral-900 text-white font-sans selection:bg-white selection:text-black flex flex-col lg:flex-row">

                {/* LEFT: Preview Canvas */}
                <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-12 relative overflow-hidden">

                    {/* Background texture */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0" style={{
                            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                            backgroundSize: '32px 32px'
                        }} />
                    </div>

                    {/* Header */}
                    <div className="absolute top-6 left-6 z-20">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="w-6 h-6 bg-white text-black text-[10px] font-bold flex items-center justify-center rounded-full">3</span>
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400">The Darkroom</span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tighter uppercase">
                            Blu<span className="font-serif italic font-normal text-neutral-400">Booth.</span>
                        </h1>
                    </div>

                    {/* Strip Preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative"
                    >
                        {/* Shadow effect */}
                        <div className="absolute -inset-4 bg-black/50 blur-3xl rounded-lg" />

                        {/* The actual strip to export */}
                        <div
                            ref={stripRef}
                            className="relative"
                            style={{
                                backgroundColor: currentFrame.bg,
                                padding: currentFrame.borderWidth,
                                paddingBottom: currentFrame.paddingBottom || currentFrame.borderWidth,
                            }}
                        >
                            {/* Photos container */}
                            <div className="flex flex-col gap-1" style={{ filter: currentFilter.css }}>
                                {photos.map((photo, index) => (
                                    <div
                                        key={index}
                                        className="w-48 md:w-56 aspect-[4/3] overflow-hidden"
                                    >
                                        {photo && (
                                            <img
                                                src={photo}
                                                alt={`Frame ${index + 1}`}
                                                className="w-full h-full object-cover"
                                                crossOrigin="anonymous"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Branding footer (for Polaroid style) */}
                            {currentFrame.paddingBottom && (
                                <div className="text-center mt-2">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400">
                                        BluBooth
                                    </span>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Preview label */}
                    <p className="mt-8 text-neutral-500 text-xs uppercase tracking-widest font-bold">
                        Live Preview
                    </p>
                </div>

                {/* RIGHT: Controls Panel */}
                <div className="w-full lg:w-96 bg-neutral-950 border-l border-neutral-800 p-6 lg:p-8 flex flex-col">

                    {/* Panel Header */}
                    <div className="mb-8">
                        <h2 className="text-lg font-bold uppercase tracking-widest mb-2">Customize</h2>
                        <p className="text-neutral-500 text-xs">Add your finishing touches</p>
                    </div>

                    {/* Frame Selection */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Image size={14} className="text-neutral-400" />
                            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Frame Style</h3>
                        </div>

                        <div className="grid grid-cols-4 gap-3">
                            {frames.map((frame) => (
                                <motion.button
                                    key={frame.id}
                                    onClick={() => setSelectedFrame(frame.id)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`
                                        aspect-square rounded-lg p-2 transition-all relative
                                        ${selectedFrame === frame.id
                                            ? 'ring-2 ring-white ring-offset-2 ring-offset-neutral-950'
                                            : 'ring-1 ring-neutral-700 hover:ring-neutral-500'}
                                    `}
                                    style={{ backgroundColor: frame.bg }}
                                >
                                    {/* Mini preview */}
                                    <div
                                        className="w-full h-full rounded-sm flex flex-col gap-0.5 p-1"
                                        style={{ backgroundColor: frame.borderColor }}
                                    >
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="flex-1 bg-neutral-400 rounded-[1px]" />
                                        ))}
                                    </div>

                                    {selectedFrame === frame.id && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center"
                                        >
                                            <Check size={10} className="text-black" />
                                        </motion.div>
                                    )}
                                </motion.button>
                            ))}
                        </div>
                        <p className="mt-2 text-[10px] text-neutral-500 text-center">{currentFrame.name}</p>
                    </div>

                    {/* Filter Selection */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles size={14} className="text-neutral-400" />
                            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Filter</h3>
                        </div>

                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {filters.map((filter) => (
                                <motion.button
                                    key={filter.id}
                                    onClick={() => setSelectedFilter(filter.id)}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`
                                        flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all
                                        ${selectedFilter === filter.id
                                            ? 'bg-white text-black'
                                            : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'}
                                    `}
                                >
                                    {filter.name}
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Export Actions */}
                    <div className="space-y-3 pt-6 border-t border-neutral-800">

                        {/* Success Message */}
                        <AnimatePresence>
                            {exportSuccess && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-2 text-green-400 text-xs font-bold uppercase tracking-widest justify-center mb-4"
                                >
                                    <Check size={14} />
                                    Saved to Archive!
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Primary Export Button */}
                        <motion.button
                            onClick={handleExport}
                            disabled={isExporting || exportSuccess}
                            whileHover={!isExporting ? { y: -2, scale: 1.02 } : {}}
                            whileTap={!isExporting ? { scale: 0.98 } : {}}
                            className={`
                                w-full py-4 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest transition-all rounded-sm
                                ${isExporting || exportSuccess
                                    ? 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
                                    : 'bg-white text-black hover:bg-neutral-200 shadow-lg shadow-white/10'}
                            `}
                        >
                            {isExporting ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" />
                                    <span>Developing...</span>
                                </>
                            ) : exportSuccess ? (
                                <>
                                    <Check size={14} />
                                    <span>Done!</span>
                                </>
                            ) : (
                                <>
                                    <Download size={14} />
                                    <span>Save & Download</span>
                                </>
                            )}
                        </motion.button>

                        {/* Secondary Actions */}
                        <div className="flex gap-3">
                            <motion.button
                                onClick={handleDownloadOnly}
                                whileHover={{ y: -1 }}
                                className="flex-1 py-3 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition border border-neutral-700 hover:border-neutral-500 rounded-sm"
                            >
                                Download Only
                            </motion.button>
                            <motion.button
                                onClick={() => router.visit('/gallery')}
                                whileHover={{ y: -1 }}
                                className="flex-1 py-3 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition border border-neutral-700 hover:border-neutral-500 rounded-sm flex items-center justify-center gap-2"
                            >
                                Skip
                                <ArrowRight size={12} />
                            </motion.button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
