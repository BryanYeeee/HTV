'use client'

import Image from "next/image";

import dynamic from 'next/dynamic'
import {useRef} from 'react'

import Hero from '@/app/hero'

export default function Home() {
  return (
    <div className="h-screen bg-[#ffffff]">
      <Hero/>

    </div>
  );
}
