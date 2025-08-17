import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">Isaac Benyakar</h3>
            <p className="text-neutral-300 mb-4">
              Full-stack developer specializing in modern web applications,
              automation, and custom business solutions.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://github.com"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                GitHub
              </Link>
              <Link
                href="https://linkedin.com"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                LinkedIn
              </Link>
              <Link
                href="https://twitter.com"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                Twitter
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Web Development
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Automation
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Custom CRM
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Analytics
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="text-neutral-400">
                Email: isaac@example.com
              </li>
              <li className="text-neutral-400">
                Phone: +1 (555) 123-4567
              </li>
              <li className="text-neutral-400">
                Location: New York, NY
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-8 pt-8 text-center">
          <p className="text-neutral-400">
            © {new Date().getFullYear()} Isaac Benyakar. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}