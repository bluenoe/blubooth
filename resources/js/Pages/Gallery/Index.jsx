import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Trash2, Download, X, ArrowLeft } from 'lucide-react';

export default function Gallery({ auth, photos }) {
    const { flash = {} } = usePage().props;
    const [selectedPhoto, setSelectedPhoto] = useState(null); // State cho Lightbox

    // Hàm xóa ảnh
    const handleDelete = (id) => {
        if (confirm('Permanently remove this capture?')) {
            router.delete(route('gallery.destroy', id), {
                onSuccess: () => setSelectedPhoto(null), // Đóng lightbox nếu đang mở
            });
        }
    };

    // Hàm tải ảnh
    const handleDownload = (path) => {
        const link = document.createElement('a');
        link.href = `/storage/${path}`;
        link.download = `blubooth_archive_${Date.now()}.png`;
        link.click();
    };

    return (
        <AuthenticatedLayout user={auth.user} header={null}>
            <Head title="The Archive" />

            {/* Inject CSS Font */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
                .font-serif { font-family: 'Playfair Display', serif; }
            `}</style>

            <div className="min-h-screen bg-white pb-24">
                
                {/* HEADER: Minimalist */}
                <div className="max-w-7xl mx-auto px-6 pt-12 pb-16 flex flex-col md:flex-row justify-between items-end border-b border-neutral-100">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-400 mb-2">
                            Personal Collection
                        </p>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none">
                            The <span className="font-serif italic font-light text-neutral-400">Archive.</span>
                        </h1>
                    </div>
                    
                    <div className="mt-8 md:mt-0 flex gap-4">
                         <Link 
                            href={route('booth')} 
                            className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:opacity-60 transition"
                        >
                            + New Session
                        </Link>
                    </div>
                </div>

                {/* NOTIFICATION */}
                {flash?.message && (
                    <div className="fixed top-24 right-6 z-40 bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest animate-fade-in-down">
                        {flash.message}
                    </div>
                )}

                {/* GALLERY GRID (THE LOOKBOOK) */}
                <div className="max-w-7xl mx-auto px-6 mt-12">
                    {photos.data.length === 0 ? (
                        <div className="py-32 text-center">
                            <p className="font-serif text-2xl text-neutral-300 italic mb-4">"Silence is luxury."</p>
                            <p className="text-xs text-neutral-400 uppercase tracking-widest">Your archive is empty.</p>
                            <Link 
                                href={route('booth')} 
                                className="mt-8 inline-block px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition rounded-full"
                            >
                                Create First Memory
                            </Link>
                        </div>
                    ) : (
                        // Lưới ảnh sát nhau (Gap 2px)
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-[2px]">
                            {photos.data.map((photo) => (
                                <div 
                                    key={photo.id} 
                                    className="group relative aspect-[4/5] bg-neutral-100 overflow-hidden cursor-zoom-in"
                                    onClick={() => setSelectedPhoto(photo)}
                                >
                                    <img 
                                        src={`/storage/${photo.path}`} 
                                        alt="Archive Item" 
                                        className="w-full h-full object-cover transition duration-700 ease-out group-hover:scale-105 filter grayscale group-hover:grayscale-0"
                                    />
                                    
                                    {/* Overlay khi hover */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                                    
                                    <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition duration-300">
                                        <p className="text-white text-[10px] font-bold uppercase tracking-widest drop-shadow-md">
                                            {new Date(photo.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* PAGINATION (Nếu có nhiều trang) */}
                    {photos.links && photos.links.length > 3 && (
                        <div className="mt-16 flex justify-center gap-2">
                            {photos.links.map((link, key) => (
                                <Link
                                    key={key}
                                    href={link.url}
                                    className={`px-4 py-2 text-xs font-bold border border-neutral-200 transition ${
                                        link.active ? 'bg-black text-white border-black' : 'text-neutral-500 hover:border-black hover:text-black'
                                    } ${!link.url ? 'opacity-50 pointer-events-none' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* LIGHTBOX MODAL (Xem ảnh Full màn hình) */}
            {selectedPhoto && (
                <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-in">
                    
                    {/* Close Button */}
                    <button 
                        onClick={() => setSelectedPhoto(null)}
                        className="absolute top-6 right-6 p-2 text-neutral-400 hover:text-black transition"
                    >
                        <X size={32} />
                    </button>

                    <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        {/* Ảnh */}
                        <div className="relative aspect-[4/5] md:aspect-auto md:h-[80vh] bg-neutral-100 shadow-2xl">
                            <img 
                                src={`/storage/${selectedPhoto.path}`} 
                                className="w-full h-full object-contain md:object-cover" 
                                alt="Detail" 
                            />
                        </div>

                        {/* Info & Actions */}
                        <div className="flex flex-col justify-center space-y-8">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-400 mb-2">
                                    Capture Details
                                </p>
                                <h2 className="text-4xl font-serif italic text-neutral-900">
                                    {new Date(selectedPhoto.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </h2>
                                <p className="text-neutral-500 text-sm mt-2">
                                    {new Date(selectedPhoto.created_at).toLocaleTimeString()}
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 w-full md:w-2/3">
                                <button 
                                    onClick={() => handleDownload(selectedPhoto.path)}
                                    className="w-full py-4 border border-neutral-200 text-neutral-900 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white hover:border-black transition flex items-center justify-center gap-3"
                                >
                                    <Download size={16} />
                                    Download High-Res
                                </button>

                                <button 
                                    onClick={() => handleDelete(selectedPhoto.id)}
                                    className="w-full py-4 text-neutral-400 text-xs font-bold uppercase tracking-widest hover:text-red-600 transition flex items-center justify-center gap-3"
                                >
                                    <Trash2 size={16} />
                                    Delete Permanently
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}