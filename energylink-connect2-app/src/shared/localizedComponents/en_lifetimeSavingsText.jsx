import React from 'react'

export default () => (
  <React.Fragment>
    <h5>
      <strong>What can I learn from the Bill Savings widget?</strong>
    </h5>
    <p>
      This is an estimate of the money you've saved from your investment in
      solar energy. Every kWh of solar energy you've generated means one less
      kWh of electricity you've had to buy from your utility.
    </p>

    <div>
      <h5>Can I see my estimated bill savings different date ranges?</h5>

      <p>
        You sure can! On the dashboard, you can see your bill savings for the
        lifetime of your system. On the graphs page, you can see your estimated
        bill savings for whatever time period you select with the date picker.
      </p>
    </div>
    <br />
    <div>
      <h5>How is my bill savings calculated?</h5>
      <p>
        Estimating bill savings from solar involves comparing your cost of
        electricity with and without solar. The goal is to determine your
        'avoided cost'—how much money you didn't spend on electricity from the
        grid because you used electricity from your solar system instead.
      </p>

      <p>
        To determine your estimated bill savings, we first determine how much
        electricity your system generated during the time period in question
        (e.g., a week, a month, the lifetime of your system) and compare it to
        how much electricity you used during the same period.
      </p>

      <p>
        We then multiply whichever quantity is smaller (electricity generated or
        electricity used) by the average cost per kWh within your state. The
        result is your estimate savings.
      </p>
    </div>
  </React.Fragment>
)
