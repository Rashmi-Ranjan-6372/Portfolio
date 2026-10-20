
const certifications = [
    {
        number: '01',
        title: 'Python Programming',
        provider: 'IIG Varsity',
        year: '2025',
        category: 'Programming',
        description:
            'Certification covering Python programming fundamentals and core concepts used in software development.',
        skills: ['Python', 'Programming Fundamentals', 'Problem Solving'],
    },
]

function Certifications() {
    return (
        <section
            id="certifications"
            className="section-container py-24 sm:py-28"
        >
            <div className="mb-12 text-center">
                <p className="gradient-text text-sm font-semibold uppercase tracking-[0.25em]">
                    Learning & Development
                </p>

                <h2 className="mt-4 text-3xl font-bold sm:text-5xl">
                    My <span className="gradient-text">Certifications</span>
                </h2>

                <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-400">
                    Certifications that reflect my commitment to learning programming
                    concepts and improving my technical skills.
                </p>
            </div>

            <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
                {certifications.map((certification) => (
                    <article
                        key={certification.number}
                        className="glass glass-hover flex h-full flex-col rounded-3xl p-6 sm:p-8"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-2xl text-cyan-200">
                                <span aria-hidden="true">✦</span>
                            </div>

                            <span className="rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-1.5 text-xs font-medium text-violet-200">
                                {certification.category}
                            </span>
                        </div>

                        <h3 className="mt-6 text-xl font-bold sm:text-2xl">
                            {certification.title}
                        </h3>

                        <p className="mt-3 text-cyan-200">
                            {certification.provider}
                        </p>

                        <p className="mt-2 text-sm text-slate-400">
                            Issued in {certification.year}
                        </p>

                        <p className="mt-5 flex-1 leading-7 text-slate-400">
                            {certification.description}
                        </p>

                        <div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-5">
                            {certification.skills.map((skill) => (
                                <span
                                    key={skill}
                                    className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-300"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </article>
                ))}
            </div>

            <p className="mt-8 text-center text-sm text-slate-500">
                More certifications can be added as you complete additional courses.
            </p>
        </section>
    )
}

export default Certifications
