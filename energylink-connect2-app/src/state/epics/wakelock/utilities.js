export const acquireWakeLock = () =>
  new Promise((resolve, reject) =>
    window.powermanagement.acquire(resolve, reject)
  )
export const releaseWakeLock = () =>
  new Promise((resolve, reject) =>
    window.powermanagement.release(resolve, reject)
  )
