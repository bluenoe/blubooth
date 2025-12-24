import { Link, Head } from '@inertiajs/react';
import { Camera, ArrowRight } from 'lucide-react';
import NavBar from '@/Components/NavBar'; // Import Header xịn
import Footer from '@/Components/Footer'; // Import Footer xịn

export default function Welcome() {
    return (
        <>
            <Head title="Welcome" />
            
            {/* Inject Font & Animation CSS */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
                .font-serif { font-family: 'Playfair Display', serif; }
                .font-sans { font-family: 'Inter', sans-serif; }
                
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0px) rotate(-6deg); }
                    50% { transform: translateY(-15px) rotate(-6deg); }
                }
                @keyframes float-medium {
                    0%, 100% { transform: translateY(0px) rotate(3deg); }
                    50% { transform: translateY(-10px) rotate(3deg); }
                }
                
                .animate-float-1 { animation: float-slow 6s ease-in-out infinite; }
                .animate-float-2 { animation: float-medium 5s ease-in-out infinite; }
                
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee { animation: marquee 30s linear infinite; }
            `}</style>

            <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-black selection:text-white overflow-x-hidden flex flex-col">
                
                {/* 1. HEADER (Dùng chung) */}
                <NavBar />

                <main className="flex-grow">
                    {/* --- HERO SECTION --- */}
                    {/* Thêm pt-32 để nội dung không bị Header che mất */}
                    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
                        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            
                            {/* LEFT: Text */}
                            <div className="order-2 lg:order-1 relative z-10">
                                <div className="inline-block px-3 py-1 border border-neutral-200 rounded-full mb-6">
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500">
                                        The Modern Studio
                                    </span>
                                </div>
                                
                                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-6">
                                    Capture <br />
                                    <span className="font-serif italic font-light text-neutral-400">The Magic.</span>
                                </h1>
                                
                                <p className="text-neutral-500 text-lg font-light leading-relaxed max-w-md mb-10">
                                    No apps. No setup. Just you, the camera, and a moment frozen in time.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link 
                                        href={route('booth')} 
                                        className="px-8 py-4 bg-black text-white text-sm font-bold uppercase tracking-widest hover:bg-neutral-800 transition rounded-full flex items-center justify-center gap-2 group shadow-xl hover:shadow-2xl hover:-translate-y-1 transform duration-300"
                                    >
                                        <Camera size={18} />
                                        <span>Start Booth</span>
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <Link 
                                        href="/gallery" 
                                        className="px-8 py-4 bg-white border border-neutral-200 text-neutral-900 text-sm font-bold uppercase tracking-widest hover:border-black transition rounded-full flex items-center justify-center"
                                    >
                                        View Archive
                                    </Link>
                                </div>
                            </div>

                            {/* RIGHT: Floating Strips (Hiệu ứng cũ của bà) */}
                            <div className="order-1 lg:order-2 relative h-[400px] md:h-[500px] flex items-center justify-center pointer-events-none">
                                {/* Gradient Blob */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-tr from-blue-100 via-green-50 to-purple-50 rounded-full blur-3xl opacity-60 animate-pulse"></div>

                                {/* Strip 1 */}
                                <div className="absolute z-10 w-48 bg-white p-3 pb-8 shadow-2xl transform -rotate-6 animate-float-1 border border-neutral-100 rounded-sm">
                                    <div className="space-y-3">
                                        <div className="aspect-[3/4] bg-neutral-100 grayscale"><img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400" className="w-full h-full object-cover" /></div>
                                        <div className="aspect-[3/4] bg-neutral-100 grayscale"><img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400" className="w-full h-full object-cover" /></div>
                                        <div className="aspect-[3/4] bg-neutral-100 grayscale"><img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400" className="w-full h-full object-cover" /></div>
                                    </div>
                                </div>

                                {/* Strip 2 */}
                                <div className="absolute z-20 w-48 bg-white p-3 pb-8 shadow-2xl transform rotate-6 translate-x-16 translate-y-8 animate-float-2 border border-neutral-100 rounded-sm">
                                    <div className="space-y-3">
                                        <div className="aspect-[3/4] bg-neutral-100"><img src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400" className="w-full h-full object-cover" /></div>
                                        <div className="aspect-[3/4] bg-neutral-100"><img src="https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400" className="w-full h-full object-cover" /></div>
                                        <div className="aspect-[3/4] bg-neutral-100"><img src="https://images.unsplash.com/photo-1513956589380-bad618211cf1?w=400" className="w-full h-full object-cover" /></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* --- MARQUEE --- */}
                    <div className="bg-neutral-900 text-white py-6 overflow-hidden border-y border-neutral-800">
                        <div className="animate-marquee whitespace-nowrap flex gap-12 font-bold text-2xl md:text-4xl uppercase tracking-tighter select-none opacity-80">
                            <span>Instant Capture</span> • 
                            <span className="font-serif italic font-light text-neutral-400">Timeless Memories</span> • 
                            <span>High Quality</span> • 
                            <span>No App Needed</span> • 
                            <span>Instant Capture</span> • 
                            <span className="font-serif italic font-light text-neutral-400">Timeless Memories</span>
                        </div>
                    </div>

                    {/* --- FEATURES --- */}
                    <section className="py-24 px-6 bg-neutral-50">
                        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                            {['Instant', 'Minimalist', 'Private'].map((feature, i) => (
                                <div key={i} className="group">
                                    <div className="h-px w-full bg-neutral-200 mb-6 group-hover:bg-black transition-colors duration-500"></div>
                                    <h3 className="text-xl font-bold uppercase tracking-tight mb-4">0{i+1}. {feature}</h3>
                                    <p className="text-neutral-500 font-light leading-relaxed">
                                        Designed for the modern web. Fast, clean, and respectful of your data.
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>

                {/* 2. FOOTER (Dùng chung) */}
                <Footer />

            </div>
        </>
    );
}