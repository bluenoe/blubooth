import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useRef, useEffect, useState } from 'react';
import { Camera, Download, RefreshCw, ArrowRight, Check } from 'lucide-react';

export default function Booth({ auth }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);

    // 1. Lấy Config từ trang chọn Layout (Mặc định là 4 ảnh nếu không có)
    const [layoutConfig] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('blu_session_layout');
            return saved ? JSON.parse(saved) : { key: 'strip_4', frames: 4, name: 'Cinema' };
        }
        return { key: 'strip_4', frames: 4, name: 'Cinema' };
    });

    // 2. State quản lý danh sách ảnh
    // Tạo mảng rỗng có độ dài bằng số frames (vd: [null, null, null, null])
    const [photos, setPhotos] = useState(Array(layoutConfig.frames).fill(null));

    // 3. State xác định đang chụp cho ô nào (Mặc định là ô 0)
    const [activeFrameIndex, setActiveFrameIndex] = useState(0);
    const [countdown, setCountdown] = useState(null);
    const [isFlashing, setIsFlashing] = useState(false);

    // --- KHỞI ĐỘNG CAMERA ---
    useEffect(() => {
        let mediaStream = null;
        const startCamera = async () => {
            try {
                mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
                    audio: false,
                });
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                    videoRef.current.play();
                }
            } catch (err) {
                console.error("Camera Error:", err);
                alert("Không thể mở camera. Vui lòng cấp quyền truy cập!");
            }
        };

        startCamera();

        return () => {
            if (mediaStream) mediaStream.getTracks().forEach(track => track.stop());
        };
    }, []);

    // --- HÀM CHỤP ẢNH ---
    const capturePhoto = () => {
        // 1. Hiệu ứng đếm ngược (Optional - ở đây làm nhanh nên bỏ qua đếm ngược dài)
        setIsFlashing(true);
        setTimeout(() => setIsFlashing(false), 150);

        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (video && canvas) {
            // Setup Canvas
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');

            // Lật ảnh gương (Mirror)
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Lấy dữ liệu ảnh
            const imageSrc = canvas.toDataURL('image/jpeg', 0.9);

            // Cập nhật vào mảng Photos tại vị trí activeFrameIndex
            const newPhotos = [...photos];
            newPhotos[activeFrameIndex] = imageSrc;
            setPhotos(newPhotos);

            // Tự động chuyển sang ô trống tiếp theo (nếu có)
            const nextEmptyIndex = newPhotos.findIndex(p => p === null);
            if (nextEmptyIndex !== -1) {
                setActiveFrameIndex(nextEmptyIndex);
            } else {
                // Nếu đã chụp full, bỏ focus (để user tự chọn nếu muốn chụp lại)
                setActiveFrameIndex(-1);
            }
        }
    };

    // --- XỬ LÝ LƯU (FINISH) ---
    const handleFinish = () => {
        if (photos.includes(null)) {
            if (!confirm('Bạn chưa chụp đủ số tấm ảnh. Vẫn muốn lưu chứ?')) return;
        }

        // Gửi toàn bộ mảng ảnh lên Server (Bà cần update Controller để nhận mảng này sau)
        // Hiện tại tạm thời lưu ảnh đầu tiên hoặc xử lý logic ghép ảnh (sẽ làm ở Phase sau)
        // Demo: Redirect về trang Gallery
        router.visit('/gallery');
    };

    // Kiểm tra đã chụp đủ ảnh chưa
    const isFull = !photos.includes(null);

    return (
        <AuthenticatedLayout user={auth.user} header={null}>
            <Head title="Capture Session" />

            {/* Font Import */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
                .font-serif { font-family: 'Playfair Display', serif; }
            `}</style>

            <div className="min-h-screen bg-neutral-900 text-white flex flex-col md:flex-row overflow-hidden">

                {/* --- LEFT: LIVE CAMERA --- */}
                <div className="flex-1 relative flex flex-col items-center justify-center p-6 bg-black">

                    {/* Header nhỏ */}
                    <div className="absolute top-6 left-6 z-20">
                        <h1 className="text-2xl font-bold tracking-tighter uppercase">
                            Blu<span className="font-serif italic font-light text-neutral-400">Booth.</span>
                        </h1>
                        <p className="text-[10px] uppercase tracking-widest text-neutral-500 mt-1">
                            Session: {layoutConfig.name}
                        </p>
                    </div>

                    {/* Camera Viewport */}
                    <div className="relative w-full max-w-4xl aspect-video bg-neutral-800 rounded-sm overflow-hidden shadow-2xl ring-1 ring-neutral-700">
                        {/* Flash Effect */}
                        <div className={`absolute inset-0 bg-white z-50 pointer-events-none transition-opacity duration-75 ${isFlashing ? 'opacity-100' : 'opacity-0'}`}></div>

                        {/* Status Overlay */}
                        <div className="absolute top-4 right-4 z-10">
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/90 text-white text-[10px] font-bold uppercase tracking-widest rounded-full animate-pulse">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                Live Rec
                            </span>
                        </div>

                        {activeFrameIndex !== -1 ? (
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover transform -scale-x-100"
                            />
                        ) : (
                            // Màn hình chờ khi đã chụp xong hết
                            <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 text-neutral-500">
                                <Check size={48} className="mb-4 text-green-500" />
                                <p className="font-serif text-2xl italic text-white">Session Complete</p>
                                <p className="text-xs uppercase tracking-widest mt-2">Tap a photo on the right to retake</p>
                            </div>
                        )}

                        {/* Guides */}
                        <div className="absolute inset-0 pointer-events-none opacity-20">
                            <div className="absolute top-1/2 left-0 w-full h-px bg-white"></div>
                            <div className="absolute left-1/2 top-0 h-full w-px bg-white"></div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="mt-8 flex items-center gap-8">
                        {activeFrameIndex !== -1 && (
                            <button
                                onClick={capturePhoto}
                                className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center hover:bg-white/10 transition-all active:scale-95 group"
                            >
                                <div className="w-16 h-16 bg-white rounded-full group-hover:scale-90 transition-transform"></div>
                            </button>
                        )}
                    </div>

                    {/* Helper Text */}
                    <p className="mt-6 text-neutral-500 text-xs uppercase tracking-widest font-bold">
                        {activeFrameIndex !== -1
                            ? `Capturing Frame ${activeFrameIndex + 1} of ${layoutConfig.frames}`
                            : 'All frames captured'}
                    </p>

                    <canvas ref={canvasRef} className="hidden"></canvas>
                </div>

                {/* --- RIGHT: FILM STRIP PREVIEW --- */}
                <div className="w-full md:w-80 lg:w-96 bg-white border-l border-neutral-200 p-6 flex flex-col h-[30vh] md:h-screen overflow-y-auto">

                    <div className="mb-6 flex justify-between items-end">
                        <h3 className="text-neutral-900 font-bold uppercase tracking-widest text-xs">Film Strip</h3>
                        <span className="text-neutral-400 text-[10px] font-serif italic">
                            {photos.filter(p => p).length} / {layoutConfig.frames}
                        </span>
                    </div>

                    {/* Dải ảnh (Layout) */}
                    <div className="flex-1 space-y-4">
                        {photos.map((imgSrc, index) => (
                            <div
                                key={index}
                                onClick={() => setActiveFrameIndex(index)}
                                className={`
                                    relative aspect-[3/2] w-full bg-neutral-100 cursor-pointer overflow-hidden transition-all duration-300 group
                                    ${activeFrameIndex === index ? 'ring-2 ring-offset-2 ring-black shadow-xl scale-105 z-10' : 'hover:opacity-80 border border-neutral-200'}
                                `}
                            >
                                {imgSrc ? (
                                    <>
                                        <img src={imgSrc} alt={`Frame ${index}`} className="w-full h-full object-cover" />
                                        {/* Overlay Retake */}
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

                                {/* Số thứ tự góc */}
                                <div className="absolute top-2 left-2 w-5 h-5 bg-black/80 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                                    {index + 1}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-6 pt-6 border-t border-neutral-100">
                        <button
                            onClick={handleFinish}
                            disabled={!isFull} // Chỉ cho finish khi chụp đủ (hoặc bỏ dòng này nếu muốn cho phép lưu thiếu)
                            className={`
                                w-full py-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest transition-all
                                ${isFull
                                    ? 'bg-black text-white hover:bg-neutral-800 shadow-lg transform hover:-translate-y-1'
                                    : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'}
                            `}
                        >
                            <span>Finish Session</span>
                            <ArrowRight size={14} />
                        </button>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}