import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

function AdminLogin() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    })

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        localStorage.removeItem('access')
        localStorage.removeItem('refresh')

        try {
            const response = await api.post(
                'accounts/login/',
                formData
            )

            const { access, refresh } = response.data

            if (!access || !refresh) {
                throw new Error('Login response did not contain both tokens.')
            }

            localStorage.setItem('access', access)
            localStorage.setItem('refresh', refresh)

            navigate('/admin/dashboard', { replace: true })
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                err.response?.data?.message ||
                err.message ||
                'Invalid username or password.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-white">
            <div className="w-full max-w-md">
                <Link
                    to="/"
                    className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-cyan-400"
                >
                    <span>←</span>
                    Back to portfolio
                </Link>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-7 shadow-2xl shadow-black/30 sm:p-9">
                    <div className="mb-8">
                        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-2xl text-cyan-300">
                            <span>R</span>
                        </div>

                        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
                            Portfolio Admin
                        </p>

                        <h1 className="text-3xl font-bold tracking-tight">
                            Welcome back
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                            Sign in to manage your portfolio content.
                        </p>
                    </div>

                    {error && (
                        <div
                            role="alert"
                            className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                        >
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="username"
                                className="mb-2 block text-sm font-medium text-slate-300"
                            >
                                Username
                            </label>

                            <input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter your username"
                                required
                                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-slate-300"
                            >
                                Password
                            </label>

                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    required
                                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 pr-20 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-3 text-sm text-slate-400 transition hover:text-cyan-400"
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? 'Signing in...' : 'Sign in to dashboard'}
                        </button>
                    </form>

                    <p className="mt-7 text-center text-xs leading-5 text-slate-500">
                        Authorized administrators only.
                    </p>
                </div>

                <p className="mt-6 text-center text-xs text-slate-600">
                    © {new Date().getFullYear()} Rashmi Ranjan Pradhan
                </p>
            </div>
        </main>
    )
}

export default AdminLogin