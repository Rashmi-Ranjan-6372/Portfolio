
const experiences = [
  {
    role: 'Python Backend Developer',
    company: 'Bariflo Labs',
    location: 'Jagatpur, Cuttack, Odisha',
    period: 'March 2026 – Present',
    type: 'Full-time',
    description:
      'Developing backend functionality and REST APIs for business applications, with a focus on inventory management and industrial monitoring systems.',
    responsibilities: [
      'Developing REST APIs using Python, Django, and Django REST Framework.',
      'Implementing component, warehouse, inventory, and stock transaction functionality.',
      'Working with PostgreSQL models, relationships, serializers, and API validation.',
      'Supporting API integration and testing with frontend developers using Postman.',
      'Contributing to backend development for industrial equipment and process monitoring.',
    ],
    technologies: [
      'Python',
      'Django',
      'Django REST Framework',
      'PostgreSQL',
      'Git',
      'Postman',
    ],
  },
]

function Experience() {
  return (
    <section
      id="experience"
      className="section-container py-24 sm:py-28"
    >
      <div className="mb-12 text-center">
        <p className="gradient-text text-sm font-semibold uppercase tracking-[0.25em]">
          My Professional Journey
        </p>

        <h2 className="mt-4 text-3xl font-bold sm:text-5xl">
          Work <span className="gradient-text">Experience</span>
        </h2>

        <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-400">
          My professional experience in backend development, API engineering,
          and database-driven applications.
        </p>
      </div>

      <div className="relative mx-auto max-w-4xl">
        <div className="absolute bottom-8 left-3 top-8 w-px bg-gradient-to-b from-cyan-400/70 via-violet-400/50 to-transparent sm:left-5" />

        <div className="space-y-8">
          {experiences.map((experience) => (
            <article
              key={`${experience.company}-${experience.role}`}
              className="relative pl-9 sm:pl-14"
            >
              <span className="absolute left-0 top-8 flex h-7 w-7 items-center justify-center rounded-full border border-cyan-300/40 bg-slate-950 sm:left-2">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-lg shadow-cyan-400/50" />
              </span>

              <div className="glass glass-hover rounded-3xl p-6 sm:p-8">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <span className="inline-flex rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-200">
                      {experience.type}
                    </span>

                    <h3 className="mt-4 text-xl font-bold sm:text-2xl">
                      {experience.role}
                    </h3>

                    <p className="mt-2 text-lg font-medium text-cyan-200">
                      {experience.company}
                    </p>

                    <p className="mt-2 text-sm text-slate-400">
                      {experience.location}
                    </p>
                  </div>

                  <span className="w-fit rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300">
                    {experience.period}
                  </span>
                </div>

                <p className="mt-6 leading-7 text-slate-300">
                  {experience.description}
                </p>

                <h4 className="mt-7 font-semibold text-white">
                  Key Responsibilities
                </h4>

                <ul className="mt-4 space-y-3">
                  {experience.responsibilities.map((responsibility) => (
                    <li
                      key={responsibility}
                      className="flex gap-3 text-sm leading-7 text-slate-400 sm:text-base"
                    >
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                      <span>{responsibility}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex flex-wrap gap-2 border-t border-white/10 pt-6">
                  {experience.technologies.map((technology) => (
                    <span
                      key={technology}
                      className="rounded-lg border border-violet-300/15 bg-violet-300/5 px-3 py-2 text-xs text-violet-200"
                    >
                      {technology}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Experience
