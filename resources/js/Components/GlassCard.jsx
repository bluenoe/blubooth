import { motion } from 'framer-motion';

/**
 * GlassCard - Glassmorphism card component
 * Uses backdrop-blur and translucent backgrounds for modern overlay effects
 */
export default function GlassCard({
    children,
    className = '',
    variant = 'light', // 'light' | 'dark'
    blur = 'xl', // 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
    animate = false,
    onClick,
    ...props
}) {
    const variants = {
        light: 'bg-white/80 border-white/20 text-neutral-900',
        dark: 'bg-black/60 border-white/10 text-white',
    };

    const blurClasses = {
        sm: 'backdrop-blur-sm',
        md: 'backdrop-blur-md',
        lg: 'backdrop-blur-lg',
        xl: 'backdrop-blur-xl',
        '2xl': 'backdrop-blur-2xl',
        '3xl': 'backdrop-blur-3xl',
    };

    const baseClasses = `
        ${variants[variant]}
        ${blurClasses[blur]}
        border rounded-sm shadow-lg
        ${className}
    `;

    if (animate) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className={baseClasses}
                onClick={onClick}
                {...props}
            >
                {children}
            </motion.div>
        );
    }

    return (
        <div className={baseClasses} onClick={onClick} {...props}>
            {children}
        </div>
    );
}
