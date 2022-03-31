import { createAction } from 'redux-act'

export const FETCH_RELEASE_NOTES = createAction('FETCH_RELEASE_NOTES')
export const FETCH_RELEASE_NOTES_SUCCESS = createAction(
  'FETCH_RELEASE_NOTES_SUCCESS'
)
export const FETCH_RELEASE_NOTES_ERROR = createAction(
  'FETCH_RELEASE_NOTES_ERROR'
)
