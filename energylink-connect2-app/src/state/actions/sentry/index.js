import { namedAction } from 'shared/redux-utils'

const sentryModule = namedAction('SENTRY')

export const SENTRY_START_LISTENER = sentryModule('Start listener')
export const SENTRY_QUEUE_EVENT = sentryModule('Queue event')
export const SENTRY_UNQUEUE_EVENT = sentryModule('Unqueue event')
export const SENTRY_UPLOAD_PENDING_EVENTS = sentryModule('Action uploaded')
