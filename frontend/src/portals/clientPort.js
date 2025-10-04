'use client'
import { useEffect, useState } from 'react'
import TimeTable from '@/components/TimeTable'
import { DiAptana } from 'react-icons/di'

import HeartMonitorButton from '@/components/heartButton'
import Switcher from '@/components/switcher'
import Table from '@/components/Table'
import OrderForm from '@/components/orderForm'
import request from '@/utils/request'

const ClientPort = () => {
  const [leftIndex, setLeftIndex] = useState(0)
  const [rightIndex, setRightIndex] = useState(0)
  const [curDrug, setCurDrug] = useState({
    name: 'ABC',
    description: 'cures from liver eating amoeba',
    model: ['rgb(255, 182, 193)']
  })
  const [drugData, setDrugData] = useState([
    { name: 'D', remain: 120, 
      schedules: [
        '0_0700',
        '1_0700',
        '2_0700',
        '3_0700',
        '4_0700',
        '5_0700',
        '6_0700'
      ], model: ['rgb(255, 182, 193)'] },
    { name: 'A', remain: 120, schedules: ['1_1400', '3_1400', '5_1400'], model: ['rgb(114, 208, 124)'] },
    { name: 'B', remain: 120, schedules: ['0_1300', '2_1300', '4_1300', '2_1600'], model: ['rgb(144, 255, 144)'] },
    { name: 'C', remain: 120, schedules: [], model: ['rgb(255, 182, 193)'] }
  ])

  useEffect(() => {
    // request
    //   .get('/drugs')
    //   .then(data => setDrugData(data))
    //   .catch(err => console.error('Failed to fetch drugs:', err))
  }, [])

  return (
    <div className='bg flex justify-around items-center h-screen p-10 gap-12'>
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
            <TimeTable data={drugData} numRows={18} onDrugClick={setCurDrug} />,
            <Table
              data={drugData}
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
