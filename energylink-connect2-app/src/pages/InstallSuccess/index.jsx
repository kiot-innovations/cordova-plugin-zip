import React from 'react'
import './InstallSuccess.scss'

const InstallSuccessful = props => {
  return (
    <div className="file level has-text-centered fill-parent install-success-screen">
      <div className="is-vertical file level is-vertical is-flex tile">
        <span className="is-uppercase has-text-weight-bold mb-25 mt-25 ">
          install successful
        </span>
        <span className="sp-pvs has-text-white mb-30" />
        <span className="mb-20">
          Please take a picture for your records of the module layout diagram
          before leaving the site
        </span>
        <span className="has-text-white">
          You can now{' '}
          <span className="has-text-weight-bold">
            turn off the solar breakers
          </span>
        </span>
        <div className="is-flex auto is-vertical tile">
          <button className="button is-primary is-uppercase is-center mt-50">
            Configure
          </button>
          <button className="configure-button is-uppercase is-center mt-50 has-text-weight-bold">
            not now
          </button>
        </div>
      </div>
    </div>
  )
}

export default InstallSuccessful
