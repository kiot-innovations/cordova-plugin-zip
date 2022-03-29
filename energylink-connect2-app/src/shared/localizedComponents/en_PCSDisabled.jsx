import React from 'react'

const style = {
  color: '#FFE600'
}

const PCSDisabled = () => (
  <section>
    <p className="has-text-centered mb-5">
      You disabled the Power Control System (PCS).
    </p>

    <p className="has-text-centered mb-5">
      As a result the Hub+ will not throttle PV production or the ESS
      charge/discharge rate to protect the main service panel busbars.
    </p>

    <p className="has-text-centered mb-5 is-uppercase" style={style}>
      Disabling this setting when busbar protection is required may result in an
      electrical hazard!
    </p>

    <p className="has-text-centered mb-5">
      Only qualified personnel (NEC 2020 240.6C) may complete this step. If you
      are not sure that the values you entered are correct, or if you do not
      feel qualified to complete this step, please stop and contact your
      supervisor.
    </p>

    <p className="has-text-centered mb-5">
      By tapping CONFIRM, you acknowledge this message and attest that busbar
      protection is not required on this site.
    </p>
  </section>
)

export default PCSDisabled
