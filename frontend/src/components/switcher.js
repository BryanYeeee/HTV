import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

export default function Switcher ({ children, activeIndex, axis = 'y', className='' }) {
  const prevIndex = useRef(activeIndex)
  const isFirstMount = useRef(true)

  useEffect(() => {
    prevIndex.current = activeIndex
    isFirstMount.current = false
  }, [activeIndex])

  const slide = (dir, type) =>
    type === 'enter'
      ? dir > 0
        ? `calc(100% + 3rem)`
        : `calc(-100% - 3rem)`
      : dir > 0
      ? `calc(-100% - 3rem)`
      : `calc(100% + 3rem)`

  const variants = {
    enter: dir => ({ [axis]: slide(dir, 'enter'), opacity: 0 }),
    active: { [axis]: 0, opacity: 1 },
    exit: dir => ({ [axis]: slide(dir, 'exit'), opacity: 0 })
  }

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence
        mode='popLayout'
        custom={activeIndex - prevIndex.current}
      >
        <motion.div
          key={activeIndex}
          custom={activeIndex - prevIndex.current}
          variants={variants}
          initial={isFirstMount.current ? false : 'enter'}
          animate='active'
          exit='exit'
          transition={{ duration: 0.6, ease: 'circInOut' }}
          className='absolute size-full'
        >
          {children[activeIndex]}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
