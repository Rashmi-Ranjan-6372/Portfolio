import { useEffect, useState } from 'react'
import api from '../../api/axios'

const statusOptions = [
    { value: 'NEW', label: 'New' },
    { value: 'READ', label: 'Read' },
    { value: 'REPLIED', label: 'Replied' },
]

function ManageMessages() {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [notice, setNotice] = useState('')
    const [selectedMessage, setSelectedMessage] = useState(null)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('ALL')
    const [updatingId, setUpdatingId] = useState(null)

    const getMessages = async () => {
        setLoading(true)
        setError('')

        try {
            const response = await api.get('contact/')

            const data =
                response.data.data ??
                response.data.results ??
                response.data

            setMessages(Array.isArray(data) ? data : [])
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                err.response?.data?.message ||
                'Unable to load messages. Check your Django API.'
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getMessages()
    }, [])

    const handleStatusChange = async (id, status) => {
        setError('')
        setNotice('')
        setUpdatingId(id)

        try {
            await api.patch(`contact/${id}/`, { status })

            setMessages((previous) =>
                previous.map((item) =>
                    item.id === id ? { ...item, status } : item
                )
            )

            setSelectedMessage((previous) =>
                previous?.id === id ? { ...previous, status } : previous
            )

            setNotice('Message status updated successfully.')
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                err.response?.data?.message ||
                'Unable to update message status. Check your Django API.'
            )
        } finally {
            setUpdatingId(null)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) {
            return
        }

        setError('')
        setNotice('')

        try {
            await api.delete(`contact/${id}/`)

            setSelectedMessage((previous) =>
                previous?.id === id ? null : previous
            )

            setNotice('Message deleted successfully.')
            await getMessages()
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                err.response?.data?.message ||
                'Unable to delete message.'
            )
        }
    }

    const filteredMessages = messages.filter((item) => {
        const searchText = search.toLowerCase()

        const matchesSearch = [
            item.name,
            item.email,
            item.subject,
            item.message,
        ].some((value) =>
            String(value ?? '').toLowerCase().includes(searchText)
        )

        const matchesStatus =
            statusFilter === 'ALL' || item.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const formatDate = (value) => {
        if (!value) return '—'

        const date = new Date(value)

        return Number.isNaN(date.getTime())
            ? value
            : date.toLocaleString()
    }

    const getStatusClass = (status) => {
        switch (status) {
            case 'NEW':
                return 'bg-cyan-400/10 text-cyan-300'
            case 'READ':
                return 'bg-amber-400/10 text-amber-300'
            case 'REPLIED':
                return 'bg-emerald-400/10 text-emerald-300'
            default:
                return 'bg-slate-400/10 text-slate-300'
        }
    }

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <p className="text-sm font-medium text-cyan-400">
                        PORTFOLIO INBOX
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-white">
                        Contact Messages
                    </h1>

                    <p className="mt-2 text-sm text-slate-400">
                        View messages, update their status, and reply to visitors.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={getMessages}
                    disabled={loading}
                    className="rounded-xl border border-white/10 px-5 py-3 text-sm text-slate-200 hover:bg-white/5 disabled:opacity-50"
                >
                    {loading ? 'Refreshing...' : 'Refresh Messages'}
                </button>
            </header>

            {notice && (
                <div
                    role="status"
                    className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300"
                >
                    {notice}
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-sm text-slate-400">Total Messages</p>
                    <p className="mt-3 text-3xl font-bold text-white">
                        {messages.length}
                    </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-sm text-slate-400">New</p>
                    <p className="mt-3 text-3xl font-bold text-cyan-300">
                        {messages.filter((item) => item.status === 'NEW').length}
                    </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-sm text-slate-400">Read</p>
                    <p className="mt-3 text-3xl font-bold text-amber-300">
                        {messages.filter((item) => item.status === 'READ').length}
                    </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-sm text-slate-400">Replied</p>
                    <p className="mt-3 text-3xl font-bold text-emerald-300">
                        {messages.filter((item) => item.status === 'REPLIED').length}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                    <label
                        htmlFor="message-search"
                        className="mb-2 block text-sm text-slate-300"
                    >
                        Search Messages
                    </label>

                    <input
                        id="message-search"
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search name, email, subject, or message..."
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
                    />
                </div>

                <div>
                    <label
                        htmlFor="status-filter"
                        className="mb-2 block text-sm text-slate-300"
                    >
                        Filter by Status
                    </label>

                    <select
                        id="status-filter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
                    >
                        <option value="ALL">All Messages</option>
                        {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                <div className="border-b border-white/10 px-5 py-4">
                    <h2 className="font-semibold text-white">
                        Inbox
                        <span className="ml-2 text-sm font-normal text-slate-400">
                            ({filteredMessages.length})
                        </span>
                    </h2>
                </div>

                {loading ? (
                    <p className="p-6 text-sm text-slate-400">
                        Loading messages...
                    </p>
                ) : filteredMessages.length === 0 ? (
                    <p className="p-6 text-sm text-slate-400">
                        No messages found.
                    </p>
                ) : (
                    <div className="divide-y divide-white/10">
                        {filteredMessages.map((item) => (
                            <article
                                key={item.id}
                                className="p-5 transition hover:bg-white/[0.02]"
                            >
                                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h3 className="font-semibold text-white">
                                                {item.subject || 'No subject'}
                                            </h3>

                                            <span
                                                className={`rounded-full px-3 py-1 text-xs ${getStatusClass(item.status)}`}
                                            >
                                                {item.status || 'NEW'}
                                            </span>
                                        </div>

                                        <p className="mt-2 text-sm text-cyan-300">
                                            {item.name}
                                        </p>

                                        <a
                                            href={`mailto:${item.email}`}
                                            className="mt-1 inline-block break-all text-sm text-slate-400 hover:text-cyan-300"
                                        >
                                            {item.email}
                                        </a>

                                        <p className="mt-3 whitespace-pre-line break-words text-sm leading-6 text-slate-300">
                                            {String(item.message ?? '').length > 180
                                                ? `${String(item.message).slice(0, 180)}...`
                                                : item.message}
                                        </p>

                                        <p className="mt-3 text-xs text-slate-500">
                                            Received: {formatDate(item.created_at)}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4">
                                        <div>
                                            <label
                                                htmlFor={`status-${item.id}`}
                                                className="mb-1 block text-xs text-slate-400"
                                            >
                                                Update Status
                                            </label>

                                            <select
                                                id={`status-${item.id}`}
                                                value={item.status || 'NEW'}
                                                disabled={updatingId === item.id}
                                                onChange={(e) =>
                                                    handleStatusChange(item.id, e.target.value)
                                                }
                                                className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400 disabled:opacity-50"
                                            >
                                                {statusOptions.map((option) => (
                                                    <option
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="flex gap-4 text-sm">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedMessage(item)}
                                                className="text-cyan-300 hover:underline"
                                            >
                                                View Full
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleDelete(item.id)}
                                                className="text-red-400 hover:underline"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            {selectedMessage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
                    onClick={() => setSelectedMessage(null)}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="message-dialog-title"
                        className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-slate-900 p-6 sm:p-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <h2
                                id="message-dialog-title"
                                className="text-xl font-bold text-white"
                            >
                                {selectedMessage.subject || 'Contact Message'}
                            </h2>

                            <button
                                type="button"
                                onClick={() => setSelectedMessage(null)}
                                aria-label="Close message"
                                className="text-2xl text-slate-400 hover:text-white"
                            >
                                ×
                            </button>
                        </div>

                        <div className="mt-5 space-y-3 text-sm">
                            <p className="text-slate-300">
                                <span className="text-slate-500">Name: </span>
                                {selectedMessage.name}
                            </p>

                            <p className="break-all text-slate-300">
                                <span className="text-slate-500">Email: </span>
                                {selectedMessage.email}
                            </p>

                            <p className="text-slate-300">
                                <span className="text-slate-500">Status: </span>
                                {selectedMessage.status || 'NEW'}
                            </p>

                            <p className="text-slate-300">
                                <span className="text-slate-500">Received: </span>
                                {formatDate(selectedMessage.created_at)}
                            </p>
                        </div>

                        <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-5">
                            <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-200">
                                {selectedMessage.message}
                            </p>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <a
                                href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(`Re: ${selectedMessage.subject || 'Your message'}`)}`}
                                className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
                            >
                                Reply by Email
                            </a>

                            <button
                                type="button"
                                onClick={() => handleStatusChange(selectedMessage.id, 'REPLIED')}
                                disabled={updatingId === selectedMessage.id || selectedMessage.status === 'REPLIED'}
                                className="rounded-xl border border-white/10 px-5 py-3 text-sm text-slate-300 hover:bg-white/5 disabled:opacity-50"
                            >
                                {selectedMessage.status === 'REPLIED'
                                    ? 'Marked as Replied'
                                    : 'Mark as Replied'}
                            </button>

                            <button
                                type="button"
                                onClick={() => setSelectedMessage(null)}
                                className="rounded-xl border border-white/10 px-5 py-3 text-sm text-slate-300 hover:bg-white/5"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )

}

export default ManageMessages