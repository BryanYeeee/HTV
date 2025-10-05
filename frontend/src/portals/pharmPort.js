'use client'
import { useEffect, useState } from 'react'
import Table from '@/components/Table'
import Graph from '@/components/graph'
import Cookies from 'js-cookie'

import HeartMonitorButton from '@/components/heartButton'
import Switcher from '@/components/switcher'
import request from '@/utils/request'

const PharmPort = () => {
  // const [leftIndex, setLeftIndex] = useState(0)
  const [drugData, setDrugData] = useState([])
  const [orderData, setOrderData] = useState([])
  const [curOrder, setCurOrder] = useState('')
  const [curDrug, setCurDrug] = useState('')

  const getDrugData = () => {
    request
      .post('/pharma/get_stocks', { username: Cookies.get('username') })
      .then(async data => {
        console.log('LFGGGG', data)
        setDrugData(data)
      })
      .catch(err => console.error('Failed to fetch drugs:', err))
  }

  const getOrderData = () => {
    request
      .get('/order/list_orders')
      .then(async data => {
        console.log('LFGGGG', data)
        setOrderData(data)
      })
      .catch(err => console.error('Failed to fetch orders:', err))
  }

  const sendOrder = () => {
    setCurOrder('')
    request
      .post('/pharma/approve', {
        order_id: curOrder,
        username: Cookies.get('username'),

      })
      .then(async data => {
        getDrugData()
      })
      .catch(err => console.error('Failed to fetch orders:', err))
  }

  const addStock = () => {
    request
      .post('/pharma/increase_stock', {
        username: Cookies.get('username'),
        drugname: curDrug
      })
      .then(async data => {
        getDrugData()
      })
      .catch(err => console.error('Failed to fetch orders:', err))
  }

  useEffect(() => {
    getDrugData()
    getOrderData()
  }, [])

  return (
    <div className='relative flex justify-around items-center h-screen p-12 gap-12'>
      <div className='relative w-1/2'>
        <Table
          data={drugData}
          keys={['drugname', 'description', 'amount']}
          className='w-full'
          highlight={row => row.drugname == curDrug}
          onRowClick={r =>
            r['drugname'] == curDrug
              ? setCurDrug('')
              : setCurDrug(r['drugname'])
          }
        />
        <div onClick={() => addStock()} className='absolute top-0 right-0'>
          <HeartMonitorButton
            text='Add Stock'
            disabled={curDrug === ''}
            color='#ff6b6b'
          />
        </div>
      </div>
      <div className='relative w-1/2'>
        <Table
          data={orderData}
          className='w-full'
          keys={['_id', 'username', 'drugname', 'dose', 'amount']}
          highlight={row => row._id == curOrder}
          onRowClick={r =>
            r['_id'] == curOrder ? setCurOrder('') : setCurOrder(r['_id'])
          }
        />
        <div onClick={() => sendOrder()} className='flex gap-4 absolute top-0 right-0'>
          <div onClick={() => getOrderData()}>
            <HeartMonitorButton
              text='Refresh'
              // disabled={page === 1}
              color='#ff6b6b'
            />
          </div>
          <HeartMonitorButton
            text='Approve Order'
            disabled={curOrder === ''}
            color='#ff6b6b'
          />
        </div>
      </div>
      {/* <div className='absolute top-0'>
        <div onClick={() => setLeftIndex((leftIndex + 1) % 2)}>CLICK</div>
      </div> */}
    </div>
  )
}

export default PharmPort
