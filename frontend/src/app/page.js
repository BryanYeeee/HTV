'use client'

import VoiceChatbot from "@/components/chatBot";

import Hero from '@/components/hero'

export default function Home() {
  return (        
    <div className="h-screen bg-[#ffffff]">
      <Hero/>
      <VoiceChatbot />
    </div>
  );
}
