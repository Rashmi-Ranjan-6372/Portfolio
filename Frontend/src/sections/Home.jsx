
function Home() {
  return (
    <section
      id="home"
      className="section-container flex min-h-screen items-center py-28"
    >
      <div className="grid w-full items-center gap-12 lg:grid-cols-2">
        {/* Left side: Introduction */}
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/5 px-4 py-2 text-sm text-cyan-200 backdrop-blur-xl">
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
            Python Backend Developer
          </div>

          <p className="text-lg text-slate-300">Hello, I'm</p>

          <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            Rashmi Ranjan
            <span className="gradient-text mt-2 block">Pradhan</span>
          </h1>

          <h2 className="mt-6 text-xl font-semibold text-slate-200 sm:text-2xl">
            Building reliable backend
            <span className="gradient-text"> solutions.</span>
          </h2>

          <p className="mt-5 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
            I develop web applications and REST APIs using Python, Django,
            Django REST Framework, and PostgreSQL. I enjoy solving problems
            and building scalable backend systems.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#projects"
              className="rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-500/10 transition hover:-translate-y-1 hover:shadow-cyan-500/20"
            >
              View My Projects
            </a>

            <a
              href="#contact"
              className="glass rounded-xl px-6 py-3 font-semibold text-white transition hover:-translate-y-1 hover:border-cyan-300/40"
            >
              Contact Me
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {['Python', 'Django', 'DRF', 'PostgreSQL'].map((skill) => (
              <span
                key={skill}
                className="glass rounded-lg px-4 py-2 text-sm text-slate-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Right side: Profile photo */}
        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute -inset-6 rounded-full bg-gradient-to-r from-cyan-500/20 to-violet-500/20 blur-3xl" />

          <div className="glass relative rounded-3xl p-3 sm:p-4">
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <img
                src="/Profile.jpg"
                alt="Rashmi Ranjan Pradhan"
                className="h-[380px] w-full object-cover object-center sm:h-[480px]"
                onError={(event) => {
                  event.currentTarget.style.display = 'none'
                }}
              />
            </div>

            <div className="px-3 pb-3 pt-5 sm:px-4">
              <h3 className="text-xl font-bold text-white">
                Rashmi Ranjan Pradhan
              </h3>

              <p className="mt-1 text-sm text-cyan-200">
                Python Backend Developer
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {['Python', 'Django', 'REST APIs'].map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Floating information card */}
          <div className="glass absolute -bottom-5 -left-3 rounded-2xl px-4 py-3 sm:-left-8">
            <p className="text-xs text-slate-400">Core Focus</p>
            <p className="mt-1 font-semibold text-cyan-200">
              APIs & Backend
            </p>
          </div>

          <div className="glass absolute -right-2 top-8 rounded-xl px-4 py-3 sm:-right-5">
            <p className="text-xs text-slate-400">Specialization</p>
            <p className="mt-1 text-sm font-semibold text-violet-200">
              Django & DRF
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Home
