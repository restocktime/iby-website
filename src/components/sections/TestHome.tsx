'use client'

export default function TestHome() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          Isaac Benyakar
        </h1>
        <p className="text-xl text-slate-300 mb-12">
          Full Stack Developer & Automation Expert
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-blue-400">Web Development</h3>
            <p className="text-slate-300">Modern React & Next.js applications</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-purple-400">Automation</h3>
            <p className="text-slate-300">Custom workflow solutions</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-cyan-400">CRM Solutions</h3>
            <p className="text-slate-300">Tailored business systems</p>
          </div>
        </div>
        
        <div className="space-x-4">
          <button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-medium transition-colors">
            View Projects
          </button>
          <button className="border border-slate-600 hover:border-slate-400 px-8 py-3 rounded-lg font-medium transition-colors">
            Get In Touch
          </button>
        </div>
      </div>
    </div>
  )
}