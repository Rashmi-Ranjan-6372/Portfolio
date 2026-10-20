
const education = [
    {
        degree: 'Master of Computer Applications (MCA)',
        institution: 'Gita Autonomous College, Bhubaneswar',
        period: '2022 – 2024',
        result: '8.61 SGPA',
        level: 'Postgraduate',
        description:
            'Advanced computer applications, software development, programming, and database concepts.',
    },
    {
        degree: 'Bachelor of Science (BSc)',
        institution: 'Udayanath Autonomous College of Science & Technology, Cuttack',
        period: '2019 – 2022',
        result: '7.32 CGPA',
        level: 'Undergraduate',
        description:
            'Built a foundation in scientific concepts, analytical thinking, and technical problem-solving.',
    },
    {
        degree: 'Higher Secondary Education (12th)',
        institution: 'Alfa Best Higher Secondary School, Kendrapara',
        period: '2017 – 2019',
        result: '65%',
        level: 'Higher Secondary',
        description:
            'Completed higher secondary education and developed the foundation for further studies.',
    },
]

function Education() {
    return (
        <section
            id="education"
            className="section-container py-24 sm:py-28"
        >
            <div className="mb-12 text-center">
                <p className="gradient-text text-sm font-semibold uppercase tracking-[0.25em]">
                    Academic Background
                </p>

                <h2 className="mt-4 text-3xl font-bold sm:text-5xl">
                    My <span className="gradient-text">Education</span>
                </h2>

                <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-400">
                    My academic journey and the educational foundation behind my
                    software development career.
                </p>
            </div>

            <div className="mx-auto grid max-w-5xl gap-6">
                {education.map((item, index) => (
                    <article
                        key={item.degree}
                        className="glass glass-hover rounded-3xl p-6 sm:p-8"
                    >
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-xl font-bold text-cyan-200">
                                0{index + 1}
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                                    <div>
                                        <span className="text-xs font-semibold uppercase tracking-wider text-violet-300">
                                            {item.level}
                                        </span>

                                        <h3 className="mt-2 text-xl font-bold leading-snug sm:text-2xl">
                                            {item.degree}
                                        </h3>
                                    </div>

                                    <span className="w-fit shrink-0 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300">
                                        {item.period}
                                    </span>
                                </div>

                                <p className="mt-3 leading-7 text-cyan-200">
                                    {item.institution}
                                </p>

                                <p className="mt-4 leading-7 text-slate-400">
                                    {item.description}
                                </p>

                                <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-2">
                                    <span className="text-sm text-slate-400">
                                        Academic Result
                                    </span>
                                    <span className="font-semibold text-emerald-200">
                                        {item.result}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    )
}

export default Education
