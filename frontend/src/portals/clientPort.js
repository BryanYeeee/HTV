'use client'
import { useState } from 'react'
import TimeTable from '@/components/TimeTable'
import Graph from '@/components/graph'
import { DiAptana } from 'react-icons/di'

const tempData = [
  { name: 'D', remain: 120, dates: [], model: ['rgb(255, 182, 193)'] },
  { name: 'A', remain: 120, dates: [], model: ['rgb(255, 182, 193)'] },
  { name: 'B', remain: 120, dates: [], model: ['rgb(255, 182, 193)'] },
  { name: 'C', remain: 120, dates: [], model: ['rgb(255, 182, 193)'] }
]
import HeartMonitorButton from '@/components/heartButton'
import Switcher from '@/components/switcher'
import Table from '@/components/Table'
import OrderForm from '@/components/orderForm'

const ClientPort = () => {
  const [leftIndex, setLeftIndex] = useState(0)
  const [rightIndex, setRightIndex] = useState(0)
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
        <Switcher activeIndex={leftIndex} axis='y' className='size-full'>
          {[
            <TimeTable numRows={18} onDrugClick={setCurDrug} />,
            <Table
              data={tempData}
              keys={['name', 'remain']}
              onRowClick={setCurDrug}
              className='h-full'
            />,
            <OrderForm />
          ]}
        </Switcher>
      </div>
      <div className='w-1/3 h-full flex flex-col'>
        <div className='flex flex-row-reverse gap-4 py-2 justify-between'>
          {/* <div onClick={() => setRightIndex(1)}>
            <HeartMonitorButton
              text='View Drug'
              disabled={rightIndex == 1}
              color='#ff6b6b'
              className='w-40'
            />
          </div> */}
          <div onClick={() => setRightIndex((rightIndex + 1) % 2)}>
            <HeartMonitorButton
              text={<DiAptana size={'2rem'} />}
              // disabled={rightIndex == 0}
              color='#ff6b6b'
              className=''
            />
          </div>
        </div>
        <Switcher activeIndex={rightIndex} axis='y' className='size-full'>
          {[
            <section className='h-full border p-8 flex flex-col items-center '>
              <div className='border h-20 w-15'>PILL MODEL</div>
              <div>{curDrug.name}</div>
              <div>{curDrug.description}</div>
            </section>,

            <section className='h-full border p-8 flex flex-col items-center space-y-4'>
              <div className='border h-20 w-15'>PILL MOasdsaDEL</div>
              <div>{curDrug.name}</div>
              <div>{curDrug.description}</div>
            </section>
          ]}
        </Switcher>
      </div>
    </div>
  )
}

export default ClientPort
