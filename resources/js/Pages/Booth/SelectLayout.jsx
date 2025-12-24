import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function SelectLayout({ auth }) {
    const [selected, setSelected] = useState(null);

    // Danh sách Layout (Cấu hình tại đây)
    const layouts = [
        { id: 'strip_2', name: 'The Duet', desc: '2 Frames • Vertical', count: 2 },
        { id: 'strip_3', name: 'Classic Trio', desc: '3 Frames • Vertical', count: 3 },
        { id: 'strip_4', name: 'Cinema', desc: '4 Frames • Vertical', count: 4 },
    ];

    // Xử lý khi bấm nút Start
    const handleProceed = () => {
        if (!selected) return;

        // 1. Tìm config của layout đã chọn
        const config = layouts.find(l => l.id === selected);

        // 2. Lưu vào localStorage để trang chụp ảnh (Capture) đọc được
        localStorage.setItem('blu_session_layout', JSON.stringify({
            key: config.id,
            frames: config.count,
            type: 'vertical'
        }));

        // 3. Chuyển hướng sang trang chụp (Giả sử là route 'booth')
        // Bà đổi route('booth') thành route('booth.capture') nếu bà tách trang riêng nhé
        router.visit(route('booth'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={null} // Ẩn header mặc định để tự custom
        >
            <Head title="Select Format" />

            {/* Inject Font (Nếu chưa có trong app.blade.php) */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
                .font-serif { font-family: 'Playfair Display', serif; }
            `}</style>

            <div className="min-h-screen bg-white text-neutral-900 flex flex-col items-center justify-center py-20">

                {/* 1. HEADER TEXT */}
                <div className="text-center mb-16 px-6 animate-fade-in-down">
                    <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-neutral-400 mb-4">
                        Step 01
                    </p>
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6">
                        Choose Your <span className="font-serif italic font-light text-neutral-500">Canvas.</span>
                    </h1>
                    <p className="text-neutral-500 font-light text-sm max-w-md mx-auto leading-relaxed">
                        Select a format for your session. Each layout is designed to tell a different story.
                    </p>
                </div>

                {/* 2. LAYOUT GRID */}
                <div className="max-w-5xl w-full px-6 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-16">
                    {layouts.map((layout) => (
                        <div
                            key={layout.id}
                            onClick={() => setSelected(layout.id)}
                            className={`
                                group cursor-pointer border p-8 flex flex-col items-center justify-between min-h-[400px] transition-all duration-500
                                ${selected === layout.id
                                    ? 'border-black bg-neutral-50 transform -translate-y-2 shadow-xl'
                                    : 'border-neutral-200 hover:border-neutral-400 hover:-translate-y-2 hover:shadow-lg bg-white'}
                            `}
                        >
                            {/* Visual Preview (Vẽ bằng CSS) */}
                            <div className="w-32 h-48 bg-white border border-neutral-200 p-2 shadow-sm flex flex-col gap-2 transition-colors duration-300 group-hover:border-neutral-300">
                                {/* Tạo các ô frame ảo dựa trên count */}
                                {Array.from({ length: layout.count }).map((_, i) => (
                                    <div key={i} className={`flex-1 w-full border border-dashed border-neutral-200 transition-colors ${selected === layout.id ? 'bg-neutral-200' : 'bg-neutral-50 group-hover:bg-neutral-100'}`}></div>
                                ))}
                            </div>

                            {/* Info */}
                            <div className="text-center mt-8">
                                <h3 className={`text-2xl font-serif mb-2 transition-colors ${selected === layout.id ? 'text-black font-bold' : 'text-neutral-800'}`}>
                                    {layout.name}
                                </h3>
                                <p className="text-[10px] uppercase tracking-widest text-neutral-400">
                                    {layout.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 3. ACTION BUTTON (Chỉ hiện khi đã chọn) */}
                <div className={`transition-all duration-500 ${selected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                    <button
                        onClick={handleProceed}
                        className="bg-black text-white px-16 py-5 text-xs font-bold uppercase tracking-[0.2em] rounded-full hover:bg-neutral-800 transition-transform hover:scale-105 shadow-2xl"
                    >
                        Start Session
                    </button>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}