'use client'
import { useEffect, useState } from 'react'
import Table from '@/components/Table'
import Graph from '@/components/graph'

import HeartMonitorButton from '@/components/heartButton'
import Switcher from '@/components/switcher'
import request from '@/utils/request'

const PharmPort = () => {
  // const [leftIndex, setLeftIndex] = useState(0)
  const [drugData, setDrugData] = useState([])
  const [orderData, setOrderData] = useState([])
  const [curOrder, setCurOrder] = useState("")

  const getDrugData = () => {
    request
      .post('/user/get_drugs', { username: 'riyan' })
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

  useEffect(() => {
    getDrugData()
    getOrderData()
  }, [])

  return (
    <div className='bg flex justify-around items-center h-screen p-12 gap-12'>
      <Table
        data={drugData}
        keys={['drugname', 'description', 'amount']}
        className='w-1/2'
      />
      <Table data={orderData} className='w-1/2' onRowClick={(r) => setCurOrder(r['_id'])}/>
      {/* <div className='absolute top-0'>
        <div onClick={() => setLeftIndex((leftIndex + 1) % 2)}>CLICK</div>
      </div> */}
    </div>
  )
}

export default PharmPort
