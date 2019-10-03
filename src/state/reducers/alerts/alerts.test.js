import * as AlertsActions from '../../actions/alerts'
import { alertsReducer } from '.'

describe('Alerts reducer', () => {
  const reducerTest = reducerTester(alertsReducer)
  const baseTime = new Date(2019, 2, 1)

  beforeEach(() => {
    jest.spyOn(Date, 'now').mockImplementation(() => baseTime)
  })

  it('returns the initial state', () => {
    reducerTest(undefined, {}, { data: {} })
  })

  it('stores the alerts by key when ALERTS_FETCH_SUCCESS action is fired', () => {
    const payload = {
      unresolvedAlerts: [
        {
          AlertsID: 86772642,
          AlertTypeID: 2
        },
        {
          AlertsID: 86772640,
          AlertTypeID: 3
        }
      ]
    }

    reducerTest(
      {
        data: {
          86772640: {
            AlertsID: 86772640,
            AlertTypeID: 2,
            seenTimestamp: 123123123123
          }
        }
      },
      AlertsActions.ALERTS_FETCH_SUCCESS(payload),
      {
        data: {
          86772640: {
            AlertsID: 86772640,
            AlertTypeID: 3,
            seenTimestamp: 123123123123
          },
          86772642: {
            AlertsID: 86772642,
            AlertTypeID: 2,
            seenTimestamp: null
          }
        }
      }
    )
  })

  it('marks all the alerts as seen when ALERTS_SEEN action is fired', () => {
    reducerTest(
      {
        data: {
          86772640: {
            AlertsID: 86772640,
            AlertTypeID: 2,
            seenTimestamp: 123123123123
          },
          86772642: {
            AlertsID: 86772642,
            AlertTypeID: 2,
            seenTimestamp: null
          }
        }
      },
      AlertsActions.ALERTS_SEEN(),
      {
        data: {
          86772640: {
            AlertsID: 86772640,
            AlertTypeID: 2,
            seenTimestamp: baseTime.valueOf()
          },
          86772642: {
            AlertsID: 86772642,
            AlertTypeID: 2,
            seenTimestamp: baseTime.valueOf()
          }
        }
      }
    )
  })
})
