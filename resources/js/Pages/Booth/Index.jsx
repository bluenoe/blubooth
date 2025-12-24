import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useRef, useEffect, useState } from 'react';

// Nhận thêm prop 'photos' từ Controller gửi sang
export default function Booth({ auth, photos }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [photo, setPhoto] = useState(null);
    
    // Lấy flash message
    const { flash = {} } = usePage().props;
    const [processing, setProcessing] = useState(false);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
                audio: false,
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                videoRef.current.play();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageSrc = canvas.toDataURL('image/png');
            setPhoto(imageSrc);
        }
    };

    const savePhotoToServer = () => {
        if (!photo) return;
        setProcessing(true);

        router.post(route('booth.store'), {
            image: photo 
        }, {
            preserveScroll: true, // Giữ nguyên vị trí cuộn trang để thấy ảnh mới
            onSuccess: () => {
                setProcessing(false);
                setPhoto(null); 
            },
            onError: (errors) => {
                setProcessing(false);
                alert('Lỗi khi lưu ảnh!');
                console.log(errors);
            }
        });
    };

    useEffect(() => {
        if (!photo) startCamera();
        return () => {
            if (stream) stream.getTracks().forEach(track => track.stop());
        };
    }, [photo]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">BluBooth Studio</h2>}
        >
            <Head title="Chụp ảnh" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    
                    {/* KHUNG CAMERA */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 flex flex-col items-center">
                            
                            {/* Thông báo thành công (Đã thêm lại) */}
                            {flash?.message && (
                                <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg w-full text-center border border-green-200 shadow-sm animate-bounce">
                                    ✅ {flash.message}
                                </div>
                            )}

                            <canvas ref={canvasRef} className="hidden"></canvas>

                            <div className="relative w-full max-w-2xl aspect-video bg-black rounded-lg overflow-hidden border-4 border-gray-200 shadow-xl">
                                {photo ? (
                                    <img src={photo} alt="Captured" className="w-full h-full object-cover" />
                                ) : (
                                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100" />
                                )}
                            </div>

                            <div className="mt-8 flex gap-4">
                                {!photo ? (
                                    <button onClick={capturePhoto} className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold text-lg shadow-lg transition transform hover:scale-105 active:scale-95">
                                        📸 CHỤP TÁCH
                                    </button>
                                ) : (
                                    <>
                                        <button onClick={() => setPhoto(null)} className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-bold shadow transition">
                                            🔄 Bỏ qua
                                        </button>
                                        
                                        {/* Nút Lưu (Đã thêm lại) */}
                                        <button 
                                            onClick={savePhotoToServer}
                                            disabled={processing}
                                            className={`px-6 py-3 text-white rounded-lg font-bold shadow flex items-center gap-2 transition ${processing ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                                        >
                                            {processing ? '⏳ Đang lưu...' : '💾 LƯU VÀO ALBUM'}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* KHUNG ALBUM ẢNH (MỚI) */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">🖼️ Ảnh đã chụp gần đây</h3>
                            
                            {photos.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">Chưa có ảnh nào. Chụp tấm đầu tiên đi!</p>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {photos.map((item) => (
                                        <div key={item.id} className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border shadow-sm">
                                            {/* Hiển thị ảnh từ thư mục storage */}
                                            <img 
                                                src={`/storage/${item.path}`} 
                                                alt="Photo" 
                                                className="w-full h-full object-cover transition duration-300 group-hover:scale-110" 
                                            />
                                            {/* Overlay ngày tháng */}
                                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition">
                                                {new Date(item.created_at).toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}