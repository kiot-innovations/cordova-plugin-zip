import { always, compose, head, ifElse, match, path, test } from 'ramda'
import { ofType } from 'redux-observable'
import { from } from 'rxjs'
import { map, retryWhen, switchMap } from 'rxjs/operators'

import { sendCommandToPVS } from 'shared/PVSUtils'
import genericRetryStrategy from 'shared/rxjs/genericRetryStrategy'
import { PVS_CONNECTION_SUCCESS } from 'state/actions/network'
import { SET_PVS_MODEL } from 'state/actions/pvs'

export const isPvsRegex = /pvs[0-9]+/gi
export const getPvsModelFromResponse = compose(
  ifElse(
    test(isPvsRegex),
    compose(head, match(isPvsRegex)),
    always('Unknown Model')
  ),
  path(['supervisor', 'MODEL'])
)

const getPVSModel = async () => {
  try {
    const info = await sendCommandToPVS('GetSupervisorInformation')
    return getPvsModelFromResponse(info)
  } catch (e) {
    //This will enable the PVS commands
    await sendCommandToPVS('Start')
  }
}

const setPVSModelEpic = action$ =>
  action$.pipe(
    ofType(PVS_CONNECTION_SUCCESS.getType()),
    switchMap(() => from(getPVSModel()).pipe(map(SET_PVS_MODEL))),
    retryWhen(
      genericRetryStrategy({
        maxRetryAttempts: 5
      })
    )
  )

export default setPVSModelEpic
