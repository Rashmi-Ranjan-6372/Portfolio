
function About() {
    const highlights = [
        {
            title: 'Backend Development',
            description: 'Building reliable server-side applications and business logic.',
            icon: '⚙️',
        },
        {
            title: 'REST API Development',
            description: 'Creating structured APIs with Django REST Framework.',
            icon: '🔗',
        },
        {
            title: 'Database Management',
            description: 'Working with PostgreSQL and relational database design.',
            icon: '🗄️',
        },
        {
            title: 'Problem Solving',
            description: 'Developing practical solutions for real-world requirements.',
            icon: '💡',
        },
    ]

    return (
        <section id="about" className="section-container py-24 sm:py-28">
            <div className="mb-12 text-center">
                <p className="gradient-text text-sm font-semibold uppercase tracking-[0.25em]">
                    Discover My Journey
                </p>

                <h2 className="mt-4 text-3xl font-bold sm:text-5xl">
                    About <span className="gradient-text">Me</span>
                </h2>

                <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-400">
                    A little about my background, my technical interests, and the work I enjoy.
                </p>
            </div>

            <div className="grid items-start gap-8 lg:grid-cols-[0.85fr_1.15fr]">
                <div className="glass rounded-3xl p-6 sm:p-8">
                    <div className="relative mx-auto flex h-36 w-36 items-center justify-center rounded-full border border-cyan-300/30 bg-gradient-to-br from-cyan-400/20 to-violet-500/20 shadow-xl shadow-cyan-500/10">
                        <span className="gradient-text text-5xl font-bold">RR</span>
                        <span className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-4 border-slate-900 bg-emerald-400" />
                    </div>

                    <h3 className="mt-6 text-center text-2xl font-bold">
                        Rashmi Ranjan Pradhan
                    </h3>

                    <p className="mt-2 text-center text-cyan-200">
                        Python Backend Developer
                    </p>

                    <div className="mt-7 space-y-4 border-t border-white/10 pt-6">
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-sm text-slate-400">Primary Language</span>
                            <span className="text-sm font-medium text-slate-200">Python</span>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                            <span className="text-sm text-slate-400">Backend Framework</span>
                            <span className="text-sm font-medium text-slate-200">Django / DRF</span>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                            <span className="text-sm text-slate-400">Database</span>
                            <span className="text-sm font-medium text-slate-200">PostgreSQL</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass rounded-3xl p-6 sm:p-8">
                        <h3 className="text-xl font-bold sm:text-2xl">
                            Building useful backend <span className="gradient-text">solutions</span>
                        </h3>

                        <p className="mt-5 leading-8 text-slate-300">
                            I am a Python Backend Developer focused on developing web
                            applications, REST APIs, database-driven systems, and backend
                            integrations. My work involves translating application
                            requirements into organized, maintainable backend functionality.
                        </p>

                        <p className="mt-4 leading-8 text-slate-400">
                            I work with Python, Django, Django REST Framework, PostgreSQL,
                            authentication, API validation, and database operations. I am
                            continuously improving my skills by working on practical software
                            projects.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {highlights.map((item) => (
                            <div
                                key={item.title}
                                className="glass glass-hover rounded-2xl p-5"
                            >
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-xl">
                                    {item.icon}
                                </div>

                                <h4 className="mt-4 font-semibold text-white">
                                    {item.title}
                                </h4>

                                <p className="mt-2 text-sm leading-6 text-slate-400">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About
