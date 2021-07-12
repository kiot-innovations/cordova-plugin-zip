import { ofType } from 'redux-observable'
import { EMPTY, of } from 'rxjs'
import { switchMap } from 'rxjs/operators'

import { finishPLTWizard, timeMixPanelEvent } from 'shared/analytics'
import { FINISH_PLT_SETUP, START_PLT_SETUP } from 'state/actions/analytics'

const finishPLTWizardEpic = action$ =>
  action$.pipe(
    ofType(FINISH_PLT_SETUP.getType()),
    switchMap(() => of(finishPLTWizard()))
  )
const enterPLTWizardEpic = action$ =>
  action$.pipe(
    ofType(START_PLT_SETUP.getType()),
    switchMap(() => {
      timeMixPanelEvent('Panel Layout Setup')
      return EMPTY
    })
  )
export default [enterPLTWizardEpic, finishPLTWizardEpic]
