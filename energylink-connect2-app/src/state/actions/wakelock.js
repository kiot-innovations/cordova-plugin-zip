import { createAction } from 'redux-act'

export const WAKELOCK_ACQUIRED = createAction('WAKELOCK_ACQUIRED')
export const WAKELOCK_ACQUIRE_ERROR = createAction('WAKELOCK_ACQUIRE_ERROR')
export const WAKELOCK_RELEASED = createAction('WAKELOCK_RELEASED')
export const WAKELOCK_RELEASE_ERROR = createAction('WAKELOCK_RELEASE_ERROR')
export const WAKELOCK_RELEASE = createAction('WAKELOCK_RELEASE')
