import { Link } from '@inertiajs/react';
import { Instagram, Twitter, Facebook, Globe } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-neutral-100 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* --- TOP SECTION --- */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                    
                    {/* Branding */}
                    <div className="md:col-span-1">
                        <div className="text-xl font-bold tracking-tighter uppercase mb-6">
                            Blu<span className="font-serif italic font-light text-neutral-400">Booth.</span>
                        </div>
                        <p className="text-xs text-neutral-400 font-light leading-relaxed max-w-xs">
                            The minimalist digital photobooth for modern memories. 
                            Designed in 2025.
                        </p>
                    </div>

                    {/* Links Column 1 */}
                    <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-900 mb-6">Platform</h4>
                        <ul className="space-y-4">
                            <li><FooterLink href={route('booth')}>Studio Booth</FooterLink></li>
                            <li><FooterLink href="/gallery">The Archive</FooterLink></li>
                            <li><FooterLink href="#">Features</FooterLink></li>
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-900 mb-6">Company</h4>
                        <ul className="space-y-4">
                            <li><FooterLink href="#">About Us</FooterLink></li>
                            <li><FooterLink href="#">Terms & Conditions</FooterLink></li>
                            <li><FooterLink href="#">Privacy Policy</FooterLink></li>
                        </ul>
                    </div>

                    {/* Socials */}
                    <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-900 mb-6">Connect</h4>
                        <div className="flex gap-4">
                            <SocialIcon icon={<Instagram size={18} />} />
                            <SocialIcon icon={<Twitter size={18} />} />
                            <SocialIcon icon={<Globe size={18} />} />
                        </div>
                    </div>
                </div>

                {/* --- BOTTOM SECTION --- */}
                <div className="border-t border-neutral-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] text-neutral-300 font-bold uppercase tracking-widest">
                        © 2025 BluBooth Inc. All rights reserved.
                    </p>
                    <p className="text-[10px] text-neutral-300 font-bold uppercase tracking-widest">
                        Made with 🖤 by Khanh
                    </p>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, children }) {
    return (
        <Link 
            href={href} 
            className="text-xs text-neutral-500 hover:text-black transition-colors font-medium"
        >
            {children}
        </Link>
    );
}

function SocialIcon({ icon }) {
    return (
        <a 
            href="#" 
            className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-400 hover:border-black hover:text-black hover:scale-110 transition-all duration-300"
        >
            {icon}
        </a>
    );
}