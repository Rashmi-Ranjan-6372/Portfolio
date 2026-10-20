
import { useEffect, useState } from 'react'
import api from '../../api/axios'

const emptyForm = {
    job_title: '',
    company_name: '',
    employment_type: 'Full-time',
    location: '',
    description: '',
    responsibilities: '',
    skills_used: '',
    start_date: '',
    end_date: '',
    is_current: false,
    company_logo: null,
    company_website: '',
}

const inputClass =
    'w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50'

function getList(response) {
    const data =
        response.data?.data ??
        response.data?.results ??
        response.data

    return Array.isArray(data) ? data : []
}

function getErrorMessage(err) {
    const data = err.response?.data

    if (data?.errors) {
        return Object.entries(data.errors)
            .map(([field, messages]) =>
                `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`
            )
            .join(' | ')
    }

    if (data?.message) return data.message

    if (data && typeof data === 'object') {
        return Object.entries(data)
            .map(([field, messages]) =>
                `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`
            )
            .join(' | ')
    }

    return 'Something went wrong. Please try again.'
}

function ManageExperience() {
    const [experiences, setExperiences] = useState([])
    const [formData, setFormData] = useState({ ...emptyForm })
    const [editingId, setEditingId] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')

    const getExperiences = async () => {
        try {
            const response = await api.get('experience/')
            setExperiences(getList(response))
        } catch (err) {
            setError(getErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getExperiences()
    }, [])

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target

        setFormData((previous) => ({
            ...previous,
            [name]:
                type === 'checkbox'
                    ? checked
                    : type === 'file'
                        ? files?.[0] ?? null
                        : value,
            ...(name === 'is_current' && checked
                ? { end_date: '' }
                : {}),
        }))
    }

    const openAddForm = () => {
        setEditingId(null)
        setFormData({ ...emptyForm })
        setError('')
        setMessage('')
        setShowForm(true)
    }

    const openEditForm = (experience) => {
        setEditingId(experience.id)

        setFormData({
            job_title: experience.job_title ?? '',
            company_name: experience.company_name ?? '',
            employment_type: experience.employment_type ?? 'Full-time',
            location: experience.location ?? '',
            description: experience.description ?? '',
            responsibilities: experience.responsibilities ?? '',
            skills_used: experience.skills_used ?? '',
            start_date: experience.start_date ?? '',
            end_date: experience.end_date ?? '',
            is_current: Boolean(experience.is_current),
            company_logo: null,
            company_website: experience.company_website ?? '',
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

        if (
            !formData.job_title.trim() ||
            !formData.company_name.trim() ||
            !formData.description.trim() ||
            !formData.start_date
        ) {
            setError(
                'Job title, company name, description, and start date are required.'
            )
            setSaving(false)
            return
        }

        if (
            !formData.is_current &&
            formData.end_date &&
            formData.end_date < formData.start_date
        ) {
            setError('End date cannot be earlier than start date.')
            setSaving(false)
            return
        }

        const payload = new FormData()

        payload.append('job_title', formData.job_title.trim())
        payload.append('company_name', formData.company_name.trim())
        payload.append('employment_type', formData.employment_type)
        payload.append('location', formData.location.trim())
        payload.append('description', formData.description.trim())
        payload.append('responsibilities', formData.responsibilities.trim())
        payload.append('skills_used', formData.skills_used.trim())
        payload.append('start_date', formData.start_date)
        payload.append(
            'end_date',
            formData.is_current ? '' : formData.end_date
        )
        payload.append('is_current', String(formData.is_current))
        payload.append('company_website', formData.company_website.trim())

        if (formData.company_logo instanceof File) {
            payload.append('company_logo', formData.company_logo)
        }

        try {
            if (editingId !== null) {
                await api.patch(`experience/${editingId}/`, payload)
                setMessage('Experience updated successfully.')
            } else {
                await api.post('experience/', payload)
                setMessage('Experience added successfully.')
            }

            setShowForm(false)
            setFormData({ ...emptyForm })
            setEditingId(null)
            await getExperiences()
        } catch (err) {
            setError(getErrorMessage(err))
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this experience?')) {
            return
        }

        setError('')
        setMessage('')

        try {
            await api.delete(`experience/${id}/`)
            setMessage('Experience deleted successfully.')
            await getExperiences()
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
                        Manage Experience
                    </h1>
                    <p className="mt-2 text-sm text-slate-400">
                        Maintain your professional work history.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={openAddForm}
                    className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
                >
                    + Add Experience
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
                    className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-7"
                >
                    <h2 className="text-xl font-semibold text-white">
                        {editingId !== null ? 'Edit Experience' : 'Add Experience'}
                    </h2>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <label
                                htmlFor="job_title"
                                className="mb-2 block text-sm text-slate-300"
                            >
                                Job Title *
                            </label>
                            <input
                                id="job_title"
                                name="job_title"
                                value={formData.job_title}
                                onChange={handleChange}
                                required
                                maxLength={150}
                                placeholder="Python Backend Developer"
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="company_name"
                                className="mb-2 block text-sm text-slate-300"
                            >
                                Company Name *
                            </label>
                            <input
                                id="company_name"
                                name="company_name"
                                value={formData.company_name}
                                onChange={handleChange}
                                required
                                maxLength={200}
                                placeholder="Company name"
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="employment_type"
                                className="mb-2 block text-sm text-slate-300"
                            >
                                Employment Type
                            </label>
                            <select
                                id="employment_type"
                                name="employment_type"
                                value={formData.employment_type}
                                onChange={handleChange}
                                className={inputClass}
                            >
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Internship">Internship</option>
                                <option value="Contract">Contract</option>
                                <option value="Freelance">Freelance</option>
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="location"
                                className="mb-2 block text-sm text-slate-300"
                            >
                                Location
                            </label>
                            <input
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Cuttack, Odisha"
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="start_date"
                                className="mb-2 block text-sm text-slate-300"
                            >
                                Start Date *
                            </label>
                            <input
                                id="start_date"
                                name="start_date"
                                type="date"
                                value={formData.start_date}
                                onChange={handleChange}
                                required
                                max={formData.end_date || undefined}
                                className={`${inputClass} [color-scheme:dark]`}
                            />
                            <p className="mt-1 text-xs text-slate-500">
                                Select your employment start date.
                            </p>
                        </div>

                        <div>
                            <label
                                htmlFor="end_date"
                                className="mb-2 block text-sm text-slate-300"
                            >
                                End Date
                            </label>
                            <input
                                id="end_date"
                                name="end_date"
                                type="date"
                                value={formData.end_date}
                                onChange={handleChange}
                                min={formData.start_date || undefined}
                                disabled={formData.is_current}
                                className={`${inputClass} [color-scheme:dark]`}
                            />
                            <p className="mt-1 text-xs text-slate-500">
                                Leave empty if no end date applies.
                            </p>
                        </div>

                        <div>
                            <label
                                htmlFor="company_website"
                                className="mb-2 block text-sm text-slate-300"
                            >
                                Company Website
                            </label>
                            <input
                                id="company_website"
                                name="company_website"
                                type="url"
                                value={formData.company_website}
                                onChange={handleChange}
                                placeholder="https://example.com"
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="company_logo"
                                className="mb-2 block text-sm text-slate-300"
                            >
                                Company Logo
                            </label>
                            <input
                                id="company_logo"
                                name="company_logo"
                                type="file"
                                accept="image/*"
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>

                        <label className="flex items-center gap-3 self-center text-sm text-slate-300">
                            <input
                                name="is_current"
                                type="checkbox"
                                checked={formData.is_current}
                                onChange={handleChange}
                                className="h-4 w-4 accent-cyan-400"
                            />
                            I currently work here
                        </label>

                        <div className="sm:col-span-2 lg:col-span-3">
                            <label
                                htmlFor="description"
                                className="mb-2 block text-sm text-slate-300"
                            >
                                Job Description *
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows={4}
                                placeholder="Describe your role and achievements."
                                className={inputClass}
                            />
                        </div>

                        <div className="sm:col-span-2 lg:col-span-3">
                            <label
                                htmlFor="responsibilities"
                                className="mb-2 block text-sm text-slate-300"
                            >
                                Responsibilities
                            </label>
                            <textarea
                                id="responsibilities"
                                name="responsibilities"
                                value={formData.responsibilities}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Describe your responsibilities."
                                className={inputClass}
                            />
                        </div>

                        <div className="sm:col-span-2 lg:col-span-3">
                            <label
                                htmlFor="skills_used"
                                className="mb-2 block text-sm text-slate-300"
                            >
                                Skills Used
                            </label>
                            <input
                                id="skills_used"
                                name="skills_used"
                                value={formData.skills_used}
                                onChange={handleChange}
                                maxLength={300}
                                placeholder="Python, Django, DRF, PostgreSQL"
                                className={inputClass}
                            />
                        </div>
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
                                    ? 'Update Experience'
                                    : 'Save Experience'}
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

            <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                <div className="border-b border-white/10 px-5 py-4">
                    <h2 className="font-semibold text-white">
                        Work History
                        <span className="ml-2 text-sm font-normal text-slate-400">
                            ({experiences.length})
                        </span>
                    </h2>
                </div>

                {loading ? (
                    <p className="p-6 text-sm text-slate-400">
                        Loading experience...
                    </p>
                ) : experiences.length === 0 ? (
                    <p className="p-8 text-sm text-slate-400">
                        No experience records found. Add your first record.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1100px] text-left text-sm">
                            <thead className="border-b border-white/10 bg-white/[0.03] text-slate-400">
                                <tr>
                                    <th className="px-5 py-4 font-medium">Job Title</th>
                                    <th className="px-5 py-4 font-medium">Company</th>
                                    <th className="px-5 py-4 font-medium">Employment</th>
                                    <th className="px-5 py-4 font-medium">Location</th>
                                    <th className="px-5 py-4 font-medium">Duration</th>
                                    <th className="px-5 py-4 font-medium">Website</th>
                                    <th className="px-5 py-4 font-medium">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-white/10">
                                {experiences.map((experience) => (
                                    <tr
                                        key={experience.id}
                                        className="hover:bg-white/[0.03]"
                                    >
                                        <td className="px-5 py-4 font-medium text-white">
                                            {experience.job_title}
                                        </td>
                                        <td className="px-5 py-4 text-cyan-300">
                                            {experience.company_name}
                                        </td>
                                        <td className="px-5 py-4 text-slate-300">
                                            {experience.employment_type || '—'}
                                        </td>
                                        <td className="px-5 py-4 text-slate-300">
                                            {experience.location || '—'}
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-4 text-slate-300">
                                            {experience.start_date || '—'} —{' '}
                                            {experience.is_current
                                                ? 'Present'
                                                : experience.end_date || '—'}
                                        </td>
                                        <td className="px-5 py-4">
                                            {experience.company_website ? (
                                                <a
                                                    href={experience.company_website}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-cyan-300 hover:underline"
                                                >
                                                    Visit
                                                </a>
                                            ) : (
                                                '—'
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() => openEditForm(experience)}
                                                    className="font-medium text-cyan-300 hover:underline"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(experience.id)}
                                                    className="font-medium text-red-400 hover:underline"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    )
}

export default ManageExperience
