import { useEffect, useState } from 'react'
import api from '../api/axios'

function getImageUrl(image) {
    if (!image) return ''

    if (image.startsWith('http://') || image.startsWith('https://')) {
        return image
    }

    return `http://127.0.0.1:8000${image.startsWith('/') ? image : `/${image}`}`
}

function getTechnologies(technologies) {
    if (Array.isArray(technologies)) {
        return technologies
    }

    if (typeof technologies === 'string' && technologies.trim()) {
        return technologies
            .split(',')
            .map((technology) => technology.trim())
            .filter(Boolean)
    }

    return []
}

function Projects() {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        let isMounted = true

        const fetchProjects = async () => {
            try {
                const response = await api.get('projects/')
                const responseData = response.data

                const projectList = Array.isArray(responseData)
                    ? responseData
                    : responseData.results || responseData.data || []

                const visibleProjects = projectList
                    .filter((project) => project.is_featured !== false)
                    .sort(
                        (a, b) =>
                            (a.display_order ?? 0) - (b.display_order ?? 0)
                    )

                if (isMounted) {
                    setProjects(visibleProjects)
                    setError('')
                }
            } catch {
                if (isMounted) {
                    setError('Unable to load projects. Please try again later.')
                }
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        fetchProjects()

        return () => {
            isMounted = false
        }
    }, [])

    return (
        <section
            id="projects"
            className="section-container scroll-mt-24 py-24 sm:py-28"
        >
            <div className="mb-12 text-center">
                <p className="gradient-text text-sm font-semibold uppercase tracking-[0.25em]">
                    What I've Built
                </p>

                <h2 className="mt-4 text-3xl font-bold text-white sm:text-5xl">
                    Featured <span className="gradient-text">Projects</span>
                </h2>

                <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-400">
                    A selection of projects demonstrating my work in backend
                    development, API design, database management, and
                    application integration.
                </p>
            </div>

            {loading ? (
                <div className="glass rounded-2xl p-10 text-center text-slate-400">
                    Loading projects...
                </div>
            ) : error ? (
                <div className="glass rounded-2xl p-10 text-center text-rose-300">
                    {error}
                </div>
            ) : projects.length === 0 ? (
                <div className="glass rounded-2xl p-10 text-center">
                    <h3 className="text-lg font-semibold text-white">
                        Projects coming soon
                    </h3>
                    <p className="mt-2 text-sm text-slate-400">
                        Featured projects will appear here when they are available.
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 lg:grid-cols-2">
                    {projects.map((project, index) => {
                        const technologies = getTechnologies(project.technologies)
                        const thumbnail = getImageUrl(project.thumbnail)
                        const description =
                            project.short_description || project.description
                        const githubUrl = project.github_url
                        const liveUrl = project.live_demo_url

                        return (
                            <article
                                key={project.id ?? project.slug ?? index}
                                className="glass glass-hover group flex h-full flex-col overflow-hidden rounded-3xl transition duration-300 hover:-translate-y-1"
                            >
                                {thumbnail && (
                                    <div className="overflow-hidden border-b border-white/10">
                                        <img
                                            src={thumbnail}
                                            alt={`${project.title} preview`}
                                            loading="lazy"
                                            className="h-52 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-60"
                                            onError={(event) => {
                                                event.currentTarget.style.display = 'none'
                                            }}
                                        />
                                    </div>
                                )}

                                <div className="flex flex-1 flex-col p-6 sm:p-8">
                                    <div className="flex items-start justify-between gap-4">
                                        <span className="gradient-text text-4xl font-bold">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>

                                        {project.category && (
                                            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-medium text-cyan-200">
                                                {project.category}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="mt-6 break-words text-2xl font-bold text-white transition-colors group-hover:text-cyan-200">
                                        {project.title}
                                    </h3>

                                    {description && (
                                        <p className="mt-4 flex-1 whitespace-pre-line leading-7 text-slate-400">
                                            {description}
                                        </p>
                                    )}

                                    {technologies.length > 0 && (
                                        <div className="mt-6 flex flex-wrap gap-2">
                                            {technologies.map((technology) => (
                                                <span
                                                    key={technology}
                                                    className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-300"
                                                >
                                                    {technology}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="mt-8 flex flex-wrap items-center gap-5 border-t border-white/10 pt-5">
                                        {githubUrl && (
                                            <a
                                                href={githubUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition hover:text-violet-300"
                                            >
                                                GitHub <span aria-hidden="true">↗</span>
                                            </a>
                                        )}

                                        {liveUrl && (
                                            <a
                                                href={liveUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition hover:text-violet-300"
                                            >
                                                Live Demo <span aria-hidden="true">↗</span>
                                            </a>
                                        )}

                                        {!githubUrl && !liveUrl && (
                                            <span className="text-sm text-slate-500">
                                                Links coming soon
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </article>
                        )
                    })}
                </div>
            )}
        </section>
    )
}

export default Projects