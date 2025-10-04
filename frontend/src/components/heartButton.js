'use client'
import { useEffect, useRef, useState } from 'react'

export default function HeartMonitorButton ({
  text = 'Heartbeat',
  color = '#2ef2b7',
  duration = 500,
  disabled = '',
  className = ''
}) {
  const pathRef = useRef(null)
  const [pathLen, setPathLen] = useState(0)

  const viewW = 200
  const viewH = 28
  const spikeX = viewW / 2 // center spike

  useEffect(() => {
    if (!pathRef.current) return
    const len = pathRef.current.getTotalLength()
    setPathLen(len)
  }, [duration])

  const svgStyle = {
    ['--path-len']: pathLen || 1000,
    ['--dur']: `${duration}ms`,
    ['--ecg-color']: color
  }

  return (
    <button
      type='button'
      disabled={disabled}
      className={`disabled:opacity-50 not-disabled:hover:scale-105 not-disabled:active:scale-90 duration-75 relative overflow-hidden inline-flex items-center gap-3 px-2 py-1 rounded-md border focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${className}`}
      aria-label={text}
    >
      <span className='z-2 text-center w-full'>{text}</span>

      <svg
        viewBox={`0 0 ${viewW} ${viewH}`}
        preserveAspectRatio='none'
        style={svgStyle}
        className='absolute left-0 top-0 w-full h-full pointer-events-none'
        aria-hidden='true'
      >
        <path
          d={`M0 ${viewH / 2} L${viewW} ${viewH / 2}`}
          stroke='rgba(255,255,255,0.08)'
          strokeWidth='1'
          fill='none'
        />
        <path
          ref={pathRef}
          className='ecg-path'
          d={`
            M0 ${viewH / 2}
            L${spikeX - 20} ${viewH / 2}
            L${spikeX - 10} ${viewH / 2 - 6}
            L${spikeX} ${viewH / 2 + 8}
            L${spikeX + 10} ${viewH / 2 - 6}
            L${spikeX + 20} ${viewH / 2}
            L${viewW} ${viewH / 2}
          `}
          stroke={color}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          fill='none'
          style={{
            strokeDasharray: pathLen || 1000,
            strokeDashoffset: pathLen || 1000
          }}
        />
      </svg>

      <style jsx>{`
        @keyframes ecg-draw {
          from {
            stroke-dashoffset: var(--path-len);
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        button:hover:not(*:disabled) svg .ecg-path {
          animation: ecg-draw var(--dur) linear forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          button:hover svg .ecg-path {
            animation: none;
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </button>
  )
}
