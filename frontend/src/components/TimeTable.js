'use client'
import { useMemo, useState } from 'react'

import HeartMonitorButton from '@/components/heartButton'
import DrugCell from './drugCell'
/**
 * Example usage:
 *  <JsonTable data={users} initialPageSize={20} onRowClick={(r)=>console.log(r)} />
 */

const HEAD = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const TIME = [
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  '24'
]

export default function TimeTable ({
  data = [
    [
      {},
      { name: 'A', model: ['rgb(114, 208, 124)'] },
      { name: 'C', model: ['rgb(144, 238, 144)'] },
      {},
      {},
      {},
      {}
    ],
    [{}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}],
    [{ name: 'D', model: ['rgb(255, 182, 193)'] }, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, { name: 'E', model: ['rgb(144, 238, 144)'] }, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}]
  ],
  columns = null,
  className = '',
  numRows = 18,
  onDrugClick
}) {
  return (
    <div className={`${className} text-sm`}>
      <div className='overflow-auto rounded-md' data-augmented-ui='both'>
        <table className='min-w-full table-fixed ' role='table'>
          <thead>
            <tr>
              {['TIME', ...HEAD].map((col, i) => (
                <th
                  key={col + '-h-' + i}
                  scope='col'
                  className='px-3 py-1 text-left font-medium bg-fore3'
                >
                  <div className='flex justify-center items-center'>{col}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='text-fontcol'>
            {TIME.map((time, i) => (
              <tr
                key={time + '-r-' + i}
                className={`cursor-pointer first:border-t relative`}
              >
                <td className='px-3 py-[3px] align-center w-1 text-center'>
                  <div className='font-bold bg-[#00000020] rounded-full'>
                    {time}
                  </div>
                </td>
                {HEAD.map((col, j) => (
                  <td
                    key={col + '-r-' + j}
                    className='px-1 py-2 align-top break-words max-w-[220px] relative '
                  >
                    {renderCell(data[i][j], onDrugClick)}
                    <div
                      className={`flex items-center absolute w-4 top-0 left-1/2 h-full -translate-x-1/2 -z-1 ${
                        TIME.length - 1 == i ? 'border-b-3 rounded-b-full border-fore2' : ''
                      }`}
                      style={
                        JSON.stringify(data[i][j]) === '{}'
                          ? { backgroundColor: 'var(--fore1)' }
                          : { backgroundColor: data[i][j].model[0] }
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
  )
}

function renderCell (value, onDrugClick) {
  if (JSON.stringify(value) === '{}') return ''
  if (typeof value === 'object')
    return <DrugCell data={value} onDrugClick={onDrugClick} />
  return String(value)
}
