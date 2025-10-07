'use client'
import { useEffect, useRef, useState } from 'react'
import ClientPort from '@/portals/clientPort'
import PharmPort from '@/portals/pharmPort'
import { ThpaceGL } from 'thpace'
import Cookies from 'js-cookie';
import VoiceChatbot from "@/components/chatBot";

const Home = () => {
  const canvasRef = useRef(null)

  const [type, setType] = useState(null);

  useEffect(() => {
    const storedType = Cookies.get("type");
    setType(storedType);
  }, []);

  console.log(type)

  useEffect(() => {
    if (!canvasRef.current) return
    const settings = {
      colors: (type == "admin") ?  ['white', '#aef2ae', 'white'] : ['white', '#c2d9ff', 'white'],
      triangleSize: 200,
      pointAnimationSpeed: 5000
    }

    ThpaceGL.create(canvasRef.current, settings)
    if (type=="admin") {
      document.documentElement.style.setProperty('--fore3', '#4caf6880')
      document.documentElement.style.setProperty('--fore4', 'rgba(76, 175, 80, 1)')
      document.documentElement.style.setProperty('--accent1', '#4caf6835')
      document.documentElement.style.setProperty('--accent2', 'rgba(76, 175, 80, 0.35)')
    }
  }, [])

  return (
    <>
      <canvas
        id='bg'
        ref={canvasRef}
        className='fixed top-0 left-0 w-full h-full z-0'
      />
      <div className='relative z-10'>
        {type == "admin" ? (<PharmPort />) : (<ClientPort />)}
        <VoiceChatbot />
        
        {/* <PharmPort /> if you need it */}
      </div>     
       <VoiceChatbot />

    </>
  )
}

export default Home
