
const projects = [
    {
        number: '01',
        title: 'CMMS Web Project',
        category: 'Backend Development',
        description:
            'A Computerized Maintenance Management System backend with component management, warehouse inventory, stock movements, BOM management, and REST APIs.',
        technologies: ['Python', 'Django', 'DRF', 'PostgreSQL'],
        github: 'https://github.com/AsishSahu2025/CMMS_Backend_Project',
    },
    {
        number: '02',
        title: 'IOCL Mobile App Backend',
        category: 'IoT & API Development',
        description:
            'A backend application for industrial water treatment monitoring, including treatment stages, equipment and sensor data, process monitoring, and alerts.',
        technologies: ['Python', 'Django REST Framework', 'PostgreSQL', 'MQTT'],
        github: '',
    },
    {
        number: '03',
        title: 'Personal Portfolio',
        category: 'Full-Stack Development',
        description:
            'A responsive developer portfolio featuring professional information, technical skills, projects, education, experience, blog posts, and contact functionality.',
        technologies: ['React', 'Tailwind CSS', 'Django', 'REST APIs'],
        github: 'https://github.com/Rashmi-Ranjan-6372',
    },
]

function Projects() {
    return (
        <section id="projects" className="section-container py-24 sm:py-28">
            <div className="mb-12 text-center">
                <p className="gradient-text text-sm font-semibold uppercase tracking-[0.25em]">
                    What I've Built
                </p>

                <h2 className="mt-4 text-3xl font-bold sm:text-5xl">
                    Featured <span className="gradient-text">Projects</span>
                </h2>

                <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-400">
                    A selection of projects demonstrating my work in backend development,
                    API design, database management, and application integration.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {projects.map((project) => (
                    <article
                        key={project.number}
                        className="glass glass-hover group flex h-full flex-col rounded-3xl p-6 sm:p-8"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <span className="gradient-text text-4xl font-bold">
                                {project.number}
                            </span>

                            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-medium text-cyan-200">
                                {project.category}
                            </span>
                        </div>

                        <h3 className="mt-6 text-2xl font-bold transition-colors group-hover:text-cyan-200">
                            {project.title}
                        </h3>

                        <p className="mt-4 flex-1 leading-7 text-slate-400">
                            {project.description}
                        </p>

                        <div className="mt-6 flex flex-wrap gap-2">
                            {project.technologies.map((technology) => (
                                <span
                                    key={technology}
                                    className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-300"
                                >
                                    {technology}
                                </span>
                            ))}
                        </div>

                        <div className="mt-8 border-t border-white/10 pt-5">
                            {project.github ? (
                                <a
                                    href={project.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition hover:text-violet-300"
                                >
                                    View on GitHub
                                    <span aria-hidden="true">↗</span>
                                </a>
                            ) : (
                                <span className="text-sm text-slate-500">
                                    Repository link not added
                                </span>
                            )}
                        </div>
                    </article>
                ))}
            </div>
        </section>
    )
}

export default Projects
