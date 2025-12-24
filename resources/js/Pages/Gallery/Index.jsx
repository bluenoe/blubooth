import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect, useCallback } from 'react';
import { Trash2, Download, X, Maximize2, Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Gallery({ auth, photos }) {
    const { flash = {} } = usePage().props;
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // --- LOGIC ĐIỀU HƯỚNG ---
    
    // Tìm index của ảnh hiện tại trong danh sách
    const currentIndex = selectedPhoto 
        ? photos.data.findIndex(p => p.id === selectedPhoto.id) 
        : -1;

    // Chuyển ảnh (Next/Prev)
    const navigatePhoto = useCallback((direction) => {
        if (currentIndex === -1) return;
        
        let newIndex;
        const total = photos.data.length;

        if (direction === 'next') {
            newIndex = (currentIndex + 1) % total; // Loop về đầu nếu hết
        } else {
            newIndex = (currentIndex - 1 + total) % total; // Loop về cuối nếu lùi quá
        }

        setIsLoaded(false); // Reset loading state cho ảnh mới
        setSelectedPhoto(photos.data[newIndex]);
    }, [currentIndex, photos.data]);

    // Mở Lightbox
    const openLightbox = (photo) => {
        setSelectedPhoto(photo);
        setIsLoaded(false);
        document.body.style.overflow = 'hidden'; // Khóa cuộn trang
    };

    // Đóng Lightbox
    const closeLightbox = () => {
        setSelectedPhoto(null);
        document.body.style.overflow = 'auto'; // Mở cuộn trang
    };

    const handleDelete = (id) => {
        if (confirm('Permanently delete this memory?')) {
            router.delete(route('gallery.destroy', id), {
                onSuccess: () => closeLightbox(),
            });
        }
    };

    const handleDownload = (path) => {
        const link = document.createElement('a');
        link.href = `/storage/${path}`;
        link.download = `blu_archive_${Date.now()}.png`;
        link.click();
    };

    // --- SỰ KIỆN BÀN PHÍM (Keyboard Events) ---
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
        <AuthenticatedLayout user={auth.user} header={null}>
            <Head title="Archive" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
                .font-serif { font-family: 'Playfair Display', serif; }
                
                /* Animation Fade khi đổi ảnh */
                @keyframes fadeInImg { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
                .animate-fade-img { animation: fadeInImg 0.4s ease-out forwards; }
            `}</style>

            <div className="min-h-screen bg-white pb-24">
                
                {/* --- HEADER --- */}
                <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-neutral-100 transition-all">
                    <div className="max-w-[1600px] mx-auto px-6 py-6 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-bold tracking-tighter uppercase">
                                The <span className="font-serif italic font-light text-neutral-400">Archive.</span>
                            </h1>
                            <span className="hidden md:inline-block px-3 py-1 bg-neutral-100 text-[10px] font-bold uppercase tracking-widest rounded-full text-neutral-500">
                                {photos.data.length} Items
                            </span>
                        </div>
                        <Link href={route('booth')} className="text-xs font-bold uppercase tracking-widest hover:text-neutral-500 transition">+ New Session</Link>
                    </div>
                </div>

                {/* --- NOTIFICATION --- */}
                {flash?.message && (
                    <div className="fixed bottom-6 left-6 z-40 bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest shadow-xl rounded-full animate-pulse">
                        {flash.message}
                    </div>
                )}

                {/* --- GRID GALLERY --- */}
                <div className="max-w-[1600px] mx-auto px-4 md:px-6 mt-8">
                    {photos.data.length === 0 ? (
                        <div className="h-[60vh] flex flex-col items-center justify-center opacity-40">
                            <p className="font-serif text-3xl text-neutral-300 italic mb-4">"Silence is luxury."</p>
                            <Link href={route('booth')} className="text-xs font-bold uppercase border-b border-black pb-1 hover:opacity-60 transition">Start Creating</Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-1">
                            {photos.data.map((photo) => (
                                <div 
                                    key={photo.id} 
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
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* --- IMMERSIVE LIGHTBOX (DARKROOM MODE) --- */}
            {selectedPhoto && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    
                    {/* 1. LAYER BACKDROP (Riêng biệt để đảm bảo đen thui) */}
                    <div 
                        className="absolute inset-0 bg-black/95 backdrop-blur-xl transition-opacity duration-300"
                        onClick={closeLightbox}
                    ></div>

                    {/* 2. LAYER CONTENT */}
                    <div className="relative z-10 w-full h-full flex flex-col justify-between pointer-events-none">
                        
                        {/* Header Controls (Close) */}
                        <div className="flex justify-end p-6 pointer-events-auto">
                            <button 
                                onClick={closeLightbox}
                                className="group p-3 text-white/50 hover:text-white transition rounded-full hover:bg-white/10"
                            >
                                <X size={24} strokeWidth={1} className="group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                        </div>

                        {/* MAIN IMAGE AREA */}
                        <div className="flex-1 flex items-center justify-center relative px-4 md:px-20 pointer-events-auto">
                            
                            {/* Nút Previous */}
                            <button 
                                onClick={(e) => { e.stopPropagation(); navigatePhoto('prev'); }}
                                className="absolute left-4 md:left-8 p-4 text-white/30 hover:text-white transition hover:scale-110 hidden md:block"
                            >
                                <ChevronLeft size={40} strokeWidth={0.5} />
                            </button>

                            {/* ẢNH CHÍNH */}
                            <img 
                                key={selectedPhoto.id} // Key thay đổi để trigger animation
                                src={`/storage/${selectedPhoto.path}`} 
                                alt="Full View" 
                                className={`max-h-[75vh] max-w-full object-contain shadow-2xl animate-fade-img ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                                onLoad={() => setIsLoaded(true)}
                            />

                            {/* Nút Next */}
                            <button 
                                onClick={(e) => { e.stopPropagation(); navigatePhoto('next'); }}
                                className="absolute right-4 md:right-8 p-4 text-white/30 hover:text-white transition hover:scale-110 hidden md:block"
                            >
                                <ChevronRight size={40} strokeWidth={0.5} />
                            </button>
                        </div>

                        {/* FOOTER INFO BAR */}
                        <div className="w-full p-6 md:p-10 flex flex-col md:flex-row justify-between items-end md:items-center bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-auto">
                            
                            {/* Info */}
                            <div className="text-white mb-6 md:mb-0">
                                <h2 className="font-serif italic text-3xl md:text-4xl text-white/90">
                                    {new Date(selectedPhoto.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                                </h2>
                                <div className="flex items-center gap-4 mt-2 text-white/50 text-xs font-bold uppercase tracking-widest">
                                    <span className="flex items-center gap-1"><Clock size={12} /> {new Date(selectedPhoto.created_at).toLocaleTimeString([], {timeStyle: 'short'})}</span>
                                    <span className="w-px h-3 bg-white/30"></span>
                                    <span>{currentIndex + 1} / {photos.data.length}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => handleDownload(selectedPhoto.path)}
                                    className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition transform hover:-translate-y-1"
                                >
                                    <Download size={14} />
                                    <span className="hidden md:inline">Save</span>
                                </button>

                                <button 
                                    onClick={() => handleDelete(selectedPhoto.id)}
                                    className="p-3 border border-white/20 rounded-full text-white/50 hover:text-red-400 hover:border-red-400/50 hover:bg-red-900/10 transition"
                                    title="Delete"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}