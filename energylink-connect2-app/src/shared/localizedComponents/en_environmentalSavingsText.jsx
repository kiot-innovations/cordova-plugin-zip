import React from 'react'
import { createExternalLinkHandler } from '../routing'

export default () => (
  <React.Fragment>
    <h5>
      <strong>What can I learn from the Environmental Savings widget?</strong>
    </h5>
    <p>
      This widget shows how your investment in a SunPower solar system benefits
      the environment. We display estimated carbon dioxide (CO2) emissions
      avoided and additional relatable carbon factors—like miles not driven,
      pounds of garbage recycled, and mature trees grown.
    </p>

    <div>
      <h5>
        Can I see my estimated environmental savings for different date ranges?
      </h5>

      <p>
        You sure can! On the dashboard, you can see your environmental savings
        for the lifetime of your system. On the graphs page, you can see your
        estimated environmental savings for whatever time period you select with
        the date picker.
      </p>
    </div>
    <br />
    <div>
      <h5>How are my environmental savings calculated?</h5>
      <p>
        We take the energy produced by your system (kWh) and multiply it by a
        <a
          href="https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator"
          className="ml-5 mr-5"
          rel="noopener noreferrer"
          onClick={createExternalLinkHandler(
            'https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator'
          )}
        >
          conversion value provided
        </a>
        by the EPA to estimate the carbon dioxide (CO2) emissions you've
        avoided. These calculations blend national rates to reflect regional
        differences. Please note that accuracy may vary based on the
        equivalencies available for your location.
      </p>
    </div>
  </React.Fragment>
)
