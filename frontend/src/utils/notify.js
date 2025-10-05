// utils/notify.js
export async function notify(title, options = {}) {
  const defaultOptions = {
    body: 'You have a new message!',
    icon: '/icon.png'
  }

  const merged = { ...defaultOptions, ...options }

  if (Notification.permission === 'granted') {
    new Notification(title, merged)
  } else if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      new Notification(title, merged)
    }
  }
}
