import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Trash2, Download, X, Maximize2, Share2, Calendar } from 'lucide-react';

export default function Gallery({ auth, photos }) {
    const { flash = {} } = usePage().props;
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);

    // --- LOGIC XỬ LÝ ---
    const openLightbox = (photo) => {
        setIsAnimating(true);
        setSelectedPhoto(photo);
    };

    const closeLightbox = () => {
        setIsAnimating(false); // Trigger animation đóng (nếu muốn làm kỹ hơn)
        setTimeout(() => setSelectedPhoto(null), 200); // Đợi animation tắt
    };

    const handleDelete = (id) => {
        if (confirm('Delete this memory permanently?')) {
            router.delete(route('gallery.destroy', id), {
                onSuccess: () => setSelectedPhoto(null),
            });
        }
    };

    const handleDownload = (path) => {
        const link = document.createElement('a');
        link.href = `/storage/${path}`;
        link.download = `blu_archive_${Date.now()}.png`;
        link.click();
    };

    // Đóng bằng phím ESC
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') closeLightbox();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    return (
        <AuthenticatedLayout user={auth.user} header={null}>
            <Head title="Archive" />

            {/* --- CUSTOM STYLES & ANIMATIONS --- */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
                .font-serif { font-family: 'Playfair Display', serif; }
                
                /* Animation cho Lightbox */
                @keyframes zoomIn {
                    from { opacity: 0; transform: scale(0.95) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-enter { animation: zoomIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                
                /* Ẩn scrollbar khi mở modal */
                .no-scroll { overflow: hidden; }
            `}</style>

            <div className={`min-h-screen bg-white pb-24 ${selectedPhoto ? 'h-screen overflow-hidden' : ''}`}>
                
                {/* --- HEADER: EDITORIAL STYLE --- */}
                <div className="max-w-[1600px] mx-auto px-6 pt-16 pb-12 flex flex-col md:flex-row justify-between items-end border-b border-neutral-100 sticky top-0 bg-white/90 backdrop-blur-md z-30 transition-all">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="h-px w-8 bg-neutral-900"></span>
                            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-400">
                                Curated Collection
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none text-neutral-900">
                            The <span className="font-serif italic font-light text-neutral-400">Archive.</span>
                        </h1>
                    </div>
                    
                    <div className="mt-8 md:mt-0 flex items-center gap-6">
                        <div className="text-right hidden md:block">
                            <p className="text-2xl font-serif italic text-neutral-900">{photos.data.length}</p>
                            <p className="text-[10px] uppercase tracking-widest text-neutral-400">Memories</p>
                        </div>
                        <Link 
                            href={route('booth')} 
                            className="group relative px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-full overflow-hidden hover:shadow-xl transition-all duration-300"
                        >
                            <span className="relative z-10 group-hover:text-white transition-colors">Create New</span>
                            <div className="absolute inset-0 bg-neutral-800 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                        </Link>
                    </div>
                </div>

                {/* --- NOTIFICATION --- */}
                {flash?.message && (
                    <div className="fixed top-24 right-6 z-40 bg-white border border-neutral-200 shadow-xl px-6 py-4 flex items-center gap-3 animate-enter">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <p className="text-xs font-bold uppercase tracking-widest text-neutral-900">{flash.message}</p>
                    </div>
                )}

                {/* --- GRID GALLERY (MASONRY LOOK) --- */}
                <div className="max-w-[1600px] mx-auto px-4 md:px-6 mt-12">
                    {photos.data.length === 0 ? (
                        <div className="py-40 text-center flex flex-col items-center justify-center opacity-50">
                            <div className="w-16 h-16 border border-neutral-200 rounded-full flex items-center justify-center mb-6">
                                <Camera className="text-neutral-300" />
                            </div>
                            <p className="font-serif text-2xl text-neutral-400 italic mb-2">"Empty spaces await stories."</p>
                        </div>
                    ) : (
                        // Grid Layout: 2 cột mobile, 4 cột desktop. Gap nhỏ (4px)
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-4">
                            {photos.data.map((photo, index) => (
                                <div 
                                    key={photo.id} 
                                    className="group relative cursor-pointer overflow-hidden bg-neutral-100"
                                    onClick={() => openLightbox(photo)}
                                >
                                    {/* Wrapper để tạo tỉ lệ ảnh chuẩn (Aspect Ratio 4:5 hoặc Auto) */}
                                    <div className="relative aspect-[4/5] overflow-hidden">
                                        <img 
                                            src={`/storage/${photo.path}`} 
                                            alt="Archive" 
                                            loading="lazy"
                                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:brightness-110"
                                        />
                                        
                                        {/* Overlay khi hover - Minimalist */}
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                <Maximize2 size={18} />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Metadata nhỏ dưới ảnh */}
                                    <div className="mt-2 px-1 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                        <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold">
                                            {new Date(photo.created_at).toLocaleDateString('en-GB')}
                                        </span>
                                        <span className="text-[9px] uppercase tracking-widest text-neutral-300">
                                            IMG_{photo.id}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* --- LIGHTBOX MODAL (THE MODERN FRAME) --- */}
            {selectedPhoto && (
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
                    onClick={closeLightbox} // Click ra ngoài thì đóng
                >
                    {/* Backdrop Blur Layer */}
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-2xl transition-opacity duration-300"></div>

                    {/* Main Content Container */}
                    <div 
                        className="relative z-10 w-full max-w-6xl h-full max-h-[90vh] flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 animate-enter"
                        onClick={(e) => e.stopPropagation()} // Chặn click đóng khi bấm vào nội dung
                    >
                        
                        {/* 1. IMAGE FRAME (Tạo cảm giác ảnh in) */}
                        <div className="relative group shadow-2xl shadow-neutral-200/50">
                            {/* Viền trắng dày (Matte Border) */}
                            <div className="bg-white p-2 md:p-4 rounded-sm">
                                <img 
                                    src={`/storage/${selectedPhoto.path}`} 
                                    alt="Detail" 
                                    className="max-h-[70vh] md:max-h-[80vh] w-auto object-contain bg-neutral-50"
                                />
                            </div>
                            
                            {/* Info góc ảnh (Giống watermark film) */}
                            <div className="absolute bottom-6 right-6 mix-blend-difference text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                <p className="font-serif italic text-sm">BluBooth Archive</p>
                            </div>
                        </div>

                        {/* 2. CONTROLS (Tách biệt, Minimalist) */}
                        <div className="flex flex-row md:flex-col gap-4 md:gap-8 items-center md:items-start min-w-[200px]">
                            
                            {/* Metadata */}
                            <div className="text-center md:text-left hidden md:block">
                                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-400 mb-2">Captured On</p>
                                <div className="flex items-center gap-2 text-neutral-900">
                                    <Calendar size={14} className="text-neutral-400" />
                                    <span className="text-lg font-serif italic">
                                        {new Date(selectedPhoto.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </span>
                                </div>
                                <p className="text-xs text-neutral-400 mt-1 pl-6">
                                    {new Date(selectedPhoto.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </p>
                            </div>

                            <div className="w-12 h-px bg-neutral-200 hidden md:block"></div>

                            {/* Action Buttons */}
                            <div className="flex md:flex-col gap-3">
                                <button 
                                    onClick={() => handleDownload(selectedPhoto.path)}
                                    className="flex items-center gap-3 px-6 py-3 bg-neutral-900 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-neutral-700 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                >
                                    <Download size={14} />
                                    <span>Save</span>
                                </button>

                                <button 
                                    onClick={() => handleDelete(selectedPhoto.id)}
                                    className="flex items-center gap-3 px-6 py-3 bg-white border border-neutral-200 text-neutral-500 rounded-full text-xs font-bold uppercase tracking-widest hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition"
                                >
                                    <Trash2 size={14} />
                                    <span>Delete</span>
                                </button>
                            </div>
                        </div>

                        {/* Close Button (Floating) */}
                        <button 
                            onClick={closeLightbox}
                            className="absolute top-0 right-0 md:-top-4 md:-right-4 p-3 bg-white rounded-full shadow-lg text-neutral-400 hover:text-black hover:rotate-90 transition-all duration-300 z-50"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}