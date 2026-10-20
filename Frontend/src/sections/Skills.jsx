
function Skills() {
    const skillGroups = [
        {
            title: 'Programming Language',
            icon: '💻',
            skills: ['Python', 'SQL'],
        },
        {
            title: 'Backend Development',
            icon: '⚙️',
            skills: ['Django', 'Django REST Framework', 'REST APIs', 'JWT Authentication'],
        },
        {
            title: 'Database',
            icon: '🗄️',
            skills: ['PostgreSQL', 'MySQL', 'Database Design', 'ORM'],
        },
        {
            title: 'Tools & Technologies',
            icon: '🛠️',
            skills: ['Git', 'GitHub', 'Postman', 'MQTT'],
        },
    ]

    return (
        <section id="skills" className="section-container py-24 sm:py-28">
            <div className="mb-12 text-center">
                <p className="gradient-text text-sm font-semibold uppercase tracking-[0.25em]">
                    My Technical Expertise
                </p>

                <h2 className="mt-4 text-3xl font-bold sm:text-5xl">
                    Technical <span className="gradient-text">Skills</span>
                </h2>

                <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-400">
                    Technologies and tools I use to build backend applications,
                    develop APIs, and manage data.
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
                {skillGroups.map((group) => (
                    <div
                        key={group.title}
                        className="glass glass-hover rounded-3xl p-6 sm:p-8"
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-2xl">
                                {group.icon}
                            </div>

                            <h3 className="text-lg font-bold text-white sm:text-xl">
                                {group.title}
                            </h3>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-3">
                            {group.skills.map((skill) => (
                                <span
                                    key={skill}
                                    className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-slate-300 transition duration-300 hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-cyan-200"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="glass mt-8 rounded-3xl p-6 sm:p-8">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h3 className="text-xl font-bold">
                            My Development <span className="gradient-text">Focus</span>
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-400">
                            Writing maintainable backend code and building reliable,
                            secure API-driven applications.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {['API Design', 'Authentication', 'Data Management'].map((item) => (
                            <span
                                key={item}
                                className="rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-2 text-xs font-medium text-violet-200"
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Skills
