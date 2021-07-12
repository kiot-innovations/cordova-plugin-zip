import { ofType } from 'redux-observable'
import { concat, of } from 'rxjs'
import { switchMap, map, take } from 'rxjs/operators'

import { HIDE_MODAL, SET_CURRENT_MODAL, SHOW_MODAL } from 'state/actions/modal'
import { EMPTY_ACTION } from 'state/actions/share'

const showModalEpic = action$ =>
  action$.pipe(
    ofType(SHOW_MODAL.getType()),
    switchMap(({ payload }) =>
      concat(
        of(SET_CURRENT_MODAL(payload)),
        action$.pipe(
          ofType(HIDE_MODAL.getType()),
          map(() => EMPTY_ACTION()),
          take(1)
        )
      )
    )
  )
export default [showModalEpic]
