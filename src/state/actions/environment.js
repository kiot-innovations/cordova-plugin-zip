import { createAction } from 'redux-act'
import { Promise } from 'q'

export const FETCH_LTE_DATA_INIT = createAction('FETCH_LTE_DATA_INIT')
export const FETCH_LTE_DATA_SUCCESS = createAction('FETCH_LTE_DATA_SUCCESS')
export const FETCH_LTE_DATA_ERROR = createAction('FETCH_LTE_DATA_ERROR')

export const fetchLTEData = () => {
  return async dispatch => {
    dispatch(FETCH_LTE_DATA_INIT())
    try {
      const { status, data } = await new Promise(resolve => {
        resolve({
          status: 200,
          data: 15655.029999999999
        })
      })
      if (status !== 200) {
        dispatch(FETCH_LTE_DATA_ERROR(status))
        dispatch(computeSavings(0))
      } else {
        dispatch(FETCH_LTE_DATA_SUCCESS(data))
        dispatch(computeSavings(data))
      }
    } catch (err) {
      dispatch(FETCH_LTE_DATA_ERROR(err))
      dispatch(computeSavings(0))
    }
  }
}

export const COMPUTE_SAVINGS_INIT = createAction('COMPUTE_SAVINGS_INIT')
export const COMPUTE_SAVINGS_SUCCESS = createAction('COMPUTE_SAVINGS_SUCCESS')

const POUNDS_IN_TON = 2000
const POUNDS_IN_METRIC_TON = 2204.62
const METRIC_TON_TO_US_TON_CONV_FACTOR = POUNDS_IN_METRIC_TON / POUNDS_IN_TON

/**
 * Calculations done in 2019-5-15. \
 * 1,559 lbs CO2/MWh × (4.536 × 10-4 metric tons/lb) × 0.001 MWh/kWh = 7.07 × 10-4 metric tons CO2/kWh
 */
const CO2_METRIC_TON_CONVERSION_FACTOR = 0.000707

/**
 * Amounts are calculated using the avoided CO2 emissions.
 * All calculations are done using metric tons
 * @param {Number} totalProduction
 * @param {Number} factor
 */
const calculateAmount = (totalProduction, factor) =>
  (CO2_METRIC_TON_CONVERSION_FACTOR * totalProduction) / factor

const calculateCO2 = totalProduction => {
  let co2MetricTons = CO2_METRIC_TON_CONVERSION_FACTOR * totalProduction
  let val = co2MetricTons * POUNDS_IN_METRIC_TON
  let unt = 'ENV_SAVINGS_POUNDS'

  if (val >= 1000) {
    val = co2MetricTons * METRIC_TON_TO_US_TON_CONV_FACTOR
    unt = 'ENV_SAVINGS_TONS'
  }

  return {
    value: val,
    units: unt
  }
}

/**
 * The factors and how to the savings are calculated is described at the following site.
 * https://www.epa.gov/energy/greenhouse-gases-equivalencies-calculator-calculations-and-references \
 * Factors calculations done in 2019-5-15:\
 * Car miles -> 8.89 × 10-3 metric tons CO2/gallon gasoline × 1/22.0 miles per gallon car/truck average × 1 CO2, CH4, and N2O/0.988 CO2 = 4.09 x 10-4 metric tons CO2E/mile \
 * Gasoline -> 8,887 grams of CO2/gallon of gasoline = 8.887 × 10-3 metric tons CO2/gallon of gasoline \
 * Coal -> 21.11 mmbtu/metric ton coal × 26.05 kg C/mmbtu × 44 kg CO2/12 kg C × 1 metric ton coal/2,204.6 pound of coal x 1 metric ton/1,000 kg = 9.15 x 10-4 metric tons CO2/pound of coal \
 * Crude oil -> 5.80 mmbtu/barrel × 20.31 kg C/mmbtu × 44 kg CO2/12 kg C × 1 metric ton/1,000 kg = 0.43 metric tons CO2/barrel \
 * Trees -> 36.4 lbs C/tree × (44 units CO2/12 units C) × 1 metric ton/2,204.6 lbs = 0.060 metric ton CO2 per urban tree planted \
 * Garbage -> 2.87 metric tons CO2 equivalent /ton of waste recycled instead of landfilled x 7 tons/garbage truck = 20.07 metric tons CO2E/garbage truck of waste recycled instead of landfilled \
 * @param {Number} totalProduction
 */
export const computeSavings = totalProduction => {
  return dispatch => {
    dispatch(COMPUTE_SAVINGS_INIT())

    if (typeof totalProduction !== 'number' || isNaN(totalProduction)) {
      totalProduction = 0
    }

    const co2 = calculateCO2(totalProduction)

    const envImpactResults = {
      carbondioxide: {
        value: co2.value,
        units: co2.units
      },
      carmiles: calculateAmount(totalProduction, 0.000409),
      gasoline: calculateAmount(totalProduction, 0.008887),
      coal: calculateAmount(totalProduction, 0.000915),
      crudeoil: calculateAmount(totalProduction, 0.43),
      trees: calculateAmount(totalProduction, 0.06),
      garbage: calculateAmount(totalProduction, 2.87) * POUNDS_IN_METRIC_TON
    }
    dispatch(COMPUTE_SAVINGS_SUCCESS(envImpactResults))
  }
}
