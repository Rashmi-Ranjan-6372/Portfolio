import { useEffect, useState } from 'react'

const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Education', href: '#education' },
    { name: 'Certifications', href: '#certifications' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Blog', href: '#blog' },
    { name: 'Contact', href: '#contact' },
]

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)

    const closeMenu = () => setMenuOpen(false)

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                closeMenu()
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    return (
        <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
            <nav
                aria-label="Main navigation"
                className="glass mx-auto max-w-7xl rounded-2xl"
            >
                <div className="flex min-h-16 items-center justify-between gap-4 px-4 py-3 sm:px-6">
                    <a
                        href="#home"
                        onClick={closeMenu}
                        className="shrink-0 text-lg font-bold tracking-tight sm:text-xl"
                        aria-label="Rashmi portfolio home"
                    >
                        <span className="gradient-text">Rashmi</span>
                        <span className="text-white">.dev</span>
                    </a>

                    <div className="hidden items-center gap-3 lg:flex xl:gap-4">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="whitespace-nowrap text-xs text-slate-300 transition-colors duration-200 hover:text-cyan-300 xl:text-sm"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    <a
                        href="#contact"
                        className="hidden shrink-0 rounded-xl border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300/60 hover:bg-cyan-400/20 lg:inline-flex"
                    >
                        Hire Me
                    </a>

                    <button
                        type="button"
                        onClick={() => setMenuOpen((previous) => !previous)}
                        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                        aria-expanded={menuOpen}
                        aria-controls="mobile-navigation"
                        className="flex h-10 w-10 shrink-0 flex-col items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-300 lg:hidden"
                    >
                        <span
                            className={`h-0.5 w-5 rounded-full bg-white transition-transform ${menuOpen ? 'translate-y-2 rotate-45' : ''
                                }`}
                        />
                        <span
                            className={`h-0.5 w-5 rounded-full bg-white transition-opacity ${menuOpen ? 'opacity-0' : ''
                                }`}
                        />
                        <span
                            className={`h-0.5 w-5 rounded-full bg-white transition-transform ${menuOpen ? '-translate-y-2 -rotate-45' : ''
                                }`}
                        />
                    </button>
                </div>

                {menuOpen && (
                    <div
                        id="mobile-navigation"
                        className="border-t border-white/10 px-4 pb-4 pt-3 lg:hidden"
                    >
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={closeMenu}
                                    className="rounded-xl px-3 py-3 text-sm text-slate-300 transition-colors hover:bg-white/10 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>

                        <a
                            href="#contact"
                            onClick={closeMenu}
                            className="mt-3 flex justify-center rounded-xl border border-cyan-300/30 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/20"
                        >
                            Hire Me
                        </a>
                    </div>
                )}
            </nav>
        </header>
    )

}

export default Navbar