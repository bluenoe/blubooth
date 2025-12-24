import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import LayoutPreview from '@/Components/LayoutPreview';
import NavBar from '@/Components/NavBar';
import Footer from '@/Components/Footer';

export default function SelectLayout({ auth }) {
    const [selected, setSelected] = useState(null);
    const [hoveredId, setHoveredId] = useState(null);

    // Layout configurations
    const layouts = [
        { id: 'strip_2', name: 'The Duet', desc: '2 Frames • Vertical', count: 2 },
        { id: 'strip_3', name: 'Classic Trio', desc: '3 Frames • Vertical', count: 3 },
        { id: 'strip_4', name: 'Cinema', desc: '4 Frames • Vertical', count: 4 },
    ];

    // Handle layout selection and navigation
    const handleProceed = () => {
        if (!selected) return;

        const config = layouts.find(l => l.id === selected);

        // Save to localStorage with consistent key (matches legacy pattern)
        localStorage.setItem('blu_layout_config', JSON.stringify({
            key: config.id,
            frames: config.count,
            name: config.name,
            type: 'vertical'
        }));

        // Also save with old key for backward compatibility
        localStorage.setItem('blu_session_layout', JSON.stringify({
            key: config.id,
            frames: config.count,
            name: config.name,
            type: 'vertical'
        }));

        router.visit(route('booth'));
    };

    return (
        <>
            <Head title="Select Format" />

            {/* Font Import */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
            `}</style>

            <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-black selection:text-white flex flex-col">

                <NavBar />

                <main className="flex-grow flex flex-col items-center justify-center py-20 pt-32">

                    {/* Header Text */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16 px-6"
                    >
                        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-neutral-400 mb-4">
                            Step 01
                        </p>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
                            Choose Your <span className="font-serif italic font-normal text-neutral-400">Canvas.</span>
                        </h1>
                        <p className="text-neutral-500 font-light text-sm max-w-md mx-auto leading-relaxed">
                            Select a format for your session. Each layout is designed to tell a different story.
                        </p>
                    </motion.div>

                    {/* Layout Grid */}
                    <div className="max-w-5xl w-full px-6 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-16">
                        {layouts.map((layout, index) => (
                            <motion.div
                                key={layout.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
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
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="bg-black text-white px-16 py-5 text-xs font-bold uppercase tracking-[0.2em] rounded-full hover:bg-neutral-800 transition-colors shadow-2xl flex items-center gap-3"
                                >
                                    <span>Start Session</span>
                                    <ArrowRight size={14} />
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