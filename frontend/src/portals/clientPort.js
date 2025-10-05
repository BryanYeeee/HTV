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
import { PillRender } from '@/components/scene'

import { scheduleFromData } from '@/utils/scheduler'
import { notify } from '@/utils/notify'
import Cookies from 'js-cookie'

const ClientPort = () => {
  const [popup, setPopup] = useState(null)
  const [leftIndex, setLeftIndex] = useState(0)
  const [rightIndex, setRightIndex] = useState(0)
  const [curDrug, setCurDrug] = useState({})
  const [drugData, setDrugData] = useState([])

  const getDrugData = () => {
    request
      .post('/user/get_drugs', { username: Cookies.get('username') })
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

  const subtractData = drugname => {
    setPopup(null)
    request
      .post('/user/subtract', {
        username: Cookies.get('username'),
        drugname: drugname
      })
      .then(async data => {
        getDrugData()
      })
      .catch(err => console.error('Failed to fetch drugs:', err))
  }

  useEffect(() => {
    getDrugData()
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
            <div onClick={() => subtractData(popup.title.split(' ')[1])}>
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
              highlight={row => row.drugname == curDrug?.drugname}
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
            <section className='h-full border-x-8 border-white rounded-xl p-6 flex flex-col items-center gap-4 bg-white/5 shadow-lg backdrop-blur-md'>
              <div className='h-40 w-40 border-4 border-white rounded-xl overflow-hidden flex items-center justify-center'>
                <div className='relative w-full h-full'>
                  <PillRender
                    topColor={curDrug?.properties?.[1] || '#000000'}
                    bottomColor={curDrug?.properties?.[2] || '#000000'}
                    radius={(curDrug?.properties?.[0] + 1) * 0.5 || 1}
                    curDrug={curDrug}
                  />
                </div>
              </div>
              <div className='text-xl font-bold text-gray text-center'>
                {curDrug.drugName}
              </div>
              <div className='text-sm text-gray text-center border border-white rounded-lg px-4 py-2 break-words max-w-xs w-full'>
                {curDrug.description}
              </div>
            </section>,

            <section className='h-full border-x-8 border-white rounded-xl p-6 flex flex-col items-center gap-4 bg-white/5 shadow-lg backdrop-blur-md'>
              <form className='flex flex-col gap-4 items-center w-full p-4'>
                <div className='text-xl font-bold text-white text-center'>
                  EDIT USERNAME
                </div>
                <input
                  type='text'
                  placeholder='Current Username'
                  className='w-full px-4 py-2 rounded-md border border-gray-300 text-black'
                />
                <input
                  type='password'
                  placeholder='New Username'
                  className='w-full px-4 py-2 rounded-md border border-gray-300 text-black'
                />
                <input
                  type='password'
                  placeholder='Password'
                  className='w-full px-4 py-2 rounded-md border border-gray-300 text-black'
                />
                <button
                  type='submit'
                  className='w-full px-4 py-2 rounded-md bg-black text-white font-bold hover:bg-gray-800 transition-all'
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
