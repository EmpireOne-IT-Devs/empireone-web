import React, { useEffect, useState } from 'react'
import { Link } from '@inertiajs/react'
import { ArrowLeft } from 'lucide-react'

export default function Page() {
  const [activeSection, setActiveSection] = useState('overview')

  const navItems = [
    { id: '1', title: '1. Information We Collect' },
    { id: '2', title: '2. How We Use Your Information' },
    { id: '3', title: '3. Employee Access and Use' },
    { id: '4', title: '4. Information Sharing and Disclosure' },
    { id: '5', title: '5. Data Security' },
    { id: '6', title: '6. Data Retention' },
    { id: '7', title: '7. Cookies and System Technologies' },
    { id: '8', title: '8. Employee Responsibilities' },
    { id: '9', title: '9. Privacy and Data Requests' },
    { id: '10', title: '10. Changes to This Privacy Policy' },
    { id: '11', title: '11. Contact Us' },
  ]

  const scrollToSection = (id) => {
    setActiveSection(id)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Sync the active nav item with whichever section is currently in view.
  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter(Boolean)

    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id)
        }
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: 0 },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0710] text-gray-200 font-sans selection:bg-purple-500 selection:text-white pb-20">
      
      <div className="relative overflow-hidden bg-gradient-to-b from-[#180e29] to-[#0a0710] border-b border-purple-900/30 pt-8 pb-16 px-6 sm:px-12">
        
        <div className="max-w-8xl mx-auto mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-md font-medium text-gray-600 hover:text-white transition-colors duration-200 group"
          >
          <ArrowLeft className="w-6 h-6 transition-transform duration-200 group-hover:-translate-x-1" />
            Back to Home
          </Link>
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-4">
          <img
            src="/images/E1CXlogo.png"
            alt="EmpireOne Logo"
            className="mx-auto h-12 w-auto"
          />
          
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400">Policy</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-gray-400 text-sm sm:text-base leading-relaxed">
            EmpireOne is committed to protecting the privacy and security of information belonging to its employees and authorized users.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400">
            <div className="flex items-center gap-1.5 bg-[#120c1f] px-3 py-1.5 rounded-lg border border-purple-900/40">
              <span className="text-purple-400 font-medium">Effective Date:</span> September 8, 2026
            </div>
            <div className="flex items-center gap-1.5 bg-[#120c1f] px-3 py-1.5 rounded-lg border border-purple-900/40">
              <span className="text-purple-400 font-medium">Last Updated:</span> September 8, 2026
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 bg-[#110b1a] border border-purple-900/30 rounded-2xl p-4 shadow-xl backdrop-blur-sm">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
                Table of Contents
              </h3>
              <nav className="space-y-1 max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 block truncate ${
                      activeSection === item.id
                        ? 'bg-gradient-to-r from-purple-900/60 to-pink-900/40 text-white border-l-2 border-pink-500'
                        : 'text-gray-400 hover:text-white hover:bg-purple-950/40'
                    }`}
                  >
                    {item.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Privacy Content Area */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Overview / Introduction Box */}
            <div className="bg-[#110b1a] border border-purple-900/30 rounded-2xl p-6 sm:p-8 shadow-xl">
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                The <strong className="text-white">EmpireOne Unified System</strong> is an internal company platform designed to support employees, managers, administrators, and authorized personnel in accessing and managing company-related information and services.
              </p>
              <div className="mt-4 p-4 rounded-xl bg-purple-950/30 border border-purple-800/30 text-purple-200 text-xs sm:text-sm">
                By accessing or using the EmpireOne Unified System, you acknowledge that you have read and understood this Privacy Policy and agree to the practices described below.
              </div>
            </div>

            {/* Section 1 */}
            <section id="1" className="bg-[#110b1a] border border-purple-900/30 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white font-bold text-sm">
                  01
                </div>
                <h2 className="text-xl font-bold text-white">Information We Collect</h2>
              </div>
              
              <p className="text-sm text-gray-300 leading-relaxed">
                The EmpireOne Unified System may collect and process information necessary to provide employees with access to company systems and services. Depending on the features you use and your role within the organization, the system may collect:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Personal Info */}
                <div className="bg-[#170e24] border border-purple-900/20 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-pink-400 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    Personal Information
                  </h3>
                  <ul className="space-y-1.5 text-xs text-gray-300 list-disc list-inside">
                    <li>Full name & Employee ID</li>
                    <li>Date of birth (where required)</li>
                    <li>Contact details (Email, Phone)</li>
                    <li>Address / location information</li>
                    <li>Employment-related records</li>
                  </ul>
                </div>

                {/* Employment Info */}
                <div className="bg-[#170e24] border border-purple-900/20 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-pink-400 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    Employment Information
                  </h3>
                  <ul className="space-y-1.5 text-xs text-gray-300 list-disc list-inside">
                    <li>Department & Position / Job Title</li>
                    <li>Employment status & Manager info</li>
                    <li>Work schedule, attendance & leave</li>
                    <li>Performance & Development records</li>
                    <li>Employment administration data</li>
                  </ul>
                </div>
              </div>

              {/* System & Technical */}
              <div className="bg-[#170e24] border border-purple-900/20 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-pink-400 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
                  System and Technical Information
                </h3>
                <p className="text-xs text-gray-400 mb-3">When accessing the system, technical information is automatically recorded to maintain security:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-gray-300">
                  <div className="bg-[#100918] p-2 rounded border border-purple-900/30">Login & Auth Data</div>
                  <div className="bg-[#100918] p-2 rounded border border-purple-900/30">Account Activity</div>
                  <div className="bg-[#100918] p-2 rounded border border-purple-900/30">Access Dates & Times</div>
                  <div className="bg-[#100918] p-2 rounded border border-purple-900/30">IP Address</div>
                  <div className="bg-[#100918] p-2 rounded border border-purple-900/30">Browser & Device Info</div>
                  <div className="bg-[#100918] p-2 rounded border border-purple-900/30">Audit Logs & Actions</div>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section id="2" className="bg-[#110b1a] border border-purple-900/30 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white font-bold text-sm">
                  02
                </div>
                <h2 className="text-xl font-bold text-white">How We Use Your Information</h2>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                Information collected through the EmpireOne Unified System is used exclusively for legitimate business and employment-related purposes:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-gray-300">
                {[
                  "Managing employee accounts & access permissions",
                  "Supporting HR and employee administration",
                  "Maintaining official employee records",
                  "Managing attendance, schedules, and leave",
                  "Supporting payroll and compensation processes",
                  "Managing activities & company announcements",
                  "Administering training & development programs",
                  "Managing organizational workflows & approvals",
                  "Maintaining system security & incident prevention",
                  "Improving system functionality & performance",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-[#170e24] p-3 rounded-xl border border-purple-900/20">
                    <span className="text-pink-500 font-bold">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3 & 4 Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Section 3 */}
              <section id="3" className="bg-[#110b1a] border border-purple-900/30 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white font-bold text-sm">
                    03
                  </div>
                  <h2 className="text-lg font-bold text-white">Employee Access & Use</h2>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Access is based on assigned roles and authorization. Employees must strictly refrain from:
                </p>
                <ul className="space-y-2 text-xs text-gray-300">
                  <li className="flex items-center gap-2 text-red-300">
                    <span>✕</span> Accessing another employee's details without authorization
                  </li>
                  <li className="flex items-center gap-2 text-red-300">
                    <span>✕</span> Sharing account login credentials
                  </li>
                  <li className="flex items-center gap-2 text-red-300">
                    <span>✕</span> Attempting to bypass system permissions
                  </li>
                  <li className="flex items-center gap-2 text-red-300">
                    <span>✕</span> Copying or distributing confidential information
                  </li>
                </ul>
              </section>

              {/* Section 4 */}
              <section id="4" className="bg-[#110b1a] border border-purple-900/30 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white font-bold text-sm">
                    04
                  </div>
                  <h2 className="text-lg font-bold text-white">Sharing & Disclosure</h2>
                </div>
                <div className="p-3 bg-purple-950/40 rounded-xl border border-purple-500/30 text-xs font-semibold text-purple-200">
                  EmpireOne does NOT sell employee personal information.
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Data is only shared when reasonably necessary with authorized managers, HR personnel, IT administrators, or legal/regulatory authorities when legally required.
                </p>
              </section>
            </div>

            {/* Section 5 & 6 */}
            <section id="5" className="bg-[#110b1a] border border-purple-900/30 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white font-bold text-sm">
                  05
                </div>
                <h2 className="text-xl font-bold text-white">Data Security</h2>
              </div>
              <p className="text-sm text-gray-300">
                EmpireOne employs administrative, technical, and organizational measures including role-based access, encryption, access monitoring, secure connections, and continuous audit logging.
              </p>
            </section>

            <section id="6" className="bg-[#110b1a] border border-purple-900/30 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white font-bold text-sm">
                  06
                </div>
                <h2 className="text-xl font-bold text-white">Data Retention</h2>
              </div>
              <p className="text-sm text-gray-300">
                Information is retained only as long as necessary to fulfill business operations and comply with legal requirements. When no longer required, data is securely deleted or anonymized.
              </p>
            </section>

            {/* Sections 7, 8, 9, 10 Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div id="7" className="bg-[#110b1a] border border-purple-900/30 rounded-2xl p-6 space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="text-pink-500">07.</span> Cookies & System Tech
                </h3>
                <p className="text-xs text-gray-400">
                  Uses sessions, local storage, and essential cookies purely for authentication, security controls, and session continuity.
                </p>
              </div>

              <div id="8" className="bg-[#110b1a] border border-purple-900/30 rounded-2xl p-6 space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="text-pink-500">08.</span> Employee Responsibilities
                </h3>
                <p className="text-xs text-gray-400">
                  Employees must maintain confidential passwords, use strong credentials, log out on shared devices, and report suspicious activities.
                </p>
              </div>

              <div id="9" className="bg-[#110b1a] border border-purple-900/30 rounded-2xl p-6 space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="text-pink-500">09.</span> Privacy Requests
                </h3>
                <p className="text-xs text-gray-400">
                  Employees can request data corrections or raise concerns regarding data usage by contacting HR or the privacy team.
                </p>
              </div>

              <div id="10" className="bg-[#110b1a] border border-purple-900/30 rounded-2xl p-6 space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="text-pink-500">10.</span> Policy Updates
                </h3>
                <p className="text-xs text-gray-400">
                  EmpireOne may revise this policy periodically. Material updates will be communicated through internal system announcements.
                </p>
              </div>
            </div>

            {/* Contact Section */}
            <section id="11" className="bg-gradient-to-r from-[#1b102e] to-[#120b1f] border border-purple-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white font-bold text-sm">
                  11
                </div>
                <h2 className="text-xl font-bold text-white">Contact Us</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-[#0f091a] p-4 rounded-xl border border-purple-900/40 flex flex-col justify-between">
                  <span className="text-gray-400 font-medium">Department</span>
                  <span className="text-white font-semibold text-sm mt-1">HR & Privacy Office</span>
                </div>

                <div className="bg-[#0f091a] p-4 rounded-xl border border-purple-900/40 flex flex-col justify-between">
                  <span className="text-gray-400 font-medium">Official Email</span>
                  <span className="text-pink-400 font-semibold text-sm mt-1">privacy@empireonegroup.com</span>
                </div>

                <div className="bg-[#0f091a] p-4 rounded-xl border border-purple-900/40 flex flex-col justify-between">
                  <span className="text-gray-400 font-medium">Headquarters</span>
                  <span className="text-white font-semibold text-sm mt-1">San Carlos City, Negros Occidental</span>
                </div>
              </div>
            </section>

            {/* Employee Acknowledgment Card */}
            <div className="bg-gradient-to-r from-purple-950/60 via-pink-950/30 to-purple-950/60 border border-pink-500/30 rounded-2xl p-6 sm:p-8 text-center space-y-4">
              <h3 className="text-lg font-bold text-white">Employee Acknowledgment</h3>
              <p className="text-xs text-gray-300 max-w-2xl mx-auto leading-relaxed">
                By accessing the EmpireOne Unified System, employees acknowledge that they have been provided access to this Privacy Policy and understand that personal and employment-related information may be processed as necessary to operate company systems.
              </p>
              <button className="px-6 py-2.5 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:opacity-90 text-white text-xs font-semibold rounded-xl transition duration-200 shadow-lg shadow-pink-500/20">
                I Acknowledge & Understand
              </button>
            </div>

          </div>
        </div>
      </div>

    
    </div>
  )
}