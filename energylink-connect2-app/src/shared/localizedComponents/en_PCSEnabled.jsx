import React from 'react'

const getLimit = busbar => busbar * 0.8

const style = {
  color: '#FFE600'
}

const PCSEnabled = ({ busbar = 'N/A', breaker = 'N/A', hubplus = 'N/A' }) => (
  <section>
    <p className="has-text-centered mb-5">
      You entered the following values: <br />
      Main Service Panel Busbar Rating: {busbar} A <br />
      Main Service Panel Breaker Rating: {breaker} A <br />
      Hub+ Breaker Rating: {hubplus} A
    </p>

    <p className="has-text-centered mb-5">
      As a result, in order to ensure that the MSP complies with the NEC 120%
      Rule, PV and SunVault storage export will be limited to
      {isNaN(busbar) ? ' N/A' : ` ${getLimit(busbar)} A`}.
    </p>

    <p className="has-text-centered mb-5 is-uppercase" style={style}>
      Your failure to enter correct main service busbar and breaker ratings may
      result in an electrical fire!
    </p>

    <p className="has-text-centered mb-5">
      Only qualified personnel (NEC 2020 240.6C) may complete this step. If you
      are not sure that the values you entered are correct, or if you do not
      feel qualified to complete this step, please stop and contact your
      supervisor.
    </p>

    <p className="has-text-centered mb-5">
      By tapping CONFIRM, you acknowledge this message and attest that the
      values you entered are correct and you are qualified to enter them.
    </p>
  </section>
)

export default PCSEnabled
