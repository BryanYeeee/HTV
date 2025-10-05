'use client'
import { useEffect, useRef } from 'react'
import ClientPort from '@/portals/clientPort'
import PharmPort from '@/portals/pharmPort'
import { ThpaceGL } from 'thpace'

const Home = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return
    const settings = {
      // colors: ['white', '#c2d9ff', 'white'],
      colors: ['white', '#aef2ae', 'white'],
      triangleSize: 200,
      pointAnimationSpeed: 5000
    }

    ThpaceGL.create(canvasRef.current, settings)
    // if(admin)
    document.documentElement.style.setProperty('--fore3', '#4caf6880')
    document.documentElement.style.setProperty('--fore4', 'rgba(76, 175, 80, 1)')
    document.documentElement.style.setProperty('--accent1', '#4caf6835')
    document.documentElement.style.setProperty('--accent2', 'rgba(76, 175, 80, 0.35)')
  }, [])

  return (
    <>
      <canvas
        id='bg'
        ref={canvasRef}
        className='fixed top-0 left-0 w-full h-full z-0'
      />
      <div className='relative z-10'>
        <PharmPort />
        {/* <PharmPort /> if you need it */}
      </div>
    </>
  )
}

export default Home
