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
      colors: ['white', '#c2d9ff', 'white'],
      triangleSize: 200,
      pointAnimationSpeed: 5000
    }

    ThpaceGL.create(canvasRef.current, settings)
  }, [])

  return (
    <>
      <canvas
        id='bg'
        ref={canvasRef}
        className='fixed top-0 left-0 w-full h-full z-0'
      />
      <div className='relative z-10'>
        <ClientPort />
        {/* <PharmPort /> if you need it */}
      </div>
    </>
  )
}

export default Home
