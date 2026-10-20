
function Footer() {
    const currentYear = new Date().getFullYear()

    const links = [
        { label: 'About', href: '#about' },
        { label: 'Skills', href: '#skills' },
        { label: 'Projects', href: '#projects' },
        { label: 'Experience', href: '#experience' },
        { label: 'Contact', href: '#contact' },
    ]

    return (
        <footer className="mt-12 border-t border-white/10 bg-slate-950/40">
            <div className="section-container py-10">
                <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                    <div>
                        <a
                            href="#home"
                            className="text-2xl font-bold"
                        >
                            <span className="gradient-text">Rashmi</span>
                            <span className="text-white">.dev</span>
                        </a>

                        <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
                            Python Backend Developer building APIs and reliable
                            backend applications.
                        </p>
                    </div>

                    <nav
                        aria-label="Footer navigation"
                        className="flex flex-wrap gap-x-5 gap-y-3"
                    >
                        {links.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="text-sm text-slate-400 transition hover:text-cyan-200"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>
                </div>

                <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                    <p>
                        © {currentYear} Rashmi Ranjan Pradhan. All rights reserved.
                    </p>

                    <div className="flex gap-5">
                        <a
                            href="https://github.com/Rashmi-Ranjan-6372"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition hover:text-cyan-200"
                        >
                            GitHub ↗
                        </a>

                        <a
                            href="https://linkedin.com/in/rrpradhan798483"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition hover:text-cyan-200"
                        >
                            LinkedIn ↗
                        </a>

                        <a
                            href="mailto:rashmiranjan6372@gmail.com"
                            className="transition hover:text-cyan-200"
                        >
                            Email ↗
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
