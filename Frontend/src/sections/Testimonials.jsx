
import { useEffect, useState } from 'react'
import api from '../api/axios'

function Testimonials() {
    const [testimonials, setTestimonials] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await api.get('testimonials/')
                const result = response.data

                const items = Array.isArray(result)
                    ? result
                    : Array.isArray(result.results)
                        ? result.results
                        : Array.isArray(result.data)
                            ? result.data
                            : []

                setTestimonials(
                    items
                        .filter((item) => item.is_active !== false)
                        .sort((a, b) => {
                            if (a.is_featured !== b.is_featured) {
                                return a.is_featured ? -1 : 1
                            }

                            return (a.display_order ?? 0) - (b.display_order ?? 0)
                        })
                )
            } catch {
                setError('Unable to load testimonials. Please try again later.')
            } finally {
                setLoading(false)
            }
        }

        fetchTestimonials()
    }, [])

    const getImageUrl = (image) => {
        if (!image) return ''

        return image.startsWith('http')
            ? image
            : `http://127.0.0.1:8000${image}`
    }

    const getRating = (rating) => {
        const value = Math.min(5, Math.max(0, Number(rating) || 0))

        return '★'.repeat(value) + '☆'.repeat(5 - value)
    }

    return (
        <section
            id="testimonials"
            className="section-container py-24 sm:py-28"
        >
            <div className="mb-12 text-center">
                <p className="gradient-text text-sm font-semibold uppercase tracking-[0.25em]">
                    Feedback & Collaboration
                </p>

                <h2 className="mt-4 text-3xl font-bold sm:text-5xl">
                    What People <span className="gradient-text">Say</span>
                </h2>

                <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-400">
                    Feedback from colleagues and collaborators about my technical
                    skills, teamwork, and professional approach.
                </p>
            </div>

            {loading && (
                <p className="py-10 text-center text-slate-400">
                    Loading testimonials...
                </p>
            )}

            {error && (
                <p className="py-10 text-center text-red-400">
                    {error}
                </p>
            )}

            {!loading && !error && testimonials.length === 0 && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[
                        {
                            title: 'Working Together',
                            description:
                                'Have we worked together on a software project? I would love to hear about your experience collaborating with me.',
                            icon: '🤝',
                            label: 'For Colleagues',
                        },
                        {
                            title: 'Project Feedback',
                            description:
                                'Have you used an API or application I developed? Your genuine feedback helps me improve my work.',
                            icon: '💻',
                            label: 'For Clients',
                        },
                        {
                            title: 'Professional Growth',
                            description:
                                'Feedback on my technical skills, teamwork, and problem-solving approach is always welcome.',
                            icon: '🚀',
                            label: 'For Mentors',
                        },
                    ].map((item) => (
                        <article
                            key={item.title}
                            className="glass glass-hover rounded-3xl p-6 sm:p-8"
                        >
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-2xl">
                                {item.icon}
                            </div>

                            <span className="mt-6 inline-block text-xs font-semibold uppercase tracking-wider text-violet-300">
                                {item.label}
                            </span>

                            <h3 className="mt-3 text-xl font-bold">
                                {item.title}
                            </h3>

                            <p className="mt-4 leading-7 text-slate-400">
                                {item.description}
                            </p>
                        </article>
                    ))}
                </div>
            )}

            {!loading && !error && testimonials.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((item) => (
                        <article
                            key={item.id}
                            className="glass glass-hover flex h-full flex-col rounded-3xl p-6 sm:p-8"
                        >
                            <div className="flex items-start gap-4">
                                {item.profile_image ? (
                                    <img
                                        src={getImageUrl(item.profile_image)}
                                        alt={item.name}
                                        className="h-14 w-14 shrink-0 rounded-2xl border border-white/10 object-cover"
                                    />
                                ) : (
                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-xl font-bold text-cyan-200">
                                        {item.name?.charAt(0)?.toUpperCase() || '?'}
                                    </div>
                                )}

                                <div className="min-w-0 flex-1">
                                    <h3 className="break-words text-lg font-bold">
                                        {item.name}
                                    </h3>

                                    {item.designation && (
                                        <p className="mt-1 text-sm text-cyan-200">
                                            {item.designation}
                                        </p>
                                    )}

                                    {item.company_name && (
                                        <p className="mt-1 text-sm text-slate-400">
                                            {item.company_name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {item.rating != null && (
                                <p
                                    className="mt-5 tracking-wider text-amber-300"
                                    aria-label={`${item.rating} out of 5 stars`}
                                >
                                    {getRating(item.rating)}
                                </p>
                            )}

                            <p className="mt-5 flex-1 whitespace-pre-line leading-7 text-slate-300">
                                “{item.message}”
                            </p>

                            {item.company_website && (
                                <a
                                    href={item.company_website}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-5 inline-flex w-fit text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
                                >
                                    Visit Website ↗
                                </a>
                            )}
                        </article>
                    ))}
                </div>
            )}

            <div className="glass mt-8 rounded-2xl p-6 text-center sm:p-8">
                <p className="text-lg font-semibold">
                    Worked with me?
                </p>

                <p className="mt-2 leading-7 text-slate-400">
                    Your genuine feedback can help visitors understand my working style
                    and professional approach.
                </p>

                <a
                    href="#contact"
                    className="mt-5 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 font-semibold text-slate-950 transition hover:scale-[1.03]"
                >
                    Share Your Feedback
                </a>
            </div>
        </section>
    )
}

export default Testimonials
