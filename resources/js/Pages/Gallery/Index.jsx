import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Download, X, Camera, ChevronLeft, ChevronRight, Clock, Layers } from 'lucide-react';

export default function Gallery({ auth, photos }) {
    const { flash = {} } = usePage().props;
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // All photos are strips now (filtered at backend)
    const displayedPhotos = photos.data;

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

    // Format date for display
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        }).toUpperCase();
    };

    return (
        <>
            <Head title="The Archive" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
            `}</style>

            <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-black selection:text-white">

                {/* Header */}
                <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-neutral-100">
                    <div className="max-w-7xl mx-auto px-6 py-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                            {/* Title */}
                            <div>
                                <h1 className="text-4xl md:text-5xl font-serif italic tracking-tight text-neutral-900">
                                    The Archive.
                                </h1>
                                <p className="text-neutral-500 text-xs uppercase tracking-widest mt-2">
                                    {displayedPhotos.length} {displayedPhotos.length === 1 ? 'Strip' : 'Strips'} in Your Collection
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-4">
                                <Link
                                    href={route('booth.select')}
                                    className="flex items-center gap-2 px-6 py-3 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-neutral-800 transition"
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
                            className="fixed bottom-6 left-6 z-50 bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest shadow-2xl rounded-full"
                        >
                            {flash.message}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Gallery Content */}
                <main className="max-w-7xl mx-auto px-4 md:px-6 py-12">

                    {displayedPhotos.length === 0 ? (
                        /* Empty State - High Fashion Typography */
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-[60vh] flex flex-col items-center justify-center text-center"
                        >
                            <div className="w-24 h-24 border border-dashed border-neutral-300 rounded-full flex items-center justify-center mb-8">
                                <Layers size={32} className="text-neutral-300" />
                            </div>
                            <p className="font-serif italic text-4xl text-neutral-400 mb-2">
                                The collection is empty.
                            </p>
                            <p className="text-neutral-500 text-sm mb-8">
                                Create your first photo strip to begin.
                            </p>
                            <Link
                                href={route('booth.select')}
                                className="flex items-center gap-2 px-8 py-4 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-neutral-800 transition"
                            >
                                <Camera size={12} />
                                Start Session
                            </Link>
                        </motion.div>
                    ) : (
                        /* Masonry Grid - Shadow Driven */
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-8"
                        >
                            {displayedPhotos.map((photo, index) => (
                                <motion.div
                                    key={photo.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: Math.min(index * 0.05, 0.5) }}
                                    className="break-inside-avoid mb-8 group cursor-pointer"
                                    onClick={() => openLightbox(photo)}
                                >
                                    <div
                                        className="relative overflow-hidden bg-white rounded-sm shadow-lg transition-all duration-500 group-hover:shadow-2xl group-hover:scale-[1.02]"
                                        style={{
                                            boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.15)'
                                        }}
                                    >
                                        <img
                                            src={`/storage/${photo.path}`}
                                            alt="Photo Strip"
                                            loading="lazy"
                                            className="w-full object-contain transition-all duration-500"
                                        />

                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-900 mb-1">View</span>
                                            <span className="text-[9px] uppercase tracking-widest text-neutral-500">
                                                {formatDate(photo.created_at)}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </main>
            </div>

            {/* Immersive Lightbox - White Theme */}
            <AnimatePresence>
                {selectedPhoto && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center"
                    >
                        {/* Backdrop - White Glassmorphism */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-white/95 backdrop-blur-2xl"
                            onClick={closeLightbox}
                        />

                        {/* Content */}
                        <div className="relative z-10 w-full h-full flex flex-col pointer-events-none">

                            {/* Top Bar */}
                            <div className="flex justify-between items-center p-6 pointer-events-auto">
                                <div className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                                    {currentIndex + 1} / {displayedPhotos.length}
                                </div>
                                <motion.button
                                    onClick={closeLightbox}
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    className="p-3 text-neutral-400 hover:text-neutral-900 transition rounded-full hover:bg-neutral-100"
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
                                        className="absolute left-4 md:left-8 p-4 text-neutral-300 hover:text-neutral-900 transition"
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
                                    className="max-w-full max-h-[80vh] object-contain shadow-2xl"
                                    style={{
                                        boxShadow: '0 25px 80px -20px rgba(0, 0, 0, 0.25)'
                                    }}
                                    onLoad={() => setIsLoaded(true)}
                                />

                                {/* Next */}
                                {displayedPhotos.length > 1 && (
                                    <motion.button
                                        onClick={(e) => { e.stopPropagation(); navigatePhoto('next'); }}
                                        whileHover={{ scale: 1.2, x: 5 }}
                                        className="absolute right-4 md:right-8 p-4 text-neutral-300 hover:text-neutral-900 transition"
                                    >
                                        <ChevronRight size={40} strokeWidth={0.5} />
                                    </motion.button>
                                )}
                            </div>

                            {/* Bottom Bar */}
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="p-6 md:p-10 flex flex-col md:flex-row justify-between items-end md:items-center bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-auto"
                            >
                                {/* Date */}
                                <div className="mb-6 md:mb-0">
                                    <h2 className="font-serif italic text-3xl md:text-4xl text-neutral-900">
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
                                        className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition"
                                    >
                                        <Download size={14} />
                                        Download
                                    </motion.button>

                                    <motion.button
                                        onClick={() => handleDelete(selectedPhoto.id)}
                                        whileHover={{ scale: 1.1 }}
                                        className="p-3 border border-neutral-200 rounded-full text-neutral-400 hover:text-red-500 hover:border-red-200 transition"
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