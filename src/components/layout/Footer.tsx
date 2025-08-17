'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Footer() {
  const socialLinks = [
    { name: 'GitHub', href: 'https://github.com/restocktime', icon: '🔗' },
    { name: 'LinkedIn', href: 'https://linkedin.com/in/isaac-benyakar', icon: '💼' },
    { name: 'X (Twitter)', href: 'https://twitter.com/restocktime', icon: '🐦' },
    { name: 'Instagram', href: 'https://instagram.com/benyakar94', icon: '📸' }
  ]

  const services = [
    'Web Development',
    'Automation',
    'Custom CRM',
    'Analytics'
  ]

  return (
    <footer className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      
      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <motion.div 
            className="col-span-1 md:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-luxury font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Isaac Benyakar
            </h3>
            <p className="text-neutral-300 mb-8 text-lg leading-relaxed max-w-md">
              Full-stack developer specializing in modern web applications,
              automation, and custom business solutions that drive real results.
            </p>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-200 border border-white/10 hover:border-white/20"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="text-lg">{link.icon}</span>
                    <span className="text-neutral-400 group-hover:text-white transition-colors">
                      {link.name}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Services Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xl font-semibold mb-6 text-white">Services</h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <motion.li
                  key={service}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href="#projects"
                    className="text-neutral-400 hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {service}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xl font-semibold mb-6 text-white">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <span className="text-blue-400">📧</span>
                <Link 
                  href="mailto:iby@isaacbenyakar.com"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  iby@isaacbenyakar.com
                </Link>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400">📱</span>
                <Link 
                  href="tel:+13053933009"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  +1 (305) 393-3009
                </Link>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400">💬</span>
                <Link 
                  href="https://wa.me/13053933009"
                  className="text-neutral-400 hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </Link>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div 
          className="border-t border-neutral-700/50 mt-12 pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-400 text-center md:text-left">
              © {new Date().getFullYear()} Isaac Benyakar. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link href="#" className="text-neutral-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-neutral-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}