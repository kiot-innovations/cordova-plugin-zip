import { ofType } from 'redux-observable'
import { EMPTY } from 'rxjs'
import { exhaustMap } from 'rxjs/operators'

import { turnOnKeyboardShrinkView } from 'shared/keyboard'
import { INITIALIZE_KEYBOARD } from 'state/actions/global'

export const keyboardEpic = action$ => {
  return action$.pipe(
    ofType(INITIALIZE_KEYBOARD.getType()),
    exhaustMap(({ payload }) => {
      turnOnKeyboardShrinkView(payload)
      return EMPTY
    })
  )
}
