import { ofType } from 'redux-observable'
import { switchMap } from 'rxjs/operators'
import { EMPTY, of } from 'rxjs'

import { FINISH_PLT_SETUP, START_PLT_SETUP } from 'state/actions/analytics'
import { finishPLTWizard, timeMixPanelEvent } from 'shared/analytics'

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
