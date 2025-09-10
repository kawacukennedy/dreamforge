"use client"

import { motion, Variants } from 'framer-motion'
import { ReactNode } from 'react'

// Optimized animation variants with shorter durations
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 }
}

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
}

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 }
}

export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -12 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -12 }
}

export const slideInRight: Variants = {
  initial: { opacity: 0, x: 12 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 12 }
}

export const staggerChildren: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.05
    }
  }
}

export const staggerChildrenFast: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.02
    }
  }
}

// Reusable animated components
interface AnimatedDivProps {
  children: ReactNode
  variants?: Variants
  className?: string
  delay?: number
  duration?: number
  initial?: string
  animate?: string
  exit?: string
}

export function AnimatedDiv({ 
  children, 
  variants = fadeInUp, 
  className, 
  delay = 0,
  duration = 0.3,
  initial = "initial",
  animate = "animate",
  exit = "exit"
}: AnimatedDivProps) {
  return (
    <motion.div
      className={className}
      variants={variants}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={{ 
        duration, 
        delay, 
        ease: "easeOut",
        type: "tween"
      }}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerContainer({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <motion.div
      className={className}
      variants={staggerChildren}
      initial="initial"
      animate="animate"
    >
      {children}
    </motion.div>
  )
}

export function FadeInWhenVisible({ 
  children, 
  className,
  delay = 0 
}: { 
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ 
        duration: 0.4, 
        delay, 
        ease: "easeOut",
        type: "tween"
      }}
      variants={{
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0 }
      }}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  )
}

export function HoverCard({ 
  children, 
  className,
  scale = 1.01,
  duration = 0.15
}: { 
  children: ReactNode
  className?: string
  scale?: number
  duration?: number
}) {
  return (
    <motion.div
      className={className}
      whileHover={{ scale, y: -2 }}
      whileTap={{ scale: 0.99 }}
      transition={{ 
        duration, 
        ease: "easeOut",
        type: "tween"
      }}
      style={{ willChange: 'transform' }}
    >
      {children}
    </motion.div>
  )
}

export function PulseOnHover({ 
  children, 
  className 
}: { 
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={className}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ 
        type: "tween", 
        duration: 0.15,
        ease: "easeOut"
      }}
      style={{ willChange: 'transform' }}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedButton({ 
  children, 
  className,
  onClick,
  disabled = false
}: { 
  children: ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
}) {
  return (
    <motion.button
      className={className}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.button>
  )
}

export function Loader({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  }
  
  return (
    <motion.div
      className={`${sizeClasses[size]} border-2 border-primary border-t-transparent rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  )
}

export function TypewriterText({ 
  text, 
  className,
  delay = 0
}: { 
  text: string
  className?: string
  delay?: number
}) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.1 }}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + i * 0.05 }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  )
}

export function SlideUpReveal({ 
  children, 
  className,
  delay = 0 
}: { 
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: "tween",
        duration: 0.4,
        ease: "easeOut",
        delay
      }}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  )
}

// Continuous floating animation component
export function FloatingElement({ 
  children, 
  className,
  intensity = 10,
  duration = 6
}: { 
  children: ReactNode
  className?: string
  intensity?: number
  duration?: number
}) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-intensity, intensity, -intensity],
        x: [-intensity/2, intensity/2, -intensity/2],
        rotate: [-1, 1, -1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        type: "tween"
      }}
      style={{ willChange: 'transform' }}
    >
      {children}
    </motion.div>
  )
}

// Background gradient animation
export function AnimatedGradient({ className }: { className?: string }) {
  return (
    <motion.div
      className={className}
      animate={{
        background: [
          "linear-gradient(45deg, rgb(var(--primary)/0.1), rgb(var(--secondary)/0.1))",
          "linear-gradient(135deg, rgb(var(--secondary)/0.1), rgb(var(--primary)/0.1))",
          "linear-gradient(45deg, rgb(var(--primary)/0.1), rgb(var(--secondary)/0.1))"
        ]
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  )
}
