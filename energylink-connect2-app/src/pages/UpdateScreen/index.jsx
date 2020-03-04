import { Loader } from 'components/Loader'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { animated, useSpring } from 'react-spring'
import { useI18n } from 'shared/i18n'
import { capitalize, either } from 'shared/utils'
import './UpdateScreen.scss'

const states = {
  UPGRADE_COMPLETE: '#fff',
  UPLOADING_FS: '#b224ff',
  WAITING_FOR_NETWORK: '#42ff28'
}

const UpdateScreen = ({ animationState }) => {
  const { status, percent } = useSelector(state => state.firmwareUpdate)
  const [color, setColor] = useState('#ffffff')
  const PVSColor = useSpring({ color })
  const t = useI18n()

  useEffect(() => {
    setColor(states[status] || '#4cd6ff')
  }, [status, setColor])

  return (
    <div className="pvs-update-screen page-height pr-20 pl-30">
      <span className="is-uppercase has-text-weight-bold">HOLD ON</span>
      <animated.span className="sp-pvs" style={PVSColor} />
      <span>We’re updating the PVS Please don’t close the application</span>
      <div className="percent-loader">
        {either(
          status === 'UPGRADE_COMPLETE',
          null,
          <>
            {either(
              status !== 'UPLOADING_FS',
              <span className="has-text-white is-size-1">{percent}%</span>,
              <Loader />
            )}
            <span className="has-text-white">{capitalize(t(status))}</span>
          </>
        )}
      </div>
    </div>
  )
}

export default UpdateScreen
