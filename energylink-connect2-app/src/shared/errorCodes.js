import * as Sentry from '@sentry/browser'
import { prop } from 'ramda'
import { arrayToObject } from 'shared/utils'

const errorCodes = [
  {
    event_code: '11010',
    event_name: 'hubplus_under_temperature_warning',
    code: '11010',
    in_use: true,
    display: true,
    error_description: 'Hub+ temperature too low',
    possible_causes:
      'Low ambient temperature (below -10C) or faulty temperature sensor in Hub+',
    recommended_actions:
      'Check that the Hub+ door is closed. Ensure that no water or ice are present in the enclosure.\n\nIf ambient temperature is consistently above -10C, you may need to replace the part due to a faulty temperature sensor. Please contact SunPower.'
  },
  {
    event_code: '11011',
    event_name: 'hubplus_over_temperature_warning',
    code: '11011',
    in_use: true,
    display: true,
    error_description: 'Hub+ temperature too high',
    possible_causes:
      'The Hub+ may be located in a hot location or facing direct sun. This could also be caused by loads/generation above Hub+ rating.',
    recommended_actions:
      'Check that the Hub+ is not in direct sunlight and change its  location if that is the case. Check that loads and generation are within the ratings of the Hub+.'
  },
  {
    event_code: '11013',
    event_name: 'hubplus_over_humidity_warning',
    code: '11013',
    in_use: true,
    display: true,
    error_description: 'Hub+ humidity warning',
    possible_causes: 'Water intrusion into Hub+',
    recommended_actions:
      'Ensure that the Hub+ door is closed and check for water intrusion.'
  },
  {
    event_code: '11016',
    event_name: 'hubplus_acdc_supply_under_voltage_warning',
    code: '11016',
    in_use: true,
    display: true,
    error_description: 'Hub+ power supply under voltage',
    possible_causes: 'Check user manual',
    recommended_actions: 'Check user manual'
  },
  {
    event_code: '11017',
    event_name: 'hubplus_acdc_supply_over_voltage_warning',
    code: '11017',
    in_use: true,
    display: true,
    error_description: 'Hub+ power supply over voltage',
    possible_causes: 'Check user manual',
    recommended_actions: 'Check user manual'
  },
  {
    event_code: '11018',
    event_name: 'hubplus_inverter_aux_under_voltage_warning',
    code: '11018',
    in_use: true,
    display: true,
    error_description: 'Inverter auxiliary power supply under voltage',
    possible_causes: 'Check user manual',
    recommended_actions: 'Check user manual'
  },
  {
    event_code: '11019',
    event_name: 'hubplus_inverter_aux_over_voltage_warning',
    code: '11019',
    in_use: true,
    display: true,
    error_description: 'Inverter auxiliary power supply over voltage',
    possible_causes: 'Check user manual',
    recommended_actions: 'Check user manual'
  },
  {
    event_code: '11020',
    event_name: 'hubplus_supply_under_voltage_warning',
    code: '11020',
    in_use: true,
    display: true,
    error_description: 'Hub+ power supply under voltage',
    possible_causes: 'Check user manual',
    recommended_actions: 'Check user manual'
  },
  {
    event_code: '11021',
    event_name: 'hubplus_supply_over_voltage_warning',
    code: '11021',
    in_use: true,
    display: true,
    error_description: 'Hub+ power supply over voltage',
    possible_causes: 'Check user manual',
    recommended_actions: 'Check user manual'
  },
  {
    event_code: '11024',
    event_name: 'hubplus_jumpstart_out_of_range_warning',
    code: '11024',
    in_use: true,
    display: true,
    error_description: 'Hub+ jump-start out of range',
    possible_causes: 'Check user manual',
    recommended_actions: 'Check user manual'
  },
  {
    event_code: '12000',
    event_name: 'storage_inv_under_temperature_warning',
    code: '12000',
    in_use: true,
    display: true,
    error_description: 'Storage inverter under temperature',
    possible_causes:
      'Water or ice may have intruded into the all-in-one enclosure. The all-in-one door may be closed.',
    recommended_actions:
      'Please ensure that the all-in-one enclosure door is properly closed. Check for water or ice intrusion.'
  },
  {
    event_code: '12001',
    event_name: 'storage_inv_over_temperature_warning',
    code: '12001',
    in_use: true,
    display: true,
    error_description: 'Storage inverter over temperature',
    possible_causes:
      'The ESS enclosure may be located in an overly hot location.\n\nESS enclosure fans may be blocked or faulty. ',
    recommended_actions:
      'Ensure that ESS is not near a heat source. \n\nEnsure that ESS fans are not blocked.\n\nCheck that the inverter air filter is unblocked and clean.\n\nCheck that the ESS enclosure door is properly locked.'
  },
  {
    event_code: '13000',
    event_name: 'battery_low_state_of_charge_warning',
    code: '13000',
    in_use: true,
    display: true,
    error_description: 'Battery has low state of charge',
    possible_causes:
      'Battery is typically charged from PV energy. Long periods of bad weather may have caused the battery to drain excessively. Inverter may be malfunctioning.',
    recommended_actions:
      'Try charging battery manually or from grid power. Check for inverter errors.'
  },
  {
    event_code: '13001',
    event_name: 'battery_low_state_of_health_warning',
    code: '13001',
    in_use: true,
    display: true,
    error_description: 'Battery has degraded (low state of health)',
    possible_causes:
      'Battery may have been exposed ot harsh environmental conditions or may have been used aggressively.',
    recommended_actions:
      'Check battery location: temperature and airflow into battery. Contact SunPower'
  },
  {
    event_code: '13003',
    event_name: 'battery_under_voltage_warning',
    code: '13003',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '13004',
    event_name: 'battery_over_voltage_warning',
    code: '13004',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '13005',
    event_name: 'battery_over_current_during_charge_warning',
    code: '13005',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '13006',
    event_name: 'battery_over_power_during_charge_warning',
    code: '13006',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '13007',
    event_name: 'battery_over_current_during_discharge_warning',
    code: '13007',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '13008',
    event_name: 'battery_over_power_during_discharge_warning',
    code: '13008',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '13009',
    event_name: 'battery_over_current_limit_during_charge_warning',
    code: '13009',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '13010',
    event_name: 'battery_over_current_limit_during_discharge_warning',
    code: '13010',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '13011',
    event_name: 'battery_under_temperature_during_charge_warning',
    code: '13011',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '13012',
    event_name: 'battery_over_temperature_during_charge_warning',
    code: '13012',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '13013',
    event_name: 'battery_under_temperature_during_discharge_warning',
    code: '13013',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '13014',
    event_name: 'battery_over_temperature_during_discharge_warning',
    code: '13014',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '13015',
    event_name: 'battery_cell_delta_voltage_too_high_warning',
    code: '13015',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '13016',
    event_name: 'battery_cell_temperature_diff_too_high_warning',
    code: '13016',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '13017',
    event_name: 'battery_state_of_charge_low_warning',
    code: '13017',
    in_use: true,
    display: true,
    error_description: 'Battery has low state of charge',
    possible_causes:
      'Battery is typically charged from PV energy. Long periods of bad weather may have caused the battery to drain excessively. Inverter may be malfunctioning.',
    recommended_actions:
      'Try charging battery manually or from grid power. Check for inverter errors.'
  },
  {
    event_code: '13018',
    event_name: 'battery_pack_will_be_turned_off_warning',
    code: '13018',
    in_use: true,
    display: true,
    error_description: 'Battery pack will be turned off',
    possible_causes: 'Check user manual',
    recommended_actions: 'Check user manual'
  },
  {
    event_code: '13019',
    event_name: 'battery_internal_communication_fail_warning',
    code: '13019',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '14000',
    event_name: 'esshub_under_temperature_warning',
    code: '14000',
    in_use: true,
    display: true,
    error_description: 'ESS temperature too low',
    possible_causes:
      'Water or ice may have intruded into the all-in-one enclosure. The all-in-one door may be closed.',
    recommended_actions:
      'Please ensure that the all-in-one enclosure door is properly closed. Check for water or ice intrusion.'
  },
  {
    event_code: '14001',
    event_name: 'esshub_over_temperature_warning',
    code: '14001',
    in_use: true,
    display: true,
    error_description: 'ESS temperature too high',
    possible_causes:
      'The ESS enclosure may be located in an overly hot location.\n\nESS enclosure fans may be blocked or faulty. ',
    recommended_actions:
      'Ensure that ESS is not near a heat source. \n\nEnsure that ESS fans are not blocked.\n\nCheck that the inverter air filter is unblocked and clean.\n\nCheck that the ESS enclosure door is properly locked.'
  },
  {
    event_code: '14003',
    event_name: 'esshub_over_humidity_warning',
    code: '14003',
    in_use: true,
    display: true,
    error_description: 'ESS humidity is too high',
    possible_causes: 'Water intrusion into ESS enclosure.',
    recommended_actions:
      'Please ensure that the all-in-one enclosure door is properly closed. Check for water or ice intrusion.'
  },
  {
    event_code: '14004',
    event_name: 'esshub_gateway_output_under_voltage_warning',
    code: '14004',
    in_use: true,
    display: true,
    error_description: 'ESS gateway power supply under voltage',
    possible_causes: 'Check user manual',
    recommended_actions: 'Check user manual'
  },
  {
    event_code: '14005',
    event_name: 'esshub_gateway_output_over_voltage_warning',
    code: '14005',
    in_use: true,
    display: true,
    error_description: 'ESS gateway power supply over voltage',
    possible_causes: 'Check user manual',
    recommended_actions: 'Check user manual'
  },
  {
    event_code: '14006',
    event_name: 'esshub_dcdc_supply_under_voltage_warning',
    code: '14006',
    in_use: true,
    display: true,
    error_description: 'MIO board supply under voltage',
    possible_causes: 'Check user manual',
    recommended_actions: 'Check user manual'
  },
  {
    event_code: '14007',
    event_name: 'esshub_dcdc_supply_over_voltage_warning',
    code: '14007',
    in_use: true,
    display: true,
    error_description: 'MIO board auxiliary power supply over voltage',
    possible_causes: 'Check user manual',
    recommended_actions: 'Check user manual'
  },
  {
    event_code: '14008',
    event_name: 'esshub_supply_under_voltage_warning',
    code: '14008',
    in_use: true,
    display: true,
    error_description: 'MIO board supply under voltage',
    possible_causes: 'Check user manual',
    recommended_actions: 'Check user manual'
  },
  {
    event_code: '14009',
    event_name: 'esshub_supply_over_voltage_warning',
    code: '14009',
    in_use: true,
    display: true,
    error_description: 'MIO board auxiliary power supply over voltage',
    possible_causes: 'Check user manual',
    recommended_actions: 'Check user manual'
  },
  {
    event_code: '16000',
    event_name: 'pvs_cmeter_ac_grid_1n_under_voltage_warning',
    code: '16000',
    in_use: true,
    display: true,
    error_description: 'Consumption meter phase 1 under voltage.',
    possible_causes:
      'Conductor terminations flipped, CT terminations are incorrectly installed.',
    recommended_actions:
      'Check installation of load terminations. Check that CT voltage sensing is correctly installed.'
  },
  {
    event_code: '16001',
    event_name: 'pvs_cmeter_ac_grid_1n_over_voltage_warning',
    code: '16001',
    in_use: true,
    display: true,
    error_description: 'Consumption meter phase 1 over voltage.',
    possible_causes:
      'Conductor terminations flipped, CT terminations are incorrectly installed.',
    recommended_actions:
      'Check installation of load terminations. Check that CT voltage sensing is correctly installed.'
  },
  {
    event_code: '16002',
    event_name: 'pvs_cmeter_ac_grid_2n_under_voltage_warning',
    code: '16002',
    in_use: true,
    display: true,
    error_description: 'Consumption meter phase 2 under voltage.',
    possible_causes:
      'Conductor terminations flipped, CT terminations are incorrectly installed.',
    recommended_actions:
      'Check installation of load terminations. Check that CT voltage sensing is correctly installed.'
  },
  {
    event_code: '16003',
    event_name: 'pvs_cmeter_ac_grid_2n_over_voltage_warning',
    code: '16003',
    in_use: true,
    display: true,
    error_description: 'Consumption meter phase 2 over voltage.',
    possible_causes:
      'Conductor terminations flipped, CT terminations are incorrectly installed.',
    recommended_actions:
      'Check installation of load terminations. Check that CT voltage sensing is correctly installed.'
  },
  {
    event_code: '16004',
    event_name: 'pvs_cmeter_ac_grid_12_under_voltage_warning',
    code: '16004',
    in_use: true,
    display: true,
    error_description: 'Consumption meter phase 1-2 under voltage.',
    possible_causes:
      'Conductor terminations flipped, CT terminations are incorrectly installed.',
    recommended_actions:
      'Check installation of load terminations. Check that CT voltage sensing is correctly installed.'
  },
  {
    event_code: '16005',
    event_name: 'pvs_cmeter_ac_grid_12_over_voltage_warning',
    code: '16005',
    in_use: true,
    display: true,
    error_description: 'Consumption meter phase 1-2 over voltage.',
    possible_causes:
      'Conductor terminations flipped, CT terminations are incorrectly installed.',
    recommended_actions:
      'Check installation of load terminations. Check that CT voltage sensing is correctly installed.'
  },
  {
    event_code: '16006',
    event_name: 'pvs_cmeter_ac_grid_under_frequency_warning',
    code: '16006',
    in_use: true,
    display: true,
    error_description: 'AC Grid under frequency',
    possible_causes: 'This is likely a grid disturbance',
    recommended_actions: 'Check with utility.'
  },
  {
    event_code: '16007',
    event_name: 'pvs_cmeter_ac_grid_over_frequency_warning',
    code: '16007',
    in_use: true,
    display: true,
    error_description: 'AC grid over frequency',
    possible_causes: 'This is likely a grid disturbance',
    recommended_actions: 'Check with utility.'
  },
  {
    event_code: '23003',
    event_name: 'battery_under_voltage_alarm',
    code: '23003',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '23004',
    event_name: 'battery_over_voltage_alarm',
    code: '23004',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '23005',
    event_name: 'battery_over_current_during_charge_alarm',
    code: '23005',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '23006',
    event_name: 'battery_over_power_during_charge_alarm',
    code: '23006',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '23007',
    event_name: 'battery_over_current_during_discharge_alarm',
    code: '23007',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '23008',
    event_name: 'battery_over_power_during_discharge_alarm',
    code: '23008',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '23009',
    event_name: 'battery_over_current_limit_during_charge_alarm',
    code: '23009',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '23010',
    event_name: 'battery_over_current_limit_during_discharge_alarm',
    code: '23010',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '23011',
    event_name: 'battery_under_temperature_during_charge_alarm',
    code: '23011',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '23012',
    event_name: 'battery_over_temperature_during_charge_alarm',
    code: '23012',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '23013',
    event_name: 'battery_under_temperature_during_discharge_alarm',
    code: '23013',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '23014',
    event_name: 'battery_over_temperature_during_discharge_alarm',
    code: '23014',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '23015',
    event_name: 'battery_cell_delta_voltage_too_high_alarm',
    code: '23015',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '23016',
    event_name: 'battery_cell_temperature_diff_too_high_alarm',
    code: '23016',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '30000',
    event_name: 'component_check_no_midc_critical',
    code: '30000',
    in_use: true,
    display: true,
    error_description: 'No MIDC',
    possible_causes:
      'The PVS cannot connect with the MIDC board. The MIDC board drives the transfer switch on the Hub+. It also connects to the MIO board, so if you’re seeing this error, it is likely that other errors are occurring as well. You should focus on fixing this error first before you proceed to fix the others.\n\nThis problem may be due to one of the following causes:\n1. The MIDC board is not powered\n1. The MIDC board is not connected to the MIO board.\n1. PVS MIDC CAN connector is bad\n1. The MIDC board is damaged\n1. The AUX cable between inverter and MIDC board is not properly connected and/or terminated.',
    recommended_actions:
      'Please try the following steps\n1. Check that the line-side and load-side AC cables to the MIDC board.\n1. Check that the gray ethernet cable and connectors between the MIDC (J14) board and MIO (J1) board is connected and terminated properly.\n1. Check that PVS MIDC CAN (J13) connector board cable is in place\n1. Check that the gray cable between the Aux port on the inverter and the J16 port on the MIDC board is correctly connected and terminated.\n1. Attempt commissioning again.\n\nIf the problem persists, this may be a sign that the MIDC board is damaged. Please contact SunPower.'
  },
  {
    event_code: '30001',
    event_name: 'component_check_no_mio_critical',
    code: '30001',
    in_use: true,
    display: true,
    error_description: 'No MIO',
    possible_causes:
      'The PVS cannot connect with the MIO board. The MIO board is a hub for data connections to the batteries, inverter, and gateway, so if you’re seeing this error, it is likely you’re also seeing other errors such as missing batteries or inverters.\n\nThis problem may be due to one of the following causes:\n1. Faulty data connection between the Hub+ and the MIO board.\n1. MIO lost power.\n1. Faulty data connection with another MIO board (applicable to Power Expansion packs only)',
    recommended_actions:
      'Please try the following steps:\n1. Check that the MIO board is powered: one LED should be blinking and the other one should be solid.\n1.  Check that the gray ethernet cable from the J1 port on the MIO board is connected to the J14 port on the MIDC. Check that the cable is terminated correctly. \n1. Check that the 48V DC connection on the MIO board is connected to the DC terminals on the inverter and properly grounded and terminated.\n1. If this install involves one or more power expansion packs (above 26kWh or 6.8kW), please check that the MIO board is connected to the adjacent MIO by checking that the purple J2 cable is correctly connected and terminated.\n1. Attempt commissioning again.\n\nIf the problem persists, this may be a sign that the MIO board is damaged. Please contact SunPower.'
  },
  {
    event_code: '30002',
    event_name: 'component_check_no_gw_critical',
    code: '30002',
    in_use: true,
    display: true,
    error_description: 'No Gateway',
    possible_causes:
      'The Schneider Gateway connects the inverter with PVS and batteries. If you’re seeing this error it is likely you’re also seeing other errors such as batteries  or inverter(s) missing.\n\nThis problem may be due to the following causes:\n1. Gateway lost power.\n1. The ethernet connector between the gateway and PVS is not connected or terminated correctly.',
    recommended_actions:
      '1. Check that the gateway has power: the LEDs should be blinking.\n1. Check that the green cable and its orange, orange/white, green, blue and blue/white conductors in the metal ferules on the gateway side are properly connected to the J4 port on the MIO board.\n1. Check the black ethernet cable is connected to the black ethernet port on the PVS. Check also that the cable is correctly terminated.\n1. Check that the cable mentioned in 3 is connected to the port labeled as ‘ethernet’ on the Schneider gateway.\n1. Attempt commissioning again\n\nIf the problem persists, this may be a sign that the Schneider Gateway is damaged. Please contact SunPower.'
  },
  {
    event_code: '30003',
    event_name: 'component_check_no_inverter_critical',
    code: '30003',
    in_use: true,
    display: true,
    error_description: 'No Inverter',
    possible_causes:
      'The PVS cannot connect to the Schneider inverter. If you’re also seeing an error that indicates that the gateway is missing, this error may be due to the fact that the gateway is not properly connected. ',
    recommended_actions:
      'Please try the following steps:\n1. If you’re also seeing a ‘missing gateway’ error, please try to fix that problem first following the instructions in the error message.\n1. Check that the yellow XANBUS connector between the Schneider gateway and the inverter is correctly terminated and connected to the port labeled as XANBUS in he inverter (underneath the inverter, to the right of the SYNC port left of BTS port and AUX ports).\n1. Check that the RPO cable in the inverter (port labeled as BTS) is connected to the J5 (red) termination in the MIO board.\n1. Check that any of LEDs on inverter are On. \n1. Check that the DC conductors have at least 48V between terminations.\n1. Ensure that the DC terminations are done correctly\n1. Ensure that the DC breakers are closed.\n1. Ensure that the batteries are on. If not, press the ON button on the batteries.\n1. Check that the gray AUX connector from the inverter is connected to the J16 termination on the MIDC board.\n1. Attempt commissioning again.\n\nIf the problem persists, this may be a sign that the inverter is damaged. Please contact SunPower.'
  },
  {
    event_code: '30004',
    event_name: 'component_check_no_bms_critical',
    code: '30004',
    in_use: true,
    display: true,
    error_description: 'No BMS',
    possible_causes:
      'The PVS cannot connect with the batteries. This could be due because there are other connections missing. If you’re also seeing a missing gateway error, missing MIDC or missing MIO board, this ’No BMS’ error is likely due to any of these errors and you should try to fix them before you attempt to fix this.\n\nThis problem may be due to the following causes:\n1. Gateway is not connected. If this is the case, you’ll also be seeing a ‘No gateway’ error and you should attempt fixing the problem first.\n1. CAN bus connection (green) between the MIO board (J4) and Schneider gateway is not properly made.\n1. The CAN bus connection on the Gateway side is not properly made or terminated (white-orange, orange, white-green, white-blue, and blue conductors).\n1. The CAN cable between J4 port on MIO and gateway is cut off.\n1. Connection between the batteries (orange) and the MIO board is not properly made\n1. Batteries are not powered on.',
    recommended_actions:
      'Please try the following steps\n1. If you’re also seeing a ‘missing gateway’ error, please try to fix that problem first following the instructions in the error message.\n1. Check that the CAN bus connection on the Gateway side is not properly made or terminated (white-orange, orange, white-green, white-blue, and blue conductors).\n1. Check that the orange cable between the master battery and the MIO board is properly connected and terminated.\n1. Check that the batteries are powered on (check status of LEDs around the power button on the side of the batteries).\n1. Check that the DC breakers are on the closed position.\n1. Attempt commissioning again.\n\nIf the problem persists, this may be a sign that one or more batteries are damaged. Please contact SunPower.'
  },
  {
    event_code: '30007',
    event_name: 'component_check_too_few_batteries_critical',
    code: '30007',
    in_use: true,
    display: true,
    error_description: 'Cannot find one or more batteries',
    possible_causes:
      'This problem may be due to the following causes:\n1. One or more batteries data cables are disconnected from the master battery.\n1. One or more batteries are off\n1. One or more batteries are not electrically connected',
    recommended_actions:
      'Please try the following steps\n1. Check that the gray connection between master and secondary batteries is properly connected and terminated between the master (Com2) port and the secondary (Com2) batteries.\n1. Check that the batteries are on by checking the ON/OFF button position\n1. Check that the DC breakers are in the closed position\n1. Check that the battery DC power connections to the XW pro inverter are in place and correctly terminated.\n1. Attempt commissioning again\n\nIf the problem persists, this may be a sign that one or more batteries are damaged. Please contact SunPower.'
  },
  {
    event_code: '30008',
    event_name: 'component_check_too_many_batteries_critical',
    code: '30008',
    in_use: true,
    display: true,
    error_description: 'Cannot find one or more inverters.',
    possible_causes:
      'The PVS cannot connect to the Schneider inverter. If you’re also seeing an error that indicates that the gateway is missing, this error may be due to the fact that the gateway is not properly connected. ',
    recommended_actions:
      'Please try the following steps:\n1. If you’re also seeing a ‘missing gateway’ error, please try to fix that problem first following the instructions in the error message.\n1. Check that the yellow XANBUS connector between the Schneider gateway and the inverter is correctly terminated and connected to the port labeled as XANBUS in he inverter (underneath the inverter, to the right of the SYNC port left of BTS port and AUX ports).\n1. Check that the RPO cable in the inverter (port labeled as BTS) is connected to the J5 (red) termination in the MIO board.\n1. Check that any of LEDs on inverter are On. \n1. Check that the DC conductors have at least 48V between terminations.\n1. Ensure that the DC terminations are done correctly\n1. Ensure that the DC breakers are closed.\n1. Ensure that the batteries are on. If not, press the ON button on the batteries.\n1. Check that the gray AUX connector from the inverter is connected to the J16 termination on the MIDC board.\n1. Attempt commissioning again.\n\nIf the problem persists, this may be a sign that the inverter is damaged. Please contact SunPower.'
  },
  {
    event_code: '30015',
    event_name: 'mapping_inverter_no_batteries_critical',
    code: '30015',
    in_use: true,
    display: true,
    error_description: 'Could not find batteries',
    possible_causes:
      'The PVS cannot connect with the batteries. This could be due because there are other connections missing. If you’re also seeing a missing gateway error, missing MIDC or missing MIO board, this ’No BMS’ error is likely due to any of these errors and you should try to fix them before you attempt to fix this.\n\nThis problem may be due to the following causes:\n1. Gateway is not connected. If this is the case, you’ll also be seeing a ‘No gateway’ error and you should attempt fixing the problem first.\n1. CAN bus connection (green) between the MIO board (J4) and Schneider gateway is not properly made.\n1. The CAN bus connection on the Gateway side is not properly made or terminated (white-orange, orange, white-green, white-blue, and blue conductors).\n1. The CAN cable between J4 port on MIO and gateway is cut off.\n1. Connection between the batteries (orange) and the MIO board is not properly made\n1. Batteries are not powered on.',
    recommended_actions:
      'Please try the following steps\n1. If you’re also seeing a ‘missing gateway’ error, please try to fix that problem first following the instructions in the error message.\n1. Check that the CAN bus connection on the Gateway side is not properly made or terminated (white-orange, orange, white-green, white-blue, and blue conductors).\n1. Check that the orange cable between the master battery and the MIO board is properly connected and terminated.\n1. Check that the batteries are powered on (check status of LEDs around the power button on the side of the batteries).\n1. Check that the DC breakers are on the closed position.\n1. Attempt commissioning again.\n\nIf the problem persists, this may be a sign that one or more batteries are damaged. Please contact SunPower.'
  },
  {
    event_code: '30017',
    event_name: 'mapping_batteries_no_inverter_critical',
    code: '30017',
    in_use: true,
    display: true,
    error_description: 'Cannot find one or more inverters.',
    possible_causes:
      'The PVS cannot connect to the Schneider inverter. If you’re also seeing an error that indicates that the gateway is missing, this error may be due to the fact that the gateway is not properly connected. ',
    recommended_actions:
      'Please try the following steps:\n1. If you’re also seeing a ‘missing gateway’ error, please try to fix that problem first following the instructions in the error message.\n1. Check that the yellow XANBUS connector between the Schneider gateway and the inverter is correctly terminated and connected to the port labeled as XANBUS in he inverter (underneath the inverter, to the right of the SYNC port left of BTS port and AUX ports).\n1. Check that the RPO cable in the inverter (port labeled as BTS) is connected to the J5 (red) termination in the MIO board.\n1. Check that any of LEDs on inverter are On. \n1. Check that the DC conductors have at least 48V between terminations.\n1. Ensure that the DC terminations are done correctly\n1. Ensure that the DC breakers are closed.\n1. Ensure that the batteries are on. If not, press the ON button on the batteries.\n1. Check that the gray AUX connector from the inverter is connected to the J16 termination on the MIDC board.\n1. Attempt commissioning again.\n\nIf the problem persists, this may be a sign that the inverter is damaged. Please contact SunPower.'
  },
  {
    event_code: '30018',
    event_name: 'mapping_inverter_too_many_batteries_critical',
    code: '30018',
    in_use: true,
    display: true,
    error_description: 'Cannot find one or more inverters.',
    possible_causes:
      'The PVS cannot connect to the Schneider inverter. If you’re also seeing an error that indicates that the gateway is missing, this error may be due to the fact that the gateway is not properly connected. ',
    recommended_actions:
      'Please try the following steps:\n1. If you’re also seeing a ‘missing gateway’ error, please try to fix that problem first following the instructions in the error message.\n1. Check that the yellow XANBUS connector between the Schneider gateway and the inverter is correctly terminated and connected to the port labeled as XANBUS in he inverter (underneath the inverter, to the right of the SYNC port left of BTS port and AUX ports).\n1. Check that the RPO cable in the inverter (port labeled as BTS) is connected to the J5 (red) termination in the MIO board.\n1. Check that any of LEDs on inverter are On. \n1. Check that the DC conductors have at least 48V between terminations.\n1. Ensure that the DC terminations are done correctly\n1. Ensure that the DC breakers are closed.\n1. Ensure that the batteries are on. If not, press the ON button on the batteries.\n1. Check that the gray AUX connector from the inverter is connected to the J16 termination on the MIDC board.\n1. Attempt commissioning again.\n\nIf the problem persists, this may be a sign that the inverter is damaged. Please contact SunPower.'
  },
  {
    event_code: '30019',
    event_name: 'mapping_battery_more_than_one_inverter_critical',
    code: '30019',
    in_use: true,
    display: true,
    error_description: 'Cannot find one or more batteries',
    possible_causes:
      'This problem may be due to the following causes:\n1. One or more batteries data cables are disconnected from the master battery.\n1. One or more batteries are off\n1. One or more batteries are not electrically connected',
    recommended_actions:
      'Please try the following steps\n1. Check that the gray connection between master and secondary batteries is properly connected and terminated between the master (Com2) port and the secondary (Com2) batteries.\n1. Check that the batteries are on by checking the ON/OFF button position\n1. Check that the DC breakers are in the closed position\n1. Check that the battery DC power connections to the XW pro inverter are in place and correctly terminated.\n1. Attempt commissioning again\n\nIf the problem persists, this may be a sign that one or more batteries are damaged. Please contact SunPower.'
  },
  {
    event_code: '30021',
    event_name: 'mapping_inverter_no_mio_critical',
    code: '30021',
    in_use: true,
    display: true,
    error_description: 'No MIO',
    possible_causes:
      'The PVS cannot connect with the MIO board. The MIO board is a hub for data connections to the batteries, inverter, and gateway, so if you’re seeing this error, it is likely you’re also seeing other errors such as missing batteries or inverters.\n\nThis problem may be due to one of the following causes:\n1. Faulty data connection between the Hub+ and the MIO board.\n1. MIO lost power.\n1. Faulty data connection with another MIO board (applicable to Power Expansion packs only)',
    recommended_actions:
      'Please try the following steps:\n1. Check that the MIO board is powered: one LED should be blinking and the other one should be solid.\n1.  Check that the gray ethernet cable from the J1 port on the MIO board is connected to the J14 port on the MIDC. Check that the cable is terminated correctly. \n1. Check that the 48V DC connection on the MIO board is connected to the DC terminals on the inverter and properly grounded and terminated.\n1. If this install involves one or more power expansion packs (above 26kWh or 6.8kW), please check that the MIO board is connected to the adjacent MIO by checking that the purple J2 cable is correctly connected and terminated.\n1. Attempt commissioning again.\n\nIf the problem persists, this may be a sign that the MIO board is damaged. Please contact SunPower.'
  },
  {
    event_code: '30023',
    event_name: 'mapping_mio_more_than_one_inverter_critical',
    code: '30023',
    in_use: true,
    display: true,
    error_description: 'No MIO',
    possible_causes:
      'The PVS cannot connect with the MIO board. The MIO board is a hub for data connections to the batteries, inverter, and gateway, so if you’re seeing this error, it is likely you’re also seeing other errors such as missing batteries or inverters.\n\nThis problem may be due to one of the following causes:\n1. Faulty data connection between the Hub+ and the MIO board.\n1. MIO lost power.\n1. Faulty data connection with another MIO board (applicable to Power Expansion packs only)',
    recommended_actions:
      'Please try the following steps:\n1. Check that the MIO board is powered: one LED should be blinking and the other one should be solid.\n1.  Check that the gray ethernet cable from the J1 port on the MIO board is connected to the J14 port on the MIDC. Check that the cable is terminated correctly. \n1. Check that the 48V DC connection on the MIO board is connected to the DC terminals on the inverter and properly grounded and terminated.\n1. If this install involves one or more power expansion packs (above 26kWh or 6.8kW), please check that the MIO board is connected to the adjacent MIO by checking that the purple J2 cable is correctly connected and terminated.\n1. Attempt commissioning again.\n\nIf the problem persists, this may be a sign that the MIO board is damaged. Please contact SunPower.'
  },
  {
    event_code: '30025',
    event_name: 'mapping_inverter_no_bms_critical',
    code: '30025',
    in_use: true,
    display: true,
    error_description: 'No BMS',
    possible_causes:
      'The PVS cannot connect with the batteries. This could be due because there are other connections missing. If you’re also seeing a missing gateway error, missing MIDC or missing MIO board, this ’No BMS’ error is likely due to any of these errors and you should try to fix them before you attempt to fix this.\n\nThis problem may be due to the following causes:\n1. Gateway is not connected. If this is the case, you’ll also be seeing a ‘No gateway’ error and you should attempt fixing the problem first.\n1. CAN bus connection (green) between the MIO board (J4) and Schneider gateway is not properly made.\n1. The CAN bus connection on the Gateway side is not properly made or terminated (white-orange, orange, white-green, white-blue, and blue conductors).\n1. The CAN cable between J4 port on MIO and gateway is cut off.\n1. Connection between the batteries (orange) and the MIO board is not properly made\n1. Batteries are not powered on.',
    recommended_actions:
      'Please try the following steps\n1. If you’re also seeing a ‘missing gateway’ error, please try to fix that problem first following the instructions in the error message.\n1. Check that the CAN bus connection on the Gateway side is not properly made or terminated (white-orange, orange, white-green, white-blue, and blue conductors).\n1. Check that the orange cable between the master battery and the MIO board is properly connected and terminated.\n1. Check that the batteries are powered on (check status of LEDs around the power button on the side of the batteries).\n1. Check that the DC breakers are on the closed position.\n1. Attempt commissioning again.\n\nIf the problem persists, this may be a sign that one or more batteries are damaged. Please contact SunPower.'
  },
  {
    event_code: '30028',
    event_name: 'mapping_no_inverter_critical',
    code: '30028',
    in_use: true,
    display: true,
    error_description: 'No Inverter',
    possible_causes:
      'The PVS cannot connect to the Schneider inverter. If you’re also seeing an error that indicates that the gateway is missing, this error may be due to the fact that the gateway is not properly connected. ',
    recommended_actions:
      'Please try the following steps:\n1. If you’re also seeing a ‘missing gateway’ error, please try to fix that problem first following the instructions in the error message.\n1. Check that the yellow XANBUS connector between the Schneider gateway and the inverter is correctly terminated and connected to the port labeled as XANBUS in he inverter (underneath the inverter, to the right of the SYNC port left of BTS port and AUX ports).\n1. Check that the RPO cable in the inverter (port labeled as BTS) is connected to the J5 (red) termination in the MIO board.\n1. Check that any of LEDs on inverter are On. \n1. Check that the DC conductors have at least 48V between terminations.\n1. Ensure that the DC terminations are done correctly\n1. Ensure that the DC breakers are closed.\n1. Ensure that the batteries are on. If not, press the ON button on the batteries.\n1. Check that the gray AUX connector from the inverter is connected to the J16 termination on the MIDC board.\n1. Attempt commissioning again.\n\nIf the problem persists, this may be a sign that the inverter is damaged. Please contact SunPower.'
  },
  {
    event_code: '30400',
    event_name: 'health_check_missing_ess_component_map_critical',
    code: '30400',
    in_use: true,
    display: true,
    error_description: 'Could not retrieve component map',
    possible_causes: 'There was an error generating the component map',
    recommended_actions: 'Please attempt commissioning again.'
  },
  {
    event_code: '30401',
    event_name: 'health_check_invalid_ess_component_map_critical',
    code: '30401',
    in_use: true,
    display: true,
    error_description: 'Invalid component map',
    possible_causes: 'There was an error generating the component map',
    recommended_actions: 'Please attempt commissioning again.'
  },
  {
    event_code: '30402',
    event_name: 'health_check_missing_ess_critical',
    code: '30402',
    in_use: true,
    display: true,
    error_description: 'Could not find all-in one',
    possible_causes:
      'The PVS cannot connect with the MIO board. The MIO board is a hub for data connections to the batteries, inverter, and gateway, so if you’re seeing this error, it is likely you’re also seeing other errors such as missing batteries or inverters.\n\nThis problem may be due to one of the following causes:\n1. Faulty data connection between the Hub+ and the MIO board.\n1. MIO lost power.\n1. Faulty data connection with another MIO board (applicable to Power Expansion packs only)',
    recommended_actions:
      'Please try the following steps:\n1. Check that the MIO board is powered: one LED should be blinking and the other one should be solid.\n1.  Check that the gray ethernet cable from the J1 port on the MIO board is connected to the J14 port on the MIDC. Check that the cable is terminated correctly. \n1. Check that the 48V DC connection on the MIO board is connected to the DC terminals on the inverter and properly grounded and terminated.\n1. If this install involves one or more power expansion packs (above 26kWh or 6.8kW), please check that the MIO board is connected to the adjacent MIO by checking that the purple J2 cable is correctly connected and terminated.\n1. Attempt commissioning again.\n\nIf the problem persists, this may be a sign that the MIO board is damaged. Please contact SunPower.'
  },
  {
    event_code: '30403',
    event_name: 'health_check_too_few_batteries_critical',
    code: '30403',
    in_use: true,
    display: true,
    error_description: 'Cannot find one or more batteries',
    possible_causes:
      'This problem may be due to the following causes:\n1. One or more batteries data cables are disconnected from the master battery.\n1. One or more batteries are off\n1. One or more batteries are not electrically connected',
    recommended_actions:
      'Please try the following steps\n1. Check that the gray connection between master and secondary batteries is properly connected and terminated between the master (Com2) port and the secondary (Com2) batteries.\n1. Check that the batteries are on by checking the ON/OFF button position\n1. Check that the DC breakers are in the closed position\n1. Check that the battery DC power connections to the XW pro inverter are in place and correctly terminated.\n1. Attempt commissioning again\n\nIf the problem persists, this may be a sign that one or more batteries are damaged. Please contact SunPower.'
  },
  {
    event_code: '30404',
    event_name: 'health_check_too_few_inverter_critical',
    code: '30404',
    in_use: true,
    display: true,
    error_description: 'Cannot find one or more inverters.',
    possible_causes:
      'The PVS cannot connect to the Schneider inverter. If you’re also seeing an error that indicates that the gateway is missing, this error may be due to the fact that the gateway is not properly connected. ',
    recommended_actions:
      'Please try the following steps:\n1. If you’re also seeing a ‘missing gateway’ error, please try to fix that problem first following the instructions in the error message.\n1. Check that the yellow XANBUS connector between the Schneider gateway and the inverter is correctly terminated and connected to the port labeled as XANBUS in he inverter (underneath the inverter, to the right of the SYNC port left of BTS port and AUX ports).\n1. Check that the RPO cable in the inverter (port labeled as BTS) is connected to the J5 (red) termination in the MIO board.\n1. Check that any of LEDs on inverter are On. \n1. Check that the DC conductors have at least 48V between terminations.\n1. Ensure that the DC terminations are done correctly\n1. Ensure that the DC breakers are closed.\n1. Ensure that the batteries are on. If not, press the ON button on the batteries.\n1. Check that the gray AUX connector from the inverter is connected to the J16 termination on the MIDC board.\n1. Attempt commissioning again.\n\nIf the problem persists, this may be a sign that the inverter is damaged. Please contact SunPower.'
  },
  {
    event_code: '30406',
    event_name: 'health_check_too_few_bms_critical',
    code: '30406',
    in_use: true,
    display: true,
    error_description: 'Too few BMS',
    possible_causes: 'N/A',
    recommended_actions: 'N/A'
  },
  {
    event_code: '30407',
    event_name: 'health_check_too_many_batteries_critical',
    code: '30407',
    in_use: true,
    display: true,
    error_description: 'Cannot find one or more inverters.',
    possible_causes:
      'The PVS cannot connect to the Schneider inverter. If you’re also seeing an error that indicates that the gateway is missing, this error may be due to the fact that the gateway is not properly connected. ',
    recommended_actions:
      'Please try the following steps:\n1. If you’re also seeing a ‘missing gateway’ error, please try to fix that problem first following the instructions in the error message.\n1. Check that the yellow XANBUS connector between the Schneider gateway and the inverter is correctly terminated and connected to the port labeled as XANBUS in he inverter (underneath the inverter, to the right of the SYNC port left of BTS port and AUX ports).\n1. Check that the RPO cable in the inverter (port labeled as BTS) is connected to the J5 (red) termination in the MIO board.\n1. Check that any of LEDs on inverter are On. \n1. Check that the DC conductors have at least 48V between terminations.\n1. Ensure that the DC terminations are done correctly\n1. Ensure that the DC breakers are closed.\n1. Ensure that the batteries are on. If not, press the ON button on the batteries.\n1. Check that the gray AUX connector from the inverter is connected to the J16 termination on the MIDC board.\n1. Attempt commissioning again.\n\nIf the problem persists, this may be a sign that the inverter is damaged. Please contact SunPower.'
  },
  {
    event_code: '30408',
    event_name: 'health_check_too_many_inverter_critical',
    code: '30408',
    in_use: true,
    display: true,
    error_description: 'Cannot find one or more batteries',
    possible_causes:
      'This problem may be due to the following causes:\n1. One or more batteries data cables are disconnected from the master battery.\n1. One or more batteries are off\n1. One or more batteries are not electrically connected',
    recommended_actions:
      'Please try the following steps\n1. Check that the gray connection between master and secondary batteries is properly connected and terminated between the master (Com2) port and the secondary (Com2) batteries.\n1. Check that the batteries are on by checking the ON/OFF button position\n1. Check that the DC breakers are in the closed position\n1. Check that the battery DC power connections to the XW pro inverter are in place and correctly terminated.\n1. Attempt commissioning again\n\nIf the problem persists, this may be a sign that one or more batteries are damaged. Please contact SunPower.'
  },
  {
    event_code: '30409',
    event_name: 'health_check_too_many_mio_critical',
    code: '30409',
    in_use: true,
    display: true,
    error_description: 'Too many MIO',
    possible_causes: 'N/A',
    recommended_actions: 'N/A'
  },
  {
    event_code: '30410',
    event_name: 'health_check_too_many_bms_critical',
    code: '30410',
    in_use: true,
    display: true,
    error_description: 'Too many BMS',
    possible_causes: 'N/A',
    recommended_actions: 'N/A'
  },
  {
    event_code: '30411',
    event_name: 'health_check_unassigned_battery_critical',
    code: '30411',
    in_use: true,
    display: true,
    error_description: 'Unassigned battery',
    possible_causes: 'There was an error generating the component map',
    recommended_actions: 'Please attempt commissioning again.'
  },
  {
    event_code: '30412',
    event_name: 'health_check_unassigned_inverter_critical',
    code: '30412',
    in_use: true,
    display: true,
    error_description: 'Unassigned inverter',
    possible_causes: 'There was an error generating the component map',
    recommended_actions: 'Please attempt commissioning again.'
  },
  {
    event_code: '30413',
    event_name: 'health_check_unassigned_mio_critical',
    code: '30413',
    in_use: true,
    display: true,
    error_description: 'Unassigned MIO',
    possible_causes: 'There was an error generating the component map',
    recommended_actions: 'Please attempt commissioning again.'
  },
  {
    event_code: '30414',
    event_name: 'health_check_unassigned_bms_critical',
    code: '30414',
    in_use: true,
    display: true,
    error_description: 'Unassigned BMS',
    possible_causes: 'There was an error generating the component map',
    recommended_actions: 'Please attempt commissioning again.'
  },
  {
    event_code: '31000',
    event_name: 'contactor_position_unknown_critical',
    code: '31000',
    in_use: true,
    display: true,
    error_description: 'Transfer switch contactor position unknown',
    possible_causes:
      'The connection between PVS and MIDC board has been lost.\n\nMIDC board can no longer control the transfer switch.',
    recommended_actions:
      'Check MIDC LEDs\n\nCheck MID cables for damage\n\nCheck for damage between PVS and MIDC communications cables.\n\nIf problem persists, you may need to replace the MID and/or MIDC.'
  },
  {
    event_code: '31003',
    event_name: 'contactor_stuck_open_critical',
    code: '31003',
    in_use: true,
    display: true,
    error_description: 'Transfer switch contactor stuck open ',
    possible_causes:
      'A fault with the MIDC board or with the transfer switch has occurred.',
    recommended_actions: 'Replace transfer switch or MIDC board.'
  },
  {
    event_code: '31004',
    event_name: 'contactor_stuck_closed_critical',
    code: '31004',
    in_use: true,
    display: true,
    error_description: 'Transfer switch contactor stuck closed',
    possible_causes:
      'A fault with the MIDC board or with the transfer switch has occurred.',
    recommended_actions: 'Replace transfer switch or MIDC board.'
  },
  {
    event_code: '31005',
    event_name: 'contactor_mismatched_open_critical',
    code: '31005',
    in_use: true,
    display: true,
    error_description: 'Contactor mismatched open',
    possible_causes:
      'Aux feedback and voltage sense does not match. A fault with the MIDC board or with the transfer switch has occurred.',
    recommended_actions: 'Replace transfer switch or MIDC board.'
  },
  {
    event_code: '31006',
    event_name: 'contactor_mismatched_closed_critical',
    code: '31006',
    in_use: true,
    display: true,
    error_description: 'Contactor mismatched closed',
    possible_causes:
      'Aux feedback and voltage sense does not match. A fault with the MIDC board or with the transfer switch has occurred.',
    recommended_actions: 'Replace transfer switch or MIDC board.'
  },
  {
    event_code: '31007',
    event_name: 'contactor_mismatched_stuck_open_critical',
    code: '31007',
    in_use: true,
    display: true,
    error_description: 'Contactor mismatched and stuck open',
    possible_causes:
      'Aux feedback and voltage sense does not match. A fault with the MIDC board or with the transfer switch has occurred.',
    recommended_actions: 'Replace transfer switch or MIDC board.'
  },
  {
    event_code: '31008',
    event_name: 'contactor_mismatched_stuck_closed_critical',
    code: '31008',
    in_use: true,
    display: true,
    error_description: 'Contactor mismatched and stuck closed',
    possible_causes:
      'Aux feedback and voltage sense does not match. A fault with the MIDC board or with the transfer switch has occurred.',
    recommended_actions: 'Replace transfer switch or MIDC board.'
  },
  {
    event_code: '31009',
    event_name: 'contactor_error_unknown_critical',
    code: '31009',
    in_use: true,
    display: true,
    error_description: 'Contactor error unknown',
    possible_causes: 'Unknown',
    recommended_actions: 'Unknown'
  },
  {
    event_code: '31011',
    event_name: 'hubplus_over_temperature_critical',
    code: '31011',
    in_use: true,
    display: true,
    error_description: 'ESS temperature too high',
    possible_causes:
      'The ESS enclosure may be located in an overly hot location.\n\nESS enclosure fans may be blocked or faulty. ',
    recommended_actions:
      'Ensure that ESS is not near a heat source. \n\nEnsure that ESS fans are not blocked.\n\nCheck that the inverter air filter is unblocked and clean.\n\nCheck that the ESS enclosure door is properly locked.'
  },
  {
    event_code: '31014',
    event_name: 'rapid_shutdown_disconnected_critical',
    code: '31014',
    in_use: true,
    display: true,
    error_description: 'Rapid shutdown disconnected',
    possible_causes: 'TBD',
    recommended_actions: 'TBD'
  },
  {
    event_code: '31025',
    event_name: 'hubplus_communication_outage_critical',
    code: '31025',
    in_use: true,
    display: true,
    error_description: 'Cannot communicate with Hub+',
    possible_causes: 'TBD',
    recommended_actions: 'TBD'
  },
  {
    event_code: '31029',
    event_name: 'hubplus_fw_error_inval_critical',
    code: '31029',
    in_use: true,
    display: true,
    error_description: 'MIDC firmware error',
    possible_causes: 'Firmware in MIDC board may be corrupted',
    recommended_actions:
      'Update MIDC firmware\n\nRestart device\n\nIf the problem persists, replace MIDC.'
  },
  {
    event_code: '31030',
    event_name: 'hubplus_fw_error_spi_bsy_critical',
    code: '31030',
    in_use: true,
    display: true,
    error_description: 'MIDC firmware error',
    possible_causes: 'Firmware in MIDC board may be corrupted',
    recommended_actions:
      'Update MIDC firmware\n\nRestart device\n\nIf the problem persists, replace MIDC.'
  },
  {
    event_code: '31031',
    event_name: 'hubplus_fw_error_spi_inval_cs_critical',
    code: '31031',
    in_use: true,
    display: true,
    error_description: 'MIDC firmware error',
    possible_causes: 'Firmware in MIDC board may be corrupted',
    recommended_actions:
      'Update MIDC firmware\n\nRestart device\n\nIf the problem persists, replace MIDC.'
  },
  {
    event_code: '31032',
    event_name: 'hubplus_fw_error_spi_critical',
    code: '31032',
    in_use: true,
    display: true,
    error_description: 'MIDC firmware error',
    possible_causes: 'Firmware in MIDC board may be corrupted',
    recommended_actions:
      'Update MIDC firmware\n\nRestart device\n\nIf the problem persists, replace MIDC.'
  },
  {
    event_code: '31033',
    event_name: 'hubplus_fw_error_flash_w_key_critical',
    code: '31033',
    in_use: true,
    display: true,
    error_description: 'MIDC firmware error',
    possible_causes: 'Firmware in MIDC board may be corrupted',
    recommended_actions:
      'Update MIDC firmware\n\nRestart device\n\nIf the problem persists, replace MIDC.'
  },
  {
    event_code: '31034',
    event_name: 'hubplus_fw_error_flash_r_critical',
    code: '31034',
    in_use: true,
    display: true,
    error_description: 'MIDC firmware error',
    possible_causes: 'Firmware in MIDC board may be corrupted',
    recommended_actions:
      'Update MIDC firmware\n\nRestart device\n\nIf the problem persists, replace MIDC.'
  },
  {
    event_code: '31035',
    event_name: 'hubplus_fw_error_flash_crc_critical',
    code: '31035',
    in_use: true,
    display: true,
    error_description: 'MIDC firmware error',
    possible_causes: 'Firmware in MIDC board may be corrupted',
    recommended_actions:
      'Update MIDC firmware\n\nRestart device\n\nIf the problem persists, replace MIDC.'
  },
  {
    event_code: '31036',
    event_name: 'hubplus_fw_error_flash_w_critical',
    code: '31036',
    in_use: true,
    display: true,
    error_description: 'MIDC firmware error',
    possible_causes: 'Firmware in MIDC board may be corrupted',
    recommended_actions:
      'Update MIDC firmware\n\nRestart device\n\nIf the problem persists, replace MIDC.'
  },
  {
    event_code: '31037',
    event_name: 'hubplus_fw_error_eeprom_critical',
    code: '31037',
    in_use: true,
    display: true,
    error_description: 'MIDC firmware error',
    possible_causes: 'Firmware in MIDC board may be corrupted',
    recommended_actions:
      'Update MIDC firmware\n\nRestart device\n\nIf the problem persists, replace MIDC.'
  },
  {
    event_code: '31038',
    event_name: 'hubplus_fw_error_eeprom_r_critical',
    code: '31038',
    in_use: true,
    display: true,
    error_description: 'MIDC firmware error',
    possible_causes: 'Firmware in MIDC board may be corrupted',
    recommended_actions:
      'Update MIDC firmware\n\nRestart device\n\nIf the problem persists, replace MIDC.'
  },
  {
    event_code: '31039',
    event_name: 'hubplus_fw_error_eeprom_w_critical',
    code: '31039',
    in_use: true,
    display: true,
    error_description: 'MIDC firmware error',
    possible_causes: 'Firmware in MIDC board may be corrupted',
    recommended_actions:
      'Update MIDC firmware\n\nRestart device\n\nIf the problem persists, replace MIDC.'
  },
  {
    event_code: '31040',
    event_name: 'hubplus_fw_error_led_drv_critical',
    code: '31040',
    in_use: true,
    display: true,
    error_description: 'MIDC firmware error',
    possible_causes: 'Firmware in MIDC board may be corrupted',
    recommended_actions:
      'Update MIDC firmware\n\nRestart device\n\nIf the problem persists, replace MIDC.'
  },
  {
    event_code: '31041',
    event_name: 'hubplus_fw_error_mbs_critical',
    code: '31041',
    in_use: true,
    display: true,
    error_description: 'MIDC firmware error',
    possible_causes: 'Firmware in MIDC board may be corrupted',
    recommended_actions:
      'Update MIDC firmware\n\nRestart device\n\nIf the problem persists, replace MIDC.'
  },
  {
    event_code: '31042',
    event_name: 'hubplus_fw_error_btldr_en_key_critical',
    code: '31042',
    in_use: true,
    display: true,
    error_description: 'MIDC firmware error',
    possible_causes: 'Firmware in MIDC board may be corrupted',
    recommended_actions:
      'Update MIDC firmware\n\nRestart device\n\nIf the problem persists, replace MIDC.'
  },
  {
    event_code: '31043',
    event_name: 'hubplus_fw_error_btldr_already_critical',
    code: '31043',
    in_use: true,
    display: true,
    error_description: 'MIDC firmware error',
    possible_causes: 'Firmware in MIDC board may be corrupted',
    recommended_actions:
      'Update MIDC firmware\n\nRestart device\n\nIf the problem persists, replace MIDC.'
  },
  {
    event_code: '31044',
    event_name: 'hubplus_fw_error_btldr_data_ready_critical',
    code: '31044',
    in_use: true,
    display: true,
    error_description: 'MIDC firmware error',
    possible_causes: 'Firmware in MIDC board may be corrupted',
    recommended_actions:
      'Update MIDC firmware\n\nRestart device\n\nIf the problem persists, replace MIDC.'
  },
  {
    event_code: '31045',
    event_name: 'hubplus_fw_error_btldr_rsp_ready_critical',
    code: '31045',
    in_use: true,
    display: true,
    error_description: 'MIDC firmware error',
    possible_causes: 'Firmware in MIDC board may be corrupted',
    recommended_actions:
      'Update MIDC firmware\n\nRestart device\n\nIf the problem persists, replace MIDC.'
  },
  {
    event_code: '31046',
    event_name: 'hubplus_fw_error_contactor_protect_critical',
    code: '31046',
    in_use: true,
    display: true,
    error_description: 'MIDC firmware error',
    possible_causes: 'Firmware in MIDC board may be corrupted',
    recommended_actions:
      'Update MIDC firmware\n\nRestart device\n\nIf the problem persists, replace MIDC.'
  },
  {
    event_code: '31047',
    event_name: 'hubplus_fw_error_unknown_critical',
    code: '31047',
    in_use: true,
    display: true,
    error_description: 'MIDC firmware error',
    possible_causes: 'Firmware in MIDC board may be corrupted',
    recommended_actions:
      'Update MIDC firmware\n\nRestart device\n\nIf the problem persists, replace MIDC.'
  },
  {
    event_code: '32001',
    event_name: 'storage_inv_over_temperature_critical',
    code: '32001',
    in_use: true,
    display: true,
    error_description: 'Storage inverter ove temperature',
    possible_causes:
      'The ESS enclosure may be located in an overly hot location.\n\nESS enclosure fans may be blocked or faulty. ',
    recommended_actions:
      'Ensure that ESS is not near a heat source. \n\nEnsure that ESS fans are not blocked.\n\nCheck that the inverter air filter is unblocked and clean.\n\nCheck that the ESS enclosure door is properly locked.'
  },
  {
    event_code: '32002',
    event_name: 'f1_ac_output_undervoltage_shutdown_critical',
    code: '32002',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32003',
    event_name: 'f2_ac_output_overvoltage_shutdown_critical',
    code: '32003',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32004',
    event_name: 'f17_ac1_l1_backfeed_fault_critical',
    code: '32004',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32005',
    event_name: 'f18_ac1_l2_backfeed_fault_critical',
    code: '32005',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32006',
    event_name: 'f19_ac2_l1_backfeed_fault_critical',
    code: '32006',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32007',
    event_name: 'f20_ac2_l2_backfeed_fault_critical',
    code: '32007',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32008',
    event_name: 'f21_ac_l1l2_backfeed_fault_critical',
    code: '32008',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32009',
    event_name: 'f22_ac_l1_weld_backfeed_fault_critical',
    code: '32009',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32010',
    event_name: 'f23_antiislanding_fault_over_freq_critical',
    code: '32010',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32011',
    event_name: 'f24_antiislanding_fault_under_freq_critical',
    code: '32011',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32012',
    event_name: 'f25_antiislanding_over_freq_critical',
    code: '32012',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32013',
    event_name: 'f26_antiislanding_under_freq_critical',
    code: '32013',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32014',
    event_name: 'f27_antiislanding_l1_over_voltage_critical',
    code: '32014',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32015',
    event_name: 'f28_antiislanding_l2_over_voltage_critical',
    code: '32015',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32016',
    event_name: 'f29_antiislanding_over_voltage_critical',
    code: '32016',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32017',
    event_name: 'f30_antiislanding_l1l2_over_voltage_critical',
    code: '32017',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32018',
    event_name: 'f31_antiislanding_l1_over_voltage_slow_critical',
    code: '32018',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32019',
    event_name: 'f32_antiislanding_l2_over_voltage_slow_critical',
    code: '32019',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32020',
    event_name: 'f33_antiislanding_l1l2_over_voltage_slow_critical',
    code: '32020',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32021',
    event_name: 'f34_antiislanding_l1_under_voltage_slow_critical',
    code: '32021',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32022',
    event_name: 'f35_antiislanding_l2_under_voltage_slow_critical',
    code: '32022',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32023',
    event_name: 'f36_antiislanding_l1l2_under_voltage_slow_critical',
    code: '32023',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32024',
    event_name: 'f37_antiislanding_l1_under_voltage_fast_critical',
    code: '32024',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32025',
    event_name: 'f38_antiislanding_l2_under_voltage_fast_critical',
    code: '32025',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32026',
    event_name: 'f39_antiislanding_under_voltage_fast_critical',
    code: '32026',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32027',
    event_name: 'f40_antiislanding_l1l2_under_voltage_fast_critical',
    code: '32027',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32028',
    event_name: 'f41_aps_under_voltage_critical',
    code: '32028',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32029',
    event_name: 'f42_aps_over_voltage_critical',
    code: '32029',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32030',
    event_name: 'f44_battery_over_temperature_critical',
    code: '32030',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32031',
    event_name: 'f45_capacitor_over_temperature_critical',
    code: '32031',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32032',
    event_name: 'f46_controller_error_critical',
    code: '32032',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32033',
    event_name: 'f47_dc_under_voltage_immediate_critical',
    code: '32033',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32034',
    event_name: 'f48_dc_under_voltage_shutdown_critical',
    code: '32034',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32035',
    event_name: 'f49_dc_over_voltage_shutdown_critical',
    code: '32035',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32036',
    event_name: 'f51_eeprom_error_critical',
    code: '32036',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32037',
    event_name: 'f52_eeprom_error_cal_fail_critical',
    code: '32037',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32038',
    event_name: 'f53_eeprom_error_config_fail_critical',
    code: '32038',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32039',
    event_name: 'f54_eeprom_error_default_fail_critical',
    code: '32039',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32040',
    event_name: 'f55_eeprom_error_log_fail_critical',
    code: '32040',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32041',
    event_name: 'f56_eeprom_error_strings_fail_critical',
    code: '32041',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32042',
    event_name: 'f57_fet1_over_temperature_shutdown_critical',
    code: '32042',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32043',
    event_name: 'f58_fet2_over_temperature_shutdown_critical',
    code: '32043',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32044',
    event_name: 'f59_configuration_copy_error_critical',
    code: '32044',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32045',
    event_name: 'f60_invalid_input_critical',
    code: '32045',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32046',
    event_name: 'f61_invalid_warning_critical',
    code: '32046',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32047',
    event_name: 'f62_invalid_interrupt_critical',
    code: '32047',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32048',
    event_name: 'f63_ac_overload_primary_critical',
    code: '32048',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32049',
    event_name: 'f64_ac_overload_secondary_1s_critical',
    code: '32049',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32050',
    event_name: 'f65_ac_overload_2s_critical',
    code: '32050',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32051',
    event_name: 'f66_system_configuration_error_critical',
    code: '32051',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32052',
    event_name: 'f67_watchdog_reset_critical',
    code: '32052',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32053',
    event_name: 'f68_transformer_over_temperature_critical',
    code: '32053',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32054',
    event_name: 'f69_synchronization_signal_fault_critical',
    code: '32054',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32055',
    event_name: 'f70_3_phase_configuration_fault_critical',
    code: '32055',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32056',
    event_name: 'f90_external_bms_disconnected_critical',
    code: '32056',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32057',
    event_name: 'f71_battery_discharge_over_current_critical',
    code: '32057',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32058',
    event_name: 'f72_external_contactor_malfunction_critical',
    code: '32058',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32059',
    event_name: 'f73_battery_charge_over_current_critical',
    code: '32059',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32060',
    event_name: 'f74_battery_under_voltage_critical',
    code: '32060',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32061',
    event_name: 'f75_battery_over_voltage_critical',
    code: '32061',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32062',
    event_name: 'f91_soc_level_lost_critical',
    code: '32062',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32063',
    event_name: 'f92_gateway_comms_lost_critical',
    code: '32063',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32064',
    event_name: 'f93_sunspec_controller_comms_lost_critical',
    code: '32064',
    in_use: true,
    display: true,
    error_description: 'Inverter fault',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '33000',
    event_name: 'battery_low_state_of_charge_critical',
    code: '33000',
    in_use: true,
    display: true,
    error_description: 'Battery has low state of charge',
    possible_causes:
      'Battery is typically charged from PV energy. Long periods of bad weather may have caused the battery to drain excessively. Inverter may be malfunctioning.',
    recommended_actions:
      'Try charging battery manually or from grid power. Check for inverter errors.'
  },
  {
    event_code: '33001',
    event_name: 'battery_low_state_of_health_critical',
    code: '33001',
    in_use: true,
    display: true,
    error_description: 'Battery has degraded (low state of health)',
    possible_causes:
      'Battery may have been exposed ot harsh environmental conditions or may have been used aggressively.',
    recommended_actions:
      'Check battery location: temperature and airflow into battery. Contact SunPower'
  },
  {
    event_code: '33002',
    event_name: 'battery_communication_outage_critical',
    code: '33002',
    in_use: true,
    display: true,
    error_description: 'Battery communication outage',
    possible_causes: 'PVS cannot reach the battery',
    recommended_actions:
      'Check Ethernet and CAN connections between battery gateway, PVS and MIO board.'
  },
  {
    event_code: '33003',
    event_name: 'battery_under_voltage_critical',
    code: '33003',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33004',
    event_name: 'battery_over_voltage_critical',
    code: '33004',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33005',
    event_name: 'battery_over_current_during_charge_critical',
    code: '33005',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33006',
    event_name: 'battery_over_power_during_charge_critical',
    code: '33006',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33007',
    event_name: 'battery_over_current_during_discharge_critical',
    code: '33007',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33008',
    event_name: 'battery_over_power_during_discharge_critical',
    code: '33008',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33009',
    event_name: 'battery_over_current_limit_during_charge_critical',
    code: '33009',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33010',
    event_name: 'battery_over_current_limit_during_discharge_critical',
    code: '33010',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33011',
    event_name: 'battery_under_temperature_during_charge_critical',
    code: '33011',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33012',
    event_name: 'battery_over_temperature_during_charge_critical',
    code: '33012',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33013',
    event_name: 'battery_under_temperature_during_discharge_critical',
    code: '33013',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33014',
    event_name: 'battery_over_temperature_during_discharge_critical',
    code: '33014',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33015',
    event_name: 'battery_cell_delta_voltage_too_high_critical',
    code: '33015',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33016',
    event_name: 'battery_cell_temperature_diff_too_high_critical',
    code: '33016',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33020',
    event_name: 'battery_hardware_under_voltage_critical',
    code: '33020',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33021',
    event_name: 'battery_hardware_over_voltage_critical',
    code: '33021',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33022',
    event_name: 'battery_hardware_over_current_critical',
    code: '33022',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33023',
    event_name: 'battery_hardware_over_temperature_critical',
    code: '33023',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33024',
    event_name: 'battery_adc_module_fault_critical',
    code: '33024',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33025',
    event_name: 'battery_afe_mcu_comm_error_critical',
    code: '33025',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33026',
    event_name: 'battery_pre_charge_failure_critical',
    code: '33026',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33027',
    event_name: 'battery_contactor_welded_critical',
    code: '33027',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33028',
    event_name: 'battery_pos_contactor_drive_fault_critical',
    code: '33028',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33029',
    event_name: 'battery_pre_charge_contactor_drive_fault_critical',
    code: '33029',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33030',
    event_name: 'battery_neg_contactor_drive_fault_critical',
    code: '33030',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33031',
    event_name: 'battery_pos_contactor_offline_critical',
    code: '33031',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33032',
    event_name: 'battery_pre_charge_contactor_offline_critical',
    code: '33032',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33033',
    event_name: 'battery_neg_contactor_offline_critical',
    code: '33033',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33034',
    event_name: 'battery_pos_contactor_welded_critical',
    code: '33034',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33035',
    event_name: 'battery_neg_contactor_welded_critical',
    code: '33035',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33036',
    event_name: 'battery_pack_enumeration_error_critical',
    code: '33036',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33037',
    event_name: 'battery_master_slave_communication_error_critical',
    code: '33037',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33038',
    event_name: 'battery_soft_start_failure_critical',
    code: '33038',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33039',
    event_name: 'battery_internal_failure_critical',
    code: '33039',
    in_use: true,
    display: true,
    error_description: 'Battery internal fault',
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '34001',
    event_name: 'esshub_over_temperature_critical',
    code: '34001',
    in_use: true,
    display: true,
    error_description: 'MIO board over temperature',
    possible_causes:
      'The ESS enclosure may be located in an overly hot location.\n\nESS enclosure fans may be blocked or faulty. ',
    recommended_actions:
      'Ensure that ESS is not near a heat source. \n\nEnsure that ESS fans are not blocked.\n\nCheck that the inverter air filter is unblocked and clean.\n\nCheck that the ESS enclosure door is properly locked.'
  },
  {
    event_code: '34010',
    event_name: 'esshub_communication_outage_critical',
    code: '34010',
    in_use: true,
    display: true,
    error_description: 'MIO communication outage',
    possible_causes: 'PVS cannot reach MIO board',
    recommended_actions:
      'Check Ethernet and CAN connections between PVS and MIO board'
  },
  {
    event_code: '34011',
    event_name: 'esshub_fw_error_inval_critical',
    code: '34011',
    in_use: true,
    display: true,
    error_description: 'MIO firmware error',
    possible_causes: 'Firmware in MIO board may be corrupted',
    recommended_actions:
      'Update MIO firmware\n\nRestart device\n\nIf the problem persists, replace MIO.'
  },
  {
    event_code: '34012',
    event_name: 'esshub_fw_error_spi_bsy_critical',
    code: '34012',
    in_use: true,
    display: true,
    error_description: 'MIO firmware error',
    possible_causes: 'Firmware in MIO board may be corrupted',
    recommended_actions:
      'Update MIO firmware\n\nRestart device\n\nIf the problem persists, replace MIO.'
  },
  {
    event_code: '34013',
    event_name: 'esshub_fw_error_spi_inval_cs_critical',
    code: '34013',
    in_use: true,
    display: true,
    error_description: 'MIO firmware error',
    possible_causes: 'Firmware in MIO board may be corrupted',
    recommended_actions:
      'Update MIO firmware\n\nRestart device\n\nIf the problem persists, replace MIO.'
  },
  {
    event_code: '34014',
    event_name: 'esshub_fw_error_spi_critical',
    code: '34014',
    in_use: true,
    display: true,
    error_description: 'MIO firmware error',
    possible_causes: 'Firmware in MIO board may be corrupted',
    recommended_actions:
      'Update MIO firmware\n\nRestart device\n\nIf the problem persists, replace MIO.'
  },
  {
    event_code: '34015',
    event_name: 'esshub_fw_error_flash_w_key_critical',
    code: '34015',
    in_use: true,
    display: true,
    error_description: 'MIO firmware error',
    possible_causes: 'Firmware in MIO board may be corrupted',
    recommended_actions:
      'Update MIO firmware\n\nRestart device\n\nIf the problem persists, replace MIO.'
  },
  {
    event_code: '34016',
    event_name: 'esshub_fw_error_flash_r_critical',
    code: '34016',
    in_use: true,
    display: true,
    error_description: 'MIO firmware error',
    possible_causes: 'Firmware in MIO board may be corrupted',
    recommended_actions:
      'Update MIO firmware\n\nRestart device\n\nIf the problem persists, replace MIO.'
  },
  {
    event_code: '34017',
    event_name: 'esshub_fw_error_flash_crc_critical',
    code: '34017',
    in_use: true,
    display: true,
    error_description: 'MIO firmware error',
    possible_causes: 'Firmware in MIO board may be corrupted',
    recommended_actions:
      'Update MIO firmware\n\nRestart device\n\nIf the problem persists, replace MIO.'
  },
  {
    event_code: '34018',
    event_name: 'esshub_fw_error_flash_w_critical',
    code: '34018',
    in_use: true,
    display: true,
    error_description: 'MIO firmware error',
    possible_causes: 'Firmware in MIO board may be corrupted',
    recommended_actions:
      'Update MIO firmware\n\nRestart device\n\nIf the problem persists, replace MIO.'
  },
  {
    event_code: '34019',
    event_name: 'esshub_fw_error_eeprom_critical',
    code: '34019',
    in_use: true,
    display: true,
    error_description: 'MIO firmware error',
    possible_causes: 'Firmware in MIO board may be corrupted',
    recommended_actions:
      'Update MIO firmware\n\nRestart device\n\nIf the problem persists, replace MIO.'
  },
  {
    event_code: '34020',
    event_name: 'esshub_fw_error_eeprom_r_critical',
    code: '34020',
    in_use: true,
    display: true,
    error_description: 'MIO firmware error',
    possible_causes: 'Firmware in MIO board may be corrupted',
    recommended_actions:
      'Update MIO firmware\n\nRestart device\n\nIf the problem persists, replace MIO.'
  },
  {
    event_code: '34021',
    event_name: 'esshub_fw_error_eeprom_w_critical',
    code: '34021',
    in_use: true,
    display: true,
    error_description: 'MIO firmware error',
    possible_causes: 'Firmware in MIO board may be corrupted',
    recommended_actions:
      'Update MIO firmware\n\nRestart device\n\nIf the problem persists, replace MIO.'
  },
  {
    event_code: '34022',
    event_name: 'esshub_fw_error_led_drv_critical',
    code: '34022',
    in_use: true,
    display: true,
    error_description: 'MIO firmware error',
    possible_causes: 'Firmware in MIO board may be corrupted',
    recommended_actions:
      'Update MIO firmware\n\nRestart device\n\nIf the problem persists, replace MIO.'
  },
  {
    event_code: '34023',
    event_name: 'esshub_fw_error_mbs_critical',
    code: '34023',
    in_use: true,
    display: true,
    error_description: 'MIO firmware error',
    possible_causes: 'Firmware in MIO board may be corrupted',
    recommended_actions:
      'Update MIO firmware\n\nRestart device\n\nIf the problem persists, replace MIO.'
  },
  {
    event_code: '34024',
    event_name: 'esshub_fw_error_btldr_en_key_critical',
    code: '34024',
    in_use: true,
    display: true,
    error_description: 'MIO firmware error',
    possible_causes: 'Firmware in MIO board may be corrupted',
    recommended_actions:
      'Update MIO firmware\n\nRestart device\n\nIf the problem persists, replace MIO.'
  },
  {
    event_code: '34025',
    event_name: 'esshub_fw_error_btldr_already_critical',
    code: '34025',
    in_use: true,
    display: true,
    error_description: 'MIO firmware error',
    possible_causes: 'Firmware in MIO board may be corrupted',
    recommended_actions:
      'Update MIO firmware\n\nRestart device\n\nIf the problem persists, replace MIO.'
  },
  {
    event_code: '34026',
    event_name: 'esshub_fw_error_btldr_data_ready_critical',
    code: '34026',
    in_use: true,
    display: true,
    error_description: 'MIO firmware error',
    possible_causes: 'Firmware in MIO board may be corrupted',
    recommended_actions:
      'Update MIO firmware\n\nRestart device\n\nIf the problem persists, replace MIO.'
  },
  {
    event_code: '34027',
    event_name: 'esshub_fw_error_btldr_rsp_ready_critical',
    code: '34027',
    in_use: true,
    display: true,
    error_description: 'MIO firmware error',
    possible_causes: 'Firmware in MIO board may be corrupted',
    recommended_actions:
      'Update MIO firmware\n\nRestart device\n\nIf the problem persists, replace MIO.'
  },
  {
    event_code: '34028',
    event_name: 'esshub_fw_error_contactor_protect_critical',
    code: '34028',
    in_use: true,
    display: true,
    error_description: 'MIO firmware error',
    possible_causes: 'Firmware in MIO board may be corrupted',
    recommended_actions:
      'Update MIO firmware\n\nRestart device\n\nIf the problem persists, replace MIO.'
  },
  {
    event_code: '34029',
    event_name: 'esshub_fw_error_unknown_critical',
    code: '34029',
    in_use: true,
    display: true,
    error_description: 'MIO firmware error',
    possible_causes: 'Firmware in MIO board may be corrupted',
    recommended_actions:
      'Update MIO firmware\n\nRestart device\n\nIf the problem persists, replace MIO.'
  },
  {
    event_code: '35000',
    event_name: 'gateway_communication_outage_critical',
    code: '35000',
    in_use: true,
    display: true,
    error_description: 'Gateway communication outage',
    possible_causes: 'PVS cannot communicate with Schneider gateway',
    recommended_actions:
      'Check Ethernet connector between PVS and Schneider gateway'
  },
  {
    event_code: '43040',
    event_name: 'battery_cell_under_voltage_permanent',
    code: '43040',
    in_use: true,
    display: true,
    error_description: 'Permanent battery damage: cell under voltage',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '43041',
    event_name: 'battery_cell_over_voltage_permanent',
    code: '43041',
    in_use: true,
    display: true,
    error_description: 'Permanent battery damage: cell over voltage',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '43042',
    event_name: 'battery_cell_delta_voltage_permanent',
    code: '43042',
    in_use: true,
    display: true,
    error_description: 'Permanent battery damage: cell voltage mismatch',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '43043',
    event_name: 'battery_state_of_health_permanent',
    code: '43043',
    in_use: true,
    display: true,
    error_description: 'Permanent battery damage: low state of cell',
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  }
]

const unknownError = code => {
  Sentry.captureException(`Error code not found ${code}`)
  return null
}

export const keyedErrors = arrayToObject('event_code', errorCodes)
export const getError = error => {
  const { code, error_message } = error
  const errorObj = prop(code, keyedErrors)
  //in case we found the error in the object above
  if (errorObj) return errorObj
  //in case there is an error message
  // for formatting reasons, will replace all _ to ' '
  else if (error_message)
    return { ...error, error_message: error_message.replace(/_/gm, ' ') }
  //in case error_message doesn't exist
  return unknownError(code)
}
export default errorCodes
