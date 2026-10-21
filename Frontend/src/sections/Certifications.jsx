
import { useEffect, useState } from 'react'
import api from '../api/axios'

function Certifications() {
    const [certifications, setCertifications] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchCertifications = async () => {
            try {
                const response = await api.get('certifications/')
                const result = response.data

                const items = Array.isArray(result)
                    ? result
                    : Array.isArray(result.results)
                        ? result.results
                        : Array.isArray(result.data)
                            ? result.data
                            : []

                setCertifications(
                    items
                        .filter((item) => item.is_active !== false)
                        .sort((a, b) => {
                            return new Date(b.issue_date) - new Date(a.issue_date)
                        })
                )
            } catch {
                setError('Unable to load certifications. Please try again later.')
            } finally {
                setLoading(false)
            }
        }

        fetchCertifications()
    }, [])

    const formatDate = (date) => {
        if (!date) return ''

        return new Date(`${date}T00:00:00`).getFullYear()
    }

    const getSkills = (tags) => {
        if (!tags) return []

        if (Array.isArray(tags)) {
            return tags
        }

        return tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean)
    }

    const getImageUrl = (image) => {
        if (!image) return ''

        return image.startsWith('http')
            ? image
            : `http://127.0.0.1:8000${image}`
    }

    return (
        <section
            id="certifications"
            className="section-container py-24 sm:py-28"
        >
            <div className="mb-12 text-center">
                <p className="gradient-text text-sm font-semibold uppercase tracking-[0.25em]">
                    Learning & Development
                </p>

                <h2 className="mt-4 text-3xl font-bold sm:text-5xl">
                    My <span className="gradient-text">Certifications</span>
                </h2>

                <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-400">
                    Certifications that reflect my commitment to learning programming
                    concepts and improving my technical skills.
                </p>
            </div>

            {loading && (
                <p className="py-10 text-center text-slate-400">
                    Loading certifications...
                </p>
            )}

            {error && (
                <p className="py-10 text-center text-red-400">
                    {error}
                </p>
            )}

            {!loading && !error && certifications.length === 0 && (
                <p className="py-10 text-center text-slate-400">
                    No certifications available yet.
                </p>
            )}

            {!loading && !error && certifications.length > 0 && (
                <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
                    {certifications.map((certification, index) => (
                        <article
                            key={certification.id ?? certification.title}
                            className="glass glass-hover flex h-full flex-col rounded-3xl p-6 sm:p-8"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-2xl text-cyan-200">
                                    {certification.certificate_image ? (
                                        <img
                                            src={getImageUrl(certification.certificate_image)}
                                            alt={certification.title}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span aria-hidden="true">✦</span>
                                    )}
                                </div>

                                <span className="rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-1.5 text-xs font-medium text-violet-200">
                                    {certification.category || 'Certification'}
                                </span>
                            </div>

                            <h3 className="mt-6 text-xl font-bold sm:text-2xl">
                                {certification.title}
                            </h3>

                            <p className="mt-3 text-cyan-200">
                                {certification.issuing_organization}
                            </p>

                            <p className="mt-2 text-sm text-slate-400">
                                Issued in {formatDate(certification.issue_date)}
                            </p>

                            {certification.expiry_date && !certification.date_not_expired && (
                                <p className="mt-2 text-sm text-slate-400">
                                    Expired in {formatDate(certification.expiry_date)}
                                </p>
                            )}

                            {certification.credentials_id && (
                                <p className="mt-2 break-all text-sm text-slate-400">
                                    Credential ID: {certification.credentials_id}
                                </p>
                            )}

                            <p className="mt-5 flex-1 whitespace-pre-line leading-7 text-slate-400">
                                {certification.description || 'Professional certification demonstrating technical knowledge and continued learning.'}
                            </p>

                            {getSkills(certification.tags).length > 0 && (
                                <div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-5">
                                    {getSkills(certification.tags).map((skill) => (
                                        <span
                                            key={skill}
                                            className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-300"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {certification.certificate_url && (
                                <a
                                    href={certification.certificate_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
                                >
                                    View Certificate
                                    <span aria-hidden="true">↗</span>
                                </a>
                            )}
                        </article>
                    ))}
                </div>
            )}

            <p className="mt-8 text-center text-sm text-slate-500">
                More certifications can be added as you complete additional courses.
            </p>
        </section>
    )
}

export default Certifications
