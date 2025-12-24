import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Menu, X, Camera, User } from 'lucide-react';
import ApplicationLogo from '@/Components/ApplicationLogo'; // Hoặc dùng text logo trực tiếp

export default function NavBar() {
    const { auth } = usePage().props;
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Hiệu ứng đổi màu nền khi cuộn trang
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav 
            className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
                isScrolled 
                ? 'bg-white/80 backdrop-blur-md border-neutral-100 py-4' 
                : 'bg-transparent border-transparent py-6'
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                
                {/* --- LOGO --- */}
                <Link href="/" className="group flex items-center gap-2">
                    <div className="text-2xl font-bold tracking-tighter uppercase text-neutral-900">
                        Blu<span className="font-serif italic font-light text-neutral-400 group-hover:text-black transition-colors">Booth.</span>
                    </div>
                </Link>

                {/* --- DESKTOP MENU --- */}
                <div className="hidden md:flex items-center gap-8">
                    <NavLink href={route('booth')} active={route().current('booth')}>
                        Studio
                    </NavLink>
                    <NavLink href="/gallery" active={window.location.pathname === '/gallery'}>
                        Archive
                    </NavLink>
                    
                    {/* Đường kẻ dọc ngăn cách */}
                    <div className="h-4 w-px bg-neutral-200"></div>

                    {auth.user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                                Hi, {auth.user.name}
                            </span>
                            <Link 
                                href={route('logout')} 
                                method="post" 
                                as="button"
                                className="text-xs font-bold uppercase tracking-widest text-neutral-900 hover:text-red-500 transition"
                            >
                                ( Logout )
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link href={route('login')} className="text-xs font-bold uppercase tracking-widest hover:text-neutral-500 transition">
                                Log in
                            </Link>
                            <Link 
                                href={route('register')} 
                                className="px-5 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-neutral-800 transition"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>

                {/* --- MOBILE HAMBURGER --- */}
                <button 
                    className="md:hidden text-neutral-900"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* --- MOBILE MENU OVERLAY --- */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-neutral-100 p-6 shadow-xl flex flex-col gap-4 animate-fade-in-down">
                    <MobileNavLink href={route('booth')}>Studio</MobileNavLink>
                    <MobileNavLink href="/gallery">Archive</MobileNavLink>
                    <hr className="border-neutral-100 my-2" />
                    {auth.user ? (
                        <>
                            <div className="text-xs text-neutral-400 uppercase tracking-widest">Account</div>
                            <MobileNavLink href={route('profile.edit')}>{auth.user.name}</MobileNavLink>
                            <Link 
                                href={route('logout')} 
                                method="post" 
                                className="text-left text-sm font-bold uppercase tracking-widest text-red-500"
                            >
                                Log out
                            </Link>
                        </>
                    ) : (
                        <>
                            <MobileNavLink href={route('login')}>Log in</MobileNavLink>
                            <MobileNavLink href={route('register')}>Sign Up</MobileNavLink>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}

// Component con cho Link Desktop (đỡ lặp code)
function NavLink({ href, active, children }) {
    return (
        <Link 
            href={href} 
            className={`text-xs font-bold uppercase tracking-[0.2em] transition-colors relative group ${
                active ? 'text-black' : 'text-neutral-500 hover:text-black'
            }`}
        >
            {children}
            <span className={`absolute -bottom-2 left-0 w-full h-px bg-black transition-transform duration-300 ${
                active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
            }`}></span>
        </Link>
    );
}

// Component con cho Link Mobile
function MobileNavLink({ href, children }) {
    return (
        <Link 
            href={href} 
            className="text-lg font-serif italic text-neutral-900 hover:text-neutral-500 transition"
        >
            {children}
        </Link>
    );
}