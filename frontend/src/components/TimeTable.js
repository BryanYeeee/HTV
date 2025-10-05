'use client'
import { useMemo, useState } from 'react'

import HeartMonitorButton from '@/components/heartButton'
import DrugCell from './drugCell'
import { AnimatePresence } from 'motion/react'
/**
 * Example usage:
 *  <JsonTable data={users} initialPageSize={20} onRowClick={(r)=>console.log(r)} />
 */

const HEAD = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const TIME = [
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
  '23:00',
  '24:00'
]

export default function TimeTable ({
  data = [
    {
      drugname: 'A',
      properties: ['rgb(114, 208, 124)'],
      schedule: ['0_1300', '2_1300', '4_1300', '2_1600']
    },
    {
      drugname: 'C',
      properties: ['rgb(144, 038, 144)'],
      schedule: ['1_1400', '3_1400', '5_1400']
    },
    {
      drugname: 'D',
      properties: ['rgb(255, 182, 193)'],
      schedule: [
        '0_0700',
        '1_0700',
        '2_0700',
        '3_0700',
        '4_0700',
        '5_0700',
        '6_0700'
      ]
    }
    // {
    //   drugname: 'E',
    //   properties: ['rgb(144, 255, 144)'],
    //   schedules: ['4_0900', '4_0800', '4_2400', '4_2300']
    // }
  ],
  columns = null,
  className = '',
  numRows = 18,
  onDrugClick
}) {
  const timeData = [
    [{}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}]
  ]

  data.forEach(drug => {
    drug.schedule.forEach(tslot => {
      timeData[parseInt(tslot.substring(2,4)) - 7][
        parseInt(tslot.charAt(0))
      ] = drug
    })
  })
  // console.table(timeData)
  // for(let i = 0; i < timeData.length; i++) {
  //   for(let j = 0; j < timeData[0].length; j++) {
  //     console.log(timeData[i][j],JSON.stringify(timeData[i][j]) === '{}')
  //   }
  // }

  return (
    <AnimatePresence>
      <div className={`${className} text-sm`}>
        <div className=' rounded-md' data-augmented-ui='both'>
          <table className='min-w-full table-fixed ' role='table'>
            <thead>
              <tr className='border-b-3 border-fore4'>
                {['TIME', ...HEAD].map((col, i) => (
                  <th
                    key={col + '-h-' + i}
                    scope='col'
                    className='px-5 py-1 text-left font-medium bg-fore3'
                  >
                    <div className='flex justify-center items-center'>
                      {prettify(col)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className='text-fontcol'>
              {TIME.map((time, i) => (
                <tr
                  key={time + '-r-' + i}
                  className={`cursor-pointer relative`}
                >
                  <td className='px-3 py-[3px] align-center w-1 text-center'>
                    <div className='font-bold bg-[#00000020] rounded-full'>
                      {time}
                    </div>
                  </td>
                  {HEAD.map((col, j) => (
                    <td
                      key={col + '-r-' + j}
                      className='px-1 py-2 align-top break-words relative '
                    >
                      {renderCell(timeData[i][j], onDrugClick)}
                      <div
                        className={`flex items-center absolute w-4 top-0 left-1/2 h-full -translate-x-1/2 -z-1 ${
                          TIME.length - 1 == i
                            ? 'border-b-3 rounded-b-full border-fore2'
                            : ''
                        }`}
                        style={
                          JSON.stringify(timeData[i][j]) === '{}'
                            ? { backgroundColor: 'var(--fore1)' }
                            : { backgroundColor: timeData[i][j].properties[1] }
                        }
                      ></div>
                    </td>
                  ))}

                  <td
                    colSpan={HEAD.length + 1}
                    className='absolute right-0 -z-1 top-1/2 -translate-y-1/2 w-full border-b border-b-[#00000010]'
                  />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AnimatePresence>
  )
}

function prettify (key) {
  // make camelCase or snake_case keys look nice: userName -> User Name
  return String(key)
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/^./, s => s.toUpperCase())
}
function renderCell (value, onDrugClick) {
  if (JSON.stringify(value) === '{}') return ''
  if (typeof value === 'object')
    return <DrugCell data={value} onDrugClick={onDrugClick} />
  return String(value)
}
