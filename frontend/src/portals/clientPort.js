'use client'
import { useState } from 'react'
import TimeTable from '@/components/TimeTable'
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
import Table from '@/components/Table'
import OrderForm from '@/components/orderForm'

const ClientPort = () => {
  const [leftIndex, setLeftIndex] = useState(0)
  const [curDrug, setCurDrug] = useState({
    name: 'ABC',
    description: 'cures from liver eating amoeba',
    model: ['rgb(255, 182, 193)']
  })

  return (
    <div className='bg flex justify-around items-center h-screen p-12 gap-12'>
      <div className='w-2/3 h-full flex flex-col'>
        <div className='flex gap-4 py-2 justify-between'>
          <div className='flex gap-4'>
            <div onClick={() => setLeftIndex(1)}>
              <HeartMonitorButton
                text='View Drugs'
                disabled={leftIndex == 1}
                color='#ff6b6b'
                className='w-40'
              />
            </div>
            <div onClick={() => setLeftIndex(0)}>
              <HeartMonitorButton
                text='View Schedule'
                disabled={leftIndex == 0}
                color='#ff6b6b'
                className='w-40'
              />
            </div>
          </div>
          <div onClick={() => setLeftIndex(2)}>
            <HeartMonitorButton
              text='Create Order'
              disabled={leftIndex == 2}
              color='#ff6b6b'
              className='w-40'
            />
          </div>
        </div>
        <Switcher activeIndex={leftIndex} axis='y' className='w-full h-full'>
          {[
            <TimeTable
              numRows={18}
              onDrugClick={setCurDrug}
            />,
            <Table data={tempData} onRowClick={setCurDrug} className='h-full' />,
            <OrderForm />
          ]}
        </Switcher>
      </div>
      <div className='h-full w-1/3 border p-8'>
        <section className='flex flex-col items-center space-y-4'>
          <div className='border h-20 w-15'>PILL MODEL</div>
          <div>{curDrug.name}</div>
          <div>{curDrug.description}</div>
        </section>
      </div>
    </div>
  )
}

export default ClientPort
