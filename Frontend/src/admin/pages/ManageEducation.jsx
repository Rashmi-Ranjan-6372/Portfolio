
import { useEffect, useState } from 'react'
import api from '../../api/axios'

const emptyForm = {
    institution: '',
    degree: '',
    field_of_study: '',
    description: '',
    start_date: '',
    end_date: '',
    is_current: false,
    grade: '',
    institution_location: '',
    certificate_image: null,
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

function ManageEducation() {
    const [educationList, setEducationList] = useState([])
    const [formData, setFormData] = useState({ ...emptyForm })
    const [editingId, setEditingId] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')

    const getEducation = async () => {
        setLoading(true)

        try {
            const response = await api.get('education/')
            setEducationList(getList(response))
            setError('')
        } catch (err) {
            setError(
                getErrorMessage(err) ||
                'Unable to load education. Check your Django API.'
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getEducation()
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

    const openEditForm = (item) => {
        setEditingId(item.id)

        setFormData({
            institution: item.institution ?? '',
            degree: item.degree ?? '',
            field_of_study: item.field_of_study ?? '',
            description: item.description ?? '',
            start_date: item.start_date ?? '',
            end_date: item.end_date ?? '',
            is_current: Boolean(item.is_current),
            grade: item.grade ?? '',
            institution_location: item.institution_location ?? '',
            certificate_image: null,
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
            !formData.institution.trim() ||
            !formData.degree.trim() ||
            !formData.start_date
        ) {
            setError('Institution, degree, and start date are required.')
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

        payload.append('institution', formData.institution.trim())
        payload.append('degree', formData.degree.trim())
        payload.append('field_of_study', formData.field_of_study.trim())
        payload.append('description', formData.description.trim())
        payload.append('start_date', formData.start_date)
        payload.append(
            'end_date',
            formData.is_current ? '' : formData.end_date
        )
        payload.append('is_current', String(formData.is_current))
        payload.append('grade', formData.grade.trim())
        payload.append(
            'institution_location',
            formData.institution_location.trim()
        )

        if (formData.certificate_image instanceof File) {
            payload.append('certificate_image', formData.certificate_image)
        }

        try {
            if (editingId !== null) {
                await api.patch(`education/${editingId}/`, payload)
                setMessage('Education updated successfully.')
            } else {
                await api.post('education/', payload)
                setMessage('Education added successfully.')
            }

            setShowForm(false)
            setFormData({ ...emptyForm })
            setEditingId(null)
            await getEducation()
        } catch (err) {
            setError(getErrorMessage(err))
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id) => {
        if (
            !window.confirm(
                'Are you sure you want to delete this education record?'
            )
        ) {
            return
        }

        setError('')
        setMessage('')

        try {
            await api.delete(`education/${id}/`)
            setMessage('Education record deleted successfully.')
            await getEducation()
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
                        Manage Education
                    </h1>
                    <p className="mt-2 text-sm text-slate-400">
                        Maintain your academic qualifications and achievements.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={openAddForm}
                    className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                    + Add Education
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
                    className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-7"
                >
                    <h2 className="text-xl font-semibold text-white">
                        {editingId !== null ? 'Edit Education' : 'Add Education'}
                    </h2>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <label
                                htmlFor="institution"
                                className="mb-2 block text-sm text-slate-300"
                            >
                                Institution Name *
                            </label>
                            <input
                                id="institution"
                                name="institution"
                                value={formData.institution}
                                onChange={handleChange}
                                required
                                maxLength={200}
                                placeholder="College or university"
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="degree"
                                className="mb-2 block text-sm text-slate-300"
                            >
                                Degree *
                            </label>
                            <input
                                id="degree"
                                name="degree"
                                value={formData.degree}
                                onChange={handleChange}
                                required
                                maxLength={150}
                                placeholder="MCA, BSc, BTech"
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="field_of_study"
                                className="mb-2 block text-sm text-slate-300"
                            >
                                Field of Study
                            </label>
                            <input
                                id="field_of_study"
                                name="field_of_study"
                                value={formData.field_of_study}
                                onChange={handleChange}
                                maxLength={150}
                                placeholder="Computer Applications"
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="grade"
                                className="mb-2 block text-sm text-slate-300"
                            >
                                Grade / CGPA / Percentage
                            </label>
                            <input
                                id="grade"
                                name="grade"
                                value={formData.grade}
                                onChange={handleChange}
                                maxLength={50}
                                placeholder="8.61 SGPA or 7.32 CGPA"
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="institution_location"
                                className="mb-2 block text-sm text-slate-300"
                            >
                                Institution Location
                            </label>
                            <input
                                id="institution_location"
                                name="institution_location"
                                value={formData.institution_location}
                                onChange={handleChange}
                                maxLength={150}
                                placeholder="Bhubaneswar, Odisha"
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
                                Select your course start date.
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

                        <label className="flex items-center gap-3 self-center text-sm text-slate-300">
                            <input
                                name="is_current"
                                type="checkbox"
                                checked={formData.is_current}
                                onChange={handleChange}
                                className="h-4 w-4 accent-cyan-400"
                            />
                            I am currently studying here
                        </label>

                        <div>
                            <label
                                htmlFor="certificate_image"
                                className="mb-2 block text-sm text-slate-300"
                            >
                                Certificate Image
                            </label>
                            <input
                                id="certificate_image"
                                name="certificate_image"
                                type="file"
                                accept="image/*"
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>

                        <div className="sm:col-span-2 lg:col-span-3">
                            <label
                                htmlFor="description"
                                className="mb-2 block text-sm text-slate-300"
                            >
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Coursework, achievements, or activities."
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
                                    ? 'Update Education'
                                    : 'Save Education'}
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
                        Education Records
                        <span className="ml-2 text-sm font-normal text-slate-400">
                            ({educationList.length})
                        </span>
                    </h2>
                </div>

                {loading ? (
                    <p className="p-6 text-sm text-slate-400">
                        Loading education...
                    </p>
                ) : educationList.length === 0 ? (
                    <p className="p-8 text-sm text-slate-400">
                        No education records found. Add your first record.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1100px] text-left text-sm">
                            <thead className="border-b border-white/10 bg-white/[0.03] text-slate-400">
                                <tr>
                                    <th className="px-5 py-4 font-medium">Degree</th>
                                    <th className="px-5 py-4 font-medium">Institution</th>
                                    <th className="px-5 py-4 font-medium">Field of Study</th>
                                    <th className="px-5 py-4 font-medium">Location</th>
                                    <th className="px-5 py-4 font-medium">Duration</th>
                                    <th className="px-5 py-4 font-medium">Grade</th>
                                    <th className="px-5 py-4 font-medium">Certificate</th>
                                    <th className="px-5 py-4 font-medium">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-white/10">
                                {educationList.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-white/[0.03]"
                                    >
                                        <td className="px-5 py-4 font-medium text-white">
                                            {item.degree}
                                        </td>
                                        <td className="px-5 py-4 text-cyan-300">
                                            {item.institution}
                                        </td>
                                        <td className="px-5 py-4 text-slate-300">
                                            {item.field_of_study || '—'}
                                        </td>
                                        <td className="px-5 py-4 text-slate-300">
                                            {item.institution_location || '—'}
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-4 text-slate-300">
                                            {item.start_date || '—'} —{' '}
                                            {item.is_current
                                                ? 'Present'
                                                : item.end_date || '—'}
                                        </td>
                                        <td className="px-5 py-4 text-slate-300">
                                            {item.grade || '—'}
                                        </td>
                                        <td className="px-5 py-4">
                                            {item.certificate_image ? (
                                                <a
                                                    href={item.certificate_image}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-cyan-300 hover:underline"
                                                >
                                                    View
                                                </a>
                                            ) : (
                                                '—'
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() => openEditForm(item)}
                                                    className="font-medium text-cyan-300 hover:underline"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(item.id)}
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

export default ManageEducation
