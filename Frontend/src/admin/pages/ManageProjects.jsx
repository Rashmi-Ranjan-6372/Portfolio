import { useEffect, useState } from 'react'
import api from '../../api/axios'

const emptyForm = {
    title: '',
    short_description: '',
    description: '',
    technologies: '',
    category: '',
    thumbnail: null,
    github_url: '',
    live_demo_url: '',
    status: 'COMPLETED',
    is_featured: false,
    display_order: 0,
    start_date: '',
    end_date: '',
}

function ManageProjects() {
    const [projects, setProjects] = useState([])
    const [formData, setFormData] = useState(emptyForm)
    const [editingSlug, setEditingSlug] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [deletingSlug, setDeletingSlug] = useState(null)
    const [projectToDelete, setProjectToDelete] = useState(null)
    const [openMenuSlug, setOpenMenuSlug] = useState(null)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [thumbnailPreview, setThumbnailPreview] = useState('')

    const getProjects = async () => {
        setLoading(true)
        setError('')

        try {
            const response = await api.get('projects/')
            const data =
                response.data.data ??
                response.data.results ??
                response.data

            setProjects(Array.isArray(data) ? data : [])
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to load projects.'
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getProjects()
    }, [])

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target

        if (type === 'file') {
            const file = files?.[0] ?? null

            setFormData((previous) => ({
                ...previous,
                [name]: file,
            }))

            if (file) {
                setThumbnailPreview(URL.createObjectURL(file))
            }

            return
        }

        setFormData((previous) => ({
            ...previous,
            [name]: type === 'checkbox' ? checked : value,
        }))
    }

    const openAddForm = () => {
        setEditingSlug(null)
        setFormData({ ...emptyForm })
        setThumbnailPreview('')
        setError('')
        setMessage('')
        setShowForm(true)
        setOpenMenuSlug(null)
    }

    const openEditForm = (project) => {
        if (!project.slug) {
            setError('Project slug is missing from the API response.')
            return
        }

        setEditingSlug(project.slug)

        setFormData({
            title: project.title ?? '',
            short_description: project.short_description ?? '',
            description: project.description ?? '',
            technologies: project.technologies ?? '',
            category: project.category ?? '',
            thumbnail: null,
            github_url: project.github_url ?? '',
            live_demo_url: project.live_demo_url ?? '',
            status: project.status ?? 'COMPLETED',
            is_featured: project.is_featured ?? false,
            display_order: project.display_order ?? 0,
            start_date: project.start_date ?? '',
            end_date: project.end_date ?? '',
        })

        setThumbnailPreview(project.thumbnail ?? '')
        setError('')
        setMessage('')
        setShowForm(true)
        setOpenMenuSlug(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        setError('')
        setMessage('')

        const payload = new FormData()

        payload.append('title', formData.title.trim())
        payload.append('short_description', formData.short_description.trim())
        payload.append('description', formData.description.trim())
        payload.append('technologies', formData.technologies.trim())
        payload.append('category', formData.category.trim())
        payload.append('github_url', formData.github_url.trim())
        payload.append('live_demo_url', formData.live_demo_url.trim())
        payload.append('status', formData.status)
        payload.append('is_featured', String(formData.is_featured))
        payload.append('display_order', String(formData.display_order))
        payload.append('start_date', formData.start_date || '')
        payload.append('end_date', formData.end_date || '')

        if (formData.thumbnail instanceof File) {
            payload.append('thumbnail', formData.thumbnail)
        }

        try {
            if (editingSlug !== null) {
                await api.patch(
                    `projects/${encodeURIComponent(editingSlug)}/`,
                    payload,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                )

                setMessage('Project updated successfully.')
            } else {
                await api.post('projects/', payload, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })

                setMessage('Project added successfully.')
            }

            setShowForm(false)
            setFormData({ ...emptyForm })
            setEditingSlug(null)
            setThumbnailPreview('')
            await getProjects()
        } catch (err) {
            const data = err.response?.data

            setError(
                typeof data === 'object' && data !== null
                    ? JSON.stringify(data)
                    : 'Unable to save project.'
            )
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        const slug = projectToDelete?.slug

        if (!slug) {
            setError('Project slug is missing from the API response.')
            setProjectToDelete(null)
            return
        }

        setDeletingSlug(slug)
        setError('')

        try {
            await api.delete(
                `projects/${encodeURIComponent(slug)}/`
            )

            setProjectToDelete(null)
            setMessage('Project deleted successfully.')
            await getProjects()
        } catch (err) {
            const data = err.response?.data

            setError(
                data?.message ||
                (data ? JSON.stringify(data) : 'Unable to delete project.')
            )
            setProjectToDelete(null)
        } finally {
            setDeletingSlug(null)
        }
    }

    const inputClass =
        'mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400'

    const labelClass = 'block text-sm font-medium text-slate-300'

    const getThumbnailUrl = (thumbnail) => {
        if (!thumbnail) return ''

        if (thumbnail.startsWith('http://') || thumbnail.startsWith('https://')) {
            return thumbnail
        }

        return `http://127.0.0.1:8000${thumbnail.startsWith('/') ? '' : '/'}${thumbnail}`
    }

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <p className="text-sm font-medium text-cyan-400">
                        PORTFOLIO CONTENT
                    </p>
                    <h1 className="mt-2 text-3xl font-bold text-white">
                        Manage Projects
                    </h1>
                    <p className="mt-2 text-sm text-slate-400">
                        Manage every field of your portfolio projects.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={openAddForm}
                    className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
                >
                    + Add Project
                </button>
            </div>

            {message && (
                <div role="status" className="flex justify-between gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300">
                    <span>{message}</span>
                    <button type="button" onClick={() => setMessage('')} aria-label="Dismiss message">×</button>
                </div>
            )}

            {error && (
                <div role="alert" className="flex justify-between gap-3 break-words rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                    <span>{error}</span>
                    <button type="button" onClick={() => setError('')} aria-label="Dismiss error">×</button>
                </div>
            )}

            {showForm && (
                <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-7">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h2 className="text-xl font-semibold text-white">
                                {editingSlug !== null ? 'Edit Project' : 'Add Project'}
                            </h2>
                            <p className="mt-1 text-sm text-slate-400">
                                Complete the project details below.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            aria-label="Close project form"
                            className="rounded-lg px-3 py-1 text-2xl text-slate-400 hover:bg-white/10 hover:text-white"
                        >
                            ×
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <label className={labelClass}>
                            Project Title *
                            <input name="title" value={formData.title} onChange={handleChange} className={inputClass} required maxLength={200} />
                        </label>

                        <label className={labelClass}>
                            Category
                            <input name="category" value={formData.category} onChange={handleChange} className={inputClass} maxLength={100} placeholder="Web App, IoT, API..." />
                        </label>

                        <label className={`${labelClass} sm:col-span-2`}>
                            Short Description *
                            <input name="short_description" value={formData.short_description} onChange={handleChange} className={inputClass} required maxLength={300} />
                        </label>

                        <label className={`${labelClass} sm:col-span-2`}>
                            Full Description *
                            <textarea name="description" value={formData.description} onChange={handleChange} className={inputClass} rows={5} required />
                        </label>

                        <label className={`${labelClass} sm:col-span-2`}>
                            Technologies *
                            <input name="technologies" value={formData.technologies} onChange={handleChange} className={inputClass} required maxLength={500} placeholder="Python, Django, React, PostgreSQL" />
                            <span className="mt-1 block text-xs text-slate-500">Enter technologies separated by commas.</span>
                        </label>

                        <label className={labelClass}>
                            GitHub URL
                            <input type="url" name="github_url" value={formData.github_url} onChange={handleChange} className={inputClass} placeholder="https://github.com/..." />
                        </label>

                        <label className={labelClass}>
                            Live Demo URL
                            <input type="url" name="live_demo_url" value={formData.live_demo_url} onChange={handleChange} className={inputClass} placeholder="https://..." />
                        </label>

                        <label className={labelClass}>
                            Status
                            <select name="status" value={formData.status} onChange={handleChange} className={inputClass}>
                                <option value="COMPLETED">Completed</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="PLANNED">Planned</option>
                            </select>
                        </label>

                        <label className={labelClass}>
                            Display Order
                            <input type="number" name="display_order" value={formData.display_order} onChange={handleChange} className={inputClass} min="0" step="1" />
                        </label>

                        <label className={labelClass}>
                            Start Date
                            <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} className={inputClass} />
                        </label>

                        <label className={labelClass}>
                            End Date
                            <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} className={inputClass} />
                        </label>

                        <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950 p-4 text-sm text-slate-300">
                            <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} className="h-4 w-4 accent-cyan-400" />
                            Featured Project
                        </label>

                        <label className={labelClass}>
                            Project Thumbnail
                            <input type="file" name="thumbnail" accept="image/*" onChange={handleChange} className={`${inputClass} file:mr-3 file:rounded-lg file:border-0 file:bg-cyan-400 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-slate-950`} />
                        </label>

                        {thumbnailPreview && (
                            <div className="sm:col-span-2">
                                <p className={labelClass}>Thumbnail Preview</p>
                                <img
                                    src={thumbnailPreview.startsWith('blob:') ? thumbnailPreview : getThumbnailUrl(thumbnailPreview)}
                                    alt="Project thumbnail preview"
                                    className="mt-2 h-48 w-full rounded-xl border border-white/10 object-cover sm:w-80"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-slate-300 hover:bg-white/5"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-60"
                        >
                            {saving ? 'Saving...' : editingSlug !== null ? 'Update Project' : 'Save Project'}
                        </button>
                    </div>
                </form>
            )}

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                <div className="flex items-center justify-between border-b border-white/10 p-5">
                    <h2 className="font-semibold text-white">All Projects</h2>
                    <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
                        {projects.length} projects
                    </span>
                </div>

                {loading ? (
                    <div className="p-10 text-center text-slate-400">Loading projects...</div>
                ) : projects.length === 0 ? (
                    <div className="p-10 text-center text-slate-400">No projects found. Add your first project.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1100px] text-left text-sm">
                            <thead className="bg-white/[0.03] text-xs uppercase text-slate-400">
                                <tr>
                                    <th className="px-4 py-4">Thumbnail</th>
                                    <th className="px-4 py-4">Title / Slug</th>
                                    <th className="px-4 py-4">Category</th>
                                    <th className="px-4 py-4">Technologies</th>
                                    <th className="px-4 py-4">Status</th>
                                    <th className="px-4 py-4">Featured</th>
                                    <th className="px-4 py-4">Order</th>
                                    <th className="px-4 py-4">Dates</th>
                                    <th className="px-4 py-4">Links</th>
                                    <th className="px-4 py-4">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-white/10">
                                {projects.map((project) => (
                                    <tr key={project.id} className="align-top hover:bg-white/[0.02]">
                                        <td className="px-4 py-4">
                                            {project.thumbnail ? (
                                                <img
                                                    src={getThumbnailUrl(project.thumbnail)}
                                                    alt={project.title}
                                                    className="h-14 w-20 rounded-lg object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-14 w-20 items-center justify-center rounded-lg bg-white/5 text-xs text-slate-500">No image</div>
                                            )}
                                        </td>

                                        <td className="max-w-64 px-4 py-4">
                                            <p className="font-medium text-white">{project.title}</p>
                                            <p className="mt-1 text-xs text-slate-500">{project.slug}</p>
                                            <p className="mt-2 line-clamp-2 text-xs text-slate-400">{project.short_description}</p>
                                            <p className="mt-2 line-clamp-2 text-xs text-slate-500">{project.description}</p>
                                            <p className="mt-2 text-xs text-slate-500">ID: {project.id}</p>
                                        </td>

                                        <td className="px-4 py-4 text-slate-300">{project.category || '—'}</td>

                                        <td className="max-w-56 px-4 py-4 text-slate-300">{project.technologies || '—'}</td>

                                        <td className="px-4 py-4">
                                            <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300">
                                                {(project.status || '').replace('_', ' ')}
                                            </span>
                                        </td>

                                        <td className="px-4 py-4 text-slate-300">{project.is_featured ? 'Yes' : 'No'}</td>

                                        <td className="px-4 py-4 text-slate-300">{project.display_order}</td>

                                        <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-400">
                                            <p>Start: {project.start_date || '—'}</p>
                                            <p className="mt-2">End: {project.end_date || '—'}</p>
                                            <p className="mt-2">Created: {project.created_at ? new Date(project.created_at).toLocaleDateString() : '—'}</p>
                                            <p className="mt-2">Updated: {project.updated_at ? new Date(project.updated_at).toLocaleDateString() : '—'}</p>
                                        </td>

                                        <td className="px-4 py-4">
                                            <div className="flex flex-col gap-2">
                                                {project.github_url && (
                                                    <a href={project.github_url} target="_blank" rel="noreferrer" className="text-cyan-300 hover:underline">GitHub</a>
                                                )}
                                                {project.live_demo_url && (
                                                    <a href={project.live_demo_url} target="_blank" rel="noreferrer" className="text-cyan-300 hover:underline">Live Demo</a>
                                                )}
                                                {!project.github_url && !project.live_demo_url && '—'}
                                            </div>
                                        </td>

                                        <td className="relative px-4 py-4">
                                            <button
                                                type="button"
                                                onClick={() => setOpenMenuSlug(openMenuSlug === project.slug ? null : project.slug)}
                                                aria-label={`Actions for ${project.title}`}
                                                aria-expanded={openMenuSlug === project.slug}
                                                className="rounded-lg px-3 py-2 text-xl text-slate-300 hover:bg-white/10 hover:text-white"
                                            >
                                                ⋮
                                            </button>

                                            {openMenuSlug === project.slug && (
                                                <div className="absolute right-4 top-14 z-20 w-36 rounded-xl border border-white/10 bg-slate-900 p-1 shadow-xl">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditForm(project)}
                                                        className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-200 hover:bg-white/10"
                                                    >
                                                        Edit Project
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setProjectToDelete(project)
                                                            setOpenMenuSlug(null)
                                                            setError('')
                                                            setMessage('')
                                                        }}
                                                        className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-300 hover:bg-red-500/10"
                                                    >
                                                        Delete Project
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {projectToDelete && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget && deletingSlug === null) {
                            setProjectToDelete(null)
                        }
                    }}
                >
                    <div role="dialog" aria-modal="true" aria-labelledby="delete-project-title" className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-2xl text-red-300">!</div>

                        <h2 id="delete-project-title" className="mt-4 text-xl font-semibold text-white">Delete Project?</h2>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                            Are you sure you want to delete <span className="font-semibold text-white">{projectToDelete.title}</span>? This action cannot be undone.
                        </p>

                        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                disabled={deletingSlug !== null}
                                onClick={() => setProjectToDelete(null)}
                                className="rounded-xl border border-white/10 px-5 py-3 text-sm text-slate-300 hover:bg-white/5 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={deletingSlug !== null}
                                onClick={handleDelete}
                                className="rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white hover:bg-red-400 disabled:opacity-50"
                            >
                                {deletingSlug !== null ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ManageProjects