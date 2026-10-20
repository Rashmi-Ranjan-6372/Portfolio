
import { Link } from 'react-router-dom'

const managementItems = [
    {
        title: 'Projects',
        description: 'Manage your portfolio projects.',
        path: '/admin/projects',
        icon: '◇',
    },
    {
        title: 'Skills',
        description: 'Update your technical skills.',
        path: '/admin/skills',
        icon: '⚡',
    },
    {
        title: 'Experience',
        description: 'Manage your work experience.',
        path: '/admin/experience',
        icon: '▤',
    },
    {
        title: 'Education',
        description: 'Update your educational details.',
        path: '/admin/education',
        icon: '▣',
    },
    {
        title: 'Certifications',
        description: 'Manage certificates and courses.',
        path: '/admin/certifications',
        icon: '✧',
    },
    {
        title: 'Blog',
        description: 'Create and manage blog posts.',
        path: '/admin/blog',
        icon: '▤',
    },
    {
        title: 'Testimonials',
        description: 'Manage client recommendations.',
        path: '/admin/testimonials',
        icon: '❞',
    },
    {
        title: 'Messages',
        description: 'View messages from visitors.',
        path: '/admin/messages',
        icon: '✉',
    },
]

function AdminDashboard() {
    return (
        <div className="mx-auto max-w-7xl space-y-8">
            <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <p className="mb-2 text-sm font-medium text-cyan-400">
                        ADMINISTRATION
                    </p>

                    <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Dashboard
                    </h1>

                    <p className="mt-2 text-sm text-slate-400">
                        Manage your portfolio content from one place.
                    </p>
                </div>

                <Link
                    to="/"
                    className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-300"
                >
                    View Portfolio <span>↗</span>
                </Link>
            </header>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-400">
                            Portfolio Sections
                        </p>
                        <span className="text-xl text-cyan-400">▦</span>
                    </div>
                    <h2 className="mt-4 text-3xl font-bold text-white">8</h2>
                    <p className="mt-2 text-xs text-slate-500">
                        Content management pages
                    </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-400">
                            Projects
                        </p>
                        <span className="text-xl text-cyan-400">◇</span>
                    </div>
                    <h2 className="mt-4 text-3xl font-bold text-white">—</h2>
                    <p className="mt-2 text-xs text-slate-500">
                        Connect the projects API to load the count
                    </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-400">
                            Skills
                        </p>
                        <span className="text-xl text-cyan-400">⚡</span>
                    </div>
                    <h2 className="mt-4 text-3xl font-bold text-white">—</h2>
                    <p className="mt-2 text-xs text-slate-500">
                        Connect the skills API to load the count
                    </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-400">
                            Messages
                        </p>
                        <span className="text-xl text-cyan-400">✉</span>
                    </div>
                    <h2 className="mt-4 text-3xl font-bold text-white">—</h2>
                    <p className="mt-2 text-xs text-slate-500">
                        Connect the contact API to load the count
                    </p>
                </div>
            </section>

            <section>
                <div className="mb-5">
                    <h2 className="text-xl font-semibold text-white">
                        Content Management
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">
                        Choose a section to view or update its content.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {managementItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-cyan-400/[0.04]"
                        >
                            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-xl text-cyan-300 transition group-hover:bg-cyan-400/20">
                                {item.icon}
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <h3 className="font-semibold text-white">
                                    {item.title}
                                </h3>
                                <span className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-cyan-300">
                                    →
                                </span>
                            </div>

                            <p className="mt-2 text-sm leading-6 text-slate-400">
                                {item.description}
                            </p>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.04] p-5 sm:p-6">
                <h2 className="font-semibold text-white">
                    Quick Action
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                    Keep your portfolio updated with your latest projects,
                    skills, work experience, and certifications.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                        to="/admin/projects"
                        className="rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                    >
                        Manage Projects
                    </Link>

                    <Link
                        to="/admin/messages"
                        className="rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-300"
                    >
                        View Messages
                    </Link>
                </div>
            </section>
        </div>
    )
}

export default AdminDashboard
