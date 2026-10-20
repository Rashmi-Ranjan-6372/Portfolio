
import { NavLink, useNavigate } from 'react-router-dom'
import api from '../api/axios'

const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: '▦' },
    { name: 'Projects', path: '/admin/projects', icon: '◇' },
    { name: 'Skills', path: '/admin/skills', icon: '⚡' },
    { name: 'Experience', path: '/admin/experience', icon: '▤' },
    { name: 'Education', path: '/admin/education', icon: '▣' },
    { name: 'Certifications', path: '/admin/certifications', icon: '✧' },
    { name: 'Blog', path: '/admin/blog', icon: '▤' },
    { name: 'Testimonials', path: '/admin/testimonials', icon: '❞' },
    { name: 'Messages', path: '/admin/messages', icon: '✉' },
]

function AdminSidebar() {
    const navigate = useNavigate()

    const handleLogout = async () => {
        const refresh = localStorage.getItem('refresh')
        const access = localStorage.getItem('access')

        try {
            if (refresh && access) {
                await api.post(
                    'accounts/logout/',
                    { refresh },
                    {
                        headers: {
                            Authorization: `Bearer ${access}`,
                        },
                    }
                )
            }
        } catch (error) {
            console.error('Logout request failed:', error)
        } finally {
            localStorage.removeItem('access')
            localStorage.removeItem('refresh')
            navigate('/admin/login', { replace: true })
        }
    }

    return (
        <aside className="flex w-full flex-col border-b border-white/10 bg-slate-900 md:min-h-screen md:w-64 md:shrink-0 md:border-b-0 md:border-r">
            <div className="border-b border-white/10 px-6 py-6">
                <h2 className="text-xl font-bold text-white">
                    Rashmi<span className="text-cyan-400">.</span>
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                    Portfolio Administration
                </p>
            </div>

            <nav className="flex-1 space-y-1 overflow-x-auto p-3">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${isActive
                                ? 'bg-cyan-400/10 text-cyan-300'
                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            }`
                        }
                    >
                        <span className="w-5 text-center">{item.icon}</span>
                        {item.name}
                    </NavLink>
                ))}
            </nav>

            <div className="border-t border-white/10 p-3">
                <NavLink
                    to="/"
                    className="mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
                >
                    <span className="w-5 text-center">↗</span>
                    View Portfolio
                </NavLink>

                <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-red-400 transition hover:bg-red-400/10"
                >
                    <span className="w-5 text-center">⇥</span>
                    Logout
                </button>
            </div>
        </aside>
    )
}

export default AdminSidebar
