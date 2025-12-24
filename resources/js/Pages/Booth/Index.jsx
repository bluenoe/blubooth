import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useRef, useEffect, useState } from 'react';

export default function Booth({ auth }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null); // Thêm cái này để xử lý ảnh
    const [stream, setStream] = useState(null);
    const [photo, setPhoto] = useState(null); // Biến chứa ảnh sau khi chụp
    const [error, setError] = useState('');

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
            setError('Không thể mở camera. Hãy kiểm tra quyền truy cập!');
        }
    };

    // Hàm chụp ảnh
    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (video && canvas) {
            // Đặt kích thước canvas bằng kích thước video thực tế
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const ctx = canvas.getContext('2d');
            
            // Lật ngược ảnh trên canvas để giống gương (Mirror effect)
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);

            // Vẽ hình từ video lên canvas
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Chuyển canvas thành dạng ảnh Base64 (chuỗi ký tự)
            const imageSrc = canvas.toDataURL('image/png');
            setPhoto(imageSrc); // Lưu ảnh vào state để hiển thị
        }
    };

    // Hàm chụp lại (Xóa ảnh, hiện lại video)
    const retakePhoto = () => {
        setPhoto(null);
    };

    // Hàm tải ảnh về máy (Quick win: Lưu về máy tính ngay lập tức)
    const downloadPhoto = () => {
        if (photo) {
            const link = document.createElement('a');
            link.href = photo;
            link.download = 'blubooth_photo.png';
            link.click();
        }
    };

    useEffect(() => {
        if (!photo) startCamera(); // Chỉ bật cam khi chưa có ảnh
        return () => {
            if (stream) stream.getTracks().forEach(track => track.stop());
        };
    }, [photo]); // Khi photo thay đổi (bấm chụp lại) thì chạy lại logic này

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">BluBooth Studio</h2>}
        >
            <Head title="Chụp ảnh" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 flex flex-col items-center">
                            
                            {/* Canvas ẩn (dùng để xử lý ngầm, không hiện ra) */}
                            <canvas ref={canvasRef} className="hidden"></canvas>

                            {/* KHUNG HIỂN THỊ CHÍNH */}
                            <div className="relative w-full max-w-2xl aspect-video bg-black rounded-lg overflow-hidden border-4 border-gray-200 shadow-xl">
                                {photo ? (
                                    // Nếu đã chụp -> Hiện ảnh tĩnh
                                    <img src={photo} alt="Captured" className="w-full h-full object-cover" />
                                ) : (
                                    // Nếu chưa chụp -> Hiện Video Live
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        className="w-full h-full object-cover transform -scale-x-100"
                                    />
                                )}
                            </div>

                            {/* CÁC NÚT BẤM ĐIỀU KHIỂN */}
                            <div className="mt-8 flex gap-4">
                                {!photo ? (
                                    <button 
                                        onClick={capturePhoto}
                                        className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold text-lg shadow-lg transition transform hover:scale-110 active:scale-95">
                                        📸 CHỤP TÁCH
                                    </button>
                                ) : (
                                    <>
                                        <button 
                                            onClick={retakePhoto}
                                            className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-bold shadow transition">
                                            🔄 Chụp lại
                                        </button>
                                        <button 
                                            onClick={downloadPhoto}
                                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow transition flex items-center gap-2">
                                            ⬇️ Tải về máy
                                        </button>
                                    </>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}