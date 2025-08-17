'use client'

import dynamic from 'next/dynamic'
import { ReactNode } from 'react'

// Dynamically import client-side only components
const AccessibilityEnhancements = dynamic(
  () => import('@/components/ui/AccessibilityEnhancements').then(mod => ({ default: mod.AccessibilityEnhancements })),
  { ssr: false }
)

interface ClientWrapperProps {
  children: ReactNode
}

export function ClientWrapper({ children }: ClientWrapperProps) {
  return (
    <AccessibilityEnhancements>
      {children}
    </AccessibilityEnhancements>
  )
}