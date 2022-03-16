import { throwError, timer } from 'rxjs'
import { mergeMap } from 'rxjs/operators'

/**
 * Retry strategy used in conjuction with RxJS 'retryWhen' operator.
 * @param {number} scalingDuration
 * @param {number} maxRetryAttempts
 * @param {number[]} excludedStatusCodes
 * @param {boolean} shouldScaleTime
 * @returns {function(*): *}
 */
const genericRetryStrategy = ({
  excludedStatusCodes = [],
  maxRetryAttempts = 3,
  scalingDuration = 1000,
  shouldScaleTime = true,
  reThrow = false,
  reThrowMessage = ''
}) => errors$ =>
  errors$.pipe(
    mergeMap((error, i) => {
      const retryAttempt = i + 1

      if (
        retryAttempt > maxRetryAttempts ||
        excludedStatusCodes.find(e => e === error.status) ||
        reThrow
      ) {
        return throwError(reThrow ? reThrowMessage : error)
      }

      return timer(
        shouldScaleTime ? retryAttempt * scalingDuration : scalingDuration
      )
    })
  )

export default genericRetryStrategy
