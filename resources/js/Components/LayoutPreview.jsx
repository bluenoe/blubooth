import { motion } from 'framer-motion';

/**
 * LayoutPreview - CSS-drawn layout preview component
 * Renders photobooth frame layout using CSS Grid instead of static images
 */
export default function LayoutPreview({
    frames = 4,
    isSelected = false,
    isHovered = false,
    size = 'default' // 'default' | 'small' | 'large'
}) {
    const sizeClasses = {
        small: 'w-20 h-28',
        default: 'w-32 h-48',
        large: 'w-40 h-56'
    };

    return (
        <div
            className={`
                ${sizeClasses[size]}
                bg-white border rounded-sm overflow-hidden shadow-sm
                transition-all duration-300
                ${isSelected
                    ? 'border-neutral-900 shadow-lg'
                    : 'border-neutral-200 group-hover:border-neutral-400'}
            `}
        >
            {/* Frame Container */}
            <div className="flex flex-col gap-1.5 p-3 h-[calc(100%-24px)]">
                {Array.from({ length: frames }).map((_, i) => (
                    <motion.div
                        key={i}
                        initial={false}
                        animate={{
                            backgroundColor: isSelected
                                ? 'rgb(23, 23, 23)'
                                : isHovered
                                    ? 'rgb(163, 163, 163)'
                                    : 'rgb(229, 229, 229)',
                        }}
                        transition={{ duration: 0.2, delay: i * 0.05 }}
                        className="flex-1 w-full rounded-[2px] border border-dashed border-neutral-300"
                    />
                ))}
            </div>

            {/* Footer Branding */}
            <div
                className={`
                    h-6 flex items-center justify-center text-[8px] font-bold uppercase tracking-widest
                    transition-colors duration-300
                    ${isSelected
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-100 text-neutral-400 group-hover:bg-neutral-200'}
                `}
            >
                BluBooth
            </div>
        </div>
    );
}
