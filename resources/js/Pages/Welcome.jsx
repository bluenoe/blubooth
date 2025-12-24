import { Link, Head } from '@inertiajs/react';
import { Camera, ArrowRight, Instagram, Twitter } from 'lucide-react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome" />
            
            {/* Inject Font & Custom CSS Animation */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
                
                .font-serif { font-family: 'Playfair Display', serif; }
                .font-sans { font-family: 'Inter', sans-serif; }
                
                /* Hiệu ứng trôi nhẹ (Lấy cảm hứng từ web cũ của bà) */
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0px) rotate(-6deg); }
                    50% { transform: translateY(-15px) rotate(-6deg); }
                }
                @keyframes float-medium {
                    0%, 100% { transform: translateY(0px) rotate(3deg); }
                    50% { transform: translateY(-10px) rotate(3deg); }
                }
                @keyframes float-fast {
                    0%, 100% { transform: translateY(0px) rotate(12deg); }
                    50% { transform: translateY(-20px) rotate(12deg); }
                }
                
                .animate-float-1 { animation: float-slow 6s ease-in-out infinite; }
                .animate-float-2 { animation: float-medium 5s ease-in-out infinite; }
                .animate-float-3 { animation: float-fast 7s ease-in-out infinite; }

                /* Text Marquee */
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee { animation: marquee 30s linear infinite; }
            `}</style>

            <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-black selection:text-white overflow-x-hidden">
                
                {/* --- NAVBAR --- */}
                <nav className="fixed w-full z-50 top-0 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-neutral-100">
                    <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                        {/* Logo */}
                        <div className="text-2xl font-bold tracking-tighter uppercase">
                            Blu<span className="font-serif italic font-light text-neutral-400">Booth.</span>
                        </div>

                        {/* Menu Right */}
                        <div className="flex items-center gap-6">
                            {auth.user ? (
                                <Link 
                                    href={route('dashboard')} 
                                    className="text-xs font-bold uppercase tracking-widest hover:text-neutral-500 transition"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link 
                                        href={route('login')} 
                                        className="text-xs font-bold uppercase tracking-widest hover:text-neutral-500 transition"
                                    >
                                        Log in
                                    </Link>
                                    <Link 
                                        href={route('register')} 
                                        className="hidden md:inline-block px-6 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition rounded-full"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                {/* --- HERO SECTION (Sự kết hợp giữa Minimalist & Floating Effect) --- */}
                <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        
                        {/* LEFT: Typography & CTA (Vibe BluShop) */}
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
                                No apps to install. No complex setup. Just you, the camera, and a moment frozen in time.
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
                                <a 
                                    href="#gallery" 
                                    className="px-8 py-4 bg-white border border-neutral-200 text-neutral-900 text-sm font-bold uppercase tracking-widest hover:border-black transition rounded-full flex items-center justify-center"
                                >
                                    View Gallery
                                </a>
                            </div>
                        </div>

                        {/* RIGHT: Floating Strips (Cái "Soul" của BluBooth cũ) */}
                        {/* Tui tái hiện lại hiệu ứng nhưng dùng CSS Tailwind + Keyframes mới */}
                        <div className="order-1 lg:order-2 relative h-[500px] flex items-center justify-center">
                            
                            {/* Gradient Blob Background (Giống cái cũ nhưng tinh tế hơn) */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-blue-100 via-green-50 to-purple-50 rounded-full blur-3xl opacity-60 animate-pulse"></div>

                            {/* Strip 1: Nghiêng trái */}
                            <div className="absolute z-10 w-48 md:w-56 bg-white p-3 pb-8 shadow-2xl transform -rotate-6 animate-float-1 border border-neutral-100">
                                <div className="space-y-3">
                                    <div className="aspect-[3/4] bg-neutral-100 overflow-hidden grayscale">
                                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500" alt="Pose 1" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="aspect-[3/4] bg-neutral-100 overflow-hidden grayscale">
                                        <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=500" alt="Pose 2" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="aspect-[3/4] bg-neutral-100 overflow-hidden grayscale">
                                        <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=500" alt="Pose 3" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <div className="mt-4 text-center">
                                    <p className="font-serif italic text-xs text-neutral-400">#BluBooth</p>
                                </div>
                            </div>

                            {/* Strip 2: Nghiêng phải (Nằm đè lên) */}
                            <div className="absolute z-20 w-48 md:w-56 bg-white p-3 pb-8 shadow-2xl transform rotate-6 translate-x-20 md:translate-x-32 translate-y-12 animate-float-2 border border-neutral-100">
                                <div className="space-y-3">
                                    <div className="aspect-[3/4] bg-neutral-100 overflow-hidden">
                                        <img src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=500" alt="Pose 4" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="aspect-[3/4] bg-neutral-100 overflow-hidden">
                                        <img src="https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=500" alt="Pose 5" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="aspect-[3/4] bg-neutral-100 overflow-hidden">
                                        <img src="https://images.unsplash.com/photo-1513956589380-bad618211cf1?q=80&w=500" alt="Pose 6" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <div className="mt-4 text-center">
                                    <p className="font-serif italic text-xs text-neutral-400">24.12.2025</p>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </section>

                {/* --- MARQUEE SECTION (Fashion Vibe) --- */}
                <div className="bg-neutral-900 text-white py-6 overflow-hidden border-y border-neutral-800">
                    <div className="animate-marquee whitespace-nowrap flex gap-12 font-bold text-2xl md:text-4xl uppercase tracking-tighter select-none opacity-80">
                        <span>Instant Capture</span> • 
                        <span className="font-serif italic font-light text-neutral-400">Timeless Memories</span> • 
                        <span>High Quality</span> • 
                        <span>No App Needed</span> • 
                        <span>Instant Capture</span> • 
                        <span className="font-serif italic font-light text-neutral-400">Timeless Memories</span> • 
                        <span>High Quality</span> • 
                        <span>No App Needed</span>
                    </div>
                </div>

                {/* --- FEATURES GRID --- */}
                <section className="py-24 px-6 bg-neutral-50">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            
                            <div className="group">
                                <div className="h-px w-full bg-neutral-200 mb-6 group-hover:bg-black transition-colors duration-500"></div>
                                <h3 className="text-xl font-bold uppercase tracking-tight mb-4">01. Instant</h3>
                                <p className="text-neutral-500 font-light leading-relaxed">
                                    No downloads. Just open your browser, strike a pose, and get your photos in seconds. Optimized for speed.
                                </p>
                            </div>

                            <div className="group">
                                <div className="h-px w-full bg-neutral-200 mb-6 group-hover:bg-black transition-colors duration-500"></div>
                                <h3 className="text-xl font-bold uppercase tracking-tight mb-4">02. Minimalist</h3>
                                <p className="text-neutral-500 font-light leading-relaxed">
                                    Clean interfaces designed to keep the focus on you. No clutter, just pure photography.
                                </p>
                            </div>

                            <div className="group">
                                <div className="h-px w-full bg-neutral-200 mb-6 group-hover:bg-black transition-colors duration-500"></div>
                                <h3 className="text-xl font-bold uppercase tracking-tight mb-4">03. Private</h3>
                                <p className="text-neutral-500 font-light leading-relaxed">
                                    Your photos are yours. We secure your gallery with advanced encryption and privacy controls.
                                </p>
                            </div>

                        </div>
                    </div>
                </section>

                {/* --- FOOTER --- */}
                <footer className="bg-white border-t border-neutral-100 py-12 px-6">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-lg font-bold tracking-tighter uppercase">
                            Blu<span className="font-serif italic font-light text-neutral-400">Booth.</span>
                        </div>
                        
                        <div className="flex gap-6">
                            <a href="#" className="text-neutral-400 hover:text-black transition"><Instagram size={20} /></a>
                            <a href="#" className="text-neutral-400 hover:text-black transition"><Twitter size={20} /></a>
                        </div>

                        <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">
                            © 2025 BluBooth Inc.
                        </p>
                    </div>
                </footer>

            </div>
        </>
    );
}