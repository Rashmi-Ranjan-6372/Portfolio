
import { useState } from 'react'

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    })

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        const subject = encodeURIComponent(formData.subject)
        const body = encodeURIComponent(
            `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`,
        )

        window.location.href =
            `mailto:rashmiranjan6372@gmail.com?subject=${subject}&body=${body}`
    }

    return (
        <section
            id="contact"
            className="section-container py-24 sm:py-28"
        >
            <div className="mb-12 text-center">
                <p className="gradient-text text-sm font-semibold uppercase tracking-[0.25em]">
                    Get In Touch
                </p>

                <h2 className="mt-4 text-3xl font-bold sm:text-5xl">
                    Let's <span className="gradient-text">Connect</span>
                </h2>

                <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-400">
                    Have a project, opportunity, or technical question? Feel free to
                    contact me. I'd be happy to connect with you.
                </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-5">
                <div className="space-y-5 lg:col-span-2">
                    <div className="glass rounded-3xl p-6 sm:p-8">
                        <h3 className="text-xl font-bold">Contact Information</h3>

                        <p className="mt-3 leading-7 text-slate-400">
                            I'm interested in backend development opportunities,
                            collaborative projects, and professional connections.
                        </p>

                        <div className="mt-7 space-y-5">
                            <a
                                href="mailto:rashmiranjan6372@gmail.com"
                                className="flex items-start gap-4 rounded-xl p-3 transition hover:bg-white/[0.04]"
                            >
                                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-lg text-cyan-200">
                                    @
                                </span>

                                <div className="min-w-0">
                                    <p className="text-sm text-slate-400">Email</p>
                                    <p className="mt-1 break-all font-medium text-slate-100">
                                        rashmiranjan6372@gmail.com
                                    </p>
                                </div>
                            </a>

                            <a
                                href="https://github.com/Rashmi-Ranjan-6372"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start gap-4 rounded-xl p-3 transition hover:bg-white/[0.04]"
                            >
                                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-300/20 bg-violet-300/10 text-lg text-violet-200">
                                    GH
                                </span>

                                <div className="min-w-0">
                                    <p className="text-sm text-slate-400">GitHub</p>
                                    <p className="mt-1 break-all font-medium text-slate-100">
                                        github.com/Rashmi-Ranjan-6372
                                    </p>
                                </div>
                            </a>

                            <a
                                href="https://linkedin.com/in/rrpradhan798483"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start gap-4 rounded-xl p-3 transition hover:bg-white/[0.04]"
                            >
                                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-sm font-bold text-cyan-200">
                                    in
                                </span>

                                <div className="min-w-0">
                                    <p className="text-sm text-slate-400">LinkedIn</p>
                                    <p className="mt-1 break-all font-medium text-slate-100">
                                        linkedin.com/in/rrpradhan798483
                                    </p>
                                </div>
                            </a>
                        </div>
                    </div>

                    <div className="glass rounded-3xl p-6">
                        <div className="flex items-center gap-3">
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                            <p className="font-medium text-slate-200">
                                Open to professional connections
                            </p>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-slate-400">
                            Connect with me to discuss Python, Django, REST APIs, databases,
                            and backend engineering.
                        </p>
                    </div>
                </div>

                <div className="glass rounded-3xl p-6 sm:p-8 lg:col-span-3">
                    <h3 className="text-xl font-bold">Send Me a Message</h3>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                        Fill in the details below to prepare an email message.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="contact-name"
                                    className="mb-2 block text-sm font-medium text-slate-300"
                                >
                                    Your Name
                                </label>

                                <input
                                    id="contact-name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your name"
                                    className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="contact-email"
                                    className="mb-2 block text-sm font-medium text-slate-300"
                                >
                                    Your Email
                                </label>

                                <input
                                    id="contact-email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="contact-subject"
                                className="mb-2 block text-sm font-medium text-slate-300"
                            >
                                Subject
                            </label>

                            <input
                                id="contact-subject"
                                name="subject"
                                type="text"
                                required
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="What would you like to discuss?"
                                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="contact-message"
                                className="mb-2 block text-sm font-medium text-slate-300"
                            >
                                Message
                            </label>

                            <textarea
                                id="contact-message"
                                name="message"
                                rows={5}
                                required
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Write your message here..."
                                className="w-full resize-y rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50"
                            />
                        </div>

                        <button
                            type="submit"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3.5 font-semibold text-slate-950 transition hover:scale-[1.01] sm:w-auto"
                        >
                            Prepare Email
                            <span aria-hidden="true">↗</span>
                        </button>

                        <p className="text-xs leading-5 text-slate-500">
                            This form opens your default email application. It does not
                            send or save messages directly on this website.
                        </p>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default Contact
