import * as React from 'react'
import { useDispatch } from 'react-redux'
import { always, cond, equals, T } from 'ramda'
import { appConnectionStatus } from 'state/reducers/network'
import { SHOW_MODAL } from 'state/actions/modal'

export const ConnectionStatus = ({ status }) => {
  const dispatch = useDispatch()

  const openConnectionStatus = () => {
    dispatch(
      SHOW_MODAL({
        componentPath: './ConnectionStatus/ConnectionStatusModal.jsx'
      })
    )
  }

  const iconStatus = cond([
    [
      equals(appConnectionStatus.CONNECTED),
      always(
        <svg
          width={36}
          height={19}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          id="status-connected"
        >
          <path
            className="pulse"
            d="M26.333 18.546h-5.25v-3.6h5.25c2.9 0 5.25-2.418 5.25-5.4s-2.35-5.4-5.25-5.4h-5.25v-3.6h5.25c4.833 0 8.75 4.03 8.75 9s-3.917 9-8.75 9zm-12.25 0h-5.25c-4.832 0-8.75-4.03-8.75-9s3.918-9 8.75-9h5.25v3.6h-5.25c-2.9 0-5.25 2.418-5.25 5.4s2.35 5.4 5.25 5.4h5.25v3.6zm12.25-7.2h-17.5v-3.6h17.5v3.6z"
            fill="#69B342"
          />
        </svg>
      )
    ],
    [
      equals(appConnectionStatus.NOT_USING_WIFI),
      always(
        <svg
          width={33}
          height={32}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          id="status-notconnected"
        >
          <path
            d="M30.183 32L15.82 17.648H8.256v-3.296h4.266l-3.3-3.297h-.966A4.947 4.947 0 003.306 16a4.947 4.947 0 004.95 4.945h4.949v3.296h-4.95a8.246 8.246 0 01-8.188-7.198A8.242 8.242 0 016.185 8.02L.49 2.33 2.823 0l29.694 29.67-2.332 2.328-.002.002zm-.257-9.583l-2.356-2.352a4.943 4.943 0 00-2.818-9.01h-4.949V7.76h4.95a8.248 8.248 0 017.777 5.5 8.237 8.237 0 01-2.603 9.158h-.001z"
            fill="#EB5757"
            className="pulse"
          />
        </svg>
      )
    ],
    [
      equals(appConnectionStatus.NOT_CONNECTED_PVS),
      always(
        <svg
          width={33}
          height={32}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          id="status-notconnected"
        >
          <path
            d="M30.183 32L15.82 17.648H8.256v-3.296h4.266l-3.3-3.297h-.966A4.947 4.947 0 003.306 16a4.947 4.947 0 004.95 4.945h4.949v3.296h-4.95a8.246 8.246 0 01-8.188-7.198A8.242 8.242 0 016.185 8.02L.49 2.33 2.823 0l29.694 29.67-2.332 2.328-.002.002zm-.257-9.583l-2.356-2.352a4.943 4.943 0 00-2.818-9.01h-4.949V7.76h4.95a8.248 8.248 0 017.777 5.5 8.237 8.237 0 01-2.603 9.158h-.001z"
            fill="#EB5757"
            className="pulse"
          />
        </svg>
      )
    ],
    [T, always(<div />)]
  ])

  return (
    <div onClick={openConnectionStatus} className="connectionStatus">
      {iconStatus(status)}
    </div>
  )
}

export default ConnectionStatus
