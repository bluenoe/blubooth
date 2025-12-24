import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import LayoutPreview from '@/Components/LayoutPreview';
import NavBar from '@/Components/NavBar';
import Footer from '@/Components/Footer';

export default function SelectLayout({ auth }) {
    const [selected, setSelected] = useState(null);
    const [hoveredId, setHoveredId] = useState(null);
    const [isNavigating, setIsNavigating] = useState(false);

    // Layout configurations
    const layouts = [
        { id: 'strip_2', name: 'The Duet', desc: '2 Frames • Vertical', count: 2 },
        { id: 'strip_3', name: 'The Trio', desc: '3 Frames • Vertical', count: 3 },
        { id: 'strip_4', name: 'Cinema', desc: '4 Frames • Vertical', count: 4 },
    ];

    // Clear any previous session on mount
    useEffect(() => {
        // Clear previous captured photos when starting fresh
        localStorage.removeItem('blu_captured_photos');
    }, []);

    // Handle layout selection and navigation
    const handleProceed = () => {
        if (!selected || isNavigating) return;

        setIsNavigating(true);
        const config = layouts.find(l => l.id === selected);

        // Save to localStorage with the strict key
        const layoutConfig = {
            key: config.id,
            frames: config.count,
            name: config.name,
            type: 'vertical',
            timestamp: new Date().toISOString()
        };

        localStorage.setItem('blu_layout_config', JSON.stringify(layoutConfig));

        // Navigate to capture page
        setTimeout(() => {
            router.visit(route('booth.capture'));
        }, 300); // Small delay for animation
    };

    return (
        <>
            <Head title="Select Format" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
            `}</style>

            <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-black selection:text-white flex flex-col">

                <NavBar />

                <main className="flex-grow flex flex-col items-center justify-center py-20 pt-32">

                    {/* Step Indicator */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4"
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-full">
                            <span className="w-6 h-6 bg-black text-white text-[10px] font-bold flex items-center justify-center rounded-full">1</span>
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-500">Choose Format</span>
                        </span>
                    </motion.div>

                    {/* Header Text */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-center mb-16 px-6"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
                            Choose Your <span className="font-serif italic font-normal text-neutral-400">Canvas.</span>
                        </h1>
                        <p className="text-neutral-500 font-light text-sm max-w-md mx-auto leading-relaxed">
                            Select a format for your session. Each layout tells a different story.
                        </p>
                    </motion.div>

                    {/* Layout Grid */}
                    <div className="max-w-5xl w-full px-6 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-16">
                        {layouts.map((layout, index) => (
                            <motion.div
                                key={layout.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                                whileHover={{ y: -12, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelected(layout.id)}
                                onMouseEnter={() => setHoveredId(layout.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                className={`
                                    group cursor-pointer border p-8 flex flex-col items-center justify-between min-h-[420px] 
                                    transition-shadow duration-500
                                    ${selected === layout.id
                                        ? 'border-neutral-900 bg-neutral-50 shadow-2xl'
                                        : 'border-neutral-200 hover:border-neutral-400 hover:shadow-xl bg-white'}
                                `}
                            >
                                {/* CSS-Drawn Layout Preview */}
                                <LayoutPreview
                                    frames={layout.count}
                                    isSelected={selected === layout.id}
                                    isHovered={hoveredId === layout.id}
                                    size="default"
                                />

                                {/* Layout Info */}
                                <div className="text-center mt-8">
                                    <motion.h3
                                        animate={{
                                            scale: selected === layout.id ? 1.05 : 1,
                                            color: selected === layout.id ? '#000' : '#404040'
                                        }}
                                        className="text-2xl font-serif mb-2 transition-colors"
                                    >
                                        {layout.name}
                                    </motion.h3>
                                    <p className="text-[10px] uppercase tracking-widest text-neutral-400">
                                        {layout.desc}
                                    </p>
                                </div>

                                {/* Selection Indicator */}
                                <AnimatePresence>
                                    {selected === layout.id && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0 }}
                                            className="w-3 h-3 bg-neutral-900 rounded-full mt-4"
                                        />
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>

                    {/* Action Button */}
                    <AnimatePresence>
                        {selected && (
                            <motion.div
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                            >
                                <motion.button
                                    onClick={handleProceed}
                                    disabled={isNavigating}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`
                                        bg-black text-white px-16 py-5 text-xs font-bold uppercase tracking-[0.2em] rounded-full 
                                        transition-all shadow-2xl flex items-center gap-3
                                        ${isNavigating ? 'opacity-70 cursor-wait' : 'hover:bg-neutral-800'}
                                    `}
                                >
                                    <span>{isNavigating ? 'Starting...' : 'Start Session'}</span>
                                    <motion.div
                                        animate={isNavigating ? { x: [0, 5, 0] } : {}}
                                        transition={{ duration: 0.6, repeat: Infinity }}
                                    >
                                        <ArrowRight size={14} />
                                    </motion.div>
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </main>

                <Footer />

            </div>
        </>
    );
}