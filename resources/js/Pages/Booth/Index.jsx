import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useRef, useEffect, useState } from 'react';

// Icon bộ icon Lucide (nhẹ và đẹp)
import { Camera, Download, RefreshCw, Save, X } from 'lucide-react';

export default function Booth({ auth, photos }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [photo, setPhoto] = useState(null);
    
    // Flash Message & States
    const { flash = {} } = usePage().props;
    const [processing, setProcessing] = useState(false);
    const [shutterEffect, setShutterEffect] = useState(false); // Hiệu ứng chớp flash

    // --- 1. LOGIC CAMERA (Giữ nguyên, chỉ tối ưu) ---
    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 1920 }, height: { ideal: 1080 }, facingMode: "user" }, // Thử Full HD
                audio: false,
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                videoRef.current.play();
            }
        } catch (err) {
            console.error("Camera Error:", err);
            alert("Please allow camera access to use the studio.");
        }
    };

    const capturePhoto = () => {
        // Hiệu ứng chớp màn hình (Flash)
        setShutterEffect(true);
        setTimeout(() => setShutterEffect(false), 150);

        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            // Set canvas size match video resolution
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            
            // Mirror Effect
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            
            // Draw
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Add subtle filter via JS (Optional - High contrast B&W vibe)
            // ctx.filter = 'grayscale(100%) contrast(1.2)'; 
            
            const imageSrc = canvas.toDataURL('image/png', 1.0); // Max quality
            setPhoto(imageSrc);
        }
    };

    const savePhotoToServer = () => {
        if (!photo) return;
        setProcessing(true);

        router.post(route('booth.store'), {
            image: photo 
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setProcessing(false);
                setPhoto(null); 
                // Auto restart camera is handled by useEffect
            },
            onError: (errors) => {
                setProcessing(false);
                alert('Could not save photo.');
            }
        });
    };

    const downloadPhoto = () => {
        if (photo) {
            const link = document.createElement('a');
            link.href = photo;
            link.download = `blu_booth_${Date.now()}.png`;
            link.click();
        }
    };

    // Lifecycle
    useEffect(() => {
        if (!photo) startCamera();
        return () => {
            if (stream) stream.getTracks().forEach(track => track.stop());
        };
    }, [photo]);

    // --- 2. GIAO DIỆN (THE VISUAL) ---
    return (
        <AuthenticatedLayout
            user={auth.user}
            // Ẩn header mặc định để tự custom cho đẹp
            header={null} 
        >
            <Head title="Studio" />

            <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-black selection:text-white pb-24">
                
                {/* --- HEADER: Minimalist Branding --- */}
                <div className="pt-12 pb-8 px-6 text-center border-b border-neutral-100">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase leading-none">
                        Blu<span className="font-light text-neutral-400">Booth.</span>
                    </h1>
                    <p className="mt-3 text-[10px] font-bold tracking-[0.3em] uppercase text-neutral-400">
                        Editorial Studio Session
                    </p>
                </div>

                {/* --- MAIN STAGE --- */}
                <div className="max-w-7xl mx-auto px-6 mt-12">
                    
                    {/* Notification Toast (Flash Message) */}
                    {flash?.message && (
                        <div className="fixed top-6 right-6 z-50 bg-black text-white px-6 py-4 shadow-2xl flex items-center gap-3 animate-fade-in-down">
                            <span className="text-green-400">●</span>
                            <p className="text-xs font-bold uppercase tracking-widest">{flash.message}</p>
                        </div>
                    )}

                    {/* Canvas ẩn */}
                    <canvas ref={canvasRef} className="hidden"></canvas>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                        
                        {/* --- LEFT: CAMERA VIEWFINDER --- */}
                        <div className="lg:col-span-8">
                            <div className="relative w-full aspect-[4/3] md:aspect-video bg-neutral-100 overflow-hidden shadow-sm group">
                                
                                {/* Shutter Flash Effect */}
                                <div className={`absolute inset-0 bg-white z-30 pointer-events-none transition-opacity duration-150 ${shutterEffect ? 'opacity-100' : 'opacity-0'}`}></div>

                                {photo ? (
                                    // REVIEW MODE
                                    <img src={photo} alt="Session Capture" className="w-full h-full object-cover" />
                                ) : (
                                    // LIVE CAMERA MODE
                                    <video 
                                        ref={videoRef} 
                                        autoPlay 
                                        playsInline 
                                        muted 
                                        className="w-full h-full object-cover transform -scale-x-100 grayscale-[20%] contrast-[1.1]" // Chỉnh màu nhẹ cho giống phim
                                    />
                                )}

                                {/* Overlay Guides (Grid quy tắc 1/3 - Pro Vibe) */}
                                {!photo && (
                                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity duration-500">
                                        <div className="absolute top-1/3 left-0 w-full h-px bg-white/50"></div>
                                        <div className="absolute top-2/3 left-0 w-full h-px bg-white/50"></div>
                                        <div className="absolute left-1/3 top-0 h-full w-px bg-white/50"></div>
                                        <div className="absolute left-2/3 top-0 h-full w-px bg-white/50"></div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* --- RIGHT: CONTROL PANEL --- */}
                        <div className="lg:col-span-4 flex flex-col justify-center h-full space-y-8">
                            
                            <div className="border-l border-neutral-100 pl-8 lg:h-[500px] flex flex-col justify-center">
                                {!photo ? (
                                    // READY TO SHOOT
                                    <div className="space-y-6">
                                        <h2 className="text-3xl font-serif italic text-neutral-900">Ready to capture.</h2>
                                        <p className="text-sm text-neutral-500 font-light leading-relaxed">
                                            Align your subject. Ensure good lighting. Minimal distractions.
                                        </p>
                                        
                                        <button 
                                            onClick={capturePhoto}
                                            className="group relative w-20 h-20 md:w-24 md:h-24 rounded-full border border-neutral-200 flex items-center justify-center hover:border-black transition-all duration-300 mx-auto md:mx-0"
                                        >
                                            <div className="w-16 h-16 md:w-20 md:h-20 bg-black rounded-full group-hover:scale-90 transition-transform duration-200"></div>
                                        </button>
                                        <p className="text-[10px] uppercase tracking-widest text-neutral-400 text-center md:text-left pt-2">Tap to Snap</p>
                                    </div>
                                ) : (
                                    // ACTION MENU (AFTER CAPTURE)
                                    <div className="space-y-6 animate-fade-in">
                                        <h2 className="text-3xl font-serif italic text-neutral-900">Nice shot.</h2>
                                        <div className="flex flex-col gap-3">
                                            <button 
                                                onClick={savePhotoToServer}
                                                disabled={processing}
                                                className="w-full py-4 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition disabled:opacity-50 flex items-center justify-center gap-3"
                                            >
                                                {processing ? (
                                                    <span>Processing...</span>
                                                ) : (
                                                    <>
                                                        <Save size={16} />
                                                        <span>Save to Archive</span>
                                                    </>
                                                )}
                                            </button>

                                            <button 
                                                onClick={downloadPhoto}
                                                className="w-full py-4 border border-neutral-200 text-neutral-900 text-xs font-bold uppercase tracking-widest hover:border-black transition flex items-center justify-center gap-3"
                                            >
                                                <Download size={16} />
                                                <span>Download</span>
                                            </button>

                                            <button 
                                                onClick={() => setPhoto(null)}
                                                className="w-full py-4 text-neutral-400 text-xs font-bold uppercase tracking-widest hover:text-black transition flex items-center justify-center gap-3"
                                            >
                                                <RefreshCw size={16} />
                                                <span>Retake</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* --- GALLERY SECTION (THE ARCHIVE) --- */}
                    <div className="mt-32 border-t border-neutral-100 pt-16">
                        <div className="flex items-end justify-between mb-12">
                            <div>
                                <h3 className="text-2xl md:text-3xl font-bold tracking-tighter">THE ARCHIVE</h3>
                                <p className="text-neutral-500 font-light mt-2">Recent sessions.</p>
                            </div>
                            <span className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-neutral-300">
                                {photos.length} Items
                            </span>
                        </div>

                        {photos.length === 0 ? (
                            <div className="py-20 text-center border border-dashed border-neutral-200 bg-neutral-50/50">
                                <p className="text-neutral-400 text-sm font-light italic">Your collection is empty.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-1">
                                {photos.map((item) => (
                                    <div key={item.id} className="group relative aspect-[4/5] overflow-hidden bg-neutral-100 cursor-pointer">
                                        <img 
                                            src={`/storage/${item.path}`} 
                                            alt="Archive" 
                                            className="w-full h-full object-cover transition duration-700 group-hover:scale-105 filter grayscale group-hover:grayscale-0" 
                                        />
                                        
                                        {/* Overlay Info */}
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                            <p className="text-white text-[10px] uppercase tracking-widest font-bold">
                                                {new Date(item.created_at).toLocaleDateString('en-GB')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}