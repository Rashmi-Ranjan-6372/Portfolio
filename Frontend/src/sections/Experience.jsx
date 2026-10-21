import { useEffect, useState } from 'react'
import api from '../api/axios'

function getImageUrl(image) {
  if (!image) return ''

  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image
  }

  return `http://127.0.0.1:8000${image.startsWith('/') ? image : `/${image}`}`
}

function formatDate(date) {
  if (!date) return ''

  const parsedDate = new Date(`${date.slice(0, 10)}T00:00:00`)

  if (Number.isNaN(parsedDate.getTime())) return date

  return parsedDate.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })
}

function getPeriod(experience) {
  const start = formatDate(experience.start_date)
  const end = experience.is_current
    ? 'Present'
    : formatDate(experience.end_date)

  if (start && end) return `${start} – ${end}`
  return start || end || ''
}

function getList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean)
  }

  if (typeof value === 'string' && value.trim()) {
    return value
      .split(/\n|,/)
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return []
}

function Experience() {
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const fetchExperiences = async () => {
      try {
        const response = await api.get('experience/')
        const responseData = response.data

        const experienceList = Array.isArray(responseData)
          ? responseData
          : responseData.results || responseData.data || []

        const sortedExperiences = [...experienceList].sort((a, b) => {
          if (a.is_current !== b.is_current) {
            return a.is_current ? -1 : 1
          }

          return (
            new Date(b.start_date || 0).getTime() -
            new Date(a.start_date || 0).getTime()
          )
        })

        if (isMounted) {
          setExperiences(sortedExperiences)
          setError('')
        }
      } catch {
        if (isMounted) {
          setError(
            'Unable to load work experience. Please try again later.'
          )
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchExperiences()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section
      id="experience"
      className="section-container scroll-mt-24 py-24 sm:py-28"
    >
      <div className="mb-12 text-center">
        <p className="gradient-text text-sm font-semibold uppercase tracking-[0.25em]">
          My Professional Journey
        </p>

        <h2 className="mt-4 text-3xl font-bold text-white sm:text-5xl">
          Work <span className="gradient-text">Experience</span>
        </h2>

        <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-400">
          My professional experience in backend development, API
          engineering, and database-driven applications.
        </p>
      </div>

      {loading ? (
        <div className="glass rounded-2xl p-10 text-center text-slate-400">
          Loading work experience...
        </div>
      ) : error ? (
        <div className="glass rounded-2xl p-10 text-center text-rose-300">
          {error}
        </div>
      ) : experiences.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center text-slate-400">
          Work experience will appear here when available.
        </div>
      ) : (
        <div className="relative mx-auto max-w-4xl">
          <div className="absolute bottom-8 left-3 top-8 w-px bg-gradient-to-b from-cyan-400/70 via-violet-400/50 to-transparent sm:left-5" />

          <div className="space-y-8">
            {experiences.map((experience, index) => {
              const responsibilities = getList(
                experience.responsibilities
              )
              const technologies = getList(
                experience.skills_used
              )
              const logo = getImageUrl(experience.company_logo)

              return (
                <article
                  key={experience.id ?? index}
                  className="relative pl-9 sm:pl-14"
                >
                  <span className="absolute left-0 top-8 flex h-7 w-7 items-center justify-center rounded-full border border-cyan-300/40 bg-slate-950 sm:left-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-lg shadow-cyan-400/50" />
                  </span>

                  <div className="glass glass-hover rounded-3xl p-6 transition duration-300 hover:-translate-y-1 sm:p-8">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          {logo && (
                            <img
                              src={logo}
                              alt={`${experience.company_name} logo`}
                              loading="lazy"
                              className="h-12 w-12 rounded-xl border border-white/10 bg-white object-contain p-1"
                              onError={(event) => {
                                event.currentTarget.style.display = 'none'
                              }}
                            />
                          )}

                          <span className="inline-flex rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-200">
                            {experience.is_current
                              ? 'Current Role'
                              : experience.employment_type || 'Experience'}
                          </span>
                        </div>

                        <h3 className="mt-4 text-xl font-bold text-white sm:text-2xl">
                          {experience.job_title}
                        </h3>

                        <p className="mt-2 text-lg font-medium text-cyan-200">
                          {experience.company_website ? (
                            <a
                              href={experience.company_website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="transition hover:text-violet-300"
                            >
                              {experience.company_name} ↗
                            </a>
                          ) : (
                            experience.company_name
                          )}
                        </p>

                        {experience.location && (
                          <p className="mt-2 text-sm text-slate-400">
                            {experience.location}
                          </p>
                        )}
                      </div>

                      {getPeriod(experience) && (
                        <span className="w-fit rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300">
                          {getPeriod(experience)}
                        </span>
                      )}
                    </div>

                    {experience.description && (
                      <p className="mt-6 whitespace-pre-line leading-7 text-slate-300">
                        {experience.description}
                      </p>
                    )}

                    {responsibilities.length > 0 && (
                      <>
                        <h4 className="mt-7 font-semibold text-white">
                          Key Responsibilities
                        </h4>

                        <ul className="mt-4 space-y-3">
                          {responsibilities.map(
                            (responsibility, responsibilityIndex) => (
                              <li
                                key={`${responsibilityIndex}-${responsibility}`}
                                className="flex gap-3 text-sm leading-7 text-slate-400 sm:text-base"
                              >
                                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                                <span>{responsibility}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </>
                    )}

                    {technologies.length > 0 && (
                      <div className="mt-7 flex flex-wrap gap-2 border-t border-white/10 pt-6">
                        {technologies.map((technology) => (
                          <span
                            key={technology}
                            className="rounded-lg border border-violet-300/15 bg-violet-300/5 px-3 py-2 text-xs text-violet-200"
                          >
                            {technology}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}

export default Experience