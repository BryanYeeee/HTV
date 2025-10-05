'use client'
import { useEffect, useState } from 'react'
import TimeTable from '@/components/TimeTable'
import { DiAptana } from 'react-icons/di'

import HeartMonitorButton from '@/components/heartButton'
import Switcher from '@/components/switcher'
import Table from '@/components/Table'
import OrderForm from '@/components/orderForm'
import request from '@/utils/request'
import { PillRender } from '@/components/scene'

import { motion, AnimatePresence } from 'framer-motion'

import { scheduleFromData } from '@/utils/scheduler'
import { notify } from '@/utils/notify'

const ClientPort = () => {
  const [leftIndex, setLeftIndex] = useState(0)
  const [rightIndex, setRightIndex] = useState(0)
  const [curDrug, setCurDrug] = useState({
    name: 'ABC',
    description: 'cures from liver eating amoeba',
    model: ['rgb(255, 182, 193)']
  })
  const [drugData, setDrugData] = useState([
    {
      name: 'D', remain: 120, description: '12313221321321123231321321321321321321321321312321321321321',
      schedules: [
        '5_2100',
        '1_0700',
        '2_0700',
        '3_0700',
        '4_0700',
        '5_0700',
        '6_0700'
      ], model: ['rgb(255, 182, 193)']
    },
    { name: 'A', remain: 120, description: '12313221321321123231321321321321321321321321312321321321321', schedules: ['1_1400', '3_1400', '5_1400'], model: ['rgb(114, 208, 124)'] },
    { name: 'B', remain: 120, description: '12313221321321123231321321321321321321321321312321321321321', schedules: ['0_1300', '2_1300', '4_1300', '2_1600'], model: ['rgb(144, 255, 144)'] },
    { name: 'C', remain: 120, description: '12313221321321123231321321321321321321321321312321321321321', schedules: [], model: ['rgb(255, 182, 193)'] }
  ])

  useEffect(() => {
    // request
    //   .get('/')
    //   .then(data => {console.log('LFGGGG')})
    //   .catch(err => console.error('Failed to fetch drugs:', err))useEffect(() => {
    // Reset old timers when schedule changes
    // request.get('/user/drugs').then((data) => {
    // data is your array of {name, schedules, description, ...}
    scheduleFromData(drugData)
    // })
  }, [])

  return (
    <div className='flex justify-around items-center h-screen p-10 gap-12'>
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
              keys={['name', 'description', 'remain']}
              curDrug={curDrug}
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
            <section className="h-full border-x-8 border-white rounded-xl p-6 flex flex-col items-center gap-4 bg-white/5 shadow-lg backdrop-blur-md">
              <div className="h-40 w-40 border-4 border-white rounded-xl overflow-hidden flex items-center justify-center">
                <div className="relative w-full h-full">
                  <PillRender
                    topColor={curDrug.model[1]}
                    bottomColor={curDrug.model[2]}
                    radius={curDrug.model[0]}
                    curDrug={curDrug}
                  />
                </div>
              </div>
              <div className="text-xl font-bold text-gray text-center">{curDrug.name}</div>
              <div className="text-sm text-gray text-center border border-white rounded-lg px-4 py-2 break-words max-w-xs w-full">
                {curDrug.description}
              </div>
            </section>,

            <section className="h-full border-x-8 border-white rounded-xl p-6 flex flex-col items-center gap-4 bg-white/5 shadow-lg backdrop-blur-md">
              <form className="flex flex-col gap-4 items-center w-full p-4">
                <div className="text-xl font-bold text-white text-center">EDIT USERNAME</div>
                <input
                  type="text"
                  placeholder="Current Username"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 text-black"
                />
                <input
                  type="password"
                  placeholder="New Username"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 text-black"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 text-black"
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 rounded-md bg-black text-white font-bold hover:bg-gray-800 transition-all"
                >
                  CHANGE USERNAME
                </button>
              </form>
            </section>
          ]}
        </Switcher>
      </div>
    </div>
  )
}

export default ClientPort
