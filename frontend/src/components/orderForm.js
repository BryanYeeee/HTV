'use client'
import { useState } from 'react'
import HeartMonitorButton from '@/components/heartButton'
import request from '@/utils/request'

const OrderForm = () => {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = f => {
    if (!f) return
    setFile(f)

    if (f.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result)
      reader.readAsDataURL(f)
    } else if (f.type === 'application/pdf') {
      // Set some non-null preview so the UI knows we have a file
      setPreview('pdf')
    } else {
      setPreview(null)
    }
  }

  const handleDrop = e => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleSubmit = async e => {
    // e.preventDefault() // stop page refresh
    if (!file) {
      alert('Please upload a file before submitting.')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    const res = request.post('/user/new_order', {
      body: formData
    }).then(res => {
      console.log('WE DO IT', res)
    })

    // try {
    //   const res = await fetch('http://localhost:5000/upload', {
    //     method: 'POST',
    //     body: formData,
    //   })

    //   if (!res.ok) throw new Error('Upload failed')
    //   const data = await res.json()
    //   console.log('✅ Upload success:', data)
    //   alert('File uploaded successfully!')
    // } catch (err) {
    //   console.error(err)
    //   alert('Upload failed.')
    // }
  }

  return (
    <div className='h-full border p-6 space-y-6'>
      <div className='text-sm text-muted-foreground'>
        Please upload an image of the prescription (.png, .jpg, .jpeg, .gif,
        .webp, .bmp, .tiff, .pdf).
      </div>

      <form
        className='flex flex-col space-y-4 items-center'
      >
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition w-full
            ${isDragging ? 'border-accent1 bg-accent1/10' : 'border-border'}`}
          onDragOver={e => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById('fileInput').click()}
        >
          {preview ? (
            <div className='flex flex-col items-center space-y-3'>
              {file?.type.startsWith('image/') ? (
                <img
                  src={preview}
                  alt='Preview'
                  className=' min-h-60 max-h-60 rounded-lg shadow-md'
                />
              ) : file?.type === 'application/pdf' ? (
                <div className='flex flex-col items-center space-y-1 min-h-60 justify-center'>
                  <div className='text-8xl'>📄</div>
                  <span className='text-sm text-foreground'>PDF File</span>
                </div>
              ) : null}
              <span className='text-sm text-foreground '>{file?.name}</span>
            </div>
          ) : (
            <div className='text-muted-foreground h-60 flex items-center justify-center'>
              Drag & Drop an image or PDF here, or click to browse
            </div>
          )}

          <input
            id='fileInput'
            type='file'
            accept='image/*,application/pdf'
            className='hidden'
            onChange={e => handleFile(e.target.files[0])}
          />
        </div>

          <div onClick={() => handleSubmit()}>
            <HeartMonitorButton
              text='Submit Order'
              color='#ff6b6b'
              className='w-60'
            />
          </div>
      </form>
    </div>
  )
}

export default OrderForm
