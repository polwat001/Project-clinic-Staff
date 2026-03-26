"use client"

import { useEffect, useState } from "react"

interface OEEGaugeProps {
  value: number
  label?: string
}

export function OEEGauge({ value, label = "OEE" }: OEEGaugeProps) {
  const [animatedValue, setAnimatedValue] = useState(0)
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 100)
    return () => clearTimeout(timer)
  }, [value])

  const radius = 80
  const strokeWidth = 12
  const circumference = 2 * Math.PI * radius
  const progress = (animatedValue / 100) * circumference
  const rotation = -90

  const getColor = (val: number) => {
    if (val >= 85) return "var(--success)"
    if (val >= 60) return "var(--warning)"
    return "var(--danger)"
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width="200" height="200" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-muted/30"
          />
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={getColor(animatedValue)}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            transform={`rotate(${rotation} 100 100)`}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-foreground">{animatedValue}%</span>
          <span className="text-sm text-muted-foreground">{label}</span>
        </div>
      </div>
    </div>
  )
}
