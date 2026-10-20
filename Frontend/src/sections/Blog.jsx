
const blogPosts = [
    {
        number: '01',
        category: 'Python',
        readTime: '5 min read',
        title: 'Why Python Is Popular for Backend Development',
        description:
            'Explore Python features, readable syntax, and its role in building maintainable backend applications and APIs.',
        tags: ['Python', 'Backend'],
    },
    {
        number: '02',
        category: 'Django REST Framework',
        readTime: '7 min read',
        title: 'Building REST APIs with Django REST Framework',
        description:
            'Understand serializers, API views, request validation, response handling, and how to structure a Django REST API.',
        tags: ['Django', 'DRF', 'REST APIs'],
    },
    {
        number: '03',
        category: 'Database',
        readTime: '6 min read',
        title: 'Working with PostgreSQL in Django Projects',
        description:
            'Learn about Django models, database relationships, ORM queries, and organizing application data efficiently.',
        tags: ['PostgreSQL', 'Django ORM'],
    },
]

function Blog() {
    return (
        <section
            id="blog"
            className="section-container py-24 sm:py-28"
        >
            <div className="mb-12 text-center">
                <p className="gradient-text text-sm font-semibold uppercase tracking-[0.25em]">
                    Knowledge & Insights
                </p>

                <h2 className="mt-4 text-3xl font-bold sm:text-5xl">
                    My <span className="gradient-text">Blog</span>
                </h2>

                <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-400">
                    Technical topics and learning notes from my journey in Python
                    backend development, REST APIs, and databases.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {blogPosts.map((post) => (
                    <article
                        key={post.number}
                        className="glass glass-hover group flex h-full flex-col overflow-hidden rounded-3xl"
                    >
                        <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-cyan-400/15 via-violet-500/10 to-transparent">
                            <span className="absolute right-5 top-4 text-sm font-bold text-white/30">
                                {post.number}
                            </span>

                            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06] text-3xl font-bold text-cyan-200 transition duration-300 group-hover:scale-110">
                                {'</>'}
                            </div>
                        </div>

                        <div className="flex flex-1 flex-col p-6">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-medium text-cyan-200">
                                    {post.category}
                                </span>

                                <span className="text-xs text-slate-500">
                                    {post.readTime}
                                </span>
                            </div>

                            <h3 className="mt-5 text-xl font-bold leading-snug transition-colors group-hover:text-cyan-200">
                                {post.title}
                            </h3>

                            <p className="mt-4 flex-1 text-sm leading-7 text-slate-400">
                                {post.description}
                            </p>

                            <div className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-5">
                                {post.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            <div className="mt-10 text-center">
                <a
                    href="#contact"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-6 py-3 font-medium text-slate-200 transition hover:border-cyan-300/40 hover:text-cyan-200"
                >
                    Discuss a Technical Topic
                    <span aria-hidden="true">↗</span>
                </a>
            </div>
        </section>
    )
}

export default Blog
