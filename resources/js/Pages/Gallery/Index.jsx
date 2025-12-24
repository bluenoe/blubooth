import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Download, X, Camera, ChevronLeft, ChevronRight, Clock, Layers, Image } from 'lucide-react';

export default function Gallery({ auth, photos }) {
    const { flash = {} } = usePage().props;
    const [activeTab, setActiveTab] = useState('strips');
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Filter photos by type
    const strips = photos.data.filter(p => p.type === 'strip' || p.path?.includes('strip_'));
    const snapshots = photos.data.filter(p => p.type === 'raw' || (!p.path?.includes('strip_') && p.type !== 'strip'));

    const displayedPhotos = activeTab === 'strips' ? strips : snapshots;

    // Find current index
    const currentIndex = selectedPhoto
        ? displayedPhotos.findIndex(p => p.id === selectedPhoto.id)
        : -1;

    // Navigate photos
    const navigatePhoto = useCallback((direction) => {
        if (currentIndex === -1 || displayedPhotos.length === 0) return;

        const total = displayedPhotos.length;
        let newIndex = direction === 'next'
            ? (currentIndex + 1) % total
            : (currentIndex - 1 + total) % total;

        setIsLoaded(false);
        setSelectedPhoto(displayedPhotos[newIndex]);
    }, [currentIndex, displayedPhotos]);

    // Open lightbox
    const openLightbox = (photo) => {
        setSelectedPhoto(photo);
        setIsLoaded(false);
        document.body.style.overflow = 'hidden';
    };

    // Close lightbox
    const closeLightbox = () => {
        setSelectedPhoto(null);
        document.body.style.overflow = 'auto';
    };

    // Delete photo
    const handleDelete = (id) => {
        if (confirm('Permanently delete this from the archive?')) {
            router.delete(route('gallery.destroy', id), {
                onSuccess: () => closeLightbox(),
            });
        }
    };

    // Download photo
    const handleDownload = (path) => {
        const link = document.createElement('a');
        link.href = `/storage/${path}`;
        link.download = `blubooth_${Date.now()}.png`;
        link.click();
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!selectedPhoto) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') navigatePhoto('next');
            if (e.key === 'ArrowLeft') navigatePhoto('prev');
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedPhoto, navigatePhoto]);

    return (
        <>
            <Head title="The Archive" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
            `}</style>

            <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-white selection:text-black">

                {/* Header */}
                <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-lg border-b border-neutral-800">
                    <div className="max-w-7xl mx-auto px-6 py-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                            {/* Title */}
                            <div>
                                <h1 className="text-4xl md:text-5xl font-serif italic tracking-tight">
                                    The Archive.
                                </h1>
                                <p className="text-neutral-500 text-xs uppercase tracking-widest mt-2">
                                    {photos.data.length} Memories • {strips.length} Strips • {snapshots.length} Snapshots
                                </p>
                            </div>

                            {/* Actions + Tabs */}
                            <div className="flex items-center gap-6">

                                {/* Tabs */}
                                <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-full">
                                    <button
                                        onClick={() => setActiveTab('strips')}
                                        className={`
                                            flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all
                                            ${activeTab === 'strips'
                                                ? 'bg-white text-black'
                                                : 'text-neutral-400 hover:text-white'}
                                        `}
                                    >
                                        <Layers size={12} />
                                        Strips
                                        <span className="ml-1 opacity-50">({strips.length})</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('snapshots')}
                                        className={`
                                            flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all
                                            ${activeTab === 'snapshots'
                                                ? 'bg-white text-black'
                                                : 'text-neutral-400 hover:text-white'}
                                        `}
                                    >
                                        <Image size={12} />
                                        Snapshots
                                        <span className="ml-1 opacity-50">({snapshots.length})</span>
                                    </button>
                                </div>

                                {/* New Session */}
                                <Link
                                    href={route('booth.select')}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-neutral-200 transition"
                                >
                                    <Camera size={12} />
                                    New Session
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Flash Message */}
                <AnimatePresence>
                    {flash?.message && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="fixed bottom-6 left-6 z-50 bg-white text-black px-6 py-3 text-xs font-bold uppercase tracking-widest shadow-2xl rounded-full"
                        >
                            {flash.message}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Gallery Content */}
                <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">

                    {displayedPhotos.length === 0 ? (
                        /* Empty State */
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-[60vh] flex flex-col items-center justify-center text-center"
                        >
                            <div className="w-24 h-24 border border-dashed border-neutral-700 rounded-full flex items-center justify-center mb-8">
                                {activeTab === 'strips' ? <Layers size={32} className="text-neutral-600" /> : <Image size={32} className="text-neutral-600" />}
                            </div>
                            <p className="font-serif italic text-3xl text-neutral-500 mb-4">
                                {activeTab === 'strips' ? '"No strips developed yet."' : '"No snapshots captured yet."'}
                            </p>
                            <Link
                                href={route('booth.select')}
                                className="text-[10px] font-bold uppercase tracking-widest border-b border-white pb-1 hover:opacity-60 transition"
                            >
                                Start Creating →
                            </Link>
                        </motion.div>
                    ) : (
                        /* Masonry Grid */
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`
                                ${activeTab === 'strips'
                                    ? 'columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4'
                                    : 'columns-2 md:columns-3 lg:columns-4 gap-3'}
                            `}
                        >
                            {displayedPhotos.map((photo, index) => (
                                <motion.div
                                    key={photo.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: Math.min(index * 0.05, 0.5) }}
                                    className="break-inside-avoid mb-4 group cursor-pointer"
                                    onClick={() => openLightbox(photo)}
                                >
                                    <div className="relative overflow-hidden bg-neutral-900 rounded-sm">
                                        <img
                                            src={`/storage/${photo.path}`}
                                            alt="Memory"
                                            loading="lazy"
                                            className={`
                                                w-full transition-all duration-500 
                                                group-hover:scale-105 group-hover:opacity-80
                                                ${activeTab === 'strips' ? 'object-contain' : 'object-cover aspect-[4/5]'}
                                            `}
                                        />

                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-white">View</span>
                                        </div>

                                        {/* Type Badge (for debugging/visibility) */}
                                        {activeTab === 'strips' && (
                                            <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-[8px] font-bold uppercase tracking-widest rounded">
                                                Strip
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </main>
            </div>

            {/* Immersive Lightbox */}
            <AnimatePresence>
                {selectedPhoto && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center"
                    >
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
                            onClick={closeLightbox}
                        />

                        {/* Content */}
                        <div className="relative z-10 w-full h-full flex flex-col pointer-events-none">

                            {/* Top Bar */}
                            <div className="flex justify-between items-center p-6 pointer-events-auto">
                                <div className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                                    {currentIndex + 1} / {displayedPhotos.length}
                                </div>
                                <motion.button
                                    onClick={closeLightbox}
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    className="p-3 text-neutral-400 hover:text-white transition rounded-full hover:bg-white/10"
                                >
                                    <X size={24} strokeWidth={1} />
                                </motion.button>
                            </div>

                            {/* Image Area */}
                            <div className="flex-1 flex items-center justify-center relative px-4 md:px-20 pointer-events-auto">

                                {/* Prev */}
                                {displayedPhotos.length > 1 && (
                                    <motion.button
                                        onClick={(e) => { e.stopPropagation(); navigatePhoto('prev'); }}
                                        whileHover={{ scale: 1.2, x: -5 }}
                                        className="absolute left-4 md:left-8 p-4 text-neutral-600 hover:text-white transition"
                                    >
                                        <ChevronLeft size={40} strokeWidth={0.5} />
                                    </motion.button>
                                )}

                                {/* Image */}
                                <motion.img
                                    key={selectedPhoto.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.95 }}
                                    src={`/storage/${selectedPhoto.path}`}
                                    alt="Full View"
                                    className={`
                                        max-w-full shadow-2xl
                                        ${activeTab === 'strips' ? 'max-h-[80vh] object-contain' : 'max-h-[75vh] object-contain'}
                                    `}
                                    onLoad={() => setIsLoaded(true)}
                                />

                                {/* Next */}
                                {displayedPhotos.length > 1 && (
                                    <motion.button
                                        onClick={(e) => { e.stopPropagation(); navigatePhoto('next'); }}
                                        whileHover={{ scale: 1.2, x: 5 }}
                                        className="absolute right-4 md:right-8 p-4 text-neutral-600 hover:text-white transition"
                                    >
                                        <ChevronRight size={40} strokeWidth={0.5} />
                                    </motion.button>
                                )}
                            </div>

                            {/* Bottom Bar */}
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="p-6 md:p-10 flex flex-col md:flex-row justify-between items-end md:items-center bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-auto"
                            >
                                {/* Date */}
                                <div className="mb-6 md:mb-0">
                                    <h2 className="font-serif italic text-3xl md:text-4xl text-white/90">
                                        {new Date(selectedPhoto.created_at).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </h2>
                                    <div className="flex items-center gap-3 mt-2 text-neutral-500 text-xs uppercase tracking-widest">
                                        <Clock size={12} />
                                        {new Date(selectedPhoto.created_at).toLocaleTimeString([], { timeStyle: 'short' })}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-3">
                                    <motion.button
                                        onClick={() => handleDownload(selectedPhoto.path)}
                                        whileHover={{ y: -2, scale: 1.02 }}
                                        className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition"
                                    >
                                        <Download size={14} />
                                        Download
                                    </motion.button>

                                    <motion.button
                                        onClick={() => handleDelete(selectedPhoto.id)}
                                        whileHover={{ scale: 1.1 }}
                                        className="p-3 border border-neutral-700 rounded-full text-neutral-400 hover:text-red-400 hover:border-red-400/50 transition"
                                    >
                                        <Trash2 size={18} />
                                    </motion.button>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}