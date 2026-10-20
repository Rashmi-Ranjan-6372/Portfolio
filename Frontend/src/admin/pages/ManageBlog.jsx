
import { useEffect, useState } from 'react'
import api from '../../api/axios'

const emptyForm = {
    title: '',
    slug: '',
    thumbnail: null,
    summary: '',
    content: '',
    category: '',
    tags: '',
    is_published: false,
    published_at: '',
}

const inputClass =
    'w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400 [color-scheme:dark]'

const labelClass = 'mb-2 block text-sm text-slate-300'

function getList(responseData) {
    const data =
        responseData?.data ??
        responseData?.results ??
        responseData

    return Array.isArray(data) ? data : []
}

function getErrorMessage(err) {
    const data = err.response?.data

    if (typeof data === 'string') {
        return data
    }

    if (data?.detail) {
        return data.detail
    }

    if (data?.message) {
        return data.message
    }

    if (data && typeof data === 'object') {
        return Object.entries(data)
            .map(([field, errors]) => {
                const message = Array.isArray(errors)
                    ? errors.join(', ')
                    : typeof errors === 'string'
                        ? errors
                        : JSON.stringify(errors)

                return `${field}: ${message}`
            })
            .join('\n')
    }

    return 'Something went wrong. Please check your Django API.'
}

function toDateTimeLocal(value) {
    if (!value) return ''

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
        return value.slice(0, 16)
    }

    const localDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
    )

    return localDate.toISOString().slice(0, 16)
}

function ManageBlog() {
    const [blogs, setBlogs] = useState([])
    const [formData, setFormData] = useState({ ...emptyForm })
    const [editingId, setEditingId] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')

    const getBlogs = async () => {
        setLoading(true)
        setError('')

        try {
            const response = await api.get('blog/')
            setBlogs(getList(response.data))
        } catch (err) {
            setError(getErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getBlogs()
    }, [])

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target

        if (type === 'checkbox') {
            setFormData((previous) => ({
                ...previous,
                [name]: checked,
                ...(name === 'is_published' && checked
                    ? {
                        published_at:
                            previous.published_at ||
                            new Date().toISOString().slice(0, 16),
                    }
                    : {}),
            }))
            return
        }

        if (type === 'file') {
            setFormData((previous) => ({
                ...previous,
                [name]: files?.[0] || null,
            }))
            return
        }

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }))
    }

    const openAddForm = () => {
        setEditingId(null)
        setFormData({ ...emptyForm })
        setError('')
        setMessage('')
        setShowForm(true)
    }

    const openEditForm = (blog) => {
        setEditingId(blog.id)

        setFormData({
            title: blog.title ?? '',
            slug: blog.slug ?? '',
            thumbnail: null,
            summary: blog.summary ?? '',
            content: blog.content ?? '',
            category: blog.category ?? '',
            tags: blog.tags ?? '',
            is_published: blog.is_published ?? false,
            published_at: toDateTimeLocal(blog.published_at),
        })

        setError('')
        setMessage('')
        setShowForm(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        setError('')
        setMessage('')

        if (formData.is_published && !formData.published_at) {
            setError('Please select the publication date and time.')
            setSaving(false)
            return
        }

        const payload = new FormData()

        payload.append('title', formData.title.trim())
        payload.append('slug', formData.slug.trim())
        payload.append('summary', formData.summary.trim())
        payload.append('content', formData.content)
        payload.append('category', formData.category.trim())
        payload.append('tags', formData.tags.trim())
        payload.append('is_published', String(formData.is_published))

        if (formData.is_published && formData.published_at) {
            payload.append(
                'published_at',
                new Date(formData.published_at).toISOString()
            )
        } else {
            payload.append('published_at', '')
        }

        if (formData.thumbnail instanceof File) {
            payload.append('thumbnail', formData.thumbnail)
        }

        try {
            if (editingId !== null) {
                await api.patch(`blog/${editingId}/`, payload)
                setMessage('Blog post updated successfully.')
            } else {
                await api.post('blog/', payload)
                setMessage('Blog post created successfully.')
            }

            setShowForm(false)
            setFormData({ ...emptyForm })
            setEditingId(null)
            await getBlogs()
        } catch (err) {
            setError(getErrorMessage(err))
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id) => {
        if (
            !window.confirm(
                'Are you sure you want to delete this blog post?'
            )
        ) {
            return
        }

        setError('')
        setMessage('')

        try {
            await api.delete(`blog/${id}/`)
            setMessage('Blog post deleted successfully.')
            await getBlogs()
        } catch (err) {
            setError(getErrorMessage(err))
        }
    }

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <p className="text-sm font-medium text-cyan-400">
                        PORTFOLIO CONTENT
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-white">
                        Manage Blog
                    </h1>

                    <p className="mt-2 text-sm text-slate-400">
                        Create articles, manage thumbnails, and publish posts.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={openAddForm}
                    className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
                >
                    + Create Blog Post
                </button>
            </header>

            {message && (
                <div
                    role="status"
                    className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300"
                >
                    {message}
                </div>
            )}

            {error && (
                <div
                    role="alert"
                    className="whitespace-pre-line break-words rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300"
                >
                    {error}
                </div>
            )}

            {showForm && (
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-7"
                >
                    <h2 className="text-xl font-semibold text-white">
                        {editingId !== null
                            ? 'Edit Blog Post'
                            : 'Create Blog Post'}
                    </h2>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                            <label htmlFor="title" className={labelClass}>
                                Blog Title
                            </label>
                            <input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                maxLength={200}
                                placeholder="Getting Started with Django REST Framework"
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label htmlFor="slug" className={labelClass}>
                                URL Slug (Optional)
                            </label>
                            <input
                                id="slug"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                placeholder="Leave blank to generate from title"
                                className={inputClass}
                            />
                            <p className="mt-1 text-xs text-slate-500">
                                Your Django model generates a slug when it is
                                empty. Leave it blank to use that behavior.
                            </p>
                        </div>

                        <div>
                            <label htmlFor="category" className={labelClass}>
                                Category (Optional)
                            </label>
                            <input
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                maxLength={100}
                                placeholder="Django, Python, Backend"
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label htmlFor="tags" className={labelClass}>
                                Tags (Optional)
                            </label>
                            <input
                                id="tags"
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                maxLength={300}
                                placeholder="Python, Django, REST API"
                                className={inputClass}
                            />
                            <p className="mt-1 text-xs text-slate-500">
                                Enter tags as comma-separated text.
                            </p>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="summary" className={labelClass}>
                                Summary
                            </label>
                            <textarea
                                id="summary"
                                name="summary"
                                value={formData.summary}
                                onChange={handleChange}
                                required
                                maxLength={300}
                                rows={3}
                                placeholder="Write a short introduction to your article."
                                className={inputClass}
                            />
                            <p className="mt-1 text-right text-xs text-slate-500">
                                {formData.summary.length}/300
                            </p>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="content" className={labelClass}>
                                Blog Content
                            </label>
                            <textarea
                                id="content"
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                required
                                rows={10}
                                placeholder="Write your full blog article here..."
                                className={inputClass}
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="thumbnail" className={labelClass}>
                                Blog Thumbnail (Optional)
                            </label>
                            <input
                                id="thumbnail"
                                name="thumbnail"
                                type="file"
                                accept="image/*"
                                onChange={handleChange}
                                className={`${inputClass} file:mr-4 file:rounded-lg file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:font-semibold file:text-slate-950`}
                            />

                            {formData.thumbnail instanceof File && (
                                <p className="mt-2 text-sm text-slate-400">
                                    Selected: {formData.thumbnail.name}
                                </p>
                            )}

                            {editingId !== null &&
                                blogs.find((blog) => blog.id === editingId)?.thumbnail && (
                                    <a
                                        href={
                                            blogs.find(
                                                (blog) => blog.id === editingId
                                            )?.thumbnail
                                        }
                                        target="_blank"
                                        rel="noreferrer"
                                        className="mt-2 inline-block text-sm text-cyan-300 hover:underline"
                                    >
                                        View Current Thumbnail ↗
                                    </a>
                                )}
                        </div>

                        <div className="sm:col-span-2">
                            <label className="flex items-center gap-3 text-sm text-slate-300">
                                <input
                                    type="checkbox"
                                    name="is_published"
                                    checked={formData.is_published}
                                    onChange={handleChange}
                                    className="h-4 w-4 accent-cyan-400"
                                />
                                Publish this blog post
                            </label>
                        </div>

                        {formData.is_published && (
                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="published_at"
                                    className={labelClass}
                                >
                                    Publication Date and Time
                                </label>
                                <input
                                    id="published_at"
                                    name="published_at"
                                    type="datetime-local"
                                    value={formData.published_at}
                                    onChange={handleChange}
                                    required
                                    className={inputClass}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 disabled:opacity-60"
                        >
                            {saving
                                ? 'Saving...'
                                : editingId !== null
                                    ? 'Update Blog Post'
                                    : 'Save Blog Post'}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setShowForm(false)
                                setError('')
                            }}
                            className="rounded-xl border border-white/10 px-5 py-3 text-sm text-slate-300 hover:bg-white/5"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <section>
                <div className="mb-4 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
                    <h2 className="font-semibold text-white">
                        Blog Posts
                        <span className="ml-2 text-sm font-normal text-slate-400">
                            ({blogs.length})
                        </span>
                    </h2>
                </div>

                {loading ? (
                    <p className="p-6 text-sm text-slate-400">
                        Loading blog posts...
                    </p>
                ) : blogs.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 p-8 text-sm text-slate-400">
                        No blog posts found. Create your first article.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                        {blogs.map((blog) => (
                            <article
                                key={blog.id}
                                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
                            >
                                {blog.thumbnail && (
                                    <img
                                        src={blog.thumbnail}
                                        alt={blog.title}
                                        className="h-48 w-full object-cover"
                                    />
                                )}

                                <div className="p-5">
                                    <div className="mb-3 flex flex-wrap items-center gap-2">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                blog.is_published
                                                    ? 'bg-emerald-400/10 text-emerald-300'
                                                    : 'bg-amber-400/10 text-amber-300'
                                            }`}
                                        >
                                            {blog.is_published
                                                ? 'Published'
                                                : 'Draft'}
                                        </span>

                                        {blog.category && (
                                            <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300">
                                                {blog.category}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-lg font-semibold text-white">
                                        {blog.title}
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-slate-400">
                                        {blog.summary}
                                    </p>

                                    {blog.tags && (
                                        <p className="mt-3 break-words text-xs text-slate-500">
                                            Tags: {blog.tags}
                                        </p>
                                    )}

                                    <p className="mt-3 break-all text-xs text-slate-500">
                                        Slug: {blog.slug}
                                    </p>

                                    {blog.published_at && (
                                        <p className="mt-2 text-xs text-slate-500">
                                            Published: {new Date(
                                                blog.published_at
                                            ).toLocaleString()}
                                        </p>
                                    )}

                                    <p className="mt-2 text-xs text-slate-500">
                                        Created: {blog.created_at
                                            ? new Date(
                                                blog.created_at
                                            ).toLocaleDateString()
                                            : '—'}
                                    </p>

                                    <div className="mt-5 flex gap-5 border-t border-white/10 pt-4 text-sm">
                                        <button
                                            type="button"
                                            onClick={() => openEditForm(blog)}
                                            className="text-cyan-300 hover:underline"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleDelete(blog.id)}
                                            className="text-red-400 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}

export default ManageBlog
