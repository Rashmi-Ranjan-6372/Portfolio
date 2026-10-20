
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Home from './sections/Home'
import About from './sections/About'
import Skills from './sections/Skills'
import Projects from './sections/Projects'
import Experience from './sections/Experience'
import Education from './sections/Education'
import Certifications from './sections/Certifications'
import Testimonials from './sections/Testimonials'
import Blog from './sections/Blog'
import Contact from './sections/Contact'

import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'
import AdminLayout from './admin/AdminLayout'

import ManageProjects from './admin/pages/ManageProjects'
import ManageSkills from './admin/pages/ManageSkills'
import ManageExperience from './admin/pages/ManageExperience'
import ManageEducation from './admin/pages/ManageEducation'
import ManageCertifications from './admin/pages/ManageCertifications'
import ManageBlog from './admin/pages/ManageBlog'
import ManageTestimonials from './admin/pages/ManageTestimonials'
import ManageMessages from './admin/pages/ManageMessages'

function Portfolio() {
  return (
    <>
      <Navbar />

      <main>
        <Home />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <Certifications />
        <Testimonials />
        <Blog />
        <Contact />
      </main>

      <Footer />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="projects" element={<ManageProjects />} />
          <Route path="skills" element={<ManageSkills />} />
          <Route path="experience" element={<ManageExperience />} />
          <Route path="education" element={<ManageEducation />} />
          <Route path="certifications" element={<ManageCertifications />} />
          <Route path="blog" element={<ManageBlog />} />
          <Route path="testimonials" element={<ManageTestimonials />} />
          <Route path="messages" element={<ManageMessages />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
