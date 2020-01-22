import React from 'react'

export default () => (
  <React.Fragment>
    <h5>
      <strong>What can I learn from the Energy Mix widget?</strong>
    </h5>

    <p>
      This widget shows an approximation of how your energy production and use
      compare throughout the day. It shows:
    </p>
    <ul>
      <li>Energy produced by your solar system (green)</li>

      <li>
        Energy you may send to the grid if energy production exceeds home use
        (dark green)
      </li>

      <li>
        Energy you may need to pull from the grid if home use exceeds energy
        production (yellow)
      </li>
    </ul>

    <p>
      For example, if in one day you produced 20 kWh and used 15 kWh, you could
      potentially send 5 kWh of energy to the grid. The exact amount you send to
      the grid depends on when during the day the excess energy was produced.
    </p>

    <div>
      <h5>What does "Waiting for the Sun" mean?</h5>

      <p>
        You'll see this message after the sun sets and until the sun rises,
        because there is no sunlight for your system to convert into
        electricity. We'll show you your power as soon as the sun returns.
      </p>
    </div>

    <br />

    <div>
      <h5>What does "Waiting for Data" mean?</h5>
      <p>We aren't receiving data from your system for one of these reasons:</p>
      <ul>
        <li>
          Your system is operating normally but weather conditions are not
          favorable for solar production.
        </li>
        <li>
          Your internet connection to the solar system is down so we aren't
          getting data.
        </li>
        <li>There is a problem with your solar system equipment.</li>
      </ul>
    </div>

    <br />

    <div>
      <p>
        <strong>Please note:</strong> If there is a communication or system
        problem, you will also see a red alert bar along the top of the screen.
        Please click on it for more information.
      </p>
    </div>
  </React.Fragment>
)
