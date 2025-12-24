import { Link, Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Camera, ArrowRight, Sparkles, Zap, Lock } from 'lucide-react';
import NavBar from '@/Components/NavBar';
import Footer from '@/Components/Footer';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
            `}</style>

            <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-black selection:text-white overflow-x-hidden flex flex-col">

                <NavBar />

                <main className="flex-grow">
                    {/* Hero Section */}
                    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">

                        {/* Background Gradient Blob */}
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.4, 0.6, 0.4]
                            }}
                            transition={{ duration: 8, repeat: Infinity }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-gradient-to-tr from-neutral-100 via-neutral-50 to-white rounded-full blur-3xl pointer-events-none"
                        />

                        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative">

                            {/* Left: Text Content */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                className="order-2 lg:order-1 relative z-10"
                            >
                                <div className="inline-block px-4 py-1.5 border border-neutral-200 rounded-full mb-6">
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500">
                                        The Modern Studio
                                    </span>
                                </div>

                                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-6">
                                    Capture <br />
                                    <span className="font-serif italic font-normal text-neutral-400">The Magic.</span>
                                </h1>

                                <p className="text-neutral-500 text-lg font-light leading-relaxed max-w-md mb-10">
                                    No apps. No setup. Just you, the camera, and a moment frozen in time.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <Link
                                            href={route('booth')}
                                            className="px-8 py-4 bg-black text-white text-sm font-bold uppercase tracking-widest hover:bg-neutral-800 transition rounded-full flex items-center justify-center gap-2 group shadow-xl"
                                        >
                                            <Camera size={18} />
                                            <span>Start Booth</span>
                                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </motion.div>
                                    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                                        <Link
                                            href="/gallery"
                                            className="px-8 py-4 bg-white border border-neutral-200 text-neutral-900 text-sm font-bold uppercase tracking-widest hover:border-black transition rounded-full flex items-center justify-center"
                                        >
                                            View Archive
                                        </Link>
                                    </motion.div>
                                </div>
                            </motion.div>

                            {/* Right: Floating Photo Strips */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="order-1 lg:order-2 relative h-[400px] md:h-[500px] flex items-center justify-center pointer-events-none"
                            >
                                {/* Gradient Blob */}
                                <motion.div
                                    animate={{
                                        rotate: [0, 5, 0, -5, 0],
                                        scale: [1, 1.05, 1]
                                    }}
                                    transition={{ duration: 12, repeat: Infinity }}
                                    className="absolute w-[350px] h-[350px] md:w-[400px] md:h-[400px] bg-gradient-to-tr from-blue-50 via-purple-50 to-pink-50 rounded-full blur-3xl opacity-60"
                                />

                                {/* Strip 1 - Left */}
                                <motion.div
                                    animate={{
                                        y: [0, -20, 0],
                                        rotate: [-6, -4, -6]
                                    }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute z-10 w-44 md:w-48 bg-white p-3 pb-8 shadow-2xl border border-neutral-100 rounded-sm -translate-x-8"
                                >
                                    <div className="space-y-2">
                                        <div className="aspect-[3/4] bg-neutral-100 overflow-hidden">
                                            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" alt="" />
                                        </div>
                                        <div className="aspect-[3/4] bg-neutral-100 overflow-hidden">
                                            <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" alt="" />
                                        </div>
                                        <div className="aspect-[3/4] bg-neutral-100 overflow-hidden">
                                            <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" alt="" />
                                        </div>
                                    </div>
                                    <p className="text-center text-[8px] font-bold uppercase tracking-widest text-neutral-400 mt-3">BluBooth</p>
                                </motion.div>

                                {/* Strip 2 - Right */}
                                <motion.div
                                    animate={{
                                        y: [0, -15, 0],
                                        rotate: [6, 8, 6]
                                    }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                    className="absolute z-20 w-44 md:w-48 bg-white p-3 pb-8 shadow-2xl border border-neutral-100 rounded-sm translate-x-12 translate-y-8"
                                >
                                    <div className="space-y-2">
                                        <div className="aspect-[3/4] bg-neutral-100 overflow-hidden">
                                            <img src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400" className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div className="aspect-[3/4] bg-neutral-100 overflow-hidden">
                                            <img src="https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400" className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div className="aspect-[3/4] bg-neutral-100 overflow-hidden">
                                            <img src="https://images.unsplash.com/photo-1513956589380-bad618211cf1?w=400" className="w-full h-full object-cover" alt="" />
                                        </div>
                                    </div>
                                    <p className="text-center text-[8px] font-bold uppercase tracking-widest text-neutral-400 mt-3">BluBooth</p>
                                </motion.div>
                            </motion.div>
                        </div>
                    </section>

                    {/* Marquee */}
                    <div className="bg-neutral-900 text-white py-6 overflow-hidden border-y border-neutral-800">
                        <motion.div
                            animate={{ x: [0, -1000] }}
                            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                            className="whitespace-nowrap flex gap-12 font-bold text-2xl md:text-4xl uppercase tracking-tighter select-none opacity-80"
                        >
                            {[...Array(3)].map((_, i) => (
                                <span key={i} className="flex items-center gap-12">
                                    <span>Instant Capture</span>
                                    <span className="text-neutral-600">•</span>
                                    <span className="font-serif italic font-normal text-neutral-400">Timeless Memories</span>
                                    <span className="text-neutral-600">•</span>
                                    <span>High Quality</span>
                                    <span className="text-neutral-600">•</span>
                                    <span>No App Needed</span>
                                    <span className="text-neutral-600">•</span>
                                </span>
                            ))}
                        </motion.div>
                    </div>

                    {/* Features */}
                    <section className="py-24 px-6 bg-neutral-50">
                        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                            {[
                                { icon: Zap, title: 'Instant', desc: 'No downloads, no waiting. Just click and capture in your browser.' },
                                { icon: Sparkles, title: 'Minimalist', desc: 'Clean, elegant interface designed for the modern web experience.' },
                                { icon: Lock, title: 'Private', desc: 'Your photos stay on your device. No cloud, no tracking, no compromise.' },
                            ].map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    className="group"
                                >
                                    <div className="h-px w-full bg-neutral-200 mb-6 group-hover:bg-black transition-colors duration-500" />
                                    <div className="flex items-center gap-3 mb-4">
                                        <feature.icon size={20} strokeWidth={1.5} className="text-neutral-400 group-hover:text-black transition-colors" />
                                        <h3 className="text-xl font-bold uppercase tracking-tight">0{i + 1}. {feature.title}</h3>
                                    </div>
                                    <p className="text-neutral-500 font-light leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                </main>

                <Footer />

            </div>
        </>
    );
}