import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Download, X, Maximize2, Clock, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import NavBar from '@/Components/NavBar';
import Footer from '@/Components/Footer';

export default function Gallery({ auth, photos }) {
    const { flash = {} } = usePage().props;
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Find current photo index
    const currentIndex = selectedPhoto
        ? photos.data.findIndex(p => p.id === selectedPhoto.id)
        : -1;

    // Navigate between photos
    const navigatePhoto = useCallback((direction) => {
        if (currentIndex === -1) return;

        const total = photos.data.length;
        let newIndex;

        if (direction === 'next') {
            newIndex = (currentIndex + 1) % total;
        } else {
            newIndex = (currentIndex - 1 + total) % total;
        }

        setIsLoaded(false);
        setSelectedPhoto(photos.data[newIndex]);
    }, [currentIndex, photos.data]);

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
        if (confirm('Permanently delete this memory?')) {
            router.delete(route('gallery.destroy', id), {
                onSuccess: () => closeLightbox(),
            });
        }
    };

    // Download photo
    const handleDownload = (path) => {
        const link = document.createElement('a');
        link.href = `/storage/${path}`;
        link.download = `blu_archive_${Date.now()}.png`;
        link.click();
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!selectedPhoto) return;

            switch (e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowRight':
                    navigatePhoto('next');
                    break;
                case 'ArrowLeft':
                    navigatePhoto('prev');
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedPhoto, navigatePhoto]);

    return (
        <>
            <Head title="Archive" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
            `}</style>

            <div className="min-h-screen bg-white font-sans selection:bg-black selection:text-white flex flex-col">

                <NavBar />

                <main className="flex-grow pt-24 pb-24">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="sticky top-24 z-30 bg-white/80 backdrop-blur-lg border-b border-neutral-100"
                    >
                        <div className="max-w-[1600px] mx-auto px-6 py-6 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <h1 className="text-2xl font-bold tracking-tighter uppercase">
                                    The <span className="font-serif italic font-normal text-neutral-400">Archive.</span>
                                </h1>
                                <span className="hidden md:inline-block px-3 py-1 bg-neutral-100 text-[10px] font-bold uppercase tracking-widest rounded-full text-neutral-500">
                                    {photos.data.length} Items
                                </span>
                            </div>
                            <Link
                                href={route('booth')}
                                className="text-xs font-bold uppercase tracking-widest hover:text-neutral-500 transition flex items-center gap-2"
                            >
                                <Camera size={14} />
                                New Session
                            </Link>
                        </div>
                    </motion.div>

                    {/* Flash Notification */}
                    <AnimatePresence>
                        {flash?.message && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="fixed bottom-6 left-6 z-40 bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest shadow-xl rounded-full"
                            >
                                {flash.message}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Gallery Grid */}
                    <div className="max-w-[1600px] mx-auto px-4 md:px-6 mt-8">
                        {photos.data.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-[60vh] flex flex-col items-center justify-center opacity-40"
                            >
                                <p className="font-serif text-3xl text-neutral-300 italic mb-4">"Silence is luxury."</p>
                                <Link
                                    href={route('booth')}
                                    className="text-xs font-bold uppercase border-b border-black pb-1 hover:opacity-60 transition"
                                >
                                    Start Creating
                                </Link>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-1"
                            >
                                {photos.data.map((photo, index) => (
                                    <motion.div
                                        key={photo.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        whileHover={{ scale: 1.02 }}
                                        className="group relative aspect-[4/5] bg-neutral-100 cursor-pointer overflow-hidden"
                                        onClick={() => openLightbox(photo)}
                                    >
                                        <img
                                            src={`/storage/${photo.path}`}
                                            alt="Memory"
                                            loading="lazy"
                                            className="w-full h-full object-cover transition duration-700 group-hover:scale-105 filter grayscale group-hover:grayscale-0"
                                        />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <Maximize2 className="text-white drop-shadow-md w-6 h-6" strokeWidth={1.5} />
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </main>

                <Footer />
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

                        {/* Content Layer */}
                        <div className="relative z-10 w-full h-full flex flex-col justify-between pointer-events-none">

                            {/* Close Button */}
                            <div className="flex justify-end p-6 pointer-events-auto">
                                <motion.button
                                    onClick={closeLightbox}
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="group p-3 text-white/50 hover:text-white transition rounded-full hover:bg-white/10"
                                >
                                    <X size={24} strokeWidth={1} />
                                </motion.button>
                            </div>

                            {/* Main Image Area */}
                            <div className="flex-1 flex items-center justify-center relative px-4 md:px-20 pointer-events-auto">

                                {/* Previous Button */}
                                <motion.button
                                    onClick={(e) => { e.stopPropagation(); navigatePhoto('prev'); }}
                                    whileHover={{ scale: 1.2, x: -5 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="absolute left-4 md:left-8 p-4 text-white/30 hover:text-white transition hidden md:block"
                                >
                                    <ChevronLeft size={40} strokeWidth={0.5} />
                                </motion.button>

                                {/* Main Image */}
                                <motion.img
                                    key={selectedPhoto.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.95 }}
                                    transition={{ duration: 0.3 }}
                                    src={`/storage/${selectedPhoto.path}`}
                                    alt="Full View"
                                    className="max-h-[75vh] max-w-full object-contain shadow-2xl"
                                    onLoad={() => setIsLoaded(true)}
                                />

                                {/* Next Button */}
                                <motion.button
                                    onClick={(e) => { e.stopPropagation(); navigatePhoto('next'); }}
                                    whileHover={{ scale: 1.2, x: 5 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="absolute right-4 md:right-8 p-4 text-white/30 hover:text-white transition hidden md:block"
                                >
                                    <ChevronRight size={40} strokeWidth={0.5} />
                                </motion.button>
                            </div>

                            {/* Footer Info Bar */}
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="w-full p-6 md:p-10 flex flex-col md:flex-row justify-between items-end md:items-center bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-auto"
                            >
                                {/* Date Info */}
                                <div className="text-white mb-6 md:mb-0">
                                    <h2 className="font-serif italic text-3xl md:text-4xl text-white/90">
                                        {new Date(selectedPhoto.created_at).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </h2>
                                    <div className="flex items-center gap-4 mt-2 text-white/50 text-xs font-bold uppercase tracking-widest">
                                        <span className="flex items-center gap-1">
                                            <Clock size={12} />
                                            {new Date(selectedPhoto.created_at).toLocaleTimeString([], { timeStyle: 'short' })}
                                        </span>
                                        <span className="w-px h-3 bg-white/30" />
                                        <span>{currentIndex + 1} / {photos.data.length}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-4">
                                    <motion.button
                                        onClick={() => handleDownload(selectedPhoto.path)}
                                        whileHover={{ y: -2, scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition"
                                    >
                                        <Download size={14} />
                                        <span className="hidden md:inline">Save</span>
                                    </motion.button>

                                    <motion.button
                                        onClick={() => handleDelete(selectedPhoto.id)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-3 border border-white/20 rounded-full text-white/50 hover:text-red-400 hover:border-red-400/50 hover:bg-red-900/10 transition"
                                        title="Delete"
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