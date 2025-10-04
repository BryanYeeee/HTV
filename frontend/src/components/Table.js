'use client'
import { useMemo, useState } from 'react'

import HeartMonitorButton from '@/components/heartButton'
/**
 * Example usage:
 *  <JsonTable data={users} initialPageSize={20} onRowClick={(r)=>console.log(r)} />
 */

export default function Table ({
  data = [],
  keys = null,
  className = '',
  numRows = 10,
  onRowClick
}) {
  const inferredColumns = useMemo(() => {
    const first = data && data.length ? data[0] : {}

    // if keys provided, only include those
    const targetKeys = keys?.length ? keys : Object.keys(first)

    return targetKeys.map(k => ({
      key: k,
      label: prettify(k),
      sortable: true
    }))
  }, [data, keys])

  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    if (!search) return data
    const q = search.toLowerCase()
    return data.filter(row =>
      Object.values(row).some(val =>
        String(val ?? '')
          .toLowerCase()
          .includes(q)
      )
    )
  }, [data, search])

  const sorted = useMemo(() => {
    if (!sortKey) return filtered
    const dir = sortDir === 'asc' ? 1 : -1
    const copy = [...filtered]
    copy.sort((a, b) => {
      const va = a[sortKey]
      const vb = b[sortKey]
      // handle numbers vs strings
      if (va == null && vb == null) return 0
      if (va == null) return -1 * dir
      if (vb == null) return 1 * dir
      if (typeof va === 'number' && typeof vb === 'number')
        return (va - vb) * dir
      return String(va).localeCompare(String(vb)) * dir
    })
    return copy
  }, [filtered, sortKey, sortDir, inferredColumns])

  // Pagination
  const total = sorted.length
  const pageCount = Math.max(1, Math.ceil(total / numRows))
  const current = useMemo(() => {
    const start = (page - 1) * numRows
    return sorted.slice(start, start + numRows)
  }, [sorted, page])

  // Helpers
  function toggleSort (key) {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  function goTo (p) {
    const n = Math.max(1, Math.min(pageCount, p))
    setPage(n)
  }

  function handleRowClick (row) {
    console.log(row)
    if (onRowClick) onRowClick(row)
  }

  // Render
  return (
    <div className={`${className} text-sm`}>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2'>
        <div className='flex items-center gap-2'>
          <label className='sr-only' htmlFor='table-search'>
            Search
          </label>
          <input
            id='table-search'
            value={search}
            onChange={e => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder='Search...'
            className='px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent1'
          />
          <div className=' text-muted-foreground'>
            {total} result{total !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      <div
        className='overflow-auto rounded-md py-4 bg-fore3'
        data-augmented-ui='tl-clip tr-clip br-clip bl-clip both'
        style={{
          '--aug-border-all': '2px',
          '--aug-border-bg': 'var(--bordercol)'
        }}
      >
        <table className='min-w-full table-fixed bg-fore3' role='table'>
          <thead>
            <tr>
              {inferredColumns.map(col => (
                <th
                  key={col.key}
                  scope='col'
                  className='px-3 py-2 text-left font-medium select-none cursor-pointer'
                  onClick={() => col.sortable !== false && toggleSort(col.key)}
                >
                  <div className='flex items-center gap-2'>
                    <span>{col.label ?? prettify(col.key)}</span>
                    {sortKey === col.key ? (
                      <span aria-hidden>{sortDir === 'asc' ? '▲' : '▼'}</span>
                    ) : col.sortable !== false ? (
                      <span aria-hidden className='opacity-30'>
                        ↕
                      </span>
                    ) : null}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='text-fontcol'>
            {current.length === 0 ? (
              <tr>
                <td
                  colSpan={inferredColumns.length}
                  className='px-3 py-6 text-center  text-muted-foreground'
                >
                  No rows
                </td>
              </tr>
            ) : (
              <>
                {current.map((row, i) => (
                  <tr
                    key={i}
                    className={`odd:bg-fore1 even:bg-fore2 hover:bg-accent1 cursor-pointer`}
                    onClick={() => handleRowClick(row)}
                  >
                    {inferredColumns.map(col => (
                      <td
                        key={col.key}
                        className='px-3 py-2 align-top break-words max-w-[220px]'
                      >
                        {col.render
                          ? col.render(row[col.key], row)
                          : renderCell(row[col.key])}
                      </td>
                    ))}
                  </tr>
                ))}

                {Array.from({ length: numRows - current.length }).map(
                  (_, i) => (
                    <tr
                      key={`empty-${i}`}
                      className={`odd:bg-fore1 even:bg-fore2`}
                    >
                      <td
                        colSpan={inferredColumns.length}
                        className='px-3 py-2 text-transparent'
                      >
                        .
                      </td>
                    </tr>
                  )
                )}
              </>
            )}
          </tbody>
        </table>
      </div>

      <div className='mt-2 flex items-center justify-between gap-2'>
        <div className=''>
          Page {page} of {pageCount}
        </div>
        <div className='flex items-center gap-2'>
          <div onClick={() => goTo(1)}>
            <HeartMonitorButton
              text='First'
              disabled={page === 1}
              color='#ff6b6b'
            />
          </div>
          <div onClick={() => goTo(page - 1)}>
            <HeartMonitorButton
              text='Prev'
              disabled={page === 1}
              color='#ff6b6b'
            />
          </div>
          <div onClick={() => goTo(page + 1)}>
            <HeartMonitorButton
              text='Next'
              disabled={page === pageCount}
              color='#ff6b6b'
            />
          </div>
          <div onClick={() => goTo(pageCount)}>
            <HeartMonitorButton
              text='Last'
              disabled={page === pageCount}
              color='#ff6b6b'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------------------- helpers ----------------------- */

function prettify (key) {
  // make camelCase or snake_case keys look nice: userName -> User Name
  return String(key)
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/^./, s => s.toUpperCase())
}

function renderCell (value) {
  if (value == null) return '-'
  if (typeof value === 'object')
    return (
      <pre className='whitespace-pre-wrap text-xs'>
        {JSON.stringify(value, null, 2)}
      </pre>
    )
  return String(value)
}
