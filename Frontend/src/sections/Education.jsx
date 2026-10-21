
import { useEffect, useState } from 'react'
import api from '../api/axios'

function Education() {
    const [education, setEducation] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchEducation = async () => {
            try {
                const response = await api.get('education/')
                const result = response.data

                const items = Array.isArray(result)
                    ? result
                    : Array.isArray(result.results)
                        ? result.results
                        : Array.isArray(result.data)
                            ? result.data
                            : []

                setEducation(
                    items
                        .filter((item) => item.is_active !== false)
                        .sort((a, b) => {
                            return new Date(b.start_date) - new Date(a.start_date)
                        })
                )
            } catch {
                setError('Unable to load education details. Please try again later.')
            } finally {
                setLoading(false)
            }
        }

        fetchEducation()
    }, [])

    const formatDate = (date) => {
        if (!date) return ''

        return new Date(`${date}T00:00:00`).getFullYear()
    }

    const getPeriod = (item) => {
        const start = formatDate(item.start_date)
        const end = item.is_current
            ? 'Present'
            : formatDate(item.end_date)

        return `${start} – ${end || 'Present'}`
    }

    const getLevel = (degree) => {
        const value = degree.toLowerCase()

        if (
            value.includes('master') ||
            value.includes('mca') ||
            value.includes('m.tech') ||
            value.includes('mba')
        ) {
            return 'Postgraduate'
        }

        if (
            value.includes('bachelor') ||
            value.includes('b.sc') ||
            value.includes('bsc') ||
            value.includes('b.tech') ||
            value.includes('bca')
        ) {
            return 'Undergraduate'
        }

        if (
            value.includes('12th') ||
            value.includes('higher secondary')
        ) {
            return 'Higher Secondary'
        }

        return 'Academic Qualification'
    }

    return (
        <section
            id="education"
            className="section-container py-24 sm:py-28"
        >
            <div className="mb-12 text-center">
                <p className="gradient-text text-sm font-semibold uppercase tracking-[0.25em]">
                    Academic Background
                </p>

                <h2 className="mt-4 text-3xl font-bold sm:text-5xl">
                    My <span className="gradient-text">Education</span>
                </h2>

                <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-400">
                    My academic journey and the educational foundation behind my
                    software development career.
                </p>
            </div>

            {loading && (
                <p className="py-10 text-center text-slate-400">
                    Loading education details...
                </p>
            )}

            {error && (
                <p className="py-10 text-center text-red-400">
                    {error}
                </p>
            )}

            {!loading && !error && education.length === 0 && (
                <p className="py-10 text-center text-slate-400">
                    No education details available yet.
                </p>
            )}

            {!loading && !error && education.length > 0 && (
                <div className="mx-auto grid max-w-5xl gap-6">
                    {education.map((item, index) => (
                        <article
                            key={item.id ?? item.degree}
                            className="glass glass-hover rounded-3xl p-6 sm:p-8"
                        >
                            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-xl font-bold text-cyan-200">
                                    {String(index + 1).padStart(2, '0')}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                                        <div>
                                            <span className="text-xs font-semibold uppercase tracking-wider text-violet-300">
                                                {getLevel(item.degree || '')}
                                            </span>

                                            <h3 className="mt-2 text-xl font-bold leading-snug sm:text-2xl">
                                                {item.degree}
                                            </h3>
                                        </div>

                                        <span className="w-fit shrink-0 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300">
                                            {getPeriod(item)}
                                        </span>
                                    </div>

                                    <p className="mt-3 leading-7 text-cyan-200">
                                        {item.institution}
                                    </p>

                                    {item.field_of_study && (
                                        <p className="mt-2 text-sm text-slate-400">
                                            Field of Study: {item.field_of_study}
                                        </p>
                                    )}

                                    {item.institution_location && (
                                        <p className="mt-2 text-sm text-slate-400">
                                            <span className="mr-2">📍</span>
                                            {item.institution_location}
                                        </p>
                                    )}

                                    {item.description && (
                                        <p className="mt-4 leading-7 text-slate-400">
                                            {item.description}
                                        </p>
                                    )}

                                    {item.grade && (
                                        <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-2">
                                            <span className="text-sm text-slate-400">
                                                Academic Result
                                            </span>
                                            <span className="font-semibold text-emerald-200">
                                                {item.grade}
                                            </span>
                                        </div>
                                    )}

                                    {item.certificate_image && (
                                        <a
                                            href={
                                                item.certificate_image.startsWith('http')
                                                    ? item.certificate_image
                                                    : `http://127.0.0.1:8000${item.certificate_image}`
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-5 inline-flex text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
                                        >
                                            View Certificate →
                                        </a>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    )
}

export default Education
