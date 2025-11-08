// Animation utilities for TravelHub System
export const animations = {
  // Fade animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },

  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },

  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },

  fadeInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },

  fadeInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },

  // Scale animations
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  },

  scaleUp: {
    initial: { transform: 'scale(1)' },
    animate: { transform: 'scale(1.05)' },
    exit: { transform: 'scale(1)' },
  },

  // Slide animations
  slideInLeft: {
    initial: { x: '-100%' },
    animate: { x: 0 },
    exit: { x: '-100%' },
  },

  slideInRight: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' },
  },

  slideInUp: {
    initial: { y: '100%' },
    animate: { y: 0 },
    exit: { y: '100%' },
  },

  slideInDown: {
    initial: { y: '-100%' },
    animate: { y: 0 },
    exit: { y: '-100%' },
  },

  // Stagger animations for lists
  staggerContainer: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },

  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
}

// Duration presets
export const durations = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
  slower: '700ms',
}

// Easing presets
export const easings = {
  ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
}

// CSS animation classes
export const animationClasses = {
  // Hover effects
  hoverLift: 'transition-transform duration-300 hover:scale-105 hover:shadow-lg',
  hoverGlow: 'transition-shadow duration-300 hover:shadow-xl hover:shadow-blue-500/20',
  hoverSlide: 'transition-transform duration-300 hover:translate-y-[-4px]',

  // Loading animations
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  bounce: 'animate-bounce',

  // Entry animations
  fadeIn: 'animate-in fade-in duration-300',
  slideInFromTop: 'animate-in slide-in-from-top duration-300',
  slideInFromBottom: 'animate-in slide-in-from-bottom duration-300',
  slideInFromLeft: 'animate-in slide-in-from-left duration-300',
  slideInFromRight: 'animate-in slide-in-from-right duration-300',
  zoomIn: 'animate-in zoom-in duration-300',

  // Exit animations
  fadeOut: 'animate-out fade-out duration-300',
  slideOutToTop: 'animate-out slide-out-to-top duration-300',
  slideOutToBottom: 'animate-out slide-out-to-bottom duration-300',
  slideOutToLeft: 'animate-out slide-out-to-left duration-300',
  slideOutToRight: 'animate-out slide-out-to-right duration-300',
  zoomOut: 'animate-out zoom-out duration-300',
}
