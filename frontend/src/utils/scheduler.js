import { notify } from './notify'

let activeTimers = {}

function getTargetDate(dayIndex, hour) {
  const now = new Date()
  const target = new Date(now)

  target.setHours(hour, 0, 0, 0)

  const today = (now.getDay() + 6) % 7
  let diff = dayIndex - today

  if (diff < 0 || (diff === 0 && target <= now)) {
    diff += 7
  }
  target.setDate(now.getDate() + diff)

  return target
}

export function clearNotifications() {
  Object.values(activeTimers).forEach(clearTimeout)
  activeTimers = {}
}

export function scheduleNotification(id, dayIndex, hour, title, options = {}) {
  if (activeTimers[id]) return

  const now = new Date()
  const target = getTargetDate(dayIndex, hour)

  const delay = target.getTime() - now.getTime()
  console.log(`⏰ ${id} at day=${dayIndex}, hour=${hour} in ${delay / 1000}s`)

  activeTimers[id] = setTimeout(() => {
    notify(title, options)
    delete activeTimers[id]

    scheduleNotification(id, dayIndex, hour, title, options)
  }, delay)
}

export function scheduleFromData(data) {
  clearNotifications()

  data.forEach((drug) => {
    drug.schedule.forEach((entry) => {
      const [dayStr, timeStr] = entry.split('_')
      const dayIndex = parseInt(dayStr, 10)
      const hour = parseInt(timeStr.substring(0, 2), 10)

      const id = `${drug.drugname}-${dayIndex}-${hour}`

      scheduleNotification(id, dayIndex, hour, `Take ${drug.drugname} 💊`, {
        body: drug.description
      })
    })
  })
}
