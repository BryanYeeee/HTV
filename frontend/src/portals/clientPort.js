'use client'
import { useEffect, useState } from 'react'
import TimeTable from '@/components/TimeTable'
import { DiAptana } from 'react-icons/di'

import HeartMonitorButton from '@/components/heartButton'
import Switcher from '@/components/switcher'
import Table from '@/components/Table'
import OrderForm from '@/components/orderForm'
import request from '@/utils/request'
import { setPopupHandler } from '@/utils/notify'

import { scheduleFromData } from '@/utils/scheduler'
import { notify } from '@/utils/notify'

const ClientPort = () => {
  const [popup, setPopup] = useState(null)
  const [leftIndex, setLeftIndex] = useState(0)
  const [rightIndex, setRightIndex] = useState(0)
  const [curDrug, setCurDrug] = useState({})
  const [drugData, setDrugData] = useState([])
  // useState([
  //   {
  //     name: 'D',
  //     remain: 120,
  //     description:
  //       '12313221321321123231321321321321321321321321312321321321321',
  //     schedules: [
  //       '5_2100',
  //       '1_0700',
  //       // '2_0700',
  //       '3_0700',
  //       '4_0700',
  //       // '5_0700',
  //       '6_0700'
  //     ],
  //     properties: ['rgb(255, 182, 193)']
  //   },
  //   {
  //     name: 'A',
  //     remain: 120,
  //     description:
  //       '12313221321321123231321321321321321321321321312321321321321',
  //     schedules: ['1_1400', '3_1400', '5_1400'],
  //     properties: ['rgb(114, 208, 124)']
  //   },
  //   {
  //     name: 'B',
  //     remain: 120,
  //     description:
  //       '12313221321321123231321321321321321321321321312321321321321',
  //     schedules: ['0_1300', '2_1300', '4_1300', '2_1600'],
  //     properties: ['rgb(144, 255, 144)']
  //   },
  //   {
  //     name: 'C',
  //     remain: 120,
  //     description:
  //       '12313221321321123231321321321321321321321321312321321321321',
  //     schedules: [],
  //     properties: ['rgb(255, 182, 193)']
  //   }
  // ])
  const getDrugData = () => {
    request
      .post('/user/get_drugs', { username: 'riyan' })
      .then(async data => {
        console.log('LFGGGG', data)
        setDrugData(data)
        scheduleFromData(data)
        setPopupHandler(payload => {
          setPopup(payload)
        })
      })
      .catch(err => console.error('Failed to fetch drugs:', err))
  }

  useEffect(() => {
    // getDrugData()
  }, [])

  return (
    <div className='flex justify-around items-center h-screen p-10 py-5 gap-12'>
      {popup && (
        <div className='fixed inset-0 flex items-center justify-center bg-black/50 z-50'>
          <div className='flex flex-col justify-center items-center min-size-100 p-12 bg-white rounded-xl shadow-lg border-b-12 border-slate-300'>
            <h2 className='text-7xl font-bold mb-4'>{popup.title}</h2>
            <p className='text-2xl text-gray-700 mb-12 max-w-100 break-words '>
              {popup.body}
            </p>
            <div onClick={() => setPopup(null)}>
              <HeartMonitorButton
                text='I TOOK IT :D'
                color='#ff6b6b'
                className='w-60 text-2xl'
              />
            </div>
          </div>
        </div>
      )}
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
            <>
              <TimeTable
                data={drugData}
                numRows={18}
                onDrugClick={setCurDrug}
              />
              <div className='pt-4 flex flex-row-reverse w-full items-center'>
                <div onClick={() => getDrugData()}>
                  <HeartMonitorButton
                    text='Refresh'
                    // disabled={page === 1}
                    color='#ff6b6b'
                  />
                </div>
              </div>
            </>,
            <Table
              data={drugData}
              keys={['drugname', 'description', 'amount']}
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
            <section className='h-full border p-8 flex flex-col items-center '>
              <div className='border h-20 w-15'>PILL properties</div>
              <div>{curDrug.drugname}</div>
              <div>{curDrug.description}</div>
            </section>,

            <section className='h-full border p-8 flex flex-col items-center space-y-4'>
              <div className='border h-20 w-15'>PILL MOasdsaDEL</div>
              <div>{curDrug.drugname}</div>
              <div>{curDrug.description}</div>
            </section>
          ]}
        </Switcher>
      </div>
    </div>
  )
}

export default ClientPort
