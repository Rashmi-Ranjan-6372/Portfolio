
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

function Blog() {
    const [blogPosts, setBlogPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchBlogPosts = async () => {
            try {
                const response = await api.get('blog/')
                const result = response.data

                const items = Array.isArray(result)
                    ? result
                    : Array.isArray(result.results)
                        ? result.results
                        : Array.isArray(result.data)
                            ? result.data
                            : []

                setBlogPosts(
                    items
                        .filter((post) => post.is_published === true)
                        .sort((a, b) => {
                            return (
                                new Date(b.published_at || b.created_at || 0) -
                                new Date(a.published_at || a.created_at || 0)
                            )
                        })
                )
            } catch {
                setError('Unable to load blog posts. Please try again later.')
            } finally {
                setLoading(false)
            }
        }

        fetchBlogPosts()
    }, [])

    const getImageUrl = (image) => {
        if (!image) return ''

        return image.startsWith('http')
            ? image
            : `http://127.0.0.1:8000${image}`
    }

    const getTags = (tags) => {
        if (!tags) return []

        if (Array.isArray(tags)) return tags

        return tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean)
    }

    const getReadTime = (content) => {
        if (!content) return '1 min read'

        const words = content.trim().split(/\s+/).length
        return `${Math.max(1, Math.ceil(words / 200))} min read`
    }

    const formatDate = (date) => {
        if (!date) return ''

        const parsedDate = new Date(date)

        if (Number.isNaN(parsedDate.getTime())) return ''

        return parsedDate.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        })
    }

    return (
        <section
            id="blog"
            className="section-container py-24 sm:py-28"
        >
            <div className="mb-12 text-center">
                <p className="gradient-text text-sm font-semibold uppercase tracking-[0.25em]">
                    Knowledge & Insights
                </p>

                <h2 className="mt-4 text-3xl font-bold sm:text-5xl">
                    My <span className="gradient-text">Blog</span>
                </h2>

                <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-400">
                    Technical topics and learning notes from my journey in Python
                    backend development, REST APIs, and databases.
                </p>
            </div>

            {loading && (
                <p className="py-10 text-center text-slate-400">
                    Loading blog posts...
                </p>
            )}

            {error && (
                <p className="py-10 text-center text-red-400">
                    {error}
                </p>
            )}

            {!loading && !error && blogPosts.length === 0 && (
                <p className="py-10 text-center text-slate-400">
                    No published blog posts available yet.
                </p>
            )}

            {!loading && !error && blogPosts.length > 0 && (
                <div className="grid gap-6 lg:grid-cols-3">
                    {blogPosts.map((post, index) => (
                        <article
                            key={post.id ?? post.slug}
                            className="glass glass-hover group flex h-full flex-col overflow-hidden rounded-3xl"
                        >
                            <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-cyan-400/15 via-violet-500/10 to-transparent">
                                {post.thumbnail ? (
                                    <img
                                        src={getImageUrl(post.thumbnail)}
                                        alt={post.title}
                                        className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06] text-3xl font-bold text-cyan-200 transition duration-300 group-hover:scale-110">
                                        {'</>'}
                                    </div>
                                )}

                                <span className="absolute right-5 top-4 text-sm font-bold text-white/70">
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                            </div>

                            <div className="flex flex-1 flex-col p-6">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-medium text-cyan-200">
                                        {post.category || 'Technology'}
                                    </span>

                                    <span className="text-xs text-slate-500">
                                        {getReadTime(post.content)}
                                    </span>
                                </div>

                                {post.published_at && (
                                    <p className="mt-3 text-xs text-slate-500">
                                        {formatDate(post.published_at)}
                                    </p>
                                )}

                                <h3 className="mt-5 text-xl font-bold leading-snug transition-colors group-hover:text-cyan-200">
                                    {post.title}
                                </h3>

                                <p className="mt-4 flex-1 text-sm leading-7 text-slate-400">
                                    {post.summary}
                                </p>

                                {getTags(post.tags).length > 0 && (
                                    <div className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-5">
                                        {getTags(post.tags).map((tag) => (
                                            <span
                                                key={tag}
                                                className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {post.slug && (
                                    <Link
                                        to={`/blog/${post.slug}`}
                                        className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
                                    >
                                        Read Article
                                        <span aria-hidden="true">→</span>
                                    </Link>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            )}

            <div className="mt-10 text-center">
                <a
                    href="#contact"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-6 py-3 font-medium text-slate-200 transition hover:border-cyan-300/40 hover:text-cyan-200"
                >
                    Discuss a Technical Topic
                    <span aria-hidden="true">↗</span>
                </a>
            </div>
        </section>
    )
}

export default Blog
