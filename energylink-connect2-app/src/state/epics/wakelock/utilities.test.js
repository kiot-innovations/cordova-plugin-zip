import { assocPath } from 'ramda'

import {
  acquireWakeLock,
  releaseWakeLock
} from 'state/epics/wakelock/utilities'
describe('The utilities file', () => {
  it('should acquire the wakelock as a promise', () => {
    let acquireMock = jest.fn(resolve => resolve('hi'))
    assocPath(['powermanagement', 'acquire'], acquireMock, window)
    expect(acquireWakeLock()).resolves.toBe('hi')

    acquireMock = jest.fn((resolve, reject) => reject('failed'))
    assocPath(['powermanagement', 'acquire'], acquireMock, window)
    expect(acquireWakeLock()).rejects.toBe('failed')
  })
  it('should release the wakelock as a promise', () => {
    let releaseMock = jest.fn(resolve => resolve('success'))
    assocPath(['powermanagement', 'release'], releaseMock, window)
    expect(releaseWakeLock()).resolves.toBe('success')

    releaseMock = jest.fn((resolve, reject) => reject('failure'))
    assocPath(['powermanagement', 'release'], releaseMock, window)
    expect(releaseWakeLock()).rejects.toBe('failure')
  })
})
