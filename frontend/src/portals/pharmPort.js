'use client'
import { useState } from 'react'
import Table from '@/components/Table'
import Graph from '@/components/graph'

const tempData = [
  {
    pillName: 'Aspirin',
    stock: 120,
    users: 45
  },
  {
    pillName: 'Ibuprofen',
    stock: 80,
    users: 32
  },
  {
    pillName: 'Paracetamol',
    stock: 200,
    users: 67
  },
  {
    pillName: 'Vitamin C',
    stock: 150,
    users: 90
  },
  {
    pillName: 'Antihistamine',
    stock: 60,
    users: 15
  },
  {
    pillName: 'Antihistamine',
    stock: 60,
    users: 15
  },
  {
    pillName: 'Antihistamine',
    stock: 60,
    users: 15
  },
  {
    pillName: 'Antihistamine',
    stock: 60,
    users: 15
  },
  {
    pillName: 'Antihistamine',
    stock: 60,
    users: 15
  },
  {
    pillName: 'Antihistamine',
    stock: 60,
    users: 15
  },
  {
    pillName: 'Antihistamine',
    stock: 60,
    users: 15
  },
  {
    pillName: 'Antihistamine',
    stock: 60,
    users: 15
  },
  {
    pillName: 'Antihistamine',
    stock: 60,
    users: 15
  },
  {
    pillName: 'Antihistamine',
    stock: 60,
    users: 15
  },
  {
    pillName: 'Antihistamine',
    stock: 60,
    users: 15
  }
]
import HeartMonitorButton from '@/components/heartButton'
import Switcher from '@/components/switcher'

const PharmPort = () => {
  const [leftIndex, setLeftIndex] = useState(0)
  return (
    <div className='bg flex justify-around items-center h-screen p-12 gap-12'>
      <Switcher activeIndex={leftIndex} axis='y' className='w-1/2'>
        {[
          <Table data={tempData} className='h-full' />,
          <Graph className='w-full h-full' />
        ]}
      </Switcher>

      <Graph className='w-1/2 h-full' />
      <div className='absolute top-0'> 
        <div onClick={() => setLeftIndex((leftIndex + 1) % 2)}>CLICK</div>
      </div>
    </div>
  )
}

export default PharmPort
