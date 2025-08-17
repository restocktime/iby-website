'use client'

import { Variants, Transition } from 'framer-motion'

// Spring physics configurations
export const springConfigs = {
  gentle: {
    type: "spring" as const,
    stiffness: 120,
    damping: 14,
    mass: 1
  },
  bouncy: {
    type: "spring" as const,
    stiffness: 400,
    damping: 17,
    mass: 1
  },
  snappy: {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
    mass: 1
  },
  smooth: {
    type: "spring" as const,
    stiffness: 200,
    damping: 20,
    mass: 1
  }
}

// Easing functions
export const easings = {
  easeInOut: [0.4, 0, 0.2, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  backOut: [0.34, 1.56, 0.64, 1],
  backIn: [0.36, 0, 0.66, -0.56],
  anticipate: [0.22, 1, 0.36, 1]
}

// Section transition variants
export const sectionVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      ...springConfigs.gentle,
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  },
  exit: {
    opacity: 0,
    y: -60,
    scale: 1.05,
    transition: springConfigs.snappy
  }
}

// Navigation transition variants
export const navVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: springConfigs.bouncy
  },
  hover: {
    scale: 1.05,
    x: 5,
    transition: springConfigs.snappy
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 }
  }
}

// Card animation variants
export const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    rotateX: -15,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: springConfigs.gentle
  },
  hover: {
    y: -8,
    rotateX: 5,
    scale: 1.02,
    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
    transition: springConfigs.bouncy
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 }
  }
}

// Button micro-interaction variants
export const buttonVariants: Variants = {
  idle: {
    scale: 1,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
  },
  hover: {
    scale: 1.05,
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    transition: springConfigs.snappy
  },
  tap: {
    scale: 0.95,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    transition: { duration: 0.1 }
  },
  loading: {
    scale: [1, 1.02, 1],
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: "easeInOut"
    }
  }
}

// Text animation variants
export const textVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ...springConfigs.gentle,
      staggerChildren: 0.05
    }
  }
}

// Stagger animation for lists
export const staggerVariants: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

// Page transition variants
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.98,
    y: 20
  },
  enter: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      ...springConfigs.gentle,
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    y: -20,
    transition: springConfigs.snappy
  }
}

// Floating animation for hero elements
export const floatingVariants: Variants = {
  floating: {
    y: [0, -10, 0],
    rotate: [0, 1, 0],
    transition: {
      y: {
        repeat: Infinity,
        duration: 3,
        ease: "easeInOut"
      },
      rotate: {
        repeat: Infinity,
        duration: 4,
        ease: "easeInOut"
      }
    }
  }
}

// Pulse animation for attention-grabbing elements
export const pulseVariants: Variants = {
  pulse: {
    scale: [1, 1.05, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      repeat: Infinity,
      duration: 2,
      ease: "easeInOut"
    }
  }
}

// Slide in from different directions
export const slideVariants = {
  fromLeft: {
    hidden: { opacity: 0, x: -100 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: springConfigs.gentle 
    }
  },
  fromRight: {
    hidden: { opacity: 0, x: 100 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: springConfigs.gentle 
    }
  },
  fromTop: {
    hidden: { opacity: 0, y: -100 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: springConfigs.gentle 
    }
  },
  fromBottom: {
    hidden: { opacity: 0, y: 100 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: springConfigs.gentle 
    }
  }
}

// Custom transition presets
export const transitions = {
  fast: { duration: 0.2, ease: easings.easeOut },
  medium: { duration: 0.4, ease: easings.easeInOut },
  slow: { duration: 0.6, ease: easings.easeInOut },
  bounce: springConfigs.bouncy,
  gentle: springConfigs.gentle,
  snappy: springConfigs.snappy
}

// Utility function to create custom variants
export const createVariants = (
  hiddenState: any,
  visibleState: any,
  transition: Transition = springConfigs.gentle
): Variants => ({
  hidden: hiddenState,
  visible: {
    ...visibleState,
    transition
  }
})

// Utility function for staggered animations
export const createStaggerVariants = (
  staggerDelay: number = 0.1,
  childrenDelay: number = 0
): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: childrenDelay
    }
  }
})