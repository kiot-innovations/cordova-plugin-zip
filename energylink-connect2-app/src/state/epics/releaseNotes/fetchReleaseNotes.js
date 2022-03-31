import { findIndex, propEq, propOr } from 'ramda'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, exhaustMap, map } from 'rxjs/operators'

import appVersion from '../../../macros/appVersion.macro'

import { plainHttpGet } from 'shared/fetch'
import {
  FETCH_RELEASE_NOTES,
  FETCH_RELEASE_NOTES_ERROR,
  FETCH_RELEASE_NOTES_SUCCESS
} from 'state/actions/releaseNotes'

const releaseNotesUrl = process.env.REACT_APP_RELEASE_NOTES_URL

const trimReleaseNotes = releaseNotes => {
  const currentAppVersion = appVersion()
  const releaseNotesCopy = releaseNotes
  const versions = propOr([], 'versions', releaseNotesCopy)
  const currentAppVersionIndex = findIndex(
    propEq('versionNumber', currentAppVersion)
  )(versions)
  releaseNotesCopy.versions = versions.slice(
    currentAppVersionIndex > 0 ? currentAppVersionIndex : 0,
    currentAppVersionIndex > 0 ? currentAppVersionIndex + 8 : 8
  )
  return JSON.stringify(releaseNotesCopy)
}

export const fetchReleaseNotesEpic = action$ =>
  action$.pipe(
    ofType(FETCH_RELEASE_NOTES.getType()),
    exhaustMap(() =>
      from(plainHttpGet(releaseNotesUrl)).pipe(
        map(response => {
          const notes = trimReleaseNotes(response.data)
          localStorage.setItem('releaseNotes', notes)
          return FETCH_RELEASE_NOTES_SUCCESS()
        }),
        catchError(error => {
          console.error(error)
          return of(FETCH_RELEASE_NOTES_ERROR(error))
        })
      )
    )
  )
