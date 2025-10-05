// utils/notify.js
let popupHandler = null

export function setPopupHandler(fn) {
  popupHandler = fn
}

export async function notify(title, options = {}) {
  const defaultOptions = {
    body: 'Take Your Pill Now!',
    // icon: '/icon.png',
  }

  const merged = { ...defaultOptions, ...options }

  // Browser notification
  if (Notification.permission === 'granted') {
    new Notification(title, merged)
  } else if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      new Notification(title, merged)
    }
  }

  // 🔥 Trigger popup in React
  if (popupHandler) {
    popupHandler({ title, body: merged.body })
  }
}
