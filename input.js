export function createInput() {
  const listeners = new Map()

  window.addEventListener('keydown', ({ code }) => {
    if (listeners.has(code)) {
      const cb = listeners.get(code)
      cb()
    }
  })

  return {
    listen: (keyString, cb) => {
      const keys = keyString.split('|')
      for (const key of keys) {
        listeners.set(key, cb)
      }
    }
  }
}
