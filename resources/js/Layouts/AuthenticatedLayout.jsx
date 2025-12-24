import NavBar from '@/Components/NavBar';
import Footer from '@/Components/Footer';

export default function AuthenticatedLayout({ user, header, children }) {
    return (
        <div className="min-h-screen bg-white font-sans text-neutral-900 selection:bg-black selection:text-white">
            
            {/* 1. Header mới */}
            <NavBar />

            {/* 2. Main Content */}
            {/* Thêm padding-top (pt-24) để nội dung không bị Header che mất */}
            <main className="pt-24 min-h-[80vh]">
                {header && (
                    <header className="max-w-7xl mx-auto px-6 mb-8">
                        {header}
                    </header>
                )}
                
                {children}
            </main>

            {/* 3. Footer mới */}
            <Footer />
            
        </div>
    );
}