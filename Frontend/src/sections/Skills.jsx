import { useEffect, useState } from 'react'
import api from '../api/axios'

const categoryIcons = {
    'programming language': '💻',
    'backend development': '⚙️',
    database: '🗄️',
    'tools & technologies': '🛠️',
    'tools and technologies': '🛠️',
}

function getSkillIcon(categoryName) {
    return categoryIcons[categoryName?.toLowerCase()] || '🚀'
}

function Skills() {
    const [skillGroups, setSkillGroups] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        let isMounted = true

        const fetchSkills = async () => {
            try {
                const [categoriesResponse, skillsResponse] = await Promise.all([
                    api.get('skills/categories/'),
                    api.get('skills/'),
                ])

                const categoriesData = categoriesResponse.data
                const skillsData = skillsResponse.data

                const categories = Array.isArray(categoriesData)
                    ? categoriesData
                    : categoriesData.results || categoriesData.data || []

                const skills = Array.isArray(skillsData)
                    ? skillsData
                    : skillsData.results || skillsData.data || []

                const groups = categories
                    .map((category) => ({
                        id: category.id,
                        title: category.name,
                        icon: getSkillIcon(category.name),
                        skills: skills.filter((skill) => {
                            const categoryId =
                                typeof skill.category === 'object'
                                    ? skill.category?.id
                                    : skill.category

                            return (
                                String(categoryId) === String(category.id) &&
                                skill.is_active !== false
                            )
                        }),
                    }))
                    .filter((group) => group.skills.length > 0)

                if (isMounted) {
                    setSkillGroups(groups)
                    setError('')
                }
            } catch (err) {
                if (isMounted) {
                    setError('Unable to load skills. Please try again later.')
                }
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        fetchSkills()

        return () => {
            isMounted = false
        }
    }, [])

    return (
        <section
            id="skills"
            className="section-container scroll-mt-24 py-24 sm:py-28"
        >
            <div className="mb-12 text-center">
                <p className="gradient-text text-sm font-semibold uppercase tracking-[0.25em]">
                    My Technical Expertise
                </p>

                <h2 className="mt-4 text-3xl font-bold text-white sm:text-5xl">
                    Technical <span className="gradient-text">Skills</span>
                </h2>

                <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-400">
                    Technologies and tools I use to build backend applications,
                    develop APIs, and manage data.
                </p>
            </div>

            {loading ? (
                <div className="glass rounded-2xl p-10 text-center text-slate-400">
                    Loading skills...
                </div>
            ) : error ? (
                <div className="glass rounded-2xl p-10 text-center text-rose-300">
                    {error}
                </div>
            ) : skillGroups.length === 0 ? (
                <div className="glass rounded-2xl p-10 text-center text-slate-400">
                    No skills are available yet.
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                    {skillGroups.map((group) => (
                        <div
                            key={group.id}
                            className="glass glass-hover rounded-3xl p-6 transition duration-300 hover:-translate-y-1 sm:p-8"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-2xl">
                                    {group.icon}
                                </div>

                                <h3 className="text-lg font-bold text-white sm:text-xl">
                                    {group.title}
                                </h3>
                            </div>

                            <div className="mt-6 space-y-5">
                                {group.skills.map((skill) => {
                                    const percentage = Math.min(
                                        100,
                                        Math.max(
                                            0,
                                            Number(skill.proficiency_percentage) || 0
                                        )
                                    )

                                    return (
                                        <div key={skill.id}>
                                            <div className="flex items-center justify-between gap-3">
                                                <span className="text-sm font-medium text-slate-200">
                                                    {skill.name}
                                                </span>

                                                {skill.proficiency_percentage != null && (
                                                    <span className="text-xs font-medium text-cyan-200">
                                                        {percentage}%
                                                    </span>
                                                )}
                                            </div>

                                            {skill.proficiency_percentage != null && (
                                                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                                                    <div
                                                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-700"
                                                        style={{
                                                            width: `${percentage}%`,
                                                        }}
                                                    />
                                                </div>
                                            )}

                                            {skill.proficiency && (
                                                <p className="mt-1 text-xs text-slate-500">
                                                    {skill.proficiency
                                                        .toLowerCase()
                                                        .replace(/_/g, ' ')
                                                        .replace(/\b\w/g, (char) =>
                                                            char.toUpperCase()
                                                        )}
                                                </p>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="glass mt-8 rounded-3xl p-6 sm:p-8">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h3 className="text-xl font-bold text-white">
                            My Development{' '}
                            <span className="gradient-text">Focus</span>
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                            Writing maintainable backend code and building reliable,
                            secure API-driven applications.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {[
                            'API Design',
                            'Authentication',
                            'Data Management',
                        ].map((item) => (
                            <span
                                key={item}
                                className="rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-2 text-xs font-medium text-violet-200"
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Skills