
import { useEffect, useState } from 'react'
import api from '../../api/axios'

const emptyForm = {
    title: '',
    issuing_organization: '',
    description: '',
    certificate_image: null,
    certificate_url: '',
    credentials_id: '',
    issue_date: '',
    expiry_date: '',
    date_not_expired: true,
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

function ManageCertifications() {
    const [certifications, setCertifications] = useState([])
    const [formData, setFormData] = useState(emptyForm)
    const [editingId, setEditingId] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')

    const getCertifications = async () => {
        setLoading(true)
        setError('')

        try {
            const response = await api.get('certifications/')
            setCertifications(getList(response.data))
        } catch (err) {
            setError(getErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getCertifications()
    }, [])

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target

        if (type === 'checkbox') {
            setFormData((prev) => ({
                ...prev,
                [name]: checked,
                ...(name === 'date_not_expired' && checked
                    ? { expiry_date: '' }
                    : {}),
            }))
            return
        }

        if (type === 'file') {
            setFormData((prev) => ({
                ...prev,
                [name]: files?.[0] || null,
            }))
            return
        }

        setFormData((prev) => ({
            ...prev,
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

    const openEditForm = (item) => {
        setEditingId(item.id)

        setFormData({
            title: item.title ?? '',
            issuing_organization: item.issuing_organization ?? '',
            description: item.description ?? '',
            certificate_image: null,
            certificate_url: item.certificate_url ?? '',
            credentials_id: item.credentials_id ?? '',
            issue_date: item.issue_date ?? '',
            expiry_date: item.expiry_date ?? '',
            date_not_expired:
                item.date_not_expired ??
                !item.expiry_date,
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
            !formData.date_not_expired &&
            formData.expiry_date &&
            formData.expiry_date < formData.issue_date
        ) {
            setError('Expiry date cannot be earlier than issue date.')
            setSaving(false)
            return
        }

        const payload = new FormData()

        payload.append('title', formData.title.trim())
        payload.append(
            'issuing_organization',
            formData.issuing_organization.trim()
        )
        payload.append('description', formData.description)
        payload.append('certificate_url', formData.certificate_url.trim())
        payload.append('credentials_id', formData.credentials_id.trim())
        payload.append('issue_date', formData.issue_date)
        payload.append(
            'date_not_expired',
            String(formData.date_not_expired)
        )

        if (!formData.date_not_expired && formData.expiry_date) {
            payload.append('expiry_date', formData.expiry_date)
        } else {
            payload.append('expiry_date', '')
        }

        if (formData.certificate_image instanceof File) {
            payload.append(
                'certificate_image',
                formData.certificate_image
            )
        }

        try {
            if (editingId !== null) {
                await api.patch(
                    `certifications/${editingId}/`,
                    payload
                )
                setMessage('Certification updated successfully.')
            } else {
                await api.post('certifications/', payload)
                setMessage('Certification added successfully.')
            }

            setShowForm(false)
            setFormData({ ...emptyForm })
            setEditingId(null)
            await getCertifications()
        } catch (err) {
            setError(getErrorMessage(err))
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id) => {
        if (
            !window.confirm(
                'Are you sure you want to delete this certification?'
            )
        ) {
            return
        }

        setError('')
        setMessage('')

        try {
            await api.delete(`certifications/${id}/`)
            setMessage('Certification deleted successfully.')
            await getCertifications()
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
                        Manage Certifications
                    </h1>

                    <p className="mt-2 text-sm text-slate-400">
                        Manage certificates, issuing organizations,
                        credentials, and expiry dates.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={openAddForm}
                    className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                    + Add Certification
                </button>
            </header>

            {message && (
                <div
                    role="status"
                    className="whitespace-pre-line rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300"
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
                            ? 'Edit Certification'
                            : 'Add Certification'}
                    </h2>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                            <label htmlFor="title" className={labelClass}>
                                Certificate Title
                            </label>
                            <input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                maxLength={100}
                                placeholder="Python Programming"
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="issuing_organization"
                                className={labelClass}
                            >
                                Issuing Organization
                            </label>
                            <input
                                id="issuing_organization"
                                name="issuing_organization"
                                value={formData.issuing_organization}
                                onChange={handleChange}
                                required
                                maxLength={100}
                                placeholder="Organization name"
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="issue_date"
                                className={labelClass}
                            >
                                Issue Date
                            </label>
                            <input
                                id="issue_date"
                                name="issue_date"
                                type="date"
                                value={formData.issue_date}
                                onChange={handleChange}
                                max={formData.expiry_date || undefined}
                                required
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="expiry_date"
                                className={labelClass}
                            >
                                Expiry Date
                            </label>
                            <input
                                id="expiry_date"
                                name="expiry_date"
                                type="date"
                                value={formData.expiry_date}
                                onChange={handleChange}
                                min={formData.issue_date || undefined}
                                disabled={formData.date_not_expired}
                                className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-50`}
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="flex items-center gap-3 text-sm text-slate-300">
                                <input
                                    type="checkbox"
                                    name="date_not_expired"
                                    checked={formData.date_not_expired}
                                    onChange={handleChange}
                                    className="h-4 w-4 accent-cyan-400"
                                />
                                This certificate does not expire
                            </label>
                        </div>

                        <div>
                            <label
                                htmlFor="credentials_id"
                                className={labelClass}
                            >
                                Credentials ID
                            </label>
                            <input
                                id="credentials_id"
                                name="credentials_id"
                                value={formData.credentials_id}
                                onChange={handleChange}
                                maxLength={100}
                                placeholder="Certificate or credential ID"
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="certificate_url"
                                className={labelClass}
                            >
                                Certificate Verification URL
                            </label>
                            <input
                                id="certificate_url"
                                name="certificate_url"
                                type="url"
                                value={formData.certificate_url}
                                onChange={handleChange}
                                placeholder="https://example.com/certificate"
                                className={inputClass}
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label
                                htmlFor="certificate_image"
                                className={labelClass}
                            >
                                Certificate Image (Optional)
                            </label>
                            <input
                                id="certificate_image"
                                name="certificate_image"
                                type="file"
                                accept="image/*"
                                onChange={handleChange}
                                className={`${inputClass} file:mr-4 file:rounded-lg file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:font-semibold file:text-slate-950`}
                            />

                            {editingId !== null &&
                                certifications.find(
                                    (item) => item.id === editingId
                                )?.certificate_image && (
                                    <a
                                        href={
                                            certifications.find(
                                                (item) => item.id === editingId
                                            )?.certificate_image
                                        }
                                        target="_blank"
                                        rel="noreferrer"
                                        className="mt-2 inline-block text-sm text-cyan-300 hover:underline"
                                    >
                                        View Current Certificate Image ↗
                                    </a>
                                )}

                            {formData.certificate_image instanceof File && (
                                <p className="mt-2 text-sm text-slate-400">
                                    Selected: {formData.certificate_image.name}
                                </p>
                            )}
                        </div>

                        <div className="sm:col-span-2">
                            <label
                                htmlFor="description"
                                className={labelClass}
                            >
                                Description (Optional)
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Describe the skills or knowledge covered."
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
                                    ? 'Update Certification'
                                    : 'Save Certification'}
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
                        Certification Records
                        <span className="ml-2 text-sm font-normal text-slate-400">
                            ({certifications.length})
                        </span>
                    </h2>
                </div>

                {loading ? (
                    <p className="p-6 text-sm text-slate-400">
                        Loading certifications...
                    </p>
                ) : certifications.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 p-8 text-sm text-slate-400">
                        No certifications found. Add your first certification.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {certifications.map((item) => (
                            <article
                                key={item.id}
                                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6"
                            >
                                <div className="flex items-start gap-4">
                                    {item.certificate_image ? (
                                        <a
                                            href={item.certificate_image}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="shrink-0"
                                        >
                                            <img
                                                src={item.certificate_image}
                                                alt={item.title}
                                                className="h-16 w-16 rounded-xl border border-white/10 object-cover"
                                            />
                                        </a>
                                    ) : (
                                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-2xl text-cyan-300">
                                            ✧
                                        </div>
                                    )}

                                    <div className="min-w-0 flex-1">
                                        <h3 className="break-words font-semibold text-white">
                                            {item.title}
                                        </h3>
                                        <p className="mt-1 text-sm text-cyan-300">
                                            {item.issuing_organization}
                                        </p>
                                        <p className="mt-2 text-xs text-slate-400">
                                            {item.date_not_expired
                                                ? 'No expiry date'
                                                : item.expiry_date
                                                    ? `Expires: ${item.expiry_date}`
                                                    : 'Expiry date not provided'}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 space-y-2 text-sm text-slate-400">
                                    <p>
                                        Issued: {item.issue_date || '—'}
                                    </p>

                                    {item.credentials_id && (
                                        <p className="break-all">
                                            Credentials ID: {item.credentials_id}
                                        </p>
                                    )}

                                    {item.description && (
                                        <p className="whitespace-pre-line leading-6 text-slate-300">
                                            {item.description}
                                        </p>
                                    )}
                                </div>

                                <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-white/10 pt-4 text-sm">
                                    {item.certificate_url && (
                                        <a
                                            href={item.certificate_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-cyan-300 hover:underline"
                                        >
                                            Verify Certificate ↗
                                        </a>
                                    )}

                                    {item.certificate_image && (
                                        <a
                                            href={item.certificate_image}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-cyan-300 hover:underline"
                                        >
                                            View Image ↗
                                        </a>
                                    )}

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

export default ManageCertifications
