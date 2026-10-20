import { useEffect, useState } from 'react'
import api from '../../api/axios'

const emptyForm = {
    name: '',
    designation: '',
    company_name: '',
    message: '',
    profile_image: null,
    company_website: '',
    rating: 5,
    is_featured: false,
    is_active: true,
    display_order: 0,
}

function getImageUrl(image) {
    if (!image) return ''

    if (image.startsWith('http://') || image.startsWith('https://')) {
        return image
    }

    return `http://127.0.0.1:8000${image.startsWith('/') ? '' : '/'}${image}`

}

function ManageTestimonials() {
    const [testimonials, setTestimonials] = useState([])
    const [formData, setFormData] = useState(emptyForm)
    const [editingId, setEditingId] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [currentImage, setCurrentImage] = useState('')

    const getTestimonials = async () => {
        setLoading(true)
        setError('')

        try {
            const response = await api.get('testimonials/')

            const data =
                response.data.data ??
                response.data.results ??
                response.data

            setTestimonials(Array.isArray(data) ? data : [])
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                err.response?.data?.message ||
                'Unable to load testimonials. Check your Django API.'
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getTestimonials()
    }, [])

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target

        setFormData((previous) => ({
            ...previous,
            [name]:
                type === 'checkbox'
                    ? checked
                    : type === 'file'
                        ? files?.[0] || null
                        : name === 'rating' || name === 'display_order'
                            ? value
                            : value,
        }))
    }

    const openAddForm = () => {
        setEditingId(null)
        setFormData({ ...emptyForm })
        setCurrentImage('')
        setError('')
        setMessage('')
        setShowForm(true)
    }

    const openEditForm = (item) => {
        setEditingId(item.id)

        setFormData({
            name: item.name ?? '',
            designation: item.designation ?? '',
            company_name: item.company_name ?? '',
            message: item.message ?? '',
            profile_image: null,
            company_website: item.company_website ?? '',
            rating: item.rating ?? 5,
            is_featured: item.is_featured ?? false,
            is_active: item.is_active ?? true,
            display_order: item.display_order ?? 0,
        })

        setCurrentImage(item.profile_image ?? '')
        setError('')
        setMessage('')
        setShowForm(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        setError('')
        setMessage('')

        if (Number(formData.rating) < 1 || Number(formData.rating) > 5) {
            setError('Rating must be between 1 and 5.')
            setSaving(false)
            return
        }

        const payload = new FormData()

        payload.append('name', formData.name.trim())
        payload.append('designation', formData.designation)
        payload.append('company_name', formData.company_name)
        payload.append('message', formData.message)
        payload.append('company_website', formData.company_website)
        payload.append('rating', String(formData.rating))
        payload.append('is_featured', String(formData.is_featured))
        payload.append('is_active', String(formData.is_active))
        payload.append('display_order', String(formData.display_order))

        if (formData.profile_image instanceof File) {
            payload.append('profile_image', formData.profile_image)
        }

        try {
            if (editingId !== null) {
                await api.patch(`testimonials/${editingId}/`, payload)
                setMessage('Testimonial updated successfully.')
            } else {
                await api.post('testimonials/', payload)
                setMessage('Testimonial added successfully.')
            }

            setShowForm(false)
            setFormData({ ...emptyForm })
            setEditingId(null)
            setCurrentImage('')
            await getTestimonials()
            setMessage(
                editingId !== null
                    ? 'Testimonial updated successfully.'
                    : 'Testimonial added successfully.'
            )
        } catch (err) {
            const data = err.response?.data

            setError(
                typeof data === 'object'
                    ? Object.entries(data)
                        .map(([field, errors]) =>
                            `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`
                        )
                        .join(' | ')
                    : 'Unable to save testimonial.'
            )
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this testimonial?')) {
            return
        }

        setError('')
        setMessage('')

        try {
            await api.delete(`testimonials/${id}/`)
            setMessage('Testimonial deleted successfully.')
            await getTestimonials()
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                err.response?.data?.message ||
                'Unable to delete testimonial.'
            )
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
                        Manage Testimonials
                    </h1>

                    <p className="mt-2 text-sm text-slate-400">
                        Manage recommendations and feedback from colleagues or clients.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={openAddForm}
                    className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
                >
                    + Add Testimonial
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
                    className="break-words rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300"
                >
                    {error}
                </div>
            )}

            {showForm && (
                <form
                    onSubmit={handleSubmit}
                    encType="multipart/form-data"
                    className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-7"
                >
                    <h2 className="text-xl font-semibold text-white">
                        {editingId !== null ? 'Edit Testimonial' : 'Add Testimonial'}
                    </h2>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                            <label htmlFor="name" className="mb-2 block text-sm text-slate-300">
                                Person's Name *
                            </label>
                            <input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                maxLength={100}
                                placeholder="Enter full name"
                                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
                            />
                        </div>

                        <div>
                            <label htmlFor="designation" className="mb-2 block text-sm text-slate-300">
                                Designation
                            </label>
                            <input
                                id="designation"
                                name="designation"
                                value={formData.designation}
                                onChange={handleChange}
                                maxLength={150}
                                placeholder="Software Engineer"
                                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
                            />
                        </div>

                        <div>
                            <label htmlFor="company_name" className="mb-2 block text-sm text-slate-300">
                                Company Name
                            </label>
                            <input
                                id="company_name"
                                name="company_name"
                                value={formData.company_name}
                                onChange={handleChange}
                                maxLength={150}
                                placeholder="Company name"
                                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
                            />
                        </div>

                        <div>
                            <label htmlFor="company_website" className="mb-2 block text-sm text-slate-300">
                                Company Website
                            </label>
                            <input
                                id="company_website"
                                name="company_website"
                                type="url"
                                value={formData.company_website}
                                onChange={handleChange}
                                placeholder="https://example.com"
                                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
                            />
                        </div>

                        <div>
                            <label htmlFor="profile_image" className="mb-2 block text-sm text-slate-300">
                                Profile Image
                            </label>
                            <input
                                id="profile_image"
                                name="profile_image"
                                type="file"
                                accept="image/*"
                                onChange={handleChange}
                                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-cyan-400 file:px-3 file:py-2 file:font-semibold file:text-slate-950"
                            />

                            {currentImage && (
                                <div className="mt-3 flex items-center gap-3">
                                    <img
                                        src={getImageUrl(currentImage)}
                                        alt="Current testimonial profile"
                                        className="h-14 w-14 rounded-full object-cover"
                                    />
                                    <p className="text-xs text-slate-400">
                                        Current image. Choose a new file to replace it.
                                    </p>
                                </div>
                            )}

                            {formData.profile_image instanceof File && (
                                <p className="mt-2 text-xs text-cyan-300">
                                    Selected: {formData.profile_image.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="rating" className="mb-2 block text-sm text-slate-300">
                                Rating (1–5) *
                            </label>
                            <select
                                id="rating"
                                name="rating"
                                value={formData.rating}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
                            >
                                {[1, 2, 3, 4, 5].map((number) => (
                                    <option key={number} value={number}>
                                        {number} {number === 1 ? 'Star' : 'Stars'}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="display_order" className="mb-2 block text-sm text-slate-300">
                                Display Order
                            </label>
                            <input
                                id="display_order"
                                name="display_order"
                                type="number"
                                min="0"
                                value={formData.display_order}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="message" className="mb-2 block text-sm text-slate-300">
                                Testimonial Message *
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows={5}
                                placeholder="Enter the person's feedback..."
                                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
                            />
                        </div>

                        <label className="flex items-center gap-3 text-sm text-slate-300">
                            <input
                                type="checkbox"
                                name="is_featured"
                                checked={formData.is_featured}
                                onChange={handleChange}
                                className="h-4 w-4 accent-cyan-400"
                            />
                            Featured testimonial
                        </label>

                        <label className="flex items-center gap-3 text-sm text-slate-300">
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleChange}
                                className="h-4 w-4 accent-cyan-400"
                            />
                            Show this testimonial on the portfolio
                        </label>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-60"
                        >
                            {saving
                                ? 'Saving...'
                                : editingId !== null
                                    ? 'Update Testimonial'
                                    : 'Save Testimonial'}
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
                        Testimonial Records
                        <span className="ml-2 text-sm font-normal text-slate-400">
                            ({testimonials.length})
                        </span>
                    </h2>
                </div>

                {loading ? (
                    <p className="p-6 text-sm text-slate-400">
                        Loading testimonials...
                    </p>
                ) : testimonials.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 p-8 text-sm text-slate-400">
                        No testimonials found. Add your first testimonial.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                        {testimonials.map((item) => (
                            <article
                                key={item.id}
                                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6"
                            >
                                <div className="flex items-start gap-4">
                                    {item.profile_image ? (
                                        <img
                                            src={getImageUrl(item.profile_image)}
                                            alt={item.name}
                                            className="h-14 w-14 shrink-0 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-cyan-400/10 text-xl font-bold text-cyan-300">
                                            {item.name?.charAt(0)?.toUpperCase() || '?'}
                                        </div>
                                    )}

                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-semibold text-white">
                                            {item.name}
                                        </h3>

                                        <p className="mt-1 text-sm text-cyan-300">
                                            {[item.designation, item.company_name]
                                                .filter(Boolean)
                                                .join(' at ') || 'No designation provided'}
                                        </p>

                                        {item.company_website && (
                                            <a
                                                href={item.company_website}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="mt-1 inline-block break-all text-xs text-slate-400 hover:text-cyan-300"
                                            >
                                                {item.company_website}
                                            </a>
                                        )}
                                    </div>

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs ${item.is_active
                                            ? 'bg-emerald-400/10 text-emerald-300'
                                            : 'bg-slate-400/10 text-slate-400'
                                            }`}
                                    >
                                        {item.is_active ? 'Active' : 'Hidden'}
                                    </span>
                                </div>

                                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                                    <span className="text-amber-300">
                                        {'★'.repeat(Math.min(5, Math.max(0, Number(item.rating) || 0)))}
                                        {'☆'.repeat(5 - Math.min(5, Math.max(0, Number(item.rating) || 0)))}
                                    </span>

                                    <span className="text-slate-400">
                                        Rating: {item.rating ?? 5}/5
                                    </span>

                                    {item.is_featured && (
                                        <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300">
                                            Featured
                                        </span>
                                    )}

                                    <span className="text-xs text-slate-500">
                                        Order: {item.display_order ?? 0}
                                    </span>
                                </div>

                                <p className="mt-5 whitespace-pre-line break-words text-sm leading-7 text-slate-300">
                                    “{item.message}”
                                </p>

                                <div className="mt-5 flex gap-5 border-t border-white/10 pt-4 text-sm">
                                    <button
                                        type="button"
                                        onClick={() => openEditForm(item)}
                                        className="text-cyan-300 hover:underline"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleDelete(item.id)}
                                        className="text-red-400 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )

}

export default ManageTestimonials