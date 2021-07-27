export const acquireWakeLock = () =>
  new Promise((resolve, reject) =>
    window.powerManagement.acquire(resolve, reject)
  )
export const releaseWakeLock = () =>
  new Promise((resolve, reject) =>
    window.powerManagement.release(resolve, reject)
  )
