'use client'
import { useState } from 'react'
import Table from '@/components/Table'
import Graph from '@/components/graph'

const tempData = [
  {
    pillName: 'Aspirin',
    remain: 120,
    dates: []
  },
  {
    pillName: 'B',
    remain: 120,
    dates: []
  },
  {
    pillName: 'C',
    remain: 120,
    dates: []
  }
]
import HeartMonitorButton from '@/components/heartButton'
import Switcher from '@/components/switcher'

const ClientPort = () => {
  const [leftIndex, setLeftIndex] = useState(0)
  const timeData = [
    { mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '' },
    { mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '' },
    { mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '' },
    { mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '' },
    { mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '' },
    { mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '' },
    { mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '' },
    { mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '' },
    { mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '' },
    { mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '' },
    { mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '' },
    { mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '' },
    { mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '' },
    { mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '' },
    { mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '' },
    { mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '' },
    { mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '' },
    { mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '' }
  ]
  return (
    <div className='bg flex justify-around items-center h-screen p-12 gap-12'>
      <Switcher activeIndex={leftIndex} axis='y' className='w-1/2'>
        {[
          <Table data={timeData} numRows={18} className='h-full' />,
          <Graph className='w-full h-full' />
        ]}
      </Switcher>

      {/* <Graph className='w-1/2 h-full' /> */}
      <div className='absolute top-0'>
        <div onClick={() => setLeftIndex((leftIndex + 1) % 2)}>CLICK</div>
      </div>
    </div>
  )
}

export default ClientPort
