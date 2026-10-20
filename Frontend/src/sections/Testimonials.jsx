
const testimonials = [
    {
        title: 'Working Together',
        description:
            'Have we worked together on a software project? I would love to hear about your experience collaborating with me.',
        icon: '🤝',
        label: 'For Colleagues',
    },
    {
        title: 'Project Feedback',
        description:
            'Have you used an API or application I developed? Your genuine feedback helps me improve my work.',
        icon: '💻',
        label: 'For Clients',
    },
    {
        title: 'Professional Growth',
        description:
            'Feedback on my technical skills, teamwork, and problem-solving approach is always welcome.',
        icon: '🚀',
        label: 'For Mentors',
    },
]

function Testimonials() {
    return (
        <section
            id="testimonials"
            className="section-container py-24 sm:py-28"
        >
            <div className="mb-12 text-center">
                <p className="gradient-text text-sm font-semibold uppercase tracking-[0.25em]">
                    Feedback & Collaboration
                </p>

                <h2 className="mt-4 text-3xl font-bold sm:text-5xl">
                    What People <span className="gradient-text">Say</span>
                </h2>

                <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-400">
                    I value collaboration, constructive feedback, and continuous
                    improvement throughout my software development journey.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {testimonials.map((item) => (
                    <article
                        key={item.title}
                        className="glass glass-hover rounded-3xl p-6 sm:p-8"
                    >
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-2xl">
                            <span aria-hidden="true">{item.icon}</span>
                        </div>

                        <span className="mt-6 inline-block text-xs font-semibold uppercase tracking-wider text-violet-300">
                            {item.label}
                        </span>

                        <h3 className="mt-3 text-xl font-bold">
                            {item.title}
                        </h3>

                        <p className="mt-4 leading-7 text-slate-400">
                            {item.description}
                        </p>
                    </article>
                ))}
            </div>

            <div className="glass mt-8 rounded-2xl p-6 text-center sm:p-8">
                <p className="text-lg font-semibold">
                    Worked with me?
                </p>

                <p className="mt-2 leading-7 text-slate-400">
                    Your genuine feedback can help visitors understand my working style
                    and professional approach.
                </p>

                <a
                    href="#contact"
                    className="mt-5 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 font-semibold text-slate-950 transition hover:scale-[1.03]"
                >
                    Share Your Feedback
                </a>
            </div>
        </section>
    )
}

export default Testimonials
