import React from 'react'
import { Battery, Arrow, HomeGray } from '../Icons'

function PoweringIcon() {
  return (
    <div className="is-flex level pr-10">
      <Battery />
      <div className="ml-10 mr-10">
        <Arrow />
      </div>
      <HomeGray />
    </div>
  )
}

export default PoweringIcon
