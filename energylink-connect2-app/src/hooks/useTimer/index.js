import { compose } from 'ramda'
import { useEffect, useState } from 'react'

import { padNumber } from 'shared/utils'

const formatTime = value =>
  `${Math.floor(value / 60)}:${padNumber(value % 60, 2)}`

const useTimer = (secondsToFinish = 60, startInitialized = false) => {
  const [secondsLeft, setSeconds] = useState(secondsToFinish)
  const [formatted, setFormatted] = useState(() => formatTime(secondsToFinish))
  const [isActive, setIsActive] = useState(startInitialized)

  function reset() {
    setSeconds(secondsToFinish)
    setIsActive(false)
  }

  function activate() {
    setIsActive(true)
  }

  useEffect(() => {
    const saveFormattedTime = compose(setFormatted, formatTime)
    saveFormattedTime(secondsLeft)
  }, [secondsLeft])
  useEffect(() => {
    let interval = null

    if (isActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds - 1)
      }, 1000)
      if (secondsLeft === 0) {
        clearInterval(interval)
        setIsActive(false)
      }
    } else if (!isActive && secondsLeft !== 0) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isActive, secondsLeft])
  return [formatted, isActive, activate, reset, secondsLeft]
}

export default useTimer
