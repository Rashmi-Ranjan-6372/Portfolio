function About() {
    const highlights = [
        {
            title: 'Backend Development',
            description:
                'Developing maintainable server-side applications and business logic using Python and Django.',
            icon: '⚙️',
        },
        {
            title: 'REST API Development',
            description:
                'Building structured APIs with Django REST Framework, authentication, and validation.',
            icon: '🔗',
        },
        {
            title: 'Database Management',
            description:
                'Working with PostgreSQL, relational models, queries, and data integrity.',
            icon: '🗄️',
        },
        {
            title: 'System Integration',
            description:
                'Connecting backend services and implementing practical application requirements.',
            icon: '🔧',
        },
    ]

    const technicalSkills = [
        'Python',
        'Django',
        'Django REST Framework',
        'REST APIs',
        'PostgreSQL',
        'MySQL',
        'JWT Authentication',
        'Git',
    ]

    return (
        <section
            id="about"
            className="section-container scroll-mt-24 py-24 sm:py-28"
        >
            <div className="mb-12 text-center">
                <p className="gradient-text text-sm font-semibold uppercase tracking-[0.25em]">
                    Discover My Journey
                </p>

                <h2 className="mt-4 text-3xl font-bold text-white sm:text-5xl">
                    About <span className="gradient-text">Me</span>
                </h2>

                <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-400">
                    My background, technical expertise, and passion for building
                    reliable backend applications.
                </p>
            </div>

            <div className="grid items-start gap-8 lg:grid-cols-[0.85fr_1.15fr]">
                <div className="glass rounded-3xl p-6 sm:p-8">
                    <div className="relative mx-auto flex h-36 w-36 items-center justify-center rounded-full border border-cyan-300/30 bg-gradient-to-br from-cyan-400/20 to-violet-500/20 shadow-xl shadow-cyan-500/10">
                        <span className="gradient-text text-5xl font-bold">
                            RR
                        </span>

                        <span
                            className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-4 border-slate-900 bg-emerald-400"
                            aria-hidden="true"
                        />
                    </div>

                    <h3 className="mt-6 text-center text-2xl font-bold text-white">
                        Rashmi Ranjan Pradhan
                    </h3>

                    <p className="mt-2 text-center text-cyan-200">
                        Python Backend Developer
                    </p>

                    <div className="mt-7 space-y-4 border-t border-white/10 pt-6">
                        <div className="flex items-start justify-between gap-4">
                            <span className="text-sm text-slate-400">
                                Primary Language
                            </span>
                            <span className="text-right text-sm font-medium text-slate-200">
                                Python
                            </span>
                        </div>

                        <div className="flex items-start justify-between gap-4">
                            <span className="text-sm text-slate-400">
                                Frameworks
                            </span>
                            <span className="text-right text-sm font-medium text-slate-200">
                                Django / DRF
                            </span>
                        </div>

                        <div className="flex items-start justify-between gap-4">
                            <span className="text-sm text-slate-400">
                                Databases
                            </span>
                            <span className="text-right text-sm font-medium text-slate-200">
                                PostgreSQL / MySQL
                            </span>
                        </div>

                        <div className="flex items-start justify-between gap-4">
                            <span className="text-sm text-slate-400">
                                Development Focus
                            </span>
                            <span className="text-right text-sm font-medium text-slate-200">
                                Backend & APIs
                            </span>
                        </div>
                    </div>

                    <div className="mt-7 flex flex-wrap justify-center gap-3">
                        <a
                            href="https://github.com/Rashmi-Ranjan-6372"
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-cyan-300/40 hover:text-cyan-200"
                        >
                            GitHub ↗
                        </a>

                        <a
                            href="https://linkedin.com/in/rrpradhan798483"
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-cyan-300/40 hover:text-cyan-200"
                        >
                            LinkedIn ↗
                        </a>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass rounded-3xl p-6 sm:p-8">
                        <p className="text-sm font-semibold uppercase tracking-wider text-cyan-200">
                            Who I Am
                        </p>

                        <h3 className="mt-3 text-xl font-bold text-white sm:text-2xl">
                            Building practical backend{' '}
                            <span className="gradient-text">
                                solutions
                            </span>
                        </h3>

                        <p className="mt-5 leading-8 text-slate-300">
                            I am a Python Backend Developer who builds web
                            applications, REST APIs, database-driven systems,
                            and backend integrations. I enjoy converting
                            application requirements into organized and
                            maintainable software.
                        </p>

                        <p className="mt-4 leading-8 text-slate-400">
                            My work includes Django and Django REST Framework,
                            API development, authentication, data validation,
                            database operations, and integration between
                            application components. I continue to strengthen
                            my technical skills through practical projects and
                            real-world development tasks.
                        </p>

                        <div className="mt-7 flex flex-wrap gap-4">
                            <a
                                href="#projects"
                                className="rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
                            >
                                Explore Projects
                            </a>

                            <a
                                href="#contact"
                                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-300/40"
                            >
                                Get In Touch
                            </a>
                        </div>
                    </div>

                    <div className="glass rounded-3xl p-6 sm:p-8">
                        <h3 className="text-xl font-bold text-white">
                            Technical <span className="gradient-text">Skills</span>
                        </h3>

                        <p className="mt-3 text-sm leading-6 text-slate-400">
                            Technologies and tools I use for backend development.
                        </p>

                        <div className="mt-5 flex flex-wrap gap-3">
                            {technicalSkills.map((skill) => (
                                <span
                                    key={skill}
                                    className="rounded-xl border border-cyan-300/10 bg-cyan-300/5 px-3 py-2 text-sm text-slate-300 transition hover:border-cyan-300/30 hover:text-cyan-200"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {highlights.map((item) => (
                            <div
                                key={item.title}
                                className="glass glass-hover rounded-2xl p-5 transition duration-300 hover:-translate-y-1"
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