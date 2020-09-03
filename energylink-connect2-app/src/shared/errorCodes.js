import * as Sentry from '@sentry/browser'
import { prop } from 'ramda'
import { arrayToObject } from 'shared/utils'

const errorCodes = [
  {
    event_code: '00550',
    event_name: 'mi_firmware_no_backup_support_info',
    code: '00550',
    in_use: true,
    error_description: 'Microinverter firmware does not support backup mode',
    display: false,
    possible_causes: 'Microinverter firmware is not up to date',
    recommended_actions:
      'This message is for informational purposes only. No action is necessary at this time. Microinverter firmware may be updated remotely by SunPower at a later time.'
  },
  {
    event_code: '01001',
    event_name: 'contactor_open_info',
    code: '01001',
    in_use: true,
    error_description: 'Contactor is open',
    display: false,
    possible_causes: 'Contactor was opened',
    recommended_actions:
      'This message is for informational purposes only. No action required.'
  },
  {
    event_code: '01002',
    event_name: 'contactor_closed_info',
    code: '01002',
    in_use: true,
    error_description: 'Contactor is closed',
    display: false,
    possible_causes: 'Contactor was closed',
    recommended_actions:
      'This message is for informational purposes only. No action required.'
  },
  {
    event_code: '01015',
    event_name: 'rapid_shutdown_activated_info',
    code: '01015',
    in_use: true,
    error_description: 'Rapid shutdown was activated.',
    display: false,
    possible_causes: 'The rapid shutdown button was pressed.',
    recommended_actions:
      'This message is for informational purposes only. No action is necessary at this time.'
  },
  {
    event_code: '01022',
    event_name: 'hubplus_jumpstart_detected_info',
    code: '01022',
    in_use: true,
    error_description: 'Hub plus jumpstart detected',
    display: false,
    possible_causes: 'PVS caused the hubplus to jumpstart',
    recommended_actions:
      'This message is for informational purposes only. No action is required.'
  },
  {
    event_code: '01023',
    event_name: 'hubplus_jumpstart_active_info',
    code: '01023',
    in_use: true,
    error_description: 'Hub plus jumpstart is active',
    display: false,
    possible_causes: 'PVS caused the hubplus to jumpstart',
    recommended_actions:
      'This message is for informational purposes only. No action is required.'
  },
  {
    event_code: '01048',
    event_name: 'hubplus_event_contactor_opened_info',
    code: '01048',
    in_use: true,
    error_description: 'Contactor is open',
    display: false,
    possible_causes: 'Contactor was opened',
    recommended_actions:
      'This message is for informational purposes only. No action required.'
  },
  {
    event_code: '01049',
    event_name: 'hubplus_event_contactor_closed_info',
    code: '01049',
    in_use: true,
    error_description: 'Contactor is closed',
    display: false,
    possible_causes: 'Contactor was closed',
    recommended_actions:
      'This message is for informational purposes only. No action required.'
  },
  {
    event_code: '01050',
    event_name: 'hubplus_event_contactor_moved_info',
    code: '01050',
    in_use: true,
    error_description: 'Contactor was moved',
    display: false,
    possible_causes: 'Contactor was moved manually or for an unknown reason.',
    recommended_actions:
      'This message is for informational purposes only. No action required.'
  },
  {
    event_code: '01051',
    event_name: 'hubplus_event_grid_phase_loss_info',
    code: '01051',
    in_use: true,
    error_description: 'Grid phase loss',
    display: false,
    possible_causes: 'Hub plus cannot detect a phase voltage on the grid side.',
    recommended_actions:
      'Check that L1 and L2 terminations on the grid side are made properly and that the MIDC board is installed correctly. Check that the white connector at the top of the MIDC board is connected and seated properly. '
  },
  {
    event_code: '01052',
    event_name: 'hubplus_event_load_phase_loss_info',
    code: '01052',
    in_use: true,
    error_description: 'Load phase loss',
    display: false,
    possible_causes: 'Hub plus cannot detect a phase voltage on the load side.',
    recommended_actions:
      'Check that L1 and L2 terminations on the load side are made properly and that the MIDC board is installed correctly. Check that the white connector at the top of the MIDC board is connected and seated properly. '
  },
  {
    event_code: '01060',
    event_name: 'hubplus_state_grid_meter_phase_loss_info',
    code: '01060',
    in_use: true,
    error_description: 'Meter phase loss',
    display: false,
    possible_causes: 'Hub plus cannot detect a phase presence.',
    recommended_actions:
      'Make sure production and consumption CTs are connected to the PVS.'
  },
  {
    event_code: '02050',
    event_name: 'f65_ac_overload_2s_info',
    code: '02050',
    in_use: true,
    error_description: 'Inverter overload',
    display: false,
    possible_causes:
      'Inverter was loaded over its continuous capacity of 7.5kW.',
    recommended_actions:
      'Make sure the loads on the back-up side are sized appropriately for the inverter power capacity.'
  },
  {
    event_code: '02053',
    event_name: 'f68_transformer_over_temperature_info',
    code: '02053',
    in_use: true,
    error_description: 'The transformer in the inverter is over temperature',
    display: false,
    possible_causes: 'High load on inverter.',
    recommended_actions:
      'If this problem continues to occur, consider replacing the inverter.'
  },
  {
    event_code: '02058',
    event_name: 'f72_external_contactor_malfunction_info',
    code: '02058',
    in_use: true,
    error_description: 'Contactor malfunction',
    display: false,
    possible_causes:
      'Inverter detected a problem with the contactor in the Hub+.',
    recommended_actions:
      'Please make sure that the Aux connection between the XW pro inverter and the MIDC board in the Hub+ is made correctly. '
  },
  {
    event_code: '02067',
    event_name: 'storage_inv_microgrid_info',
    code: '02067',
    in_use: true,
    error_description: 'The inverter formed a microgrid',
    display: false,
    possible_causes: 'The inverter is now powering the backed-up loads.',
    recommended_actions:
      'This message is for informational purposes only. No action is required.'
  },
  {
    event_code: '11010',
    event_name: 'hubplus_under_temperature_warning',
    code: '11010',
    in_use: true,
    error_description: 'Hub+ temperature too low',
    display: false,
    possible_causes:
      'Low ambient temperature (below -10C) or faulty temperature sensor in Hub+',
    recommended_actions:
      'Check that the Hub+ door is closed. Ensure that no water or ice are present in the enclosure.\nIf ambient temperature is consistently above -10C, you may need to replace the part due to a faulty temperature sensor. Please contact SunPower.'
  },
  {
    event_code: '11011',
    event_name: 'hubplus_over_temperature_warning',
    code: '11011',
    in_use: true,
    error_description: 'Hub+ temperature too high',
    display: false,
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
    error_description: 'Hub+ humidity warning',
    display: false,
    possible_causes: 'Water intrusion into Hub+',
    recommended_actions:
      'Ensure that the Hub+ door is closed and check for water intrusion.'
  },
  {
    event_code: '11014',
    event_name: 'rapid_shutdown_disconnected_warning',
    code: '11014',
    in_use: true,
    error_description: 'Rapid shutdown button is disconnected.',
    display: false,
    possible_causes:
      'Connection between the Hub+ and rapid shutdown button was severed or the shunts are not properly connected.',
    recommended_actions:
      'If the Hub+ is installed inside, ensure the rapid shutdown switch is properly connected to the MIDC board. If it is installed outside, please ensure that the rapid shutdown terminations are properly shunted.'
  },
  {
    event_code: '11016',
    event_name: 'hubplus_acdc_supply_under_voltage_warning',
    code: '11016',
    in_use: true,
    error_description: 'Hub+ power supply under voltage',
    display: false,
    possible_causes: 'Check user manual',
    recommended_actions: 'Check user manual'
  },
  {
    event_code: '11017',
    event_name: 'hubplus_acdc_supply_over_voltage_warning',
    code: '11017',
    in_use: true,
    error_description: 'Hub+ power supply over voltage',
    display: false,
    possible_causes: 'Check user manual',
    recommended_actions: 'Check user manual'
  },
  {
    event_code: '11018',
    event_name: 'hubplus_inverter_aux_under_voltage_warning',
    code: '11018',
    in_use: true,
    error_description: 'Aux cable voltage low',
    display: false,
    possible_causes:
      'Aux cable between inverter and MIDC board in the Hub+ may not be properly made or installed.',
    recommended_actions:
      'Check that all the connectors and conductors are properly made, terminated and seated. On the inverter and MIDC side.'
  },
  {
    event_code: '11019',
    event_name: 'hubplus_inverter_aux_over_voltage_warning',
    code: '11019',
    in_use: true,
    error_description: 'Aux cable voltage high',
    display: false,
    possible_causes:
      'Aux cable between inverter and MIDC board in the Hub+ may not be properly made or installed.',
    recommended_actions:
      'Check that all the connectors and conductors are properly made, terminated and seated. On the inverter and MIDC side.'
  },
  {
    event_code: '11020',
    event_name: 'hubplus_supply_under_voltage_warning',
    code: '11020',
    in_use: true,
    error_description: 'Hub+ power supply voltage is low',
    display: false,
    possible_causes: 'Check user manual',
    recommended_actions: 'Check user manual'
  },
  {
    event_code: '11021',
    event_name: 'hubplus_supply_over_voltage_warning',
    code: '11021',
    in_use: true,
    error_description: 'Hub+ power supply voltage is high',
    display: false,
    possible_causes: 'Check user manual',
    recommended_actions: 'Check user manual'
  },
  {
    event_code: '11024',
    event_name: 'hubplus_jumpstart_out_of_range_warning',
    code: '11024',
    in_use: true,
    error_description: 'Hub+ jumpstart voltage out of range',
    display: false,
    possible_causes: 'Check user manual',
    recommended_actions: 'Check user manual'
  },
  {
    event_code: '11056',
    event_name: 'hubplus_event_midc_reboot_warning',
    code: '11056',
    in_use: true,
    error_description: 'MIDC board rebooted',
    display: false,
    possible_causes: 'MIDC board rebooted',
    recommended_actions: 'No action required at this time.'
  },
  {
    event_code: '11057',
    event_name: 'hubplus_event_wdt_reboot_warning',
    code: '11057',
    in_use: true,
    error_description: 'WDT reboot',
    display: false,
    possible_causes: 'A component rebooted',
    recommended_actions: 'No action required at this time.'
  },
  {
    event_code: '11058',
    event_name: 'hubplus_event_uart_timeout_warning',
    code: '11058',
    in_use: true,
    error_description: 'UART Timeout',
    display: false,
    possible_causes: 'UART timed out',
    recommended_actions: 'No action required at this time.'
  },
  {
    event_code: '11059',
    event_name: 'hubplus_state_grid_meter_voltage_out_range_warning',
    code: '11059',
    in_use: true,
    error_description: 'Grid meter voltage out of range',
    display: false,
    possible_causes: 'Hub plus cannot detect a phase voltage on the grid side.',
    recommended_actions:
      'Check that L1 and L2 terminations on the load side are made properly and that the MIDC board is installed correctly. Check that the white connector at the top of the MIDC board is connected and seated properly. '
  },
  {
    event_code: '12000',
    event_name: 'storage_inv_under_temperature_warning',
    code: '12000',
    in_use: true,
    error_description: 'Storage inverter under temperature',
    display: false,
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
    error_description: 'Storage inverter over temperature',
    display: false,
    possible_causes:
      'The ESS enclosure may be located in an overly hot location.\nESS enclosure fans may be blocked or faulty. ',
    recommended_actions:
      'Ensure that ESS is not near a heat source. \nEnsure that ESS fans are not blocked.\nCheck that the inverter air filter is unblocked and clean.\nCheck that the ESS enclosure door is properly locked.'
  },
  {
    event_code: '12068',
    event_name: 'storage_inv_microgrid_overload_warning',
    code: '12068',
    in_use: true,
    error_description: 'Microgrid overload',
    display: false,
    possible_causes: 'Load is to high for the batteries. ',
    recommended_actions:
      'Make sure the loads on the back-up side are sized appropriately for the inverter power capacity.'
  },
  {
    event_code: '13000',
    event_name: 'battery_low_state_of_charge_warning',
    code: '13000',
    in_use: true,
    error_description: 'Battery has low state of charge',
    display: false,
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
    error_description: 'Battery has degraded (low state of health)',
    display: false,
    possible_causes:
      'Battery may have been exposed ot harsh environmental conditions or may have been used aggressively.',
    recommended_actions:
      'Check battery location: temperature and airflow into batttery. Contact SunPower'
  },
  {
    event_code: '13003',
    event_name: 'battery_under_voltage_warning',
    code: '13003',
    in_use: true,
    error_description: 'Battery internal fault',
    display: false,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '13004',
    event_name: 'battery_over_voltage_warning',
    code: '13004',
    in_use: true,
    error_description: 'Battery internal fault',
    display: false,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '13005',
    event_name: 'battery_over_current_during_charge_warning',
    code: '13005',
    in_use: true,
    error_description: 'Battery internal fault',
    display: false,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '13006',
    event_name: 'battery_over_power_during_charge_warning',
    code: '13006',
    in_use: true,
    error_description: 'Battery internal fault',
    display: false,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '13007',
    event_name: 'battery_over_current_during_discharge_warning',
    code: '13007',
    in_use: true,
    error_description: 'Battery internal fault',
    display: false,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '13008',
    event_name: 'battery_over_power_during_discharge_warning',
    code: '13008',
    in_use: true,
    error_description: 'Battery internal fault',
    display: false,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '13009',
    event_name: 'battery_over_current_limit_during_charge_warning',
    code: '13009',
    in_use: true,
    error_description: 'Battery internal fault',
    display: false,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '13010',
    event_name: 'battery_over_current_limit_during_discharge_warning',
    code: '13010',
    in_use: true,
    error_description: 'Battery internal fault',
    display: false,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '13011',
    event_name: 'battery_under_temperature_during_charge_warning',
    code: '13011',
    in_use: true,
    error_description: 'Battery internal fault',
    display: false,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '13012',
    event_name: 'battery_over_temperature_during_charge_warning',
    code: '13012',
    in_use: true,
    error_description: 'Battery internal fault',
    display: false,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '13013',
    event_name: 'battery_under_temperature_during_discharge_warning',
    code: '13013',
    in_use: true,
    error_description: 'Battery internal fault',
    display: false,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '13014',
    event_name: 'battery_over_temperature_during_discharge_warning',
    code: '13014',
    in_use: true,
    error_description: 'Battery internal fault',
    display: false,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '13015',
    event_name: 'battery_cell_delta_voltage_too_high_warning',
    code: '13015',
    in_use: true,
    error_description: 'Battery internal fault',
    display: false,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '13016',
    event_name: 'battery_cell_temperature_diff_too_high_warning',
    code: '13016',
    in_use: true,
    error_description: 'Battery internal fault',
    display: false,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '13017',
    event_name: 'battery_state_of_charge_low_warning',
    code: '13017',
    in_use: true,
    error_description: 'Battery has low state of charge',
    display: false,
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
    error_description: 'Battery pack will be turned off',
    display: false,
    possible_causes: 'Check user manual',
    recommended_actions: 'Check user manual'
  },
  {
    event_code: '13019',
    event_name: 'battery_internal_communication_fail_warning',
    code: '13019',
    in_use: true,
    error_description: 'Battery internal fault',
    display: false,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '14000',
    event_name: 'esshub_under_temperature_warning',
    code: '14000',
    in_use: true,
    error_description: 'ESS temperature too low',
    display: false,
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
    error_description: 'ESS temperature too high',
    display: false,
    possible_causes:
      'The ESS enclosure may be located in an overly hot location.\nESS enclosure fans may be blocked or faulty. ',
    recommended_actions:
      'Ensure that ESS is not near a heat source. \nEnsure that ESS fans are not blocked.\nCheck that the inverter air filter is unblocked and clean.\nCheck that the ESS enclosure door is properly locked.'
  },
  {
    event_code: '14003',
    event_name: 'esshub_over_humidity_warning',
    code: '14003',
    in_use: true,
    error_description: 'ESS enclosure high humidity warning',
    display: false,
    possible_causes: 'Water intrusion into ESS enclosure',
    recommended_actions:
      'Ensure that the ESS enclosure door is closed and check for water intrusion.'
  },
  {
    event_code: '14004',
    event_name: 'esshub_gateway_output_under_voltage_warning',
    code: '14004',
    in_use: true,
    error_description: 'ESS gateway power supply under voltage',
    display: false,
    possible_causes: 'Check user manual',
    recommended_actions: 'Check user manual'
  },
  {
    event_code: '14005',
    event_name: 'esshub_gateway_output_over_voltage_warning',
    code: '14005',
    in_use: true,
    error_description: 'ESS gateway power supply over voltage',
    display: false,
    possible_causes: 'Check user manual',
    recommended_actions: 'Check user manual'
  },
  {
    event_code: '14006',
    event_name: 'esshub_dcdc_supply_under_voltage_warning',
    code: '14006',
    in_use: true,
    error_description: 'MIO board supply under voltage',
    display: false,
    possible_causes: 'Check user manual',
    recommended_actions: 'Check user manual'
  },
  {
    event_code: '14007',
    event_name: 'esshub_dcdc_supply_over_voltage_warning',
    code: '14007',
    in_use: true,
    error_description: 'MIO board auxiliary power supply over voltage',
    display: false,
    possible_causes: 'Check user manual',
    recommended_actions: 'Check user manual'
  },
  {
    event_code: '14008',
    event_name: 'esshub_supply_under_voltage_warning',
    code: '14008',
    in_use: true,
    error_description: 'MIO board supply under voltage',
    display: false,
    possible_causes: 'Check user manual',
    recommended_actions: 'Check user manual'
  },
  {
    event_code: '14009',
    event_name: 'esshub_supply_over_voltage_warning',
    code: '14009',
    in_use: true,
    error_description: 'MIO board auxiliary power supply over voltage',
    display: false,
    possible_causes: 'Check user manual',
    recommended_actions: 'Check user manual'
  },
  {
    event_code: '16000',
    event_name: 'pvs_cmeter_ac_grid_1n_under_voltage_warning',
    code: '16000',
    in_use: true,
    error_description: 'Consumption meter phase 1 under voltage.',
    display: false,
    possible_causes:
      'Conductor terminations flipped, CT terminations are incorrectly installed.',
    recommended_actions:
      'Check installation of load terminations. Check that CT voltage sensing is correclty installed.'
  },
  {
    event_code: '16001',
    event_name: 'pvs_cmeter_ac_grid_1n_over_voltage_warning',
    code: '16001',
    in_use: true,
    error_description: 'Consumption meter phase 1 over voltage.',
    display: false,
    possible_causes:
      'Conductor terminations flipped, CT terminations are incorrectly installed.',
    recommended_actions:
      'Check installation of load terminations. Check that CT voltage sensing is correclty installed.'
  },
  {
    event_code: '16002',
    event_name: 'pvs_cmeter_ac_grid_2n_under_voltage_warning',
    code: '16002',
    in_use: true,
    error_description: 'Consumption meter phase 2 under voltage.',
    display: false,
    possible_causes:
      'Conductor terminations flipped, CT terminations are incorrectly installed.',
    recommended_actions:
      'Check installation of load terminations. Check that CT voltage sensing is correclty installed.'
  },
  {
    event_code: '16003',
    event_name: 'pvs_cmeter_ac_grid_2n_over_voltage_warning',
    code: '16003',
    in_use: true,
    error_description: 'Consumption meter phase 2 over voltage.',
    display: false,
    possible_causes:
      'Conductor terminations flipped, CT terminations are incorrectly installed.',
    recommended_actions:
      'Check installation of load terminations. Check that CT voltage sensing is correclty installed.'
  },
  {
    event_code: '16004',
    event_name: 'pvs_cmeter_ac_grid_12_under_voltage_warning',
    code: '16004',
    in_use: true,
    error_description: 'Consumption meter phase 1-2 under voltage.',
    display: false,
    possible_causes:
      'Conductor terminations flipped, CT terminations are incorrectly installed.',
    recommended_actions:
      'Check installation of load terminations. Check that CT voltage sensing is correclty installed.'
  },
  {
    event_code: '16005',
    event_name: 'pvs_cmeter_ac_grid_12_over_voltage_warning',
    code: '16005',
    in_use: true,
    error_description: 'Consumption meter phase 1-2 over voltage.',
    display: false,
    possible_causes:
      'Conductor terminations flipped, CT terminations are incorrectly installed.',
    recommended_actions:
      'Check installation of load terminations. Check that CT voltage sensing is correclty installed.'
  },
  {
    event_code: '16006',
    event_name: 'pvs_cmeter_ac_grid_under_frequency_warning',
    code: '16006',
    in_use: true,
    error_description: 'AC Grid under frequency',
    display: false,
    possible_causes: 'This is likely a grid disturbance',
    recommended_actions: 'Check with utlity.'
  },
  {
    event_code: '16007',
    event_name: 'pvs_cmeter_ac_grid_over_frequency_warning',
    code: '16007',
    in_use: true,
    error_description: 'AC grid over frequency',
    display: false,
    possible_causes: 'This is likely a grid disturbance',
    recommended_actions: 'Check with utlity.'
  },
  {
    event_code: '21055',
    event_name: 'hubplus_event_rsd_activated_alarm',
    code: '21055',
    in_use: true,
    error_description: 'Rapid shutdown button pressed',
    display: false,
    possible_causes: 'The rapid shutdown button may have been pressed',
    recommended_actions:
      "Pull remote shutdown push-button. Rebool inverter by pressing the 'on/off' button for a few seconds until you see 'Off' in the display, then press the on/of button again."
  },
  {
    event_code: '23003',
    event_name: 'battery_under_voltage_alarm',
    code: '23003',
    in_use: true,
    error_description: 'Battery internal fault',
    display: false,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions:
      'Reboot both batteries to clear this fault. If the problem persists, please contact SunPower'
  },
  {
    event_code: '23004',
    event_name: 'battery_over_voltage_alarm',
    code: '23004',
    in_use: true,
    error_description: 'Battery internal fault',
    display: false,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions:
      'Reboot both batteries to clear this fault. If the problem persists, please contact SunPower'
  },
  {
    event_code: '23005',
    event_name: 'battery_over_current_during_charge_alarm',
    code: '23005',
    in_use: true,
    error_description: 'Battery internal fault',
    display: false,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions:
      'Reboot both batteries to clear this fault. If the problem persists, please contact SunPower'
  },
  {
    event_code: '23006',
    event_name: 'battery_over_power_during_charge_alarm',
    code: '23006',
    in_use: true,
    error_description: 'Battery internal fault',
    display: false,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions:
      'Reboot both batteries to clear this fault. If the problem persists, please contact SunPower'
  },
  {
    event_code: '23007',
    event_name: 'battery_over_current_during_discharge_alarm',
    code: '23007',
    in_use: true,
    error_description: 'Battery internal fault',
    display: false,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions:
      'Reboot both batteries to clear this fault. If the problem persists, please contact SunPower'
  },
  {
    event_code: '23008',
    event_name: 'battery_over_power_during_discharge_alarm',
    code: '23008',
    in_use: true,
    error_description: 'Battery internal fault',
    display: false,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions:
      'Reboot both batteries to clear this fault. If the problem persists, please contact SunPower'
  },
  {
    event_code: '23009',
    event_name: 'battery_over_current_limit_during_charge_alarm',
    code: '23009',
    in_use: true,
    error_description: 'Battery internal fault',
    display: false,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions:
      'Reboot both batteries to clear this fault. If the problem persists, please contact SunPower'
  },
  {
    event_code: '23010',
    event_name: 'battery_over_current_limit_during_discharge_alarm',
    code: '23010',
    in_use: true,
    error_description: 'Battery internal fault',
    display: false,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions:
      'Reboot both batteries to clear this fault. If the problem persists, please contact SunPower'
  },
  {
    event_code: '23011',
    event_name: 'battery_under_temperature_during_charge_alarm',
    code: '23011',
    in_use: true,
    error_description: 'Battery internal fault',
    display: false,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions:
      'Reboot both batteries to clear this fault. If the problem persists, please contact SunPower'
  },
  {
    event_code: '23012',
    event_name: 'battery_over_temperature_during_charge_alarm',
    code: '23012',
    in_use: true,
    error_description: 'Battery internal fault',
    display: false,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions:
      'Reboot both batteries to clear this fault. If the problem persists, please contact SunPower'
  },
  {
    event_code: '23013',
    event_name: 'battery_under_temperature_during_discharge_alarm',
    code: '23013',
    in_use: true,
    error_description: 'Battery internal fault',
    display: false,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions:
      'Reboot both batteries to clear this fault. If the problem persists, please contact SunPower'
  },
  {
    event_code: '23014',
    event_name: 'battery_over_temperature_during_discharge_alarm',
    code: '23014',
    in_use: true,
    error_description: 'Battery internal fault',
    display: false,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions:
      'Reboot both batteries to clear this fault. If the problem persists, please contact SunPower'
  },
  {
    event_code: '23015',
    event_name: 'battery_cell_delta_voltage_too_high_alarm',
    code: '23015',
    in_use: true,
    error_description: 'Battery internal fault',
    display: false,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions:
      'Reboot both batteries to clear this fault. If the problem persists, please contact SunPower'
  },
  {
    event_code: '23016',
    event_name: 'battery_cell_temperature_diff_too_high_alarm',
    code: '23016',
    in_use: true,
    error_description: 'Battery internal fault',
    display: false,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions:
      'Reboot both batteries to clear this fault. If the problem persists, please contact SunPower'
  },
  {
    event_code: '30000',
    event_name: 'component_check_no_midc_critical',
    code: '30000',
    in_use: true,
    error_description: 'PVS could not connect to MIDC board',
    display: false,
    possible_causes:
      "The PVS cannot connect with the MIDC board. The MIDC board drives the transfer switch on the Hub+. It also connects to the MIO board, so if you're seeing this error, it is likely that other errors are occurring as well. You should focus on fixing this error first before you proceed to fix the others.\n\nThis problem may be due to one of the following causes:\n1. The MIDC board is not powered\n1. The MIDC board is not connected to the MIO board.\n1. PVS MIDC CAN connector is bad\n1. The MIDC board is damaged\n1. The AUX cable between inverter and MIDC board is not properly connected and/or terminated.",
    recommended_actions:
      'Please try the following steps\n1. Check that the line-side and load-side AC cables to the MIDC board.\n1. Check that the gray ethernet cable and connectors between the MIDC (J14) board and MIO (J1) board is connected and terminated properly.\n1. Check that PVS MIDC CAN (J13) connector board cable is in place\n1. Check that the gray cable between the Aux port on the inverter and the J16 port on the MIDC board is correctly connected and terminated.\n1. Press the retry button in the app.\n\nIf the problem persists, this may be a sign that the MIDC board is damaged. Please contact SunPower.'
  },
  {
    event_code: '30001',
    event_name: 'component_check_no_mio_critical',
    code: '30001',
    in_use: true,
    error_description: 'PVS could not connect to MIO board',
    display: false,
    possible_causes:
      "The PVS cannot connect with the MIO board. The MIO board is a hub for data connections to the batteries, inverter, and gateway, so if you're seeing this error, it is likely you're also seeing other errors such as missing batteries or inverters.\n\nThis problem may be due to one of the following causes:\n1. Faulty data connection between the Hub+ and the MIO board.\n1. MIO lost power.\n1. Faulty data connection with another MIO board (applicable to Power Expansion packs only)",
    recommended_actions:
      'Please try the following steps:\n1. Check that the MIO board is powered: one LED should be blinking and the other one should be solid.\n1.  Check that the gray ethernet cable from the J1 port on the MIO board is connected to the J14 port on the MIDC. Check that the cable is terminated correctly. \n1. Check that the 48V DC connection on the MIO board is connected to the DC terminals on the inverter and properly grounded and terminated.\n1. Press the retry button on the app.\n\nIf the problem persists, this may be a sign that the MIO board is damaged. Please contact SunPower.'
  },
  {
    event_code: '30002',
    event_name: 'component_check_no_gw_critical',
    code: '30002',
    in_use: true,
    error_description: 'PVS could not connect to ESS Gateway',
    display: false,
    possible_causes:
      "The Schneider Gateway connects the inverter with PVS and batteries. If you're seeing this error it is likely you're also seeing other errors such as batteries  or inverter(s) missing.\n\nThis problem may be due to the following causes:\n1. Gateway lost power.\n1. The ethernet connector between the gateway and PVS is not connected or terminated correctly.\n1. Gateway may need to be rebooted.",
    recommended_actions:
      "1- Check that the gateway has power: the LEDs should be blinking.\n1. Check that the green cable and its orange, orange/white, green, blue and blue/white conductors in the metal ferules on the gateway side are properly connected to the J4 port on the MIO board.\n1. Check the black ethernet cable is connected to the black ethernet port on the PVS. Check also that the cable is correctly terminated.\n1. Check that the cable mentioned in 3 is connected to the port labeled as 'ethernet' on the Schneider gateway.\n1. Reboot the gateway by  pulling the ethernet connectors from the left-side of the Gateway and plugging them back into the same ports they were in. It may take a few minutes for the gateway to reboot.\n1. Press 'retry' on the commissioning app.\n\nIf the problem persists, this may be a sign that the Schneider Gateway is damaged. Please contact SunPower."
  },
  {
    event_code: '30003',
    event_name: 'component_check_no_inverter_critical',
    code: '30003',
    in_use: true,
    error_description: 'PVS could not connect to inverter',
    display: false,
    possible_causes:
      "The PVS cannot connect to the Schneider inverter.\n1.  If you're also seeing an error that indicates that the gateway is missing, this error may be due to the fact that the gateway is not properly connected. Please address the problem with the gateway first if you're seeing a gateway error. \n1. The inverter may need to be rebooted.\n1. A data connection between the inverter.MIO and PVS is not properly made.\n",
    recommended_actions:
      "Please try the following steps:\n1. If you're also seeing a 'missing gateway' error, please try to fix that problem first following the instructions in the 'missing gateway' error message.\n1. Reboot the inverter by pressing the 'on/off' button on the XWPro inverter for a few seconds until you see 'OFF' appear on the inverter display, then press the 'on/off' button again\n1. Press the retry button on the app.\nIf the problem persists:\n1. Check that the yellow XANBUS connector between the Schneider gateway and the inverter is correctly terminated and connected to the port labeled as XANBUS in he inverter (underneath the inverter, to the right of the SYNC port left of BTS port and AUX ports).\n1. Check that the RPO cable in the inverter (port labeled as BTS) is connected to the J5 (red) termination in the MIO board.\n1. Check that any of LEDs on inverter are On. \n1. Check that the DC conductors have at least 48V between terminations.\n1. Ensure that the DC terminations are done correctly\n1. Ensure that the DC breakers are closed.\n1. Ensure that the batteries are on. If not, press the ON button on the batteries.\n1. Check that the gray AUX connector from the inverter is connected to the J16 termination on the MIDC board.\n1. Press retry on the commissioning app.\n\nIf the problem persists, this may be a sign that the inverter is damaged. Please contact SunPower."
  },
  {
    event_code: '30004',
    event_name: 'component_check_no_bms_critical',
    code: '30004',
    in_use: true,
    error_description: 'PVS could not connect to batteries',
    display: false,
    possible_causes:
      "The PVS cannot connect with the batteries. This could be due because there are other connections missing. If you're also seeing a missing gateway error, missing MIDC or missing MIO board, this 'No BMS' error is likely due to any of these errors and you should try to fix them before you attempt to fix this.\n\nThis problem may be due to the following causes:\n1. Gateway is not connected. If this is the case, you'll also be seeing a 'No gateway' error and you should attempt fixing the problem first.\n1. CAN bus connection (green) between the MIO board (J4) and Schneider gateway is not properly made.\n1. The CAN bus connection on the Gateway side is not properly made or terminated (white-orange, orange, white-green, white-blue, and blue conductors).\n1. The CAN cable between J4 port on MIO and gateway is cut off.\n1. Connection between the batteries (orange) and the MIO board is not properly made\n1. Batteries are not powered on.",
    recommended_actions:
      "Please try the following steps\n1. If you're also seeing a 'missing gateway' error, please try to fix that problem first following the instructions in the error message.\n1. Check that the CAN bus connection on the Gateway side is not properly made or terminated (white-orange, orange, white-green, white-blue, and blue conductors).\n1. Check that the orange cable between the master battery and the MIO board is properly connected and terminated.\n1. Check that the batteries are powered on (check status of LEDs around the power button on the side of the batteries).\n1. Check that the DC breakers are on the closed position.\n1. Attempt commissioning again.\n\nIf the problem persists, this may be a sign that one or more batteries are damaged. Please contact SunPower."
  },
  {
    event_code: '30005',
    event_name: 'component_check_too_many_inverters_critical',
    code: '30005',
    in_use: true,
    error_description: 'Too many inverters',
    display: false,
    possible_causes: 'N/A',
    recommended_actions: 'N/A'
  },
  {
    event_code: '30006',
    event_name: 'component_check_mio_xw_mismatch_critical',
    code: '30006',
    in_use: true,
    error_description: 'MIO could not connect to inverter',
    display: false,
    possible_causes:
      "The PVS cannot connect to the Schneider inverter.\n1.  If you're also seeing an error that indicates that the gateway is missing, this error may be due to the fact that the gateway is not properly connected. Please address the problem with the gateway first if you're seeing a gateway error. \n1. The inverter may need to be rebooted.\n1. A data connection between the inverter.MIO and PVS is not properly made.\n",
    recommended_actions:
      "Please try the following steps:\n1. If you're also seeing a 'missing gateway' error, please try to fix that problem first following the instructions in the 'missing gateway' error message.\n1. Reboot the inverter by pressing the 'on/off' button on the XWPro inverter for a few seconds until you see 'OFF' appear on the inverter display, then press the 'on/off' button again\n1. Press the retry button on the app.\nIf the problem persists:\n1. Check that the yellow XANBUS connector between the Schneider gateway and the inverter is correctly terminated and connected to the port labeled as XANBUS in he inverter (underneath the inverter, to the right of the SYNC port left of BTS port and AUX ports).\n1. Check that the RPO cable in the inverter (port labeled as BTS) is connected to the J5 (red) termination in the MIO board.\n1. Check that any of LEDs on inverter are On. \n1. Check that the DC conductors have at least 48V between terminations.\n1. Ensure that the DC terminations are done correctly\n1. Ensure that the DC breakers are closed.\n1. Ensure that the batteries are on. If not, press the ON button on the batteries.\n1. Check that the gray AUX connector from the inverter is connected to the J16 termination on the MIDC board.\n1. Press retry on the commissioning app.\n\nIf the problem persists, this may be a sign that the inverter is damaged. Please contact SunPower."
  },
  {
    event_code: '30007',
    event_name: 'component_check_too_few_batteries_critical',
    code: '30007',
    in_use: true,
    error_description: 'PVS could not connect to batteries',
    display: false,
    possible_causes:
      "The PVS cannot connect with the batteries. This could be due because there are other connections missing. If you're also seeing a missing gateway error, missing MIDC or missing MIO board, this 'No BMS' error is likely due to any of these errors and you should try to fix them before you attempt to fix this.\n\nThis problem may be due to the following causes:\n1. Gateway is not connected. If this is the case, you'll also be seeing a 'No gateway' error and you should attempt fixing the problem first.\n1. CAN bus connection (green) between the MIO board (J4) and Schneider gateway is not properly made.\n1. The CAN bus connection on the Gateway side is not properly made or terminated (white-orange, orange, white-green, white-blue, and blue conductors).\n1. The CAN cable between J4 port on MIO and gateway is cut off.\n1. Connection between the batteries (orange) and the MIO board is not properly made\n1. Batteries are not powered on.",
    recommended_actions:
      "Please try the following steps\n1. If you're also seeing a 'missing gateway' error, please try to fix that problem first following the instructions in the error message.\n1. Check that the CAN bus connection on the Gateway side is not properly made or terminated (white-orange, orange, white-green, white-blue, and blue conductors).\n1. Check that the orange cable between the master battery and the MIO board is properly connected and terminated.\n1. Check that the batteries are powered on (check status of LEDs around the power button on the side of the batteries).\n1. Check that the DC breakers are on the closed position.\n1. Attempt commissioning again.\n\nIf the problem persists, this may be a sign that one or more batteries are damaged. Please contact SunPower."
  },
  {
    event_code: '30008',
    event_name: 'component_check_too_many_batteries_critical',
    code: '30008',
    in_use: true,
    error_description: 'PVS could not connect to one or more inverters',
    display: false,
    possible_causes:
      "The PVS cannot connect to the Schneider inverter.\n1.  If you're also seeing an error that indicates that the gateway is missing, this error may be due to the fact that the gateway is not properly connected. Please address the problem with the gateway first if you're seeing a gateway error. \n1. The inverter may need to be rebooted.\n1. A data connection between the inverter.MIO and PVS is not properly made.\n",
    recommended_actions:
      "Please try the following steps:\n1. If you're also seeing a 'missing gateway' error, please try to fix that problem first following the instructions in the 'missing gateway' error message.\n1. Reboot the inverter by pressing the 'on/off' button on the XWPro inverter for a few seconds until you see 'OFF' appear on the inverter display, then press the 'on/off' button again\n1. Press the retry button on the app.\nIf the problem persists:\n1. Check that the yellow XANBUS connector between the Schneider gateway and the inverter is correctly terminated and connected to the port labeled as XANBUS in he inverter (underneath the inverter, to the right of the SYNC port left of BTS port and AUX ports).\n1. Check that the RPO cable in the inverter (port labeled as BTS) is connected to the J5 (red) termination in the MIO board.\n1. Check that any of LEDs on inverter are On. \n1. Check that the DC conductors have at least 48V between terminations.\n1. Ensure that the DC terminations are done correctly\n1. Ensure that the DC breakers are closed.\n1. Ensure that the batteries are on. If not, press the ON button on the batteries.\n1. Check that the gray AUX connector from the inverter is connected to the J16 termination on the MIDC board.\n1. Press retry on the commissioning app.\n\nIf the problem persists, this may be a sign that the inverter is damaged. Please contact SunPower."
  },
  {
    event_code: '30015',
    event_name: 'mapping_inverter_no_batteries_critical',
    code: '30015',
    in_use: true,
    error_description: 'PVS could not connect to batteries',
    display: false,
    possible_causes:
      "The PVS cannot connect with the batteries. This could be due because there are other connections missing. If you're also seeing a missing gateway error, missing MIDC or missing MIO board, this 'No BMS' error is likely due to any of these errors and you should try to fix them before you attempt to fix this.\n\nThis problem may be due to the following causes:\n1. Gateway is not connected. If this is the case, you'll also be seeing a 'No gateway' error and you should attempt fixing the problem first.\n1. CAN bus connection (green) between the MIO board (J4) and Schneider gateway is not properly made.\n1. The CAN bus connection on the Gateway side is not properly made or terminated (white-orange, orange, white-green, white-blue, and blue conductors).\n1. The CAN cable between J4 port on MIO and gateway is cut off.\n1. Connection between the batteries (orange) and the MIO board is not properly made\n1. Batteries are not powered on.",
    recommended_actions:
      "Please try the following steps\n1. If you're also seeing a 'missing gateway' error, please try to fix that problem first following the instructions in the error message.\n1. Check that the CAN bus connection on the Gateway side is not properly made or terminated (white-orange, orange, white-green, white-blue, and blue conductors).\n1. Check that the orange cable between the master battery and the MIO board is properly connected and terminated.\n1. Check that the batteries are powered on (check status of LEDs around the power button on the side of the batteries).\n1. Check that the DC breakers are on the closed position.\n1. Attempt commissioning again.\n\nIf the problem persists, this may be a sign that one or more batteries are damaged. Please contact SunPower."
  },
  {
    event_code: '30018',
    event_name: 'mapping_inverter_too_many_batteries_critical',
    code: '30018',
    in_use: true,
    error_description: 'PVS could not connect to one or more inverters',
    display: false,
    possible_causes:
      "The PVS cannot connect to the Schneider inverter.\n1.  If you're also seeing an error that indicates that the gateway is missing, this error may be due to the fact that the gateway is not properly connected. Please address the problem with the gateway first if you're seeing a gateway error. \n1. The inverter may need to be rebooted.\n1. A data connection between the inverter.MIO and PVS is not properly made.\n",
    recommended_actions:
      "Please try the following steps:\n1. If you're also seeing a 'missing gateway' error, please try to fix that problem first following the instructions in the 'missing gateway' error message.\n1. Reboot the inverter by pressing the 'on/off' button on the XWPro inverter for a few seconds until you see 'OFF' appear on the inverter display, then press the 'on/off' button again\n1. Press the retry button on the app.\nIf the problem persists:\n1. Check that the yellow XANBUS connector between the Schneider gateway and the inverter is correctly terminated and connected to the port labeled as XANBUS in he inverter (underneath the inverter, to the right of the SYNC port left of BTS port and AUX ports).\n1. Check that the RPO cable in the inverter (port labeled as BTS) is connected to the J5 (red) termination in the MIO board.\n1. Check that any of LEDs on inverter are On. \n1. Check that the DC conductors have at least 48V between terminations.\n1. Ensure that the DC terminations are done correctly\n1. Ensure that the DC breakers are closed.\n1. Ensure that the batteries are on. If not, press the ON button on the batteries.\n1. Check that the gray AUX connector from the inverter is connected to the J16 termination on the MIDC board.\n1. Press retry on the commissioning app.\n\nIf the problem persists, this may be a sign that the inverter is damaged. Please contact SunPower."
  },
  {
    event_code: '30021',
    event_name: 'mapping_inverter_no_mio_critical',
    code: '30021',
    in_use: true,
    error_description: 'PVS could not connect to MIO board',
    display: false,
    possible_causes:
      "The PVS cannot connect with the MIO board. The MIO board is a hub for data connections to the batteries, inverter, and gateway, so if you're seeing this error, it is likely you're also seeing other errors such as missing batteries or inverters.\n\nThis problem may be due to one of the following causes:\n1. Faulty data connection between the Hub+ and the MIO board.\n1. MIO lost power.\n1. Faulty data connection with another MIO board (applicable to Power Expansion packs only)",
    recommended_actions:
      'Please try the following steps:\n1. Check that the MIO board is powered: one LED should be blinking and the other one should be solid.\n1.  Check that the gray ethernet cable from the J1 port on the MIO board is connected to the J14 port on the MIDC. Check that the cable is terminated correctly. \n1. Check that the 48V DC connection on the MIO board is connected to the DC terminals on the inverter and properly grounded and terminated.\n1. If this install involves one or more power expansion packs (above 26kWh or 6.8kW), please check that the MIO board is connected to the adjacent MIO by checking that the purple J2 cable is correctly connected and terminated.\n1. Attempt commissioning again.\n\nIf the problem persists, this may be a sign that the MIO board is damaged. Please contact SunPower.'
  },
  {
    event_code: '30022',
    event_name: 'mapping_inverter_too_many_mio_critical',
    code: '30022',
    in_use: true,
    error_description: 'PVS found too many MIO boards',
    display: false,
    possible_causes: 'N/A',
    recommended_actions: 'N/A'
  },
  {
    event_code: '30025',
    event_name: 'mapping_inverter_no_bms_critical',
    code: '30025',
    in_use: true,
    error_description: 'PVS could not connect to batteries',
    display: false,
    possible_causes:
      "The PVS cannot connect with the batteries. This could be due because there are other connections missing. If you're also seeing a missing gateway error, missing MIDC or missing MIO board, this 'No BMS' error is likely due to any of these errors and you should try to fix them before you attempt to fix this.\n\nThis problem may be due to the following causes:\n1. Gateway is not connected. If this is the case, you'll also be seeing a 'No gateway' error and you should attempt fixing the problem first.\n1. CAN bus connection (green) between the MIO board (J4) and Schneider gateway is not properly made.\n1. The CAN bus connection on the Gateway side is not properly made or terminated (white-orange, orange, white-green, white-blue, and blue conductors).\n1. The CAN cable between J4 port on MIO and gateway is cut off.\n1. Connection between the batteries (orange) and the MIO board is not properly made\n1. Batteries are not powered on.",
    recommended_actions:
      "Please try the following steps\n1. If you're also seeing a 'missing gateway' error, please try to fix that problem first following the instructions in the error message.\n1. Check that the CAN bus connection on the Gateway side is not properly made or terminated (white-orange, orange, white-green, white-blue, and blue conductors).\n1. Check that the orange cable between the master battery and the MIO board is properly connected and terminated.\n1. Check that the batteries are powered on (check status of LEDs around the power button on the side of the batteries).\n1. Check that the DC breakers are on the closed position.\n1. Attempt commissioning again.\n\nIf the problem persists, this may be a sign that one or more batteries are damaged. Please contact SunPower."
  },
  {
    event_code: '30026',
    event_name: 'mapping_inverter_too_many_bms_critical',
    code: '30026',
    in_use: true,
    error_description: 'PVS could not connect to one or more inverters',
    display: false,
    possible_causes:
      "The PVS cannot connect to the Schneider inverter.\n1.  If you're also seeing an error that indicates that the gateway is missing, this error may be due to the fact that the gateway is not properly connected. Please address the problem with the gateway first if you're seeing a gateway error. \n1. The inverter may need to be rebooted.\n1. A data connection between the inverter.MIO and PVS is not properly made.\n",
    recommended_actions:
      "Please try the following steps:\n1. If you're also seeing a 'missing gateway' error, please try to fix that problem first following the instructions in the 'missing gateway' error message.\n1. Reboot the inverter by pressing the 'on/off' button on the XWPro inverter for a few seconds until you see 'OFF' appear on the inverter display, then press the 'on/off' button again\n1. Press the retry button on the app.\nIf the problem persists:\n1. Check that the yellow XANBUS connector between the Schneider gateway and the inverter is correctly terminated and connected to the port labeled as XANBUS in he inverter (underneath the inverter, to the right of the SYNC port left of BTS port and AUX ports).\n1. Check that the RPO cable in the inverter (port labeled as BTS) is connected to the J5 (red) termination in the MIO board.\n1. Check that any of LEDs on inverter are On. \n1. Check that the DC conductors have at least 48V between terminations.\n1. Ensure that the DC terminations are done correctly\n1. Ensure that the DC breakers are closed.\n1. Ensure that the batteries are on. If not, press the ON button on the batteries.\n1. Check that the gray AUX connector from the inverter is connected to the J16 termination on the MIDC board.\n1. Press retry on the commissioning app.\n\nIf the problem persists, this may be a sign that the inverter is damaged. Please contact SunPower."
  },
  {
    event_code: '30028',
    event_name: 'mapping_no_inverter_critical',
    code: '30028',
    in_use: true,
    error_description: 'PVS could not connet to one or more inverters',
    display: false,
    possible_causes:
      "The PVS cannot connect to the Schneider inverter.\n1.  If you're also seeing an error that indicates that the gateway is missing, this error may be due to the fact that the gateway is not properly connected. Please address the problem with the gateway first if you're seeing a gateway error. \n1. The inverter may need to be rebooted.\n1. A data connection between the inverter.MIO and PVS is not properly made.\n",
    recommended_actions:
      "Please try the following steps:\n1. If you're also seeing a 'missing gateway' error, please try to fix that problem first following the instructions in the 'missing gateway' error message.\n1. Reboot the inverter by pressing the 'on/off' button on the XWPro inverter for a few seconds until you see 'OFF' appear on the inverter display, then press the 'on/off' button again\n1. Press the retry button on the app.\nIf the problem persists:\n1. Check that the yellow XANBUS connector between the Schneider gateway and the inverter is correctly terminated and connected to the port labeled as XANBUS in he inverter (underneath the inverter, to the right of the SYNC port left of BTS port and AUX ports).\n1. Check that the RPO cable in the inverter (port labeled as BTS) is connected to the J5 (red) termination in the MIO board.\n1. Check that any of LEDs on inverter are On. \n1. Check that the DC conductors have at least 48V between terminations.\n1. Ensure that the DC terminations are done correctly\n1. Ensure that the DC breakers are closed.\n1. Ensure that the batteries are on. If not, press the ON button on the batteries.\n1. Check that the gray AUX connector from the inverter is connected to the J16 termination on the MIDC board.\n1. Press retry on the commissioning app.\n\nIf the problem persists, this may be a sign that the inverter is damaged. Please contact SunPower."
  },
  {
    event_code: '30029',
    event_name: 'mapping_no_gateway_critical',
    code: '30029',
    in_use: true,
    error_description: 'PVS could not connect to ESS Gateway',
    display: false,
    possible_causes:
      "The Schneider Gateway connects the inverter with PVS and batteries. If you're seeing this error it is likely you're also seeing other errors such as batteries  or inverter(s) missing.\n\nThis problem may be due to the following causes:\n1. Gateway lost power.\n1. The ethernet connector between the gateway and PVS is not connected or terminated correctly.\n1. Gateway may need to be rebooted.",
    recommended_actions:
      "1- Check that the gateway has power: the LEDs should be blinking.\n1. Check that the green cable and its orange, orange/white, green, blue and blue/white conductors in the metal ferules on the gateway side are properly connected to the J4 port on the MIO board.\n1. Check the black ethernet cable is connected to the black ethernet port on the PVS. Check also that the cable is correctly terminated.\n1. Check that the cable mentioned in 3 is connected to the port labeled as 'ethernet' on the Schneider gateway.\n1. Reboot the gateway by  pulling the ethernet connectors from the left-side of the Gateway and plugging them back into the same ports they were in. It may take a few minutes for the gateway to reboot.\n1. Press 'retry' on the commissioning app.\n\nIf the problem persists, this may be a sign that the Schneider Gateway is damaged. Please contact SunPower."
  },
  {
    event_code: '30030',
    event_name: 'mapping_no_midc_critical',
    code: '30030',
    in_use: true,
    error_description: 'PVS could not connect to MIDC board',
    display: false,
    possible_causes:
      "The PVS cannot connect with the MIDC board. The MIDC board drives the transfer switch on the Hub+. It also connects to the MIO board, so if you're seeing this error, it is likely that other errors are occurring as well. You should focus on fixing this error first before you proceed to fix the others.\n\nThis problem may be due to one of the following causes:\n1. The MIDC board is not powered\n1. The MIDC board is not connected to the MIO board.\n1. PVS MIDC CAN connector is bad\n1. The MIDC board is damaged\n1. The AUX cable between inverter and MIDC board is not properly connected and/or terminated.",
    recommended_actions:
      'Please try the following steps\n1. Check that the line-side and load-side AC cables to the MIDC board.\n1. Check that the gray ethernet cable and connectors between the MIDC (J14) board and MIO (J1) board is connected and terminated properly.\n1. Check that PVS MIDC CAN (J13) connector board cable is in place\n1. Check that the gray cable between the Aux port on the inverter and the J16 port on the MIDC board is correctly connected and terminated.\n1. Press the retry button in the app.\n\nIf the problem persists, this may be a sign that the MIDC board is damaged. Please contact SunPower.'
  },
  {
    event_code: '30031',
    event_name: 'mapping_too_many_gateways_critical',
    code: '30031',
    in_use: true,
    error_description:
      'Cateway could not connect to inverter or more than one gateway was installed',
    display: false,
    possible_causes:
      'The ESS gateway could not connect to inverter . Or more than one gateway was installed. ',
    recommended_actions:
      "\"1- Check that you have installed only one gateway.\n1. Reboot the inverter by pressing the 'on/off' button on the XWPro inverter for a few seconds until you see 'OFF' appear on the inverter display, then press the 'on/off' button again\n1. Press the retry button on the app.\nIf the problem persists:\n1. Check that the yellow XANBUS connector between the Schneider gateway and the inverter is correctly terminated and connected to the port labeled as XANBUS in he inverter (underneath the inverter, to the right of the SYNC port left of BTS port and AUX ports).\n1. Check that the RPO cable in the inverter (port labeled as BTS) is connected to the J5 (red) termination in the MIO board.\n1. Check that any of LEDs on inverter are On. \n1. Check that the DC conductors have at least 48V between terminations.\n1. Ensure that the DC terminations are done correctly\n1. Ensure that the DC breakers are closed.\n1. Ensure that the batteries are on. If not, press the ON button on the batteries.\n1. Check that the gray AUX connector from the inverter is connected to the J16 termination on the MIDC board.\n1. Press retry on the commissioning app.\n\nIf the problem persists, this may be a sign that the inverter is damaged. Please contact SunPower.7- Press 'retry' on the commissioning app.\n\nIf the problem persists, this may be a sign that the Schneider Gateway is damaged. Please contact SunPower.\""
  },
  {
    event_code: '30032',
    event_name: 'mapping_too_many_midc_critical',
    code: '30032',
    in_use: true,
    error_description: 'Too many MIDC boards',
    display: false,
    possible_causes: 'N/A',
    recommended_actions: 'N/A'
  },
  {
    event_code: '31000',
    event_name: 'contactor_position_unknown_critical',
    code: '31000',
    in_use: true,
    error_description: 'Microgrid interconect contactor position unknown',
    display: false,
    possible_causes:
      'The connection between PVS and MIDC board has been lost.\nMIDC board can no longer control the transfer switch.',
    recommended_actions:
      'Check MIDC LEDs\nCheck MID cables for damage\nCheck for damage between PVS and MIDC communications cables.\nCheck the Aux cable is correctly connected an terminated.\nIf problem persists, you may need to replace the MID and/or MIDC.\n'
  },
  {
    event_code: '31003',
    event_name: 'contactor_stuck_open_critical',
    code: '31003',
    in_use: true,
    error_description: 'Transfer switch contactor stuck open ',
    display: false,
    possible_causes:
      'A fault with the MIDC board or with the transfer switch has occurred.',
    recommended_actions:
      'Check MIDC LEDs\nCheck MID cables for damage\nCheck for damage between PVS and MIDC communications cables.\nCheck the Aux cable is correctly connected an terminated.\nIf problem persists, you may need to replace the MID and/or MIDC.\n'
  },
  {
    event_code: '31004',
    event_name: 'contactor_stuck_closed_critical',
    code: '31004',
    in_use: true,
    error_description: 'Transfer switch contactor stuck closed',
    display: false,
    possible_causes:
      'A fault with the MIDC board or with the transfer switch has occurred.',
    recommended_actions:
      'Check MIDC LEDs\nCheck MID cables for damage\nCheck for damage between PVS and MIDC communications cables.\nCheck the Aux cable is correctly connected an terminated.\nIf problem persists, you may need to replace the MID and/or MIDC.\n'
  },
  {
    event_code: '31005',
    event_name: 'contactor_mismatched_open_critical',
    code: '31005',
    in_use: true,
    error_description: 'Contactor mismatched open',
    display: false,
    possible_causes:
      'Aux feedback and voltage sense does not match. A fault with the MIDC board or with the transfer switch has occurred.',
    recommended_actions:
      'Check MIDC LEDs\nCheck MID cables for damage\nCheck for damage between PVS and MIDC communications cables.\nCheck the Aux cable is correctly connected an terminated.\nIf problem persists, you may need to replace the MID and/or MIDC.\n'
  },
  {
    event_code: '31006',
    event_name: 'contactor_mismatched_closed_critical',
    code: '31006',
    in_use: true,
    error_description: 'Contactor mismatched closed',
    display: false,
    possible_causes:
      'Aux feedback and voltage sense does not match. A fault with the MIDC board or with the transfer switch has occurred.',
    recommended_actions:
      'Check MIDC LEDs\nCheck MID cables for damage\nCheck for damage between PVS and MIDC communications cables.\nCheck the Aux cable is correctly connected an terminated.\nIf problem persists, you may need to replace the MID and/or MIDC.\n'
  },
  {
    event_code: '31007',
    event_name: 'contactor_mismatched_stuck_open_critical',
    code: '31007',
    in_use: true,
    error_description: 'Contactor mismatched and stuck open',
    display: false,
    possible_causes:
      'Aux feedback and voltage sense does not match. A fault with the MIDC board or with the transfer switch has occurred.',
    recommended_actions:
      'Check MIDC LEDs\nCheck MID cables for damage\nCheck for damage between PVS and MIDC communications cables.\nCheck the Aux cable is correctly connected an terminated.\nIf problem persists, you may need to replace the MID and/or MIDC.\n'
  },
  {
    event_code: '31008',
    event_name: 'contactor_mismatched_stuck_closed_critical',
    code: '31008',
    in_use: true,
    error_description: 'Contactor mismatched and stuck closed',
    display: false,
    possible_causes:
      'Aux feedback and voltage sense does not match. A fault with the MIDC board or with the transfer switch has occurred.',
    recommended_actions:
      'Check MIDC LEDs\nCheck MID cables for damage\nCheck for damage between PVS and MIDC communications cables.\nCheck the Aux cable is correctly connected an terminated.\nIf problem persists, you may need to replace the MID and/or MIDC.\n'
  },
  {
    event_code: '31009',
    event_name: 'contactor_error_unknown_critical',
    code: '31009',
    in_use: true,
    error_description: 'Contactor error unknown',
    display: false,
    possible_causes: 'Problem unknown',
    recommended_actions:
      'Check MIDC LEDs\nCheck MID cables for damage\nCheck for damage between PVS and MIDC communications cables.\nCheck the Aux cable is correctly connected an terminated.\nIf problem persists, you may need to replace the MID and/or MIDC.\n'
  },
  {
    event_code: '31011',
    event_name: 'hubplus_over_temperature_critical',
    code: '31011',
    in_use: true,
    error_description: 'Hub+ over temperature',
    display: false,
    possible_causes:
      'The Hub+ may be located in a hot location or facing direct sun. This could also be caused by loads/generation above Hub+ rating.',
    recommended_actions:
      'Check that the Hub+ is not in direct sunlight and change its  location if that is the case. Check that loads and generation are within the ratings of the Hub+.'
  },
  {
    event_code: '31025',
    event_name: 'hubplus_communication_outage_critical',
    code: '31025',
    in_use: true,
    error_description: 'PVS could not connect to MIDC board',
    display: false,
    possible_causes:
      "The PVS cannot connect with the MIDC board. The MIDC board drives the transfer switch on the Hub+. It also connects to the MIO board, so if you're seeing this error, it is likely that other errors are occurring as well. You should focus on fixing this error first before you proceed to fix the others.\n\nThis problem may be due to one of the following causes:\n1. The MIDC board is not powered\n1. The MIDC board is not connected to the MIO board.\n1. PVS MIDC CAN connector is bad\n1. The MIDC board is damaged\n1. The AUX cable between inverter and MIDC board is not properly connected and/or terminated.",
    recommended_actions:
      'Please try the following steps\n1. Check that the line-side and load-side AC cables to the MIDC board.\n1. Check that the gray ethernet cable and connectors between the MIDC (J14) board and MIO (J1) board is connected and terminated properly.\n1. Check that PVS MIDC CAN (J13) connector board cable is in place\n1. Check that the gray cable between the Aux port on the inverter and the J16 port on the MIDC board is correctly connected and terminated.\n1. Press the retry button in the app.\n\nIf the problem persists, this may be a sign that the MIDC board is damaged. Please contact SunPower.'
  },
  {
    event_code: '31028',
    event_name: 'hubplus_firmware_update_failure_critical',
    code: '31028',
    in_use: true,
    error_description: 'MIDC firmware update failure',
    display: false,
    possible_causes: 'We could not update the firmware in the MIDC',
    recommended_actions:
      'Please try again, if the problem persists, contact SunPower.'
  },
  {
    event_code: '31029',
    event_name: 'hubplus_fw_error_inval_critical',
    code: '31029',
    in_use: true,
    error_description: 'MIDC firmware error',
    display: false,
    possible_causes: 'There is a problem with the firmware in the MIDC board.',
    recommended_actions: 'If the problem persists, please contact SunPower.'
  },
  {
    event_code: '31030',
    event_name: 'hubplus_fw_error_spi_bsy_critical',
    code: '31030',
    in_use: true,
    error_description: 'MIDC firmware error',
    display: false,
    possible_causes: 'There is a problem with the firmware in the MIDC board.',
    recommended_actions: 'If the problem persists, please contact SunPower.'
  },
  {
    event_code: '31031',
    event_name: 'hubplus_fw_error_spi_inval_cs_critical',
    code: '31031',
    in_use: true,
    error_description: 'MIDC firmware error',
    display: false,
    possible_causes: 'There is a problem with the firmware in the MIDC board.',
    recommended_actions: 'If the problem persists, please contact SunPower.'
  },
  {
    event_code: '31032',
    event_name: 'hubplus_fw_error_spi_critical',
    code: '31032',
    in_use: true,
    error_description: 'MIDC firmware error',
    display: false,
    possible_causes: 'There is a problem with the firmware in the MIDC board.',
    recommended_actions: 'If the problem persists, please contact SunPower.'
  },
  {
    event_code: '31033',
    event_name: 'hubplus_fw_error_flash_w_key_critical',
    code: '31033',
    in_use: true,
    error_description: 'MIDC firmware error',
    display: false,
    possible_causes: 'There is a problem with the firmware in the MIDC board.',
    recommended_actions: 'If the problem persists, please contact SunPower.'
  },
  {
    event_code: '31034',
    event_name: 'hubplus_fw_error_flash_r_critical',
    code: '31034',
    in_use: true,
    error_description: 'MIDC firmware error',
    display: false,
    possible_causes: 'There is a problem with the firmware in the MIDC board.',
    recommended_actions: 'If the problem persists, please contact SunPower.'
  },
  {
    event_code: '31035',
    event_name: 'hubplus_fw_error_flash_crc_critical',
    code: '31035',
    in_use: true,
    error_description: 'MIDC firmware error',
    display: false,
    possible_causes: 'There is a problem with the firmware in the MIDC board.',
    recommended_actions: 'If the problem persists, please contact SunPower.'
  },
  {
    event_code: '31036',
    event_name: 'hubplus_fw_error_flash_w_critical',
    code: '31036',
    in_use: true,
    error_description: 'MIDC firmware error',
    display: false,
    possible_causes: 'There is a problem with the firmware in the MIDC board.',
    recommended_actions: 'If the problem persists, please contact SunPower.'
  },
  {
    event_code: '31037',
    event_name: 'hubplus_fw_error_eeprom_critical',
    code: '31037',
    in_use: true,
    error_description: 'MIDC firmware error',
    display: false,
    possible_causes: 'There is a problem with the firmware in the MIDC board.',
    recommended_actions: 'If the problem persists, please contact SunPower.'
  },
  {
    event_code: '31038',
    event_name: 'hubplus_fw_error_eeprom_r_critical',
    code: '31038',
    in_use: true,
    error_description: 'MIDC firmware error',
    display: false,
    possible_causes: 'There is a problem with the firmware in the MIDC board.',
    recommended_actions: 'If the problem persists, please contact SunPower.'
  },
  {
    event_code: '31039',
    event_name: 'hubplus_fw_error_eeprom_w_critical',
    code: '31039',
    in_use: true,
    error_description: 'MIDC firmware error',
    display: false,
    possible_causes: 'There is a problem with the firmware in the MIDC board.',
    recommended_actions: 'If the problem persists, please contact SunPower.'
  },
  {
    event_code: '31040',
    event_name: 'hubplus_fw_error_led_drv_critical',
    code: '31040',
    in_use: true,
    error_description: 'MIDC firmware error',
    display: false,
    possible_causes: 'There is a problem with the firmware in the MIDC board.',
    recommended_actions: 'If the problem persists, please contact SunPower.'
  },
  {
    event_code: '31041',
    event_name: 'hubplus_fw_error_mbs_critical',
    code: '31041',
    in_use: true,
    error_description: 'MIDC firmware error',
    display: false,
    possible_causes: 'There is a problem with the firmware in the MIDC board.',
    recommended_actions: 'If the problem persists, please contact SunPower.'
  },
  {
    event_code: '31042',
    event_name: 'hubplus_fw_error_btldr_en_key_critical',
    code: '31042',
    in_use: true,
    error_description: 'MIDC firmware error',
    display: false,
    possible_causes: 'There is a problem with the firmware in the MIDC board.',
    recommended_actions: 'If the problem persists, please contact SunPower.'
  },
  {
    event_code: '31043',
    event_name: 'hubplus_fw_error_btldr_already_critical',
    code: '31043',
    in_use: true,
    error_description: 'MIDC firmware error',
    display: false,
    possible_causes: 'There is a problem with the firmware in the MIDC board.',
    recommended_actions: 'If the problem persists, please contact SunPower.'
  },
  {
    event_code: '31044',
    event_name: 'hubplus_fw_error_btldr_data_ready_critical',
    code: '31044',
    in_use: true,
    error_description: 'MIDC firmware error',
    display: false,
    possible_causes: 'There is a problem with the firmware in the MIDC board.',
    recommended_actions: 'If the problem persists, please contact SunPower.'
  },
  {
    event_code: '31045',
    event_name: 'hubplus_fw_error_btldr_rsp_ready_critical',
    code: '31045',
    in_use: true,
    error_description: 'MIDC firmware error',
    display: false,
    possible_causes: 'There is a problem with the firmware in the MIDC board.',
    recommended_actions: 'If the problem persists, please contact SunPower.'
  },
  {
    event_code: '31046',
    event_name: 'hubplus_fw_error_contactor_protect_critical',
    code: '31046',
    in_use: true,
    error_description: 'MIDC firmware error',
    display: false,
    possible_causes: 'There is a problem with the firmware in the MIDC board.',
    recommended_actions: 'If the problem persists, please contact SunPower.'
  },
  {
    event_code: '31047',
    event_name: 'hubplus_fw_error_unknown_critical',
    code: '31047',
    in_use: true,
    error_description: 'MIDC firmware error',
    display: false,
    possible_causes: 'There is a problem with the firmware in the MIDC board.',
    recommended_actions: 'If the problem persists, please contact SunPower.'
  },
  {
    event_code: '31053',
    event_name: 'hubplus_event_main_over_volt_critical',
    code: '31053',
    in_use: true,
    error_description: 'MIDC over voltage event',
    display: false,
    possible_causes: 'MIDC may have been damaged.',
    recommended_actions: 'Consider replacing MIDC board.'
  },
  {
    event_code: '31054',
    event_name: 'hubplus_event_main_under_volt_critical',
    code: '31054',
    in_use: true,
    error_description: 'MIDC under voltage event',
    display: false,
    possible_causes: 'MIDC may have been damaged.',
    recommended_actions: 'Consider replacing MIDC board.'
  },
  {
    event_code: '32001',
    event_name: 'storage_inv_over_temperature_critical',
    code: '32001',
    in_use: true,
    error_description: 'Temperature of inverter critically high',
    display: false,
    possible_causes:
      'Inverter may be overloaded and/or exposed to high ambient temperature',
    recommended_actions:
      'Ensure that fans in ESS enclosure are working, the ESS is away from heat sources and loads are sized appropriately for the device.'
  },
  {
    event_code: '32002',
    event_name: 'f1_ac_output_undervoltage_shutdown_critical',
    code: '32002',
    in_use: true,
    error_description: 'AC Output Under Voltage',
    display: false,
    possible_causes:
      'AC under voltage shutdown at 108V. The inverter has shut down to protect the loads.',
    recommended_actions:
      'Clear the fault and attempt restart. If problem persists, call customer service.'
  },
  {
    event_code: '32003',
    event_name: 'f2_ac_output_overvoltage_shutdown_critical',
    code: '32003',
    in_use: true,
    error_description: 'AC Oputput Over Voltage',
    display: false,
    possible_causes:
      'AC over voltage shutdown at 135V. The inverter has shut down to protect the loads.',
    recommended_actions:
      'Clear the fault and attempt restart. If problem persists, call customer service.'
  },
  {
    event_code: '32004',
    event_name: 'f17_ac1_l1_backfeed_fault_critical',
    code: '32004',
    in_use: true,
    error_description: 'Inverter internal fault',
    display: false,
    possible_causes: 'Check inverter manual',
    recommended_actions: 'Check inverter manual'
  },
  {
    event_code: '32005',
    event_name: 'f18_ac1_l2_backfeed_fault_critical',
    code: '32005',
    in_use: true,
    error_description: 'Inverter internal fault',
    display: false,
    possible_causes: 'Check inverter manual',
    recommended_actions: 'Check inverter manual'
  },
  {
    event_code: '32006',
    event_name: 'f19_ac2_l1_backfeed_fault_critical',
    code: '32006',
    in_use: true,
    error_description: 'Inverter internal fault',
    display: false,
    possible_causes: 'Check inverter manual',
    recommended_actions: 'Check inverter manual'
  },
  {
    event_code: '32007',
    event_name: 'f20_ac2_l2_backfeed_fault_critical',
    code: '32007',
    in_use: true,
    error_description: 'Inverter internal fault',
    display: false,
    possible_causes: 'Check inverter manual',
    recommended_actions: 'Check inverter manual'
  },
  {
    event_code: '32008',
    event_name: 'f21_ac_l1l2_backfeed_fault_critical',
    code: '32008',
    in_use: true,
    error_description: 'Inverter internal fault',
    display: false,
    possible_causes: 'Check inverter manual',
    recommended_actions: 'Check inverter manual'
  },
  {
    event_code: '32009',
    event_name: 'f22_ac_l1_weld_backfeed_fault_critical',
    code: '32009',
    in_use: true,
    error_description: 'Inverter internal fault',
    display: false,
    possible_causes: 'Check inverter manual',
    recommended_actions: 'Check inverter manual'
  },
  {
    event_code: '32010',
    event_name: 'f23_antiislanding_fault_over_freq_critical',
    code: '32010',
    in_use: true,
    error_description: 'Inverter anti islanding fault',
    display: false,
    possible_causes: 'An unexpected condition occurred in the grid.',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem persists, please contact SunPower.'
  },
  {
    event_code: '32011',
    event_name: 'f24_antiislanding_fault_under_freq_critical',
    code: '32011',
    in_use: true,
    error_description: 'Inverter anti islanding fault',
    display: false,
    possible_causes: 'An unexpected condition occurred in the grid.',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem persists, please contact SunPower.'
  },
  {
    event_code: '32012',
    event_name: 'f25_antiislanding_over_freq_critical',
    code: '32012',
    in_use: true,
    error_description: 'Inverter anti islanding fault',
    display: false,
    possible_causes: 'An unexpected condition occurred in the grid.',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem persists, please contact SunPower.'
  },
  {
    event_code: '32013',
    event_name: 'f26_antiislanding_under_freq_critical',
    code: '32013',
    in_use: true,
    error_description: 'Inverter anti islanding fault',
    display: false,
    possible_causes: 'An unexpected condition occurred in the grid.',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem persists, please contact SunPower.'
  },
  {
    event_code: '32014',
    event_name: 'f27_antiislanding_l1_over_voltage_critical',
    code: '32014',
    in_use: true,
    error_description: 'Inverter anti islanding fault',
    display: false,
    possible_causes: 'An unexpected condition occurred in the grid.',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem persists, please contact SunPower.'
  },
  {
    event_code: '32015',
    event_name: 'f28_antiislanding_l2_over_voltage_critical',
    code: '32015',
    in_use: true,
    error_description: 'Inverter anti islanding fault',
    display: false,
    possible_causes: 'An unexpected condition occurred in the grid.',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem persists, please contact SunPower.'
  },
  {
    event_code: '32016',
    event_name: 'f29_antiislanding_over_voltage_critical',
    code: '32016',
    in_use: true,
    error_description: 'Inverter anti islanding fault',
    display: false,
    possible_causes: 'An unexpected condition occurred in the grid.',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem persists, please contact SunPower.'
  },
  {
    event_code: '32017',
    event_name: 'f30_antiislanding_l1l2_over_voltage_critical',
    code: '32017',
    in_use: true,
    error_description: 'Inverter anti islanding fault',
    display: false,
    possible_causes: 'An unexpected condition occurred in the grid.',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem persists, please contact SunPower.'
  },
  {
    event_code: '32018',
    event_name: 'f31_antiislanding_l1_over_voltage_slow_critical',
    code: '32018',
    in_use: true,
    error_description: 'Inverter anti islanding fault',
    display: false,
    possible_causes: 'An unexpected condition occurred in the grid.',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem persists, please contact SunPower.'
  },
  {
    event_code: '32019',
    event_name: 'f32_antiislanding_l2_over_voltage_slow_critical',
    code: '32019',
    in_use: true,
    error_description: 'Inverter anti islanding fault',
    display: false,
    possible_causes: 'An unexpected condition occurred in the grid.',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem persists, please contact SunPower.'
  },
  {
    event_code: '32020',
    event_name: 'f33_antiislanding_l1l2_over_voltage_slow_critical',
    code: '32020',
    in_use: true,
    error_description: 'Inverter anti islanding fault',
    display: false,
    possible_causes: 'An unexpected condition occurred in the grid.',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem persists, please contact SunPower.'
  },
  {
    event_code: '32021',
    event_name: 'f34_antiislanding_l1_under_voltage_slow_critical',
    code: '32021',
    in_use: true,
    error_description: 'Inverter anti islanding fault',
    display: false,
    possible_causes: 'An unexpected condition occurred in the grid.',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem persists, please contact SunPower.'
  },
  {
    event_code: '32022',
    event_name: 'f35_antiislanding_l2_under_voltage_slow_critical',
    code: '32022',
    in_use: true,
    error_description: 'Inverter anti islanding fault',
    display: false,
    possible_causes: 'An unexpected condition occurred in the grid.',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem persists, please contact SunPower.'
  },
  {
    event_code: '32023',
    event_name: 'f36_antiislanding_l1l2_under_voltage_slow_critical',
    code: '32023',
    in_use: true,
    error_description: 'Inverter anti islanding fault',
    display: false,
    possible_causes: 'An unexpected condition occurred in the grid.',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem persists, please contact SunPower.'
  },
  {
    event_code: '32024',
    event_name: 'f37_antiislanding_l1_under_voltage_fast_critical',
    code: '32024',
    in_use: true,
    error_description: 'Inverter anti islanding fault',
    display: false,
    possible_causes: 'An unexpected condition occurred in the grid.',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem persists, please contact SunPower.'
  },
  {
    event_code: '32025',
    event_name: 'f38_antiislanding_l2_under_voltage_fast_critical',
    code: '32025',
    in_use: true,
    error_description: 'Inverter anti islanding fault',
    display: false,
    possible_causes: 'An unexpected condition occurred in the grid.',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem persists, please contact SunPower.'
  },
  {
    event_code: '32026',
    event_name: 'f39_antiislanding_under_voltage_fast_critical',
    code: '32026',
    in_use: true,
    error_description: 'Inverter anti islanding fault',
    display: false,
    possible_causes: 'An unexpected condition occurred in the grid.',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem persists, please contact SunPower.'
  },
  {
    event_code: '32027',
    event_name: 'f40_antiislanding_l1l2_under_voltage_fast_critical',
    code: '32027',
    in_use: true,
    error_description: 'Inverter anti islanding fault',
    display: false,
    possible_causes: 'An unexpected condition occurred in the grid.',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem persists, please contact SunPower.'
  },
  {
    event_code: '32028',
    event_name: 'f41_aps_under_voltage_critical',
    code: '32028',
    in_use: true,
    error_description: 'Auxiliary power source under voltage',
    display: false,
    possible_causes: 'Auxiliary power source voltage too low.',
    recommended_actions:
      'Clear the fault and attempt restart. If problem persists, call customer service.'
  },
  {
    event_code: '32029',
    event_name: 'f42_aps_over_voltage_critical',
    code: '32029',
    in_use: true,
    error_description: 'Auxiliary power source over voltage',
    display: false,
    possible_causes: 'Auxiliary power source voltage is too high.',
    recommended_actions:
      'Clear the fault and attempt restart. If problem persists, call customer service.'
  },
  {
    event_code: '32030',
    event_name: 'f44_battery_over_temperature_critical',
    code: '32030',
    in_use: true,
    error_description: 'Battery over temperature',
    display: false,
    possible_causes: 'Battery temperature too high.',
    recommended_actions:
      'Clear the fault and attempt restart. Stop charging, check battery voltage and temperature. Check for excessive ambient temperature and adequate ventilation in the battery compartment. NOTE: Shutdown temperature is above 60C, Revovery occurs at 50C where the Conext XW pro will be enabled again.'
  },
  {
    event_code: '32031',
    event_name: 'f45_capacitor_over_temperature_critical',
    code: '32031',
    in_use: true,
    error_description: 'Capacitor over temperature',
    display: false,
    possible_causes: 'Capacitor over-tempeature shutdown at 105C.',
    recommended_actions:
      'Clear the fault and attempt restart. Ensure adequate ventilation around the Conext XW Pro. Reduce AC loads.'
  },
  {
    event_code: '32032',
    event_name: 'f46_controller_error_critical',
    code: '32032',
    in_use: true,
    error_description: 'Controller fault',
    display: false,
    possible_causes: 'Controller fault.',
    recommended_actions: 'Service required.'
  },
  {
    event_code: '32033',
    event_name: 'f47_dc_under_voltage_immediate_critical',
    code: '32033',
    in_use: true,
    error_description: 'DC Under voltage',
    display: false,
    possible_causes:
      'DC under-voltage shutdown (immediate) occurs if DC voltage is below 32V. The fault clears and the inverter restarts when DC voltage reaches V+4V.',
    recommended_actions:
      "Check for the correct battery voltage at the inverter's DC input terminals. Check for an external DC load on the batteries. Check condition of batteries and recharge if possible."
  },
  {
    event_code: '32034',
    event_name: 'f48_dc_under_voltage_shutdown_critical',
    code: '32034',
    in_use: true,
    error_description: 'DC Under voltage',
    display: false,
    possible_causes:
      'DC under-voltage shutdown (immediate) occurs if DC voltage is below 32V. The fault clears and the inverter restarts when DC voltage reaches V+4V.',
    recommended_actions:
      "Check for the correct battery voltage at the inverter's DC input terminals. Check for an external DC load on the batteries. Check condition of batteries and recharge if possible."
  },
  {
    event_code: '32035',
    event_name: 'f49_dc_over_voltage_shutdown_critical',
    code: '32035',
    in_use: true,
    error_description: 'DC over voltage',
    display: false,
    possible_causes:
      'DC over-voltage shutdown. Occurs if DC voltage goes over its setting. The fault can also occur when batteries are disconnected at the DC breaker while the Conext XW Pro is operating.',
    recommended_actions:
      'Clear the fault and attempt restart. Ensure battery voltage is below 58V DC at Conext XW Pro terminals. Check all other charging source outputs, battery cables. Ensure that batteries are connected, or that your DC source is regulated below your high battery cut out or increase your Hi Batt Cut Out setting.'
  },
  {
    event_code: '32036',
    event_name: 'f51_eeprom_error_critical',
    code: '32036',
    in_use: true,
    error_description: 'EEPROM Error',
    display: false,
    possible_causes: 'Internal inverter error',
    recommended_actions:
      'No action. Clear fault and resume operating or configuring the unit. If the fault persists, have the unit serviced.'
  },
  {
    event_code: '32037',
    event_name: 'f52_eeprom_error_cal_fail_critical',
    code: '32037',
    in_use: true,
    error_description: 'EEPROM Error',
    display: false,
    possible_causes: 'Internal inverter error',
    recommended_actions:
      'No action. Clear fault and resume operating or configuring the unit. If the fault persists, have the unit serviced.'
  },
  {
    event_code: '32038',
    event_name: 'f53_eeprom_error_config_fail_critical',
    code: '32038',
    in_use: true,
    error_description: 'EEPROM Error',
    display: false,
    possible_causes: 'Internal inverter error',
    recommended_actions:
      'No action. Clear fault and resume operating or configuring the unit. If the fault persists, have the unit serviced.'
  },
  {
    event_code: '32039',
    event_name: 'f54_eeprom_error_default_fail_critical',
    code: '32039',
    in_use: true,
    error_description: 'EEPROM Error',
    display: false,
    possible_causes: 'Internal inverter error',
    recommended_actions:
      'No action. Clear fault and resume operating or configuring the unit. If the fault persists, have the unit serviced.'
  },
  {
    event_code: '32040',
    event_name: 'f55_eeprom_error_log_fail_critical',
    code: '32040',
    in_use: true,
    error_description: 'EEPROM Error',
    display: false,
    possible_causes: 'Internal inverter error',
    recommended_actions:
      'No action. Clear fault and resume operating or configuring the unit. If the fault persists, have the unit serviced.'
  },
  {
    event_code: '32041',
    event_name: 'f56_eeprom_error_strings_fail_critical',
    code: '32041',
    in_use: true,
    error_description: 'EEPROM Error',
    display: false,
    possible_causes: 'Internal inverter error',
    recommended_actions:
      'No action. Clear fault and resume operating or configuring the unit. If the fault persists, have the unit serviced.'
  },
  {
    event_code: '32042',
    event_name: 'f57_fet1_over_temperature_shutdown_critical',
    code: '32042',
    in_use: true,
    error_description: 'FET1 Over Temperature Shutdown',
    display: false,
    possible_causes:
      'This error may be due to one of the following causes:\n- Internal temperature is over 105C\n- AC input voltage may be too high while charging\n- Operating too large of a load for too long\n- Inverter cooling fan may have failed\n- Inverter airflow intake may be blocked\n- Charging setting is to high based on ambient temperature around inverter',
    recommended_actions:
      'Depending on the cause try one of the following:\n- AC input voltage high: check for high input AC voltage.\n- High loads: remove excessive loads.\n- Failed inverter fan: hold a piece of paper to inverter vents to check the fan. If the fan has failed, have the inverter serviced.\n- Inverter airflow intake may be blocked: increase clearance around the inverter or unclog the fan air intake.\n- Charging setting too high: lower the max charge rate setting'
  },
  {
    event_code: '32043',
    event_name: 'f58_fet2_over_temperature_shutdown_critical',
    code: '32043',
    in_use: true,
    error_description: 'FET2 Over Temperature Shutdown',
    display: false,
    possible_causes:
      'This error may be due to one of the following causes:\n- Internal temperature is over 105C\n- AC input voltage may be too high while charging\n- Operating too large of a load for too long\n- Inverter cooling fan may have failed\n- Inverter airflow intake may be blocked\n- Charging setting is to high based on ambient temperature around inverter',
    recommended_actions:
      'Depending on the cause try one of the following:\n- AC input voltage high: check for high input AC voltage.\n- High loads: remove excessive loads.\n- Failed inverter: hold a piece of paper to inverter vents to check the fan. If the fan has failed, have the inverter serviced.\n- Inverter airflow intake may be blocked: increase clearance around the inverter or unclog the fan air intake.\n- Charging setting too high: lower the max charge rate setting'
  },
  {
    event_code: '32044',
    event_name: 'f59_configuration_copy_error_critical',
    code: '32044',
    in_use: true,
    error_description: 'Error configuring the inverter',
    display: false,
    possible_causes: 'Auto-configuration process failed.',
    recommended_actions: 'N/A'
  },
  {
    event_code: '32045',
    event_name: 'f60_invalid_input_critical',
    code: '32045',
    in_use: true,
    error_description: 'Invalid input error',
    display: false,
    possible_causes: 'N/A',
    recommended_actions: 'N/A'
  },
  {
    event_code: '32046',
    event_name: 'f61_invalid_warning_critical',
    code: '32046',
    in_use: true,
    error_description: 'Invalid input error',
    display: false,
    possible_causes: 'N/A',
    recommended_actions: 'N/A'
  },
  {
    event_code: '32047',
    event_name: 'f62_invalid_interrupt_critical',
    code: '32047',
    in_use: true,
    error_description: 'Invalid interrupt',
    display: false,
    possible_causes: 'N/A',
    recommended_actions: 'N/A'
  },
  {
    event_code: '32048',
    event_name: 'f63_ac_overload_primary_critical',
    code: '32048',
    in_use: true,
    error_description: 'AC Overload',
    display: false,
    possible_causes: 'Excessive load on the AC output.',
    recommended_actions:
      "Check for loads above the inverter's capacity. Turn off some loads if necessary. To clear the fault: Turn off th eunit by holding the power button for 5 sec. Disconnect the Conext XW Pro Inverter from the battery bank for 20 seconds."
  },
  {
    event_code: '32049',
    event_name: 'f64_ac_overload_secondary_1s_critical',
    code: '32049',
    in_use: true,
    error_description: 'AC Overload L1',
    display: false,
    possible_causes: 'Excessive load on the AC output.',
    recommended_actions:
      "Check for loads above the inverter's capacity. Turn off some loads if necessary. To clear the fault: Turn off th eunit by holding the power button for 5 sec. Disconnect the Conext XW Pro Inverter from the battery bank for 20 seconds."
  },
  {
    event_code: '32050',
    event_name: 'f65_ac_overload_2s_critical',
    code: '32050',
    in_use: true,
    error_description: 'AC Overload L2',
    display: false,
    possible_causes: 'Excessive load on the AC output.',
    recommended_actions:
      "Check for loads above the inverter's capacity. Turn off some loads if necessary. To clear the fault: Turn off th eunit by holding the power button for 5 sec. Disconnect the Conext XW Pro Inverter from the battery bank for 20 seconds."
  },
  {
    event_code: '32051',
    event_name: 'f66_system_configuration_error_critical',
    code: '32051',
    in_use: true,
    error_description: 'System configuration fault',
    display: false,
    possible_causes: 'Multi-unit configuration settings are incorrect.',
    recommended_actions:
      'Ensure only one unit is configured as the master. Ensure each unit has a unique Device Number and that connections have been configured correctly. Ensure there is only one primary charger.'
  },
  {
    event_code: '32052',
    event_name: 'f67_watchdog_reset_critical',
    code: '32052',
    in_use: true,
    error_description: 'Watchdog error',
    display: false,
    possible_causes: 'Inverter firmware error.',
    recommended_actions: 'Service required.'
  },
  {
    event_code: '32053',
    event_name: 'f68_transformer_over_temperature_critical',
    code: '32053',
    in_use: true,
    error_description: 'Transformer over termperature',
    display: false,
    possible_causes: 'The transformer temperature is over 140C.',
    recommended_actions:
      'The fault clears when the transformer temperature falls to 125C. Ensure adequate ventilation around the Conext XW Pro inverter. Reduce AC loads.'
  },
  {
    event_code: '32054',
    event_name: 'f69_synchronization_signal_fault_critical',
    code: '32054',
    in_use: true,
    error_description: 'External Sync Failed',
    display: false,
    possible_causes: 'Inverter could not synch with the grid.',
    recommended_actions:
      'Check connections and cable on external AC sync port. In a signle-inverter system, nothing must be plugged into the AC sync port. Clear fault and try again. If these steps fail, the unit requires service.'
  },
  {
    event_code: '32055',
    event_name: 'f70_3_phase_configuration_fault_critical',
    code: '32055',
    in_use: true,
    error_description: '3-phase configuration fault',
    display: false,
    possible_causes: 'N/A',
    recommended_actions: 'N/A'
  },
  {
    event_code: '32056',
    event_name: 'f90_external_bms_disconnected_critical',
    code: '32056',
    in_use: true,
    error_description: 'Inverter disconnected from battery',
    display: false,
    possible_causes:
      'Check connections between inverter, batteries and MIO board.',
    recommended_actions:
      'Check connections between inverter, batteries and MIO board.'
  },
  {
    event_code: '32057',
    event_name: 'f71_battery_discharge_over_current_critical',
    code: '32057',
    in_use: true,
    error_description: 'Battery discharge over current',
    display: false,
    possible_causes: 'There is an excessive load on the Li-Ion battery. ',
    recommended_actions: 'Reduce the load.'
  },
  {
    event_code: '32058',
    event_name: 'f72_external_contactor_malfunction_critical',
    code: '32058',
    in_use: true,
    error_description: 'MID contactor malfunction',
    display: false,
    possible_causes:
      'Could be one of the following:\n- Aux Cable severed\n- Aux Cable terminations are incorrect\n- Bad inverter comm card',
    recommended_actions:
      "Try the following: \n- Check for continuity on Aux cable terminations.\n- Check that the conductors are terminated correctly and in the right order on both ends of the cable.\n- Measure voltage on the Aux terminals of the inverter. If you can't read any voltage, the inverter COMM card may be defective and the unit may need to be serviced."
  },
  {
    event_code: '32059',
    event_name: 'f73_battery_charge_over_current_critical',
    code: '32059',
    in_use: true,
    error_description: 'Battery charge over current',
    display: false,
    possible_causes: 'Battery is being charged at an overly high rate.',
    recommended_actions: 'N/A'
  },
  {
    event_code: '32060',
    event_name: 'f74_battery_under_voltage_critical',
    code: '32060',
    in_use: true,
    error_description: 'Battery under voltage',
    display: false,
    possible_causes: 'Batteries have been discharged.',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem persists, try charging the batteries. If the problem still persists, the batteries need to be serviced.'
  },
  {
    event_code: '32061',
    event_name: 'f75_battery_over_voltage_critical',
    code: '32061',
    in_use: true,
    error_description: 'Battery over voltage',
    display: false,
    possible_causes: 'Batteries are charged above capacity.',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem persists, try discharging the batteries. If the problem still persists, the batteries need to be serviced.'
  },
  {
    event_code: '32062',
    event_name: 'f91_soc_level_lost_critical',
    code: '32062',
    in_use: true,
    error_description: 'Inverter cannot read battery SOC',
    display: false,
    possible_causes:
      "The PVS cannot connect with the batteries. This could be due because there are other connections missing. If you're also seeing a missing gateway error, missing MIDC or missing MIO board, this 'No BMS' error is likely due to any of these errors and you should try to fix them before you attempt to fix this.\n\nThis problem may be due to the following causes:\n1. Gateway is not connected. If this is the case, you'll also be seeing a 'No gateway' error and you should attempt fixing the problem first.\n1. CAN bus connection (green) between the MIO board (J4) and Schneider gateway is not properly made.\n1. The CAN bus connection on the Gateway side is not properly made or terminated (white-orange, orange, white-green, white-blue, and blue conductors).\n1. The CAN cable between J4 port on MIO and gateway is cut off.\n1. Connection between the batteries (orange) and the MIO board is not properly made\n1. Batteries are not powered on.",
    recommended_actions:
      "Please try the following steps\n1. If you're also seeing a 'missing gateway' error, please try to fix that problem first following the instructions in the error message.\n1. Check that the CAN bus connection on the Gateway side is not properly made or terminated (white-orange, orange, white-green, white-blue, and blue conductors).\n1. Check that the orange cable between the master battery and the MIO board is properly connected and terminated.\n1. Check that the batteries are powered on (check status of LEDs around the power button on the side of the batteries).\n1. Check that the DC breakers are on the closed position.\n1. Attempt commissioning again.\n\nIf the problem persists, this may be a sign that one or more batteries are damaged. Please contact SunPower."
  },
  {
    event_code: '32063',
    event_name: 'f92_gateway_comms_lost_critical',
    code: '32063',
    in_use: true,
    error_description: 'Inverter cannot communicate with the gateway.',
    display: false,
    possible_causes:
      "The Schneider Gateway connects the inverter with PVS and batteries. If you're seeing this error it is likely you're also seeing other errors such as batteries  or inverter(s) missing.\n\nThis problem may be due to the following causes:\n1. Gateway lost power.\n1. The ethernet connector between the gateway and PVS is not connected or terminated correctly.\n1. Gateway may need to be rebooted.",
    recommended_actions:
      "1- Check that the gateway has power: the LEDs should be blinking.\n1. Check that the green cable and its orange, orange/white, green, blue and blue/white conductors in the metal ferules on the gateway side are properly connected to the J4 port on the MIO board.\n1. Check the black ethernet cable is connected to the black ethernet port on the PVS. Check also that the cable is correctly terminated.\n1. Check that the cable mentioned in 3 is connected to the port labeled as 'ethernet' on the Schneider gateway.\n1. Reboot the gateway by  pulling the ethernet connectors from the left-side of the Gateway and plugging them back into the same ports they were in. It may take a few minutes for the gateway to reboot.\n1. Press 'retry' on the commissioning app.\n\nIf the problem persists, this may be a sign that the Schneider Gateway is damaged. Please contact SunPower."
  },
  {
    event_code: '32064',
    event_name: 'f93_sunspec_controller_comms_lost_critical',
    code: '32064',
    in_use: true,
    error_description: 'Inverter cannot communicate with the PVS',
    display: false,
    possible_causes:
      "Schneider Connext XW Pro inverter cannot connect to PVS.\n1.  If you're also seeing an error that indicates that the gateway is missing, this error may be due to the fact that the gateway is not properly connected. Please address the problem with the gateway first if you're seeing a gateway error. \n1. The inverter may need to be rebooted.\n1. A data connection between the inverter.MIO and PVS is not properly made.\n",
    recommended_actions:
      "Please try the following steps:\n1. If you're also seeing a 'missing gateway' error, please try to fix that problem first following the instructions in the 'missing gateway' error message.\n1. Reboot the inverter by pressing the 'on/off' button on the XWPro inverter for a few seconds until you see 'OFF' appear on the inverter display, then press the 'on/off' button again\n1. Press the retry button on the app.\nIf the problem persists:\n1. Check that the yellow XANBUS connector between the Schneider gateway and the inverter is correctly terminated and connected to the port labeled as XANBUS in he inverter (underneath the inverter, to the right of the SYNC port left of BTS port and AUX ports).\n1. Check that the RPO cable in the inverter (port labeled as BTS) is connected to the J5 (red) termination in the MIO board.\n1. Check that any of LEDs on inverter are On. \n1. Check that the DC conductors have at least 48V between terminations.\n1. Ensure that the DC terminations are done correctly\n1. Ensure that the DC breakers are closed.\n1. Ensure that the batteries are on. If not, press the ON button on the batteries.\n1. Check that the gray AUX connector from the inverter is connected to the J16 termination on the MIDC board.\n1. Press retry on the commissioning app.\n\nIf the problem persists, this may be a sign that the inverter is damaged. Please contact SunPower."
  },
  {
    event_code: '32065',
    event_name: 'storage_inv_firmware_update_failure_critical',
    code: '32065',
    in_use: true,
    error_description: 'Failure updating inverter firmware.',
    display: false,
    possible_causes:
      'Something went wrong while updating Conext XW Pro inverter.',
    recommended_actions:
      'Ensure the app has downloaded the ESS firmware in full. Try updating firmware again. If the problem persists, please contact SunPower.'
  },
  {
    event_code: '32066',
    event_name: 'storage_inv_communication_outage_critical',
    code: '32066',
    in_use: true,
    error_description: 'Inverter cannot communicate with the PVS',
    display: false,
    possible_causes:
      "Schneider Connext XW Pro inverter cannot connect to PVS.\n1.  If you're also seeing an error that indicates that the gateway is missing, this error may be due to the fact that the gateway is not properly connected. Please address the problem with the gateway first if you're seeing a gateway error. \n1. The inverter may need to be rebooted.\n1. A data connection between the inverter.MIO and PVS is not properly made.\n",
    recommended_actions:
      "Please try the following steps:\n1. If you're also seeing a 'missing gateway' error, please try to fix that problem first following the instructions in the 'missing gateway' error message.\n1. Reboot the inverter by pressing the 'on/off' button on the XWPro inverter for a few seconds until you see 'OFF' appear on the inverter display, then press the 'on/off' button again\n1. Press the retry button on the app.\nIf the problem persists:\n1. Check that the yellow XANBUS connector between the Schneider gateway and the inverter is correctly terminated and connected to the port labeled as XANBUS in he inverter (underneath the inverter, to the right of the SYNC port left of BTS port and AUX ports).\n1. Check that the RPO cable in the inverter (port labeled as BTS) is connected to the J5 (red) termination in the MIO board.\n1. Check that any of LEDs on inverter are On. \n1. Check that the DC conductors have at least 48V between terminations.\n1. Ensure that the DC terminations are done correctly\n1. Ensure that the DC breakers are closed.\n1. Ensure that the batteries are on. If not, press the ON button on the batteries.\n1. Check that the gray AUX connector from the inverter is connected to the J16 termination on the MIDC board.\n1. Press retry on the commissioning app.\n\nIf the problem persists, this may be a sign that the inverter is damaged. Please contact SunPower."
  },
  {
    event_code: '33000',
    event_name: 'battery_low_state_of_charge_critical',
    code: '33000',
    in_use: true,
    error_description: 'Batteries have a low state of charge.',
    display: false,
    possible_causes: 'Batteries have been discharged.',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem persists, try charging the batteries. If the problem still persists, the batteries need to be serviced.'
  },
  {
    event_code: '33001',
    event_name: 'battery_low_state_of_health_critical',
    code: '33001',
    in_use: true,
    error_description: 'Batteries have low state of health',
    display: false,
    possible_causes: 'Batteries have been degraded.',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem still persists, the batteries need to be serviced.'
  },
  {
    event_code: '33002',
    event_name: 'battery_communication_outage_critical',
    code: '33002',
    in_use: true,
    error_description: 'PVS cannot communicate with the batteries.',
    display: false,
    possible_causes:
      "The PVS cannot connect with the batteries. This could be due because there are other connections missing. If you're also seeing a missing gateway error, missing MIDC or missing MIO board, this 'No BMS' error is likely due to any of these errors and you should try to fix them before you attempt to fix this.\n\nThis problem may be due to the following causes:\n1. Gateway is not connected. If this is the case, you'll also be seeing a 'No gateway' error and you should attempt fixing the problem first.\n1. CAN bus connection (green) between the MIO board (J4) and Schneider gateway is not properly made.\n1. The CAN bus connection on the Gateway side is not properly made or terminated (white-orange, orange, white-green, white-blue, and blue conductors).\n1. The CAN cable between J4 port on MIO and gateway is cut off.\n1. Connection between the batteries (orange) and the MIO board is not properly made\n1. Batteries are not powered on.",
    recommended_actions:
      "Please try the following steps\n1. If you're also seeing a 'missing gateway' error, please try to fix that problem first following the instructions in the error message.\n1. Check that the CAN bus connection on the Gateway side is not properly made or terminated (white-orange, orange, white-green, white-blue, and blue conductors).\n1. Check that the orange cable between the master battery and the MIO board is properly connected and terminated.\n1. Check that the batteries are powered on (check status of LEDs around the power button on the side of the batteries).\n1. Check that the DC breakers are on the closed position.\n1. Attempt commissioning again.\n\nIf the problem persists, this may be a sign that one or more batteries are damaged. Please contact SunPower."
  },
  {
    event_code: '33003',
    event_name: 'battery_under_voltage_critical',
    code: '33003',
    in_use: true,
    error_description: 'Battery under voltage',
    display: false,
    possible_causes: 'Batteries have been discharged.',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem persists, try charging the batteries. If the problem still persists, the batteries need to be serviced.'
  },
  {
    event_code: '33004',
    event_name: 'battery_over_voltage_critical',
    code: '33004',
    in_use: true,
    error_description: 'Battery over voltage',
    display: false,
    possible_causes: 'Batteries are charged above capacity.',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem persists, try discharging the batteries. If the problem still persists, the batteries need to be serviced.'
  },
  {
    event_code: '33005',
    event_name: 'battery_over_current_during_charge_critical',
    code: '33005',
    in_use: true,
    error_description: 'Battery over current during charge',
    display: false,
    possible_causes: 'The batteries are being charged at a fast rate',
    recommended_actions:
      'Make sure that both DC breakers are closed. Clear the fault and restart. If the problem persists, the batteries may need to be serviced.'
  },
  {
    event_code: '33006',
    event_name: 'battery_over_power_during_charge_critical',
    code: '33006',
    in_use: true,
    error_description: 'Battery over power during charge',
    display: false,
    possible_causes: 'The batteries are being charged at a fast rate',
    recommended_actions:
      'Make sure that both DC breakers are closed. Clear the fault and restart. If the problem persists, the batteries may need to be serviced.'
  },
  {
    event_code: '33007',
    event_name: 'battery_over_current_during_discharge_critical',
    code: '33007',
    in_use: true,
    error_description: 'Battery over current during discharge',
    display: false,
    possible_causes:
      'This could be due to one of the following causes:\n- The loads are too high.\n- One of the DC breakers was left open.',
    recommended_actions:
      'Make sure the loads are appropriately sized for the ESS.\nCheck that both DC breakers are closed'
  },
  {
    event_code: '33008',
    event_name: 'battery_over_power_during_discharge_critical',
    code: '33008',
    in_use: true,
    error_description: 'Battery over power during discharge',
    display: false,
    possible_causes:
      'This could be due to one of the following causes:\n- The loads are too high.\n- One of the DC breakers was left open.',
    recommended_actions:
      'Make sure the loads are appropriately sized for the ESS.\nCheck that both DC breakers are closed'
  },
  {
    event_code: '33009',
    event_name: 'battery_over_current_limit_during_charge_critical',
    code: '33009',
    in_use: true,
    error_description: 'Battery over current during charge',
    display: false,
    possible_causes: 'The batteries are being charged at a fast rate',
    recommended_actions:
      'Make sure that both DC breakers are closed. Clear the fault and restart. If the problem persists, the batteries may need to be serviced.'
  },
  {
    event_code: '33010',
    event_name: 'battery_over_current_limit_during_discharge_critical',
    code: '33010',
    in_use: true,
    error_description: 'Battery over power during charge',
    display: false,
    possible_causes: 'The batteries are being charged at a fast rate',
    recommended_actions:
      'Make sure that both DC breakers are closed. Clear the fault and restart. If the problem persists, the batteries may need to be serviced.'
  },
  {
    event_code: '33011',
    event_name: 'battery_under_temperature_during_charge_critical',
    code: '33011',
    in_use: true,
    error_description: 'Battery over current during discharge',
    display: false,
    possible_causes:
      'This could be due to one of the following causes:\n- The loads are too high.\n- One of the DC breakers was left open.',
    recommended_actions:
      'Make sure the loads are appropriately sized for the ESS.\nCheck that both DC breakers are closed'
  },
  {
    event_code: '33012',
    event_name: 'battery_over_temperature_during_charge_critical',
    code: '33012',
    in_use: true,
    error_description: 'Battery over power during discharge',
    display: false,
    possible_causes:
      'This could be due to one of the following causes:\n- The loads are too high.\n- One of the DC breakers was left open.',
    recommended_actions:
      'Make sure the loads are appropriately sized for the ESS.\nCheck that both DC breakers are closed'
  },
  {
    event_code: '33013',
    event_name: 'battery_under_temperature_during_discharge_critical',
    code: '33013',
    in_use: true,
    error_description: 'Battery under temperature during discharge',
    display: false,
    possible_causes: 'Battery temperature is too low.',
    recommended_actions:
      'Make sure the ESS enclosure is not exposed to unduly low temperatures.'
  },
  {
    event_code: '33014',
    event_name: 'battery_over_temperature_during_discharge_critical',
    code: '33014',
    in_use: true,
    error_description: 'Battery over temperature',
    display: false,
    possible_causes: 'Battery temperature too high.',
    recommended_actions:
      'Clear the fault and attempt restart. Stop charging, check battery voltage and temperature. Check for excessive ambient temperature and adequate ventilation in the battery compartment. '
  },
  {
    event_code: '33015',
    event_name: 'battery_cell_delta_voltage_too_high_critical',
    code: '33015',
    in_use: true,
    error_description: 'Battery cell delta voltage too high',
    display: false,
    possible_causes: 'Voltage mismatch in battery cells.',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem persists, please service the batteries.'
  },
  {
    event_code: '33016',
    event_name: 'battery_cell_temperature_diff_too_high_critical',
    code: '33016',
    in_use: true,
    error_description: 'Battery cell temperature difference too high',
    display: false,
    possible_causes: 'Temperature mismatch in battery cells.',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem persists, please service the batteries.'
  },
  {
    event_code: '33020',
    event_name: 'battery_hardware_under_voltage_critical',
    code: '33020',
    in_use: true,
    error_description: 'Battery under voltage',
    display: false,
    possible_causes: 'Battery voltage low',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem persists, please service the batteries.'
  },
  {
    event_code: '33021',
    event_name: 'battery_hardware_over_voltage_critical',
    code: '33021',
    in_use: true,
    error_description: 'Battery over voltage',
    display: false,
    possible_causes: 'Battery voltage high',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem persists, try discharging the batteries. If the problem persists, please service the batteries.'
  },
  {
    event_code: '33022',
    event_name: 'battery_hardware_over_current_critical',
    code: '33022',
    in_use: true,
    error_description: 'Battery over current',
    display: false,
    possible_causes:
      'This could be due to one of the following causes:\n- The loads are too high.\n- One of the DC breakers was left open.',
    recommended_actions:
      'Make sure the loads are appropriately sized for the ESS.\nCheck that both DC breakers are closed'
  },
  {
    event_code: '33023',
    event_name: 'battery_hardware_over_temperature_critical',
    code: '33023',
    in_use: true,
    error_description: 'Battery over temperature',
    display: false,
    possible_causes: 'Battery temperature too high.',
    recommended_actions:
      'Clear the fault and attempt restart. Stop charging, check battery voltage and temperature. Check for excessive ambient temperature and adequate ventilation in the battery compartment. '
  },
  {
    event_code: '33024',
    event_name: 'battery_adc_module_fault_critical',
    code: '33024',
    in_use: true,
    error_description: 'Internal battery error',
    display: false,
    possible_causes: 'Internal battery error',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem persists, please contact SunPower support for  further help.'
  },
  {
    event_code: '33025',
    event_name: 'battery_afe_mcu_comm_error_critical',
    code: '33025',
    in_use: true,
    error_description: 'Internal battery error',
    display: false,
    possible_causes: 'Internal battery error',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem persists, please contact SunPower support for  further help.'
  },
  {
    event_code: '33026',
    event_name: 'battery_pre_charge_failure_critical',
    code: '33026',
    in_use: true,
    error_description: 'Internal battery error',
    display: false,
    possible_causes: 'Internal battery error',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem persists, please contact SunPower support for  further help.'
  },
  {
    event_code: '33027',
    event_name: 'battery_contactor_welded_critical',
    code: '33027',
    in_use: true,
    error_description: 'Internal battery error',
    display: false,
    possible_causes: 'Internal battery error',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem persists, please contact SunPower support for  further help.'
  },
  {
    event_code: '33028',
    event_name: 'battery_pos_contactor_drive_fault_critical',
    code: '33028',
    in_use: true,
    error_description: 'Internal battery error',
    display: false,
    possible_causes: 'Internal battery error',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem persists, please contact SunPower support for  further help.'
  },
  {
    event_code: '33029',
    event_name: 'battery_pre_charge_contactor_drive_fault_critical',
    code: '33029',
    in_use: true,
    error_description: 'Internal battery error',
    display: false,
    possible_causes: 'Internal battery error',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem persists, please contact SunPower support for  further help.'
  },
  {
    event_code: '33030',
    event_name: 'battery_neg_contactor_drive_fault_critical',
    code: '33030',
    in_use: true,
    error_description: 'Internal battery error',
    display: false,
    possible_causes: 'Internal battery error',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem persists, please contact SunPower support for  further help.'
  },
  {
    event_code: '33031',
    event_name: 'battery_pos_contactor_offline_critical',
    code: '33031',
    in_use: true,
    error_description: 'Internal battery error',
    display: false,
    possible_causes: 'Internal battery error',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem persists, please contact SunPower support for  further help.'
  },
  {
    event_code: '33032',
    event_name: 'battery_pre_charge_contactor_offline_critical',
    code: '33032',
    in_use: true,
    error_description: 'Internal battery error',
    display: false,
    possible_causes: 'Internal battery error',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem persists, please contact SunPower support for  further help.'
  },
  {
    event_code: '33033',
    event_name: 'battery_neg_contactor_offline_critical',
    code: '33033',
    in_use: true,
    error_description: 'Internal battery error',
    display: false,
    possible_causes: 'Internal battery error',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem persists, please contact SunPower support for  further help.'
  },
  {
    event_code: '33034',
    event_name: 'battery_pos_contactor_welded_critical',
    code: '33034',
    in_use: true,
    error_description: 'Internal battery error',
    display: false,
    possible_causes: 'Internal battery error',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem persists, please contact SunPower support for  further help.'
  },
  {
    event_code: '33035',
    event_name: 'battery_neg_contactor_welded_critical',
    code: '33035',
    in_use: true,
    error_description: 'Internal battery error',
    display: false,
    possible_causes: 'Internal battery error',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem persists, please contact SunPower support for  further help.'
  },
  {
    event_code: '33036',
    event_name: 'battery_pack_enumeration_error_critical',
    code: '33036',
    in_use: true,
    error_description: 'Internal battery error',
    display: false,
    possible_causes: 'Internal battery error',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem persists, please contact SunPower support for  further help.'
  },
  {
    event_code: '33037',
    event_name: 'battery_master_slave_communication_error_critical',
    code: '33037',
    in_use: true,
    error_description: 'Internal battery communication error',
    display: false,
    possible_causes: 'Master battery cannot communicate with slave',
    recommended_actions:
      'Check that battery communication cable is connected and both batteries are on. Clear the fault and attempt restart. If the problem persists, please service the batteries.'
  },
  {
    event_code: '33038',
    event_name: 'battery_soft_start_failure_critical',
    code: '33038',
    in_use: true,
    error_description: 'Internal battery error',
    display: false,
    possible_causes: 'Internal battery error',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem persists, please service the batteries.'
  },
  {
    event_code: '33039',
    event_name: 'battery_internal_failure_critical',
    code: '33039',
    in_use: true,
    error_description: 'Internal battery error',
    display: false,
    possible_causes: 'Internal battery error',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem persists, please service the batteries.'
  },
  {
    event_code: '33044',
    event_name: 'battery_firmware_update_failure_critical',
    code: '33044',
    in_use: true,
    error_description: 'Internal battery error',
    display: false,
    possible_causes: 'Internal battery error',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem persists, please service the batteries.'
  },
  {
    event_code: '34001',
    event_name: 'esshub_over_temperature_critical',
    code: '34001',
    in_use: true,
    error_description: 'ESS enclosure over temperarture',
    display: false,
    possible_causes:
      'The ESS enclosure may be located in an overly hot location.\nESS enclosure fans may be blocked or faulty. ',
    recommended_actions:
      'Ensure that ESS is not near a heat source. \nEnsure that ESS fans are not blocked.\nCheck that the inverter air filter is unblocked and clean.\nCheck that the ESS enclosure door is properly locked.'
  },
  {
    event_code: '34010',
    event_name: 'esshub_communication_outage_critical',
    code: '34010',
    in_use: true,
    error_description: 'MIO Communication outage',
    display: false,
    possible_causes:
      "The PVS cannot connect with the MIO board. The MIO board is a hub for data connections to the batteries, inverter, and gateway, so if you're seeing this error, it is likely you're also seeing other errors such as missing batteries or inverters.\n\nThis problem may be due to one of the following causes:\n1. Faulty data connection between the Hub+ and the MIO board.\n1. MIO lost power.\n1. Faulty data connection with another MIO board (applicable to Power Expansion packs only)",
    recommended_actions:
      'Please try the following steps:\n1. Check that the MIO board is powered: one LED should be blinking and the other one should be solid.\n1.  Check that the gray ethernet cable from the J1 port on the MIO board is connected to the J14 port on the MIDC. Check that the cable is terminated correctly. \n1. Check that the 48V DC connection on the MIO board is connected to the DC terminals on the inverter and properly grounded and terminated.\n1. Press the retry button on the app.\n\nIf the problem persists, this may be a sign that the MIO board is damaged. Please contact SunPower.'
  },
  {
    event_code: '34011',
    event_name: 'esshub_fw_error_inval_critical',
    code: '34011',
    in_use: true,
    error_description: 'MIO firmware error',
    display: false,
    possible_causes: 'There is a problem with the firmware in the MIDC board.',
    recommended_actions: 'If the problem persists, please contact SunPower.'
  },
  {
    event_code: '34012',
    event_name: 'esshub_fw_error_spi_bsy_critical',
    code: '34012',
    in_use: true,
    error_description: 'MIO firmware error',
    display: false,
    possible_causes: 'There is a problem with the firmware in the MIDC board.',
    recommended_actions: 'If the problem persists, please contact SunPower.'
  },
  {
    event_code: '34013',
    event_name: 'esshub_fw_error_spi_inval_cs_critical',
    code: '34013',
    in_use: true,
    error_description: 'MIO firmware error',
    display: false,
    possible_causes: 'There is a problem with the firmware in the MIDC board.',
    recommended_actions: 'If the problem persists, please contact SunPower.'
  },
  {
    event_code: '34014',
    event_name: 'esshub_fw_error_spi_critical',
    code: '34014',
    in_use: true,
    error_description: 'MIO firmware error',
    display: false,
    possible_causes: 'There is a problem with the firmware in the MIDC board.',
    recommended_actions: 'If the problem persists, please contact SunPower.'
  },
  {
    event_code: '34015',
    event_name: 'esshub_fw_error_flash_w_key_critical',
    code: '34015',
    in_use: true,
    error_description: 'MIO firmware error',
    display: false,
    possible_causes: 'There is a problem with the firmware in the MIDC board.',
    recommended_actions: 'If the problem persists, please contact SunPower.'
  },
  {
    event_code: '34016',
    event_name: 'esshub_fw_error_flash_r_critical',
    code: '34016',
    in_use: true,
    error_description: 'MIO firmware error',
    display: false,
    possible_causes: 'There is a problem with the firmware in the MIDC board.',
    recommended_actions: 'If the problem persists, please contact SunPower.'
  },
  {
    event_code: '34017',
    event_name: 'esshub_fw_error_flash_crc_critical',
    code: '34017',
    in_use: true,
    error_description: 'MIO firmware error',
    display: false,
    possible_causes: 'There is a problem with the firmware in the MIDC board.',
    recommended_actions: 'If the problem persists, please contact SunPower.'
  },
  {
    event_code: '34018',
    event_name: 'esshub_fw_error_flash_w_critical',
    code: '34018',
    in_use: true,
    error_description: 'MIO firmware error',
    display: false,
    possible_causes: 'There is a problem with the firmware in the MIDC board.',
    recommended_actions: 'If the problem persists, please contact SunPower.'
  },
  {
    event_code: '34019',
    event_name: 'esshub_fw_error_eeprom_critical',
    code: '34019',
    in_use: true,
    error_description: 'MIO firmware error',
    display: false,
    possible_causes: 'There is a problem with the firmware in the MIDC board.',
    recommended_actions: 'If the problem persists, please contact SunPower.'
  },
  {
    event_code: '34020',
    event_name: 'esshub_fw_error_eeprom_r_critical',
    code: '34020',
    in_use: true,
    error_description: 'MIO firmware error',
    display: false,
    possible_causes: 'There is a problem with the firmware in the MIDC board.',
    recommended_actions: 'If the problem persists, please contact SunPower.'
  },
  {
    event_code: '34021',
    event_name: 'esshub_fw_error_eeprom_w_critical',
    code: '34021',
    in_use: true,
    error_description: 'MIO firmware error',
    display: false,
    possible_causes: 'There is a problem with the firmware in the MIDC board.',
    recommended_actions: 'If the problem persists, please contact SunPower.'
  },
  {
    event_code: '34022',
    event_name: 'esshub_fw_error_led_drv_critical',
    code: '34022',
    in_use: true,
    error_description: 'MIO firmware error',
    display: false,
    possible_causes: 'There is a problem with the firmware in the MIDC board.',
    recommended_actions: 'If the problem persists, please contact SunPower.'
  },
  {
    event_code: '34023',
    event_name: 'esshub_fw_error_mbs_critical',
    code: '34023',
    in_use: true,
    error_description: 'MIO firmware error',
    display: false,
    possible_causes: 'There is a problem with the firmware in the MIDC board.',
    recommended_actions: 'If the problem persists, please contact SunPower.'
  },
  {
    event_code: '34024',
    event_name: 'esshub_fw_error_btldr_en_key_critical',
    code: '34024',
    in_use: true,
    error_description: 'MIO firmware error',
    display: false,
    possible_causes: 'There is a problem with the firmware in the MIDC board.',
    recommended_actions: 'If the problem persists, please contact SunPower.'
  },
  {
    event_code: '34025',
    event_name: 'esshub_fw_error_btldr_already_critical',
    code: '34025',
    in_use: true,
    error_description: 'MIO firmware error',
    display: false,
    possible_causes: 'There is a problem with the firmware in the MIDC board.',
    recommended_actions: 'If the problem persists, please contact SunPower.'
  },
  {
    event_code: '34026',
    event_name: 'esshub_fw_error_btldr_data_ready_critical',
    code: '34026',
    in_use: true,
    error_description: 'MIO firmware error',
    display: false,
    possible_causes: 'There is a problem with the firmware in the MIDC board.',
    recommended_actions: 'If the problem persists, please contact SunPower.'
  },
  {
    event_code: '34027',
    event_name: 'esshub_fw_error_btldr_rsp_ready_critical',
    code: '34027',
    in_use: true,
    error_description: 'MIO firmware error',
    display: false,
    possible_causes: 'There is a problem with the firmware in the MIDC board.',
    recommended_actions: 'If the problem persists, please contact SunPower.'
  },
  {
    event_code: '34028',
    event_name: 'esshub_fw_error_contactor_protect_critical',
    code: '34028',
    in_use: true,
    error_description: 'MIO firmware error',
    display: false,
    possible_causes: 'There is a problem with the firmware in the MIDC board.',
    recommended_actions: 'If the problem persists, please contact SunPower.'
  },
  {
    event_code: '34029',
    event_name: 'esshub_fw_error_unknown_critical',
    code: '34029',
    in_use: true,
    error_description: 'MIO firmware error',
    display: false,
    possible_causes: 'There is a problem with the firmware in the MIDC board.',
    recommended_actions: 'If the problem persists, please contact SunPower.'
  },
  {
    event_code: '34030',
    event_name: 'esshub_firmware_update_failure_critical',
    code: '34030',
    in_use: true,
    error_description: 'MIO firmware update error',
    display: false,
    possible_causes:
      'There is a problem with updating firmware in the MIDC board.',
    recommended_actions:
      'Please try updating the firmware again. If the problem persists, please contact SunPower.'
  },
  {
    event_code: '35000',
    event_name: 'gateway_communication_outage_critical',
    code: '35000',
    in_use: true,
    error_description: 'PVS could not connect to ESS Gateway',
    display: false,
    possible_causes:
      "The Schneider Gateway connects the inverter with PVS and batteries. If you're seeing this error it is likely you're also seeing other errors such as batteries  or inverter(s) missing.\n\nThis problem may be due to the following causes:\n1. Gateway lost power.\n1. The ethernet connector between the gateway and PVS is not connected or terminated correctly.\n1. Gateway may need to be rebooted.",
    recommended_actions:
      "1- Check that the gateway has power: the LEDs should be blinking.\n1. Check that the green cable and its orange, orange/white, green, blue and blue/white conductors in the metal ferules on the gateway side are properly connected to the J4 port on the MIO board.\n1. Check the black ethernet cable is connected to the black ethernet port on the PVS. Check also that the cable is correctly terminated.\n1. Check that the cable mentioned in 3 is connected to the port labeled as 'ethernet' on the Schneider gateway.\n1. Reboot the gateway by  pulling the ethernet connectors from the left-side of the Gateway and plugging them back into the same ports they were in. It may take a few minutes for the gateway to reboot.\n1. Press 'retry' on the commissioning app.\n\nIf the problem persists, this may be a sign that the Schneider Gateway is damaged. Please contact SunPower."
  },
  {
    event_code: '35001',
    event_name: 'gateway_firmware_update_failure_critical',
    code: '35001',
    in_use: true,
    error_description: 'Gateway firmware update error',
    display: false,
    possible_causes: 'Could not update gateway firmware.',
    recommended_actions:
      '1- Reboot the gateway by  pulling the ethernet connectors from the left-side of the Gateway and plugging them back into the same ports they were in. It may take a few minutes for the gateway to reboot.\n1. Try updating the firmware again. \nIf the problem persists, please contact SunPower.'
  },
  {
    event_code: '35002',
    event_name: 'gateway_bulk_settings_failure_critical',
    code: '35002',
    in_use: true,
    error_description: 'Inverter bulk settings update error',
    display: true,
    possible_causes: 'Could not update settings in the inverter.',
    recommended_actions:
      "1- Reboot the gateway by  pulling the ethernet connectors from the left-side of the Gateway and plugging them back into the same ports they were in. It may take a few minutes for the gateway to reboot.\n1. Try applying bulk settings again by tapping 'retry' or running the firmware update step again.\nIf the problem persists, please contact SunPower."
  },
  {
    event_code: '43040',
    event_name: 'battery_cell_under_voltage_permanent',
    code: '43040',
    in_use: true,
    error_description: 'Battery under voltage',
    display: false,
    possible_causes: 'Battery voltage low',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem persists, please service the batteries.'
  },
  {
    event_code: '43041',
    event_name: 'battery_cell_over_voltage_permanent',
    code: '43041',
    in_use: true,
    error_description: 'Battery over voltage',
    display: false,
    possible_causes: 'Battery voltage high',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem persists, try discharging the batteries. If the problem persists, please contact SunPower.'
  },
  {
    event_code: '43042',
    event_name: 'battery_cell_delta_voltage_permanent',
    code: '43042',
    in_use: true,
    error_description: 'Battery cell delta voltage too high',
    display: false,
    possible_causes: 'Voltage mismatch in battery cells.',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem persists, please contact SunPower.'
  },
  {
    event_code: '43043',
    event_name: 'battery_state_of_health_permanent',
    code: '43043',
    in_use: true,
    error_description: 'Batteries have low state of health',
    display: false,
    possible_causes: 'Batteries have been degraded.',
    recommended_actions:
      'Clear the fault and attempt restart. If the problem still persists, the batteries need to be serviced.'
  },
  {
    event_code: '',
    event_name: 'contactor_open_info',
    code: '1001',
    in_use: true,
    error_description: '',
    display: false,
    possible_causes: '',
    recommended_actions: ''
  },
  {
    event_code: '',
    event_name: 'contactor_closed_info',
    code: '1002',
    in_use: true,
    error_description: '',
    display: false,
    possible_causes: '',
    recommended_actions: ''
  },
  {
    event_code: '',
    event_name: 'rapid_shutdown_activated_info',
    code: '1015',
    in_use: true,
    error_description: '',
    display: false,
    possible_causes: '',
    recommended_actions: ''
  },
  {
    event_code: '',
    event_name: 'hubplus_jumpstart_detected_info',
    code: '1022',
    in_use: true,
    error_description: '',
    display: false,
    possible_causes: '',
    recommended_actions: ''
  },
  {
    event_code: '',
    event_name: 'hubplus_jumpstart_active_info',
    code: '1023',
    in_use: true,
    error_description: '',
    display: false,
    possible_causes: '',
    recommended_actions: ''
  },
  {
    event_code: '',
    event_name: 'f65_ac_overload_2s_info',
    code: '2050',
    in_use: true,
    error_description: '',
    display: false,
    possible_causes: '',
    recommended_actions: ''
  },
  {
    event_code: '',
    event_name: 'f68_transformer_over_temperature_info',
    code: '2053',
    in_use: true,
    error_description: '',
    display: false,
    possible_causes: '',
    recommended_actions: ''
  },
  {
    event_code: '',
    event_name: 'f72_external_contactor_malfunction_info',
    code: '2058',
    in_use: true,
    error_description: '',
    display: false,
    possible_causes: '',
    recommended_actions: ''
  },
  {
    event_code: '11010',
    event_name: 'hubplus_under_temperature_warning',
    code: '11010',
    in_use: true,
    error_description: 'Hub+ temperature too low',
    display: true,
    possible_causes:
      'Low ambient temperature (below -10C) or faulty temperature sensor in Hub+',
    recommended_actions:
      'Check that the Hub+ door is closed. Ensure that no water or ice are present in the enclosure.\nIf ambient temperature is consistently above -10C, you may need to replace the part due to a faulty temperature sensor. Please contact SunPower.'
  },
  {
    event_code: '11011',
    event_name: 'hubplus_over_temperature_warning',
    code: '11011',
    in_use: true,
    error_description: 'Hub+ temperature too high',
    display: true,
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
    error_description: 'Hub+ humidity warning',
    display: true,
    possible_causes: 'Water intrusion into Hub+',
    recommended_actions:
      'Ensure that the Hub+ door is closed and check for water intrusion.'
  },
  {
    event_code: '11016',
    event_name: 'hubplus_acdc_supply_under_voltage_warning',
    code: '11016',
    in_use: true,
    error_description: 'Hub+ power supply under voltage',
    display: true,
    possible_causes: 'Check user manual',
    recommended_actions: 'Check user manual'
  },
  {
    event_code: '11017',
    event_name: 'hubplus_acdc_supply_over_voltage_warning',
    code: '11017',
    in_use: true,
    error_description: 'Hub+ power supply over voltage',
    display: true,
    possible_causes: 'Check user manual',
    recommended_actions: 'Check user manual'
  },
  {
    event_code: '11018',
    event_name: 'hubplus_inverter_aux_under_voltage_warning',
    code: '11018',
    in_use: true,
    error_description: 'Inverter auxiliary power supply under voltage',
    display: true,
    possible_causes: 'Check user manual',
    recommended_actions: 'Check user manual'
  },
  {
    event_code: '11019',
    event_name: 'hubplus_inverter_aux_over_voltage_warning',
    code: '11019',
    in_use: true,
    error_description: 'Inverter auxiliary power supply over voltage',
    display: true,
    possible_causes: 'Check user manual',
    recommended_actions: 'Check user manual'
  },
  {
    event_code: '11020',
    event_name: 'hubplus_supply_under_voltage_warning',
    code: '11020',
    in_use: true,
    error_description: 'Hub+ power supply under voltate',
    display: true,
    possible_causes: 'Check user manual',
    recommended_actions: 'Check user manual'
  },
  {
    event_code: '11021',
    event_name: 'hubplus_supply_over_voltage_warning',
    code: '11021',
    in_use: true,
    error_description: 'Hub+ power supply over voltage',
    display: true,
    possible_causes: 'Check user manual',
    recommended_actions: 'Check user manual'
  },
  {
    event_code: '11024',
    event_name: 'hubplus_jumpstart_out_of_range_warning',
    code: '11024',
    in_use: true,
    error_description: 'Hub+ jumpstart out of range',
    display: true,
    possible_causes: 'Check user manual',
    recommended_actions: 'Check user manual'
  },
  {
    event_code: '12000',
    event_name: 'storage_inv_under_temperature_warning',
    code: '12000',
    in_use: true,
    error_description: 'Storage inverter under temperature',
    display: true,
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
    error_description: 'Storage inverter over temperature',
    display: true,
    possible_causes:
      'The ESS enclosure may be located in an overly hot location.\nESS enclosure fans may be blocked or faulty. ',
    recommended_actions:
      'Ensure that ESS is not near a heat source. \nEnsure that ESS fans are not blocked.\nCheck that the inverter air filter is unblocked and clean.\nCheck that the ESS enclosure door is properly locked.'
  },
  {
    event_code: '13000',
    event_name: 'battery_low_state_of_charge_warning',
    code: '13000',
    in_use: true,
    error_description: 'Battery has low state of charge',
    display: true,
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
    error_description: 'Battery has degraded (low state of health)',
    display: true,
    possible_causes:
      'Battery may have been exposed ot harsh environmental conditions or may have been used aggressively.',
    recommended_actions:
      'Check battery location: temperature and airflow into batttery. Contact SunPower'
  },
  {
    event_code: '13003',
    event_name: 'battery_under_voltage_warning',
    code: '13003',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery inernal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '13004',
    event_name: 'battery_over_voltage_warning',
    code: '13004',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery inernal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '13005',
    event_name: 'battery_over_current_during_charge_warning',
    code: '13005',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery inernal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '13006',
    event_name: 'battery_over_power_during_charge_warning',
    code: '13006',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery inernal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '13007',
    event_name: 'battery_over_current_during_discharge_warning',
    code: '13007',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery inernal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '13008',
    event_name: 'battery_over_power_during_discharge_warning',
    code: '13008',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery inernal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '13009',
    event_name: 'battery_over_current_limit_during_charge_warning',
    code: '13009',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery inernal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '13010',
    event_name: 'battery_over_current_limit_during_discharge_warning',
    code: '13010',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery inernal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '13011',
    event_name: 'battery_under_temperature_during_charge_warning',
    code: '13011',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery inernal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '13012',
    event_name: 'battery_over_temperature_during_charge_warning',
    code: '13012',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery inernal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '13013',
    event_name: 'battery_under_temperature_during_discharge_warning',
    code: '13013',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery inernal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '13014',
    event_name: 'battery_over_temperature_during_discharge_warning',
    code: '13014',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery inernal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '13015',
    event_name: 'battery_cell_delta_voltage_too_high_warning',
    code: '13015',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery inernal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '13016',
    event_name: 'battery_cell_temperature_diff_too_high_warning',
    code: '13016',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery inernal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '13017',
    event_name: 'battery_state_of_charge_low_warning',
    code: '13017',
    in_use: true,
    error_description: 'Battery has low state of charge',
    display: true,
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
    error_description: 'Battery pack will be turned off',
    display: true,
    possible_causes: 'Check user manual',
    recommended_actions: 'Check user manual'
  },
  {
    event_code: '13019',
    event_name: 'battery_internal_communication_fail_warning',
    code: '13019',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery inernal fault occurred',
    recommended_actions: 'Please contac SunPower'
  },
  {
    event_code: '14000',
    event_name: 'esshub_under_temperature_warning',
    code: '14000',
    in_use: true,
    error_description: 'ESS temperature too low',
    display: true,
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
    error_description: 'ESS temperature too high',
    display: true,
    possible_causes:
      'The ESS enclosure may be located in an overly hot location.\nESS enclosure fans may be blocked or faulty. ',
    recommended_actions:
      'Ensure that ESS is not near a heat source. \nEnsure that ESS fans are not blocked.\nCheck that the inverter air filter is unblocked and clean.\nCheck that the ESS enclosure door is properly locked.'
  },
  {
    event_code: '14003',
    event_name: 'esshub_over_humidity_warning',
    code: '14003',
    in_use: true,
    error_description: 'ESS humidiy is too high',
    display: true,
    possible_causes: 'Water intrusion into ESS enclosure.',
    recommended_actions:
      'Please ensure that the all-in-one enclosure door is properly closed. Check for water or ice intrusion.'
  },
  {
    event_code: '14004',
    event_name: 'esshub_gateway_output_under_voltage_warning',
    code: '14004',
    in_use: true,
    error_description: 'ESS gateway power supply under voltage',
    display: true,
    possible_causes: 'Check user manual',
    recommended_actions: 'Check user manual'
  },
  {
    event_code: '14005',
    event_name: 'esshub_gateway_output_over_voltage_warning',
    code: '14005',
    in_use: true,
    error_description: 'ESS gateway power supply over voltage',
    display: true,
    possible_causes: 'Check user manual',
    recommended_actions: 'Check user manual'
  },
  {
    event_code: '14006',
    event_name: 'esshub_dcdc_supply_under_voltage_warning',
    code: '14006',
    in_use: true,
    error_description: 'MIO board supply under voltage',
    display: true,
    possible_causes: 'Check user manual',
    recommended_actions: 'Check user manual'
  },
  {
    event_code: '14007',
    event_name: 'esshub_dcdc_supply_over_voltage_warning',
    code: '14007',
    in_use: true,
    error_description: 'MIO board auxiliary power supply over voltage',
    display: true,
    possible_causes: 'Check user manual',
    recommended_actions: 'Check user manual'
  },
  {
    event_code: '14008',
    event_name: 'esshub_supply_under_voltage_warning',
    code: '14008',
    in_use: true,
    error_description: 'MIO board supply under voltage',
    display: true,
    possible_causes: 'Check user manual',
    recommended_actions: 'Check user manual'
  },
  {
    event_code: '14009',
    event_name: 'esshub_supply_over_voltage_warning',
    code: '14009',
    in_use: true,
    error_description: 'MIO board auxiliary power supply over voltage',
    display: true,
    possible_causes: 'Check user manual',
    recommended_actions: 'Check user manual'
  },
  {
    event_code: '16000',
    event_name: 'pvs_cmeter_ac_grid_1n_under_voltage_warning',
    code: '16000',
    in_use: true,
    error_description: 'Consumption meter phase 1 under voltage.',
    display: true,
    possible_causes:
      'Conductor terminations flipped, CT terminations are incorrectly installed.',
    recommended_actions:
      'Check installation of load terminations. Check that CT voltage sensing is correclty installed.'
  },
  {
    event_code: '16001',
    event_name: 'pvs_cmeter_ac_grid_1n_over_voltage_warning',
    code: '16001',
    in_use: true,
    error_description: 'Consumption meter phase 1 over voltage.',
    display: true,
    possible_causes:
      'Conductor terminations flipped, CT terminations are incorrectly installed.',
    recommended_actions:
      'Check installation of load terminations. Check that CT voltage sensing is correclty installed.'
  },
  {
    event_code: '16002',
    event_name: 'pvs_cmeter_ac_grid_2n_under_voltage_warning',
    code: '16002',
    in_use: true,
    error_description: 'Consumption meter phase 2 under voltage.',
    display: true,
    possible_causes:
      'Conductor terminations flipped, CT terminations are incorrectly installed.',
    recommended_actions:
      'Check installation of load terminations. Check that CT voltage sensing is correclty installed.'
  },
  {
    event_code: '16003',
    event_name: 'pvs_cmeter_ac_grid_2n_over_voltage_warning',
    code: '16003',
    in_use: true,
    error_description: 'Consumption meter phase 2 over voltage.',
    display: true,
    possible_causes:
      'Conductor terminations flipped, CT terminations are incorrectly installed.',
    recommended_actions:
      'Check installation of load terminations. Check that CT voltage sensing is correclty installed.'
  },
  {
    event_code: '16004',
    event_name: 'pvs_cmeter_ac_grid_12_under_voltage_warning',
    code: '16004',
    in_use: true,
    error_description: 'Consumption meter phase 1-2 under voltage.',
    display: true,
    possible_causes:
      'Conductor terminations flipped, CT terminations are incorrectly installed.',
    recommended_actions:
      'Check installation of load terminations. Check that CT voltage sensing is correclty installed.'
  },
  {
    event_code: '16005',
    event_name: 'pvs_cmeter_ac_grid_12_over_voltage_warning',
    code: '16005',
    in_use: true,
    error_description: 'Consumption meter phase 1-2 over voltage.',
    display: true,
    possible_causes:
      'Conductor terminations flipped, CT terminations are incorrectly installed.',
    recommended_actions:
      'Check installation of load terminations. Check that CT voltage sensing is correclty installed.'
  },
  {
    event_code: '16006',
    event_name: 'pvs_cmeter_ac_grid_under_frequency_warning',
    code: '16006',
    in_use: true,
    error_description: 'AC Grid under frequency',
    display: true,
    possible_causes: 'This is likely a grid disturbance',
    recommended_actions: 'Check with utlity.'
  },
  {
    event_code: '16007',
    event_name: 'pvs_cmeter_ac_grid_over_frequency_warning',
    code: '16007',
    in_use: true,
    error_description: 'AC grid over frequency',
    display: true,
    possible_causes: 'This is likely a grid disturbance',
    recommended_actions: 'Check with utlity.'
  },
  {
    event_code: '23003',
    event_name: 'battery_under_voltage_alarm',
    code: '23003',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '23004',
    event_name: 'battery_over_voltage_alarm',
    code: '23004',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '23005',
    event_name: 'battery_over_current_during_charge_alarm',
    code: '23005',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '23006',
    event_name: 'battery_over_power_during_charge_alarm',
    code: '23006',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '23007',
    event_name: 'battery_over_current_during_discharge_alarm',
    code: '23007',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '23008',
    event_name: 'battery_over_power_during_discharge_alarm',
    code: '23008',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '23009',
    event_name: 'battery_over_current_limit_during_charge_alarm',
    code: '23009',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '23010',
    event_name: 'battery_over_current_limit_during_discharge_alarm',
    code: '23010',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '23011',
    event_name: 'battery_under_temperature_during_charge_alarm',
    code: '23011',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '23012',
    event_name: 'battery_over_temperature_during_charge_alarm',
    code: '23012',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '23013',
    event_name: 'battery_under_temperature_during_discharge_alarm',
    code: '23013',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '23014',
    event_name: 'battery_over_temperature_during_discharge_alarm',
    code: '23014',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '23015',
    event_name: 'battery_cell_delta_voltage_too_high_alarm',
    code: '23015',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '23016',
    event_name: 'battery_cell_temperature_diff_too_high_alarm',
    code: '23016',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '30000',
    event_name: 'component_check_no_midc_critical',
    code: '30000',
    in_use: true,
    error_description: 'No MIDC',
    display: true,
    possible_causes:
      "The PVS cannot connect with the MIDC board. The MIDC board drives the transfer switch on the Hub+. It also connects to the MIO board, so if you're seeing this error, it is likely that other errors are occurring as well. You should focus on fixing this error first before you proceed to fix the others.\n\nThis problem may be due to one of the following causes:\n1. The MIDC board is not powered\n1. The MIDC board is not connected to the MIO board.\n1. PVS MIDC CAN connector is bad\n1. The MIDC board is damaged\n1. The AUX cable between inverter and MIDC board is not properly connected and/or terminated.",
    recommended_actions:
      'Please try the following steps\n1. Check that the line-side and load-side AC cables to the MIDC board.\n1. Check that the gray ethernet cable and connectors between the MIDC (J14) board and MIO (J1) board is connected and terminated properly.\n1. Check that PVS MIDC CAN (J13) connector board cable is in place\n1. Check that the gray cable between the Aux port on the inverter and the J16 port on the MIDC board is correctly connected and terminated.\n1. Attempt commissioning again.\n\nIf the problem persists, this may be a sign that the MIDC board is damaged. Please contact SunPower.'
  },
  {
    event_code: '30001',
    event_name: 'component_check_no_mio_critical',
    code: '30001',
    in_use: true,
    error_description: 'No MIO',
    display: true,
    possible_causes:
      "The PVS cannot connect with the MIO board. The MIO board is a hub for data connections to the batteries, inverter, and gateway, so if you're seeing this error, it is likely you're also seeing other errors such as missing batteries or inverters.\n\nThis problem may be due to one of the following causes:\n1. Faulty data connection between the Hub+ and the MIO board.\n1. MIO lost power.\n1. Faulty data connection with another MIO board (applicable to Power Expansion packs only)",
    recommended_actions:
      'Please try the following steps:\n1. Check that the MIO board is powered: one LED should be blinking and the other one should be solid.\n1.  Check that the gray ethernet cable from the J1 port on the MIO board is connected to the J14 port on the MIDC. Check that the cable is terminated correctly. \n1. Check that the 48V DC connection on the MIO board is connected to the DC terminals on the inverter and properly grounded and terminated.\n1. If this install involves one or more power expansion packs (above 26kWh or 6.8kW), please check that the MIO board is connected to the adjacent MIO by checking that the purple J2 cable is correctly connected and terminated.\n1. Attempt commissioning again.\n\nIf the problem persists, this may be a sign that the MIO board is damaged. Please contact SunPower.'
  },
  {
    event_code: '30002',
    event_name: 'component_check_no_gw_critical',
    code: '30002',
    in_use: true,
    error_description: 'No Gateway',
    display: true,
    possible_causes:
      "The Schneider Gateway connects the inverter with PVS and batteries. If you're seeing this error it is likely you're also seeing other errors such as batteries  or inverter(s) missing.\n\nThis problem may be due to the following causes:\n1. Gateway lost power.\n1. The ethernet connector between the gateway and PVS is not connected or terminated correctly.",
    recommended_actions:
      "1- Check that the gateway has power: the LEDs should be blinking.\n1. Check that the green cable and its orange, orange/white, green, blue and blue/white conductors in the metal ferules on the gateway side are properly connected to the J4 port on the MIO board.\n1. Check the black ethernet cable is connected to the black ethernet port on the PVS. Check also that the cable is correctly terminated.\n1. Check that the cable mentioned in 3 is connected to the port labeled as 'ethernet' on the Schneider gateway.\n1. Attempt commissioning again\n\nIf the problem persists, this may be a sign that the Schneider Gateway is damaged. Please contact SunPower."
  },
  {
    event_code: '30003',
    event_name: 'component_check_no_inverter_critical',
    code: '30003',
    in_use: true,
    error_description: 'No Inverter',
    display: true,
    possible_causes:
      "The PVS cannot connect to the Schneider inverter. If you're also seeing an error that indicates that the gateway is missing, this error may be due to the fact that the gateway is not properly connected. ",
    recommended_actions:
      "Please try the following steps:\n1. If you're also seeing a 'missing gateway' error, please try to fix that problem first following the instructions in the error message.\n1. Check that the yellow XANBUS connector between the Schneider gateway and the inverter is correctly terminated and connected to the port labeled as XANBUS in he inverter (underneath the inverter, to the right of the SYNC port left of BTS port and AUX ports).\n1. Check that the RPO cable in the inverter (port labeled as BTS) is connected to the J5 (red) termination in the MIO board.\n1. Check that any of LEDs on inverter are On. \n1. Check that the DC conductors have at least 48V between terminations.\n1. Ensure that the DC terminations are done correctly\n1. Ensure that the DC breakers are closed.\n1. Ensure that the batteries are on. If not, press the ON button on the batteries.\n1. Check that the gray AUX connector from the inverter is connected to the J16 termination on the MIDC board.\n1. Attempt commissioning again.\n\nIf the problem persists, this may be a sign that the inverter is damaged. Please contact SunPower."
  },
  {
    event_code: '30004',
    event_name: 'component_check_no_bms_critical',
    code: '30004',
    in_use: true,
    error_description: 'No BMS',
    display: true,
    possible_causes:
      "The PVS cannot connect with the batteries. This could be due because there are other connections missing. If you're also seeing a missing gateway error, missing MIDC or missing MIO board, this 'No BMS' error is likely due to any of these errors and you should try to fix them before you attempt to fix this.\n\nThis problem may be due to the following causes:\n1. Gateway is not connected. If this is the case, you'll also be seeing a 'No gateway' error and you should attempt fixing the problem first.\n1. CAN bus connection (green) between the MIO board (J4) and Schneider gateway is not properly made.\n1. The CAN bus connection on the Gateway side is not properly made or terminated (white-orange, orange, white-green, white-blue, and blue conductors).\n1. The CAN cable between J4 port on MIO and gateway is cut off.\n1. Connection between the batteries (orange) and the MIO board is not properly made\n1. Batteries are not powered on.",
    recommended_actions:
      "Please try the following steps\n1. If you're also seeing a 'missing gateway' error, please try to fix that problem first following the instructions in the error message.\n1. Check that the CAN bus connection on the Gateway side is not properly made or terminated (white-orange, orange, white-green, white-blue, and blue conductors).\n1. Check that the orange cable between the master battery and the MIO board is properly connected and terminated.\n1. Check that the batteries are powered on (check status of LEDs around the power button on the side of the batteries).\n1. Check that the DC breakers are on the closed position.\n1. Attempt commissioning again.\n\nIf the problem persists, this may be a sign that one or more batteries are damaged. Please contact SunPower."
  },
  {
    event_code: '30005',
    event_name: 'component_check_too_many_inverters_critical',
    code: '30005',
    in_use: true,
    error_description: 'Too many inverters',
    display: false,
    possible_causes: 'N/A',
    recommended_actions: 'N/A'
  },
  {
    event_code: '30006',
    event_name: 'component_check_mio_xw_mismatch_critical',
    code: '30006',
    in_use: true,
    error_description:
      'Number of inverters does not match number of MIO boards',
    display: false,
    possible_causes: 'N/A',
    recommended_actions: 'N/A'
  },
  {
    event_code: '30007',
    event_name: 'component_check_too_few_batteries_critical',
    code: '30007',
    in_use: true,
    error_description: 'Cannot find one or more batteries',
    display: true,
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
    error_description: 'Cannot find one or more inverters.',
    display: true,
    possible_causes:
      "The PVS cannot connect to the Schneider inverter. If you're also seeing an error that indicates that the gateway is missing, this error may be due to the fact that the gateway is not properly connected. ",
    recommended_actions:
      "Please try the following steps:\n1. If you're also seeing a 'missing gateway' error, please try to fix that problem first following the instructions in the error message.\n1. Check that the yellow XANBUS connector between the Schneider gateway and the inverter is correctly terminated and connected to the port labeled as XANBUS in he inverter (underneath the inverter, to the right of the SYNC port left of BTS port and AUX ports).\n1. Check that the RPO cable in the inverter (port labeled as BTS) is connected to the J5 (red) termination in the MIO board.\n1. Check that any of LEDs on inverter are On. \n1. Check that the DC conductors have at least 48V between terminations.\n1. Ensure that the DC terminations are done correctly\n1. Ensure that the DC breakers are closed.\n1. Ensure that the batteries are on. If not, press the ON button on the batteries.\n1. Check that the gray AUX connector from the inverter is connected to the J16 termination on the MIDC board.\n1. Attempt commissioning again.\n\nIf the problem persists, this may be a sign that the inverter is damaged. Please contact SunPower."
  },
  {
    event_code: '30015',
    event_name: 'mapping_inverter_no_batteries_critical',
    code: '30015',
    in_use: true,
    error_description: 'Could not find batteries',
    display: true,
    possible_causes:
      "The PVS cannot connect with the batteries. This could be due because there are other connections missing. If you're also seeing a missing gateway error, missing MIDC or missing MIO board, this 'No BMS' error is likely due to any of these errors and you should try to fix them before you attempt to fix this.\n\nThis problem may be due to the following causes:\n1. Gateway is not connected. If this is the case, you'll also be seeing a 'No gateway' error and you should attempt fixing the problem first.\n1. CAN bus connection (green) between the MIO board (J4) and Schneider gateway is not properly made.\n1. The CAN bus connection on the Gateway side is not properly made or terminated (white-orange, orange, white-green, white-blue, and blue conductors).\n1. The CAN cable between J4 port on MIO and gateway is cut off.\n1. Connection between the batteries (orange) and the MIO board is not properly made\n1. Batteries are not powered on.",
    recommended_actions:
      "Please try the following steps\n1. If you're also seeing a 'missing gateway' error, please try to fix that problem first following the instructions in the error message.\n1. Check that the CAN bus connection on the Gateway side is not properly made or terminated (white-orange, orange, white-green, white-blue, and blue conductors).\n1. Check that the orange cable between the master battery and the MIO board is properly connected and terminated.\n1. Check that the batteries are powered on (check status of LEDs around the power button on the side of the batteries).\n1. Check that the DC breakers are on the closed position.\n1. Attempt commissioning again.\n\nIf the problem persists, this may be a sign that one or more batteries are damaged. Please contact SunPower."
  },
  {
    event_code: '30017',
    event_name: 'mapping_batteries_no_inverter_critical',
    code: '30017',
    in_use: true,
    error_description: 'Cannot find one or more inverters.',
    display: true,
    possible_causes:
      "The PVS cannot connect to the Schneider inverter. If you're also seeing an error that indicates that the gateway is missing, this error may be due to the fact that the gateway is not properly connected. ",
    recommended_actions:
      "Please try the following steps:\n1. If you're also seeing a 'missing gateway' error, please try to fix that problem first following the instructions in the error message.\n1. Check that the yellow XANBUS connector between the Schneider gateway and the inverter is correctly terminated and connected to the port labeled as XANBUS in he inverter (underneath the inverter, to the right of the SYNC port left of BTS port and AUX ports).\n1. Check that the RPO cable in the inverter (port labeled as BTS) is connected to the J5 (red) termination in the MIO board.\n1. Check that any of LEDs on inverter are On. \n1. Check that the DC conductors have at least 48V between terminations.\n1. Ensure that the DC terminations are done correctly\n1. Ensure that the DC breakers are closed.\n1. Ensure that the batteries are on. If not, press the ON button on the batteries.\n1. Check that the gray AUX connector from the inverter is connected to the J16 termination on the MIDC board.\n1. Attempt commissioning again.\n\nIf the problem persists, this may be a sign that the inverter is damaged. Please contact SunPower."
  },
  {
    event_code: '30018',
    event_name: 'mapping_inverter_too_many_batteries_critical',
    code: '30018',
    in_use: true,
    error_description: 'Cannot find one or more inverters.',
    display: true,
    possible_causes:
      "The PVS cannot connect to the Schneider inverter. If you're also seeing an error that indicates that the gateway is missing, this error may be due to the fact that the gateway is not properly connected. ",
    recommended_actions:
      "Please try the following steps:\n1. If you're also seeing a 'missing gateway' error, please try to fix that problem first following the instructions in the error message.\n1. Check that the yellow XANBUS connector between the Schneider gateway and the inverter is correctly terminated and connected to the port labeled as XANBUS in he inverter (underneath the inverter, to the right of the SYNC port left of BTS port and AUX ports).\n1. Check that the RPO cable in the inverter (port labeled as BTS) is connected to the J5 (red) termination in the MIO board.\n1. Check that any of LEDs on inverter are On. \n1. Check that the DC conductors have at least 48V between terminations.\n1. Ensure that the DC terminations are done correctly\n1. Ensure that the DC breakers are closed.\n1. Ensure that the batteries are on. If not, press the ON button on the batteries.\n1. Check that the gray AUX connector from the inverter is connected to the J16 termination on the MIDC board.\n1. Attempt commissioning again.\n\nIf the problem persists, this may be a sign that the inverter is damaged. Please contact SunPower."
  },
  {
    event_code: '30019',
    event_name: 'mapping_battery_more_than_one_inverter_critical',
    code: '30019',
    in_use: true,
    error_description: 'Cannot find one or more batteries',
    display: true,
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
    error_description: 'No MIO',
    display: true,
    possible_causes:
      "The PVS cannot connect with the MIO board. The MIO board is a hub for data connections to the batteries, inverter, and gateway, so if you're seeing this error, it is likely you're also seeing other errors such as missing batteries or inverters.\n\nThis problem may be due to one of the following causes:\n1. Faulty data connection between the Hub+ and the MIO board.\n1. MIO lost power.\n1. Faulty data connection with another MIO board (applicable to Power Expansion packs only)",
    recommended_actions:
      'Please try the following steps:\n1. Check that the MIO board is powered: one LED should be blinking and the other one should be solid.\n1.  Check that the gray ethernet cable from the J1 port on the MIO board is connected to the J14 port on the MIDC. Check that the cable is terminated correctly. \n1. Check that the 48V DC connection on the MIO board is connected to the DC terminals on the inverter and properly grounded and terminated.\n1. If this install involves one or more power expansion packs (above 26kWh or 6.8kW), please check that the MIO board is connected to the adjacent MIO by checking that the purple J2 cable is correctly connected and terminated.\n1. Attempt commissioning again.\n\nIf the problem persists, this may be a sign that the MIO board is damaged. Please contact SunPower.'
  },
  {
    event_code: '30022',
    event_name: 'mapping_inverter_too_many_mio_critical',
    code: '30022',
    in_use: true,
    error_description: 'Too many MIO',
    display: false,
    possible_causes: 'N/A',
    recommended_actions: 'N/A'
  },
  {
    event_code: '30023',
    event_name: 'mapping_mio_more_than_one_inverter_critical',
    code: '30023',
    in_use: true,
    error_description: 'No MIO',
    display: true,
    possible_causes:
      "The PVS cannot connect with the MIO board. The MIO board is a hub for data connections to the batteries, inverter, and gateway, so if you're seeing this error, it is likely you're also seeing other errors such as missing batteries or inverters.\n\nThis problem may be due to one of the following causes:\n1. Faulty data connection between the Hub+ and the MIO board.\n1. MIO lost power.\n1. Faulty data connection with another MIO board (applicable to Power Expansion packs only)",
    recommended_actions:
      'Please try the following steps:\n1. Check that the MIO board is powered: one LED should be blinking and the other one should be solid.\n1.  Check that the gray ethernet cable from the J1 port on the MIO board is connected to the J14 port on the MIDC. Check that the cable is terminated correctly. \n1. Check that the 48V DC connection on the MIO board is connected to the DC terminals on the inverter and properly grounded and terminated.\n1. If this install involves one or more power expansion packs (above 26kWh or 6.8kW), please check that the MIO board is connected to the adjacent MIO by checking that the purple J2 cable is correctly connected and terminated.\n1. Attempt commissioning again.\n\nIf the problem persists, this may be a sign that the MIO board is damaged. Please contact SunPower.'
  },
  {
    event_code: '30025',
    event_name: 'mapping_inverter_no_bms_critical',
    code: '30025',
    in_use: true,
    error_description: 'No BMS',
    display: true,
    possible_causes:
      "The PVS cannot connect with the batteries. This could be due because there are other connections missing. If you're also seeing a missing gateway error, missing MIDC or missing MIO board, this 'No BMS' error is likely due to any of these errors and you should try to fix them before you attempt to fix this.\n\nThis problem may be due to the following causes:\n1. Gateway is not connected. If this is the case, you'll also be seeing a 'No gateway' error and you should attempt fixing the problem first.\n1. CAN bus connection (green) between the MIO board (J4) and Schneider gateway is not properly made.\n1. The CAN bus connection on the Gateway side is not properly made or terminated (white-orange, orange, white-green, white-blue, and blue conductors).\n1. The CAN cable between J4 port on MIO and gateway is cut off.\n1. Connection between the batteries (orange) and the MIO board is not properly made\n1. Batteries are not powered on.",
    recommended_actions:
      "Please try the following steps\n1. If you're also seeing a 'missing gateway' error, please try to fix that problem first following the instructions in the error message.\n1. Check that the CAN bus connection on the Gateway side is not properly made or terminated (white-orange, orange, white-green, white-blue, and blue conductors).\n1. Check that the orange cable between the master battery and the MIO board is properly connected and terminated.\n1. Check that the batteries are powered on (check status of LEDs around the power button on the side of the batteries).\n1. Check that the DC breakers are on the closed position.\n1. Attempt commissioning again.\n\nIf the problem persists, this may be a sign that one or more batteries are damaged. Please contact SunPower."
  },
  {
    event_code: '30026',
    event_name: 'mapping_inverter_too_many_bms_critical',
    code: '30026',
    in_use: true,
    error_description: 'Too many BMS',
    display: false,
    possible_causes: 'N/A',
    recommended_actions: 'N/A'
  },
  {
    event_code: '30027',
    event_name: 'mapping_bms_more_than_one_inverter_critical',
    code: '30027',
    in_use: true,
    error_description: 'Too many inverters',
    display: false,
    possible_causes: 'N/A',
    recommended_actions: 'N/A'
  },
  {
    event_code: '30028',
    event_name: 'mapping_no_inverter_critical',
    code: '30028',
    in_use: true,
    error_description: 'No Inverter',
    display: true,
    possible_causes:
      "The PVS cannot connect to the Schneider inverter. If you're also seeing an error that indicates that the gateway is missing, this error may be due to the fact that the gateway is not properly connected. ",
    recommended_actions:
      "Please try the following steps:\n1. If you're also seeing a 'missing gateway' error, please try to fix that problem first following the instructions in the error message.\n1. Check that the yellow XANBUS connector between the Schneider gateway and the inverter is correctly terminated and connected to the port labeled as XANBUS in he inverter (underneath the inverter, to the right of the SYNC port left of BTS port and AUX ports).\n1. Check that the RPO cable in the inverter (port labeled as BTS) is connected to the J5 (red) termination in the MIO board.\n1. Check that any of LEDs on inverter are On. \n1. Check that the DC conductors have at least 48V between terminations.\n1. Ensure that the DC terminations are done correctly\n1. Ensure that the DC breakers are closed.\n1. Ensure that the batteries are on. If not, press the ON button on the batteries.\n1. Check that the gray AUX connector from the inverter is connected to the J16 termination on the MIDC board.\n1. Attempt commissioning again.\n\nIf the problem persists, this may be a sign that the inverter is damaged. Please contact SunPower."
  },
  {
    event_code: '30400',
    event_name: 'health_check_missing_ess_component_map_critical',
    code: '30400',
    in_use: true,
    error_description: 'Could not retrieve component map',
    display: true,
    possible_causes: 'There was an error generating the component map',
    recommended_actions: 'Please attempt commissioning again.'
  },
  {
    event_code: '30401',
    event_name: 'health_check_invalid_ess_component_map_critical',
    code: '30401',
    in_use: true,
    error_description: 'Invalid component map',
    display: true,
    possible_causes: 'There was an error generating the component map',
    recommended_actions: 'Please attempt commissioning again.'
  },
  {
    event_code: '30402',
    event_name: 'health_check_missing_ess_critical',
    code: '30402',
    in_use: true,
    error_description: 'Could not find all-in one',
    display: true,
    possible_causes:
      "The PVS cannot connect with the MIO board. The MIO board is a hub for data connections to the batteries, inverter, and gateway, so if you're seeing this error, it is likely you're also seeing other errors such as missing batteries or inverters.\n\nThis problem may be due to one of the following causes:\n1. Faulty data connection between the Hub+ and the MIO board.\n1. MIO lost power.\n1. Faulty data connection with another MIO board (applicable to Power Expansion packs only)",
    recommended_actions:
      'Please try the following steps:\n1. Check that the MIO board is powered: one LED should be blinking and the other one should be solid.\n1.  Check that the gray ethernet cable from the J1 port on the MIO board is connected to the J14 port on the MIDC. Check that the cable is terminated correctly. \n1. Check that the 48V DC connection on the MIO board is connected to the DC terminals on the inverter and properly grounded and terminated.\n1. If this install involves one or more power expansion packs (above 26kWh or 6.8kW), please check that the MIO board is connected to the adjacent MIO by checking that the purple J2 cable is correctly connected and terminated.\n1. Attempt commissioning again.\n\nIf the problem persists, this may be a sign that the MIO board is damaged. Please contact SunPower.'
  },
  {
    event_code: '30403',
    event_name: 'health_check_too_few_batteries_critical',
    code: '30403',
    in_use: true,
    error_description: 'Cannot find one or more batteries',
    display: true,
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
    error_description: 'Cannot find one or more inverters.',
    display: true,
    possible_causes:
      "The PVS cannot connect to the Schneider inverter. If you're also seeing an error that indicates that the gateway is missing, this error may be due to the fact that the gateway is not properly connected. ",
    recommended_actions:
      "Please try the following steps:\n1. If you're also seeing a 'missing gateway' error, please try to fix that problem first following the instructions in the error message.\n1. Check that the yellow XANBUS connector between the Schneider gateway and the inverter is correctly terminated and connected to the port labeled as XANBUS in he inverter (underneath the inverter, to the right of the SYNC port left of BTS port and AUX ports).\n1. Check that the RPO cable in the inverter (port labeled as BTS) is connected to the J5 (red) termination in the MIO board.\n1. Check that any of LEDs on inverter are On. \n1. Check that the DC conductors have at least 48V between terminations.\n1. Ensure that the DC terminations are done correctly\n1. Ensure that the DC breakers are closed.\n1. Ensure that the batteries are on. If not, press the ON button on the batteries.\n1. Check that the gray AUX connector from the inverter is connected to the J16 termination on the MIDC board.\n1. Attempt commissioning again.\n\nIf the problem persists, this may be a sign that the inverter is damaged. Please contact SunPower."
  },
  {
    event_code: '30405',
    event_name: 'health_check_too_few_mio_critical',
    code: '30405',
    in_use: true,
    error_description: 'Too few MIO',
    display: false,
    possible_causes: 'N/A',
    recommended_actions: 'N/A'
  },
  {
    event_code: '30406',
    event_name: 'health_check_too_few_bms_critical',
    code: '30406',
    in_use: true,
    error_description: 'Too few BMS',
    display: true,
    possible_causes: 'N/A',
    recommended_actions: 'N/A'
  },
  {
    event_code: '30407',
    event_name: 'health_check_too_many_batteries_critical',
    code: '30407',
    in_use: true,
    error_description: 'Cannot find one or more inverters.',
    display: true,
    possible_causes:
      "The PVS cannot connect to the Schneider inverter. If you're also seeing an error that indicates that the gateway is missing, this error may be due to the fact that the gateway is not properly connected. ",
    recommended_actions:
      "Please try the following steps:\n1. If you're also seeing a 'missing gateway' error, please try to fix that problem first following the instructions in the error message.\n1. Check that the yellow XANBUS connector between the Schneider gateway and the inverter is correctly terminated and connected to the port labeled as XANBUS in he inverter (underneath the inverter, to the right of the SYNC port left of BTS port and AUX ports).\n1. Check that the RPO cable in the inverter (port labeled as BTS) is connected to the J5 (red) termination in the MIO board.\n1. Check that any of LEDs on inverter are On. \n1. Check that the DC conductors have at least 48V between terminations.\n1. Ensure that the DC terminations are done correctly\n1. Ensure that the DC breakers are closed.\n1. Ensure that the batteries are on. If not, press the ON button on the batteries.\n1. Check that the gray AUX connector from the inverter is connected to the J16 termination on the MIDC board.\n1. Attempt commissioning again.\n\nIf the problem persists, this may be a sign that the inverter is damaged. Please contact SunPower."
  },
  {
    event_code: '30408',
    event_name: 'health_check_too_many_inverter_critical',
    code: '30408',
    in_use: true,
    error_description: 'Cannot find one or more batteries',
    display: true,
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
    error_description: 'Too many MIO',
    display: true,
    possible_causes: 'N/A',
    recommended_actions: 'N/A'
  },
  {
    event_code: '30410',
    event_name: 'health_check_too_many_bms_critical',
    code: '30410',
    in_use: true,
    error_description: 'Too many BMS',
    display: true,
    possible_causes: 'N/A',
    recommended_actions: 'N/A'
  },
  {
    event_code: '30411',
    event_name: 'health_check_unassigned_battery_critical',
    code: '30411',
    in_use: true,
    error_description: 'Unassigned battery',
    display: true,
    possible_causes: 'There was an error generating the component map',
    recommended_actions: 'Please attempt commissioning again.'
  },
  {
    event_code: '30412',
    event_name: 'health_check_unassigned_inverter_critical',
    code: '30412',
    in_use: true,
    error_description: 'Unassigned inverter',
    display: true,
    possible_causes: 'There was an error generating the component map',
    recommended_actions: 'Please attempt commissioning again.'
  },
  {
    event_code: '30413',
    event_name: 'health_check_unassigned_mio_critical',
    code: '30413',
    in_use: true,
    error_description: 'Unassigned MIO',
    display: true,
    possible_causes: 'There was an error generating the component map',
    recommended_actions: 'Please attempt commissioning again.'
  },
  {
    event_code: '30414',
    event_name: 'health_check_unassigned_bms_critical',
    code: '30414',
    in_use: true,
    error_description: 'Unassigned BMS',
    display: true,
    possible_causes: 'There was an error generating the component map',
    recommended_actions: 'Please attempt commissioning again.'
  },
  {
    event_code: '31000',
    event_name: 'contactor_position_unknown_critical',
    code: '31000',
    in_use: true,
    error_description: 'Transfer switch contactor position unknown',
    display: true,
    possible_causes:
      'The connection between PVS and MIDC board has been lost.\nMIDC board can no longer control the transfer switch.',
    recommended_actions:
      'Check MIDC LEDs\nCheck MID cables for damage\nCheck for damage between PVS and MIDC communications cables.\nIf problem persists, you may need to replace the MID and/or MIDC.'
  },
  {
    event_code: '31003',
    event_name: 'contactor_stuck_open_critical',
    code: '31003',
    in_use: true,
    error_description: 'Transfer switch contactor stuck open ',
    display: true,
    possible_causes:
      'A fault with the MIDC board or with the transfer switch has occurred.',
    recommended_actions: 'Replace transfer switch or MIDC board.'
  },
  {
    event_code: '31004',
    event_name: 'contactor_stuck_closed_critical',
    code: '31004',
    in_use: true,
    error_description: 'Transfer switch contactor stuck closed',
    display: true,
    possible_causes:
      'A fault with the MIDC board or with the transfer switch has occurred.',
    recommended_actions: 'Replace transfer switch or MIDC board.'
  },
  {
    event_code: '31005',
    event_name: 'contactor_mismatched_open_critical',
    code: '31005',
    in_use: true,
    error_description: 'Contactor mismatched open',
    display: true,
    possible_causes:
      'Aux feedback and voltage sense does not match. A fault with the MIDC board or with the transfer switch has occurred.',
    recommended_actions: 'Replace transfer switch or MIDC board.'
  },
  {
    event_code: '31006',
    event_name: 'contactor_mismatched_closed_critical',
    code: '31006',
    in_use: true,
    error_description: 'Contactor mismatched closed',
    display: true,
    possible_causes:
      'Aux feedback and voltage sense does not match. A fault with the MIDC board or with the transfer switch has occurred.',
    recommended_actions: 'Replace transfer switch or MIDC board.'
  },
  {
    event_code: '31007',
    event_name: 'contactor_mismatched_stuck_open_critical',
    code: '31007',
    in_use: true,
    error_description: 'Contactor mismatched and stuck open',
    display: true,
    possible_causes:
      'Aux feedback and voltage sense does not match. A fault with the MIDC board or with the transfer switch has occurred.',
    recommended_actions: 'Replace transfer switch or MIDC board.'
  },
  {
    event_code: '31008',
    event_name: 'contactor_mismatched_stuck_closed_critical',
    code: '31008',
    in_use: true,
    error_description: 'Contactor mismatched and stuck closed',
    display: true,
    possible_causes:
      'Aux feedback and voltage sense does not match. A fault with the MIDC board or with the transfer switch has occurred.',
    recommended_actions: 'Replace transfer switch or MIDC board.'
  },
  {
    event_code: '31009',
    event_name: 'contactor_error_unknown_critical',
    code: '31009',
    in_use: true,
    error_description: 'Contactor error unknown',
    display: true,
    possible_causes: 'Unkown',
    recommended_actions: 'Unknown'
  },
  {
    event_code: '31011',
    event_name: 'hubplus_over_temperature_critical',
    code: '31011',
    in_use: true,
    error_description: 'ESS temperature too high',
    display: true,
    possible_causes:
      'The ESS enclosure may be located in an overly hot location.\nESS enclosure fans may be blocked or faulty. ',
    recommended_actions:
      'Ensure that ESS is not near a heat source. \nEnsure that ESS fans are not blocked.\nCheck that the inverter air filter is unblocked and clean.\nCheck that the ESS enclosure door is properly locked.'
  },
  {
    event_code: '31014',
    event_name: 'rapid_shutdown_disconnected_critical',
    code: '31014',
    in_use: true,
    error_description: 'Rapid shutdown disconnected',
    display: true,
    possible_causes: 'TBD',
    recommended_actions: 'TBD'
  },
  {
    event_code: '31025',
    event_name: 'hubplus_communication_outage_critical',
    code: '31025',
    in_use: true,
    error_description: 'Cannot communicate with Hub+',
    display: true,
    possible_causes: 'TBD',
    recommended_actions: 'TBD'
  },
  {
    event_code: '31029',
    event_name: 'hubplus_fw_error_inval_critical',
    code: '31029',
    in_use: true,
    error_description: 'MIDC firmware error',
    display: true,
    possible_causes: 'Firmware in MIDC board may be corrupted',
    recommended_actions:
      'Update MIDC firmware\nRestart device\nIf the problem persists, replace MIDC.'
  },
  {
    event_code: '31030',
    event_name: 'hubplus_fw_error_spi_bsy_critical',
    code: '31030',
    in_use: true,
    error_description: 'MIDC firmware error',
    display: true,
    possible_causes: 'Firmware in MIDC board may be corrupted',
    recommended_actions:
      'Update MIDC firmware\nRestart device\nIf the problem persists, replace MIDC.'
  },
  {
    event_code: '31031',
    event_name: 'hubplus_fw_error_spi_inval_cs_critical',
    code: '31031',
    in_use: true,
    error_description: 'MIDC firmware error',
    display: true,
    possible_causes: 'Firmware in MIDC board may be corrupted',
    recommended_actions:
      'Update MIDC firmware\nRestart device\nIf the problem persists, replace MIDC.'
  },
  {
    event_code: '31032',
    event_name: 'hubplus_fw_error_spi_critical',
    code: '31032',
    in_use: true,
    error_description: 'MIDC firmware error',
    display: true,
    possible_causes: 'Firmware in MIDC board may be corrupted',
    recommended_actions:
      'Update MIDC firmware\nRestart device\nIf the problem persists, replace MIDC.'
  },
  {
    event_code: '31033',
    event_name: 'hubplus_fw_error_flash_w_key_critical',
    code: '31033',
    in_use: true,
    error_description: 'MIDC firmware error',
    display: true,
    possible_causes: 'Firmware in MIDC board may be corrupted',
    recommended_actions:
      'Update MIDC firmware\nRestart device\nIf the problem persists, replace MIDC.'
  },
  {
    event_code: '31034',
    event_name: 'hubplus_fw_error_flash_r_critical',
    code: '31034',
    in_use: true,
    error_description: 'MIDC firmware error',
    display: true,
    possible_causes: 'Firmware in MIDC board may be corrupted',
    recommended_actions:
      'Update MIDC firmware\nRestart device\nIf the problem persists, replace MIDC.'
  },
  {
    event_code: '31035',
    event_name: 'hubplus_fw_error_flash_crc_critical',
    code: '31035',
    in_use: true,
    error_description: 'MIDC firmware error',
    display: true,
    possible_causes: 'Firmware in MIDC board may be corrupted',
    recommended_actions:
      'Update MIDC firmware\nRestart device\nIf the problem persists, replace MIDC.'
  },
  {
    event_code: '31036',
    event_name: 'hubplus_fw_error_flash_w_critical',
    code: '31036',
    in_use: true,
    error_description: 'MIDC firmware error',
    display: true,
    possible_causes: 'Firmware in MIDC board may be corrupted',
    recommended_actions:
      'Update MIDC firmware\nRestart device\nIf the problem persists, replace MIDC.'
  },
  {
    event_code: '31037',
    event_name: 'hubplus_fw_error_eeprom_critical',
    code: '31037',
    in_use: true,
    error_description: 'MIDC firmware error',
    display: true,
    possible_causes: 'Firmware in MIDC board may be corrupted',
    recommended_actions:
      'Update MIDC firmware\nRestart device\nIf the problem persists, replace MIDC.'
  },
  {
    event_code: '31038',
    event_name: 'hubplus_fw_error_eeprom_r_critical',
    code: '31038',
    in_use: true,
    error_description: 'MIDC firmware error',
    display: true,
    possible_causes: 'Firmware in MIDC board may be corrupted',
    recommended_actions:
      'Update MIDC firmware\nRestart device\nIf the problem persists, replace MIDC.'
  },
  {
    event_code: '31039',
    event_name: 'hubplus_fw_error_eeprom_w_critical',
    code: '31039',
    in_use: true,
    error_description: 'MIDC firmware error',
    display: true,
    possible_causes: 'Firmware in MIDC board may be corrupted',
    recommended_actions:
      'Update MIDC firmware\nRestart device\nIf the problem persists, replace MIDC.'
  },
  {
    event_code: '31040',
    event_name: 'hubplus_fw_error_led_drv_critical',
    code: '31040',
    in_use: true,
    error_description: 'MIDC firmware error',
    display: true,
    possible_causes: 'Firmware in MIDC board may be corrupted',
    recommended_actions:
      'Update MIDC firmware\nRestart device\nIf the problem persists, replace MIDC.'
  },
  {
    event_code: '31041',
    event_name: 'hubplus_fw_error_mbs_critical',
    code: '31041',
    in_use: true,
    error_description: 'MIDC firmware error',
    display: true,
    possible_causes: 'Firmware in MIDC board may be corrupted',
    recommended_actions:
      'Update MIDC firmware\nRestart device\nIf the problem persists, replace MIDC.'
  },
  {
    event_code: '31042',
    event_name: 'hubplus_fw_error_btldr_en_key_critical',
    code: '31042',
    in_use: true,
    error_description: 'MIDC firmware error',
    display: true,
    possible_causes: 'Firmware in MIDC board may be corrupted',
    recommended_actions:
      'Update MIDC firmware\nRestart device\nIf the problem persists, replace MIDC.'
  },
  {
    event_code: '31043',
    event_name: 'hubplus_fw_error_btldr_already_critical',
    code: '31043',
    in_use: true,
    error_description: 'MIDC firmware error',
    display: true,
    possible_causes: 'Firmware in MIDC board may be corrupted',
    recommended_actions:
      'Update MIDC firmware\nRestart device\nIf the problem persists, replace MIDC.'
  },
  {
    event_code: '31044',
    event_name: 'hubplus_fw_error_btldr_data_ready_critical',
    code: '31044',
    in_use: true,
    error_description: 'MIDC firmware error',
    display: true,
    possible_causes: 'Firmware in MIDC board may be corrupted',
    recommended_actions:
      'Update MIDC firmware\nRestart device\nIf the problem persists, replace MIDC.'
  },
  {
    event_code: '31045',
    event_name: 'hubplus_fw_error_btldr_rsp_ready_critical',
    code: '31045',
    in_use: true,
    error_description: 'MIDC firmware error',
    display: true,
    possible_causes: 'Firmware in MIDC board may be corrupted',
    recommended_actions:
      'Update MIDC firmware\nRestart device\nIf the problem persists, replace MIDC.'
  },
  {
    event_code: '31046',
    event_name: 'hubplus_fw_error_contactor_protect_critical',
    code: '31046',
    in_use: true,
    error_description: 'MIDC firmware error',
    display: true,
    possible_causes: 'Firmware in MIDC board may be corrupted',
    recommended_actions:
      'Update MIDC firmware\nRestart device\nIf the problem persists, replace MIDC.'
  },
  {
    event_code: '31047',
    event_name: 'hubplus_fw_error_unknown_critical',
    code: '31047',
    in_use: true,
    error_description: 'MIDC firmware error',
    display: true,
    possible_causes: 'Firmware in MIDC board may be corrupted',
    recommended_actions:
      'Update MIDC firmware\nRestart device\nIf the problem persists, replace MIDC.'
  },
  {
    event_code: '32001',
    event_name: 'storage_inv_over_temperature_critical',
    code: '32001',
    in_use: true,
    error_description: 'Storage inverter ove temperature',
    display: true,
    possible_causes:
      'The ESS enclosure may be located in an overly hot location.\nESS enclosure fans may be blocked or faulty. ',
    recommended_actions:
      'Ensure that ESS is not near a heat source. \nEnsure that ESS fans are not blocked.\nCheck that the inverter air filter is unblocked and clean.\nCheck that the ESS enclosure door is properly locked.'
  },
  {
    event_code: '32002',
    event_name: 'f1_ac_output_undervoltage_shutdown_critical',
    code: '32002',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32003',
    event_name: 'f2_ac_output_overvoltage_shutdown_critical',
    code: '32003',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32004',
    event_name: 'f17_ac1_l1_backfeed_fault_critical',
    code: '32004',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32005',
    event_name: 'f18_ac1_l2_backfeed_fault_critical',
    code: '32005',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32006',
    event_name: 'f19_ac2_l1_backfeed_fault_critical',
    code: '32006',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32007',
    event_name: 'f20_ac2_l2_backfeed_fault_critical',
    code: '32007',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32008',
    event_name: 'f21_ac_l1l2_backfeed_fault_critical',
    code: '32008',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32009',
    event_name: 'f22_ac_l1_weld_backfeed_fault_critical',
    code: '32009',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32010',
    event_name: 'f23_antiislanding_fault_over_freq_critical',
    code: '32010',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32011',
    event_name: 'f24_antiislanding_fault_under_freq_critical',
    code: '32011',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32012',
    event_name: 'f25_antiislanding_over_freq_critical',
    code: '32012',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32013',
    event_name: 'f26_antiislanding_under_freq_critical',
    code: '32013',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32014',
    event_name: 'f27_antiislanding_l1_over_voltage_critical',
    code: '32014',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32015',
    event_name: 'f28_antiislanding_l2_over_voltage_critical',
    code: '32015',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32016',
    event_name: 'f29_antiislanding_over_voltage_critical',
    code: '32016',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32017',
    event_name: 'f30_antiislanding_l1l2_over_voltage_critical',
    code: '32017',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32018',
    event_name: 'f31_antiislanding_l1_over_voltage_slow_critical',
    code: '32018',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32019',
    event_name: 'f32_antiislanding_l2_over_voltage_slow_critical',
    code: '32019',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32020',
    event_name: 'f33_antiislanding_l1l2_over_voltage_slow_critical',
    code: '32020',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32021',
    event_name: 'f34_antiislanding_l1_under_voltage_slow_critical',
    code: '32021',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32022',
    event_name: 'f35_antiislanding_l2_under_voltage_slow_critical',
    code: '32022',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32023',
    event_name: 'f36_antiislanding_l1l2_under_voltage_slow_critical',
    code: '32023',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32024',
    event_name: 'f37_antiislanding_l1_under_voltage_fast_critical',
    code: '32024',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32025',
    event_name: 'f38_antiislanding_l2_under_voltage_fast_critical',
    code: '32025',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32026',
    event_name: 'f39_antiislanding_under_voltage_fast_critical',
    code: '32026',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32027',
    event_name: 'f40_antiislanding_l1l2_under_voltage_fast_critical',
    code: '32027',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32028',
    event_name: 'f41_aps_under_voltage_critical',
    code: '32028',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32029',
    event_name: 'f42_aps_over_voltage_critical',
    code: '32029',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32030',
    event_name: 'f44_battery_over_temperature_critical',
    code: '32030',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32031',
    event_name: 'f45_capacitor_over_temperature_critical',
    code: '32031',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32032',
    event_name: 'f46_controller_error_critical',
    code: '32032',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32033',
    event_name: 'f47_dc_under_voltage_immediate_critical',
    code: '32033',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32034',
    event_name: 'f48_dc_under_voltage_shutdown_critical',
    code: '32034',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32035',
    event_name: 'f49_dc_over_voltage_shutdown_critical',
    code: '32035',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32036',
    event_name: 'f51_eeprom_error_critical',
    code: '32036',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32037',
    event_name: 'f52_eeprom_error_cal_fail_critical',
    code: '32037',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32038',
    event_name: 'f53_eeprom_error_config_fail_critical',
    code: '32038',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32039',
    event_name: 'f54_eeprom_error_default_fail_critical',
    code: '32039',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32040',
    event_name: 'f55_eeprom_error_log_fail_critical',
    code: '32040',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32041',
    event_name: 'f56_eeprom_error_strings_fail_critical',
    code: '32041',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32042',
    event_name: 'f57_fet1_over_temperature_shutdown_critical',
    code: '32042',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32043',
    event_name: 'f58_fet2_over_temperature_shutdown_critical',
    code: '32043',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32044',
    event_name: 'f59_configuration_copy_error_critical',
    code: '32044',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32045',
    event_name: 'f60_invalid_input_critical',
    code: '32045',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32046',
    event_name: 'f61_invalid_warning_critical',
    code: '32046',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32047',
    event_name: 'f62_invalid_interrupt_critical',
    code: '32047',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32048',
    event_name: 'f63_ac_overload_primary_critical',
    code: '32048',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32049',
    event_name: 'f64_ac_overload_secondary_1s_critical',
    code: '32049',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32050',
    event_name: 'f65_ac_overload_2s_critical',
    code: '32050',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32051',
    event_name: 'f66_system_configuration_error_critical',
    code: '32051',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32052',
    event_name: 'f67_watchdog_reset_critical',
    code: '32052',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32053',
    event_name: 'f68_transformer_over_temperature_critical',
    code: '32053',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32054',
    event_name: 'f69_synchronization_signal_fault_critical',
    code: '32054',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32055',
    event_name: 'f70_3_phase_configuration_fault_critical',
    code: '32055',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32056',
    event_name: 'f90_external_bms_disconnected_critical',
    code: '32056',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32057',
    event_name: 'f71_battery_discharge_over_current_critical',
    code: '32057',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32058',
    event_name: 'f72_external_contactor_malfunction_critical',
    code: '32058',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32059',
    event_name: 'f73_battery_charge_over_current_critical',
    code: '32059',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32060',
    event_name: 'f74_battery_under_voltage_critical',
    code: '32060',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32061',
    event_name: 'f75_battery_over_voltage_critical',
    code: '32061',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32062',
    event_name: 'f91_soc_level_lost_critical',
    code: '32062',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32063',
    event_name: 'f92_gateway_comms_lost_critical',
    code: '32063',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '32064',
    event_name: 'f93_sunspec_controller_comms_lost_critical',
    code: '32064',
    in_use: true,
    error_description: 'Inverter fault',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '33000',
    event_name: 'battery_low_state_of_charge_critical',
    code: '33000',
    in_use: true,
    error_description: 'Battery has low state of charge',
    display: true,
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
    error_description: 'Battery has degraded (low state of health)',
    display: true,
    possible_causes:
      'Battery may have been exposed ot harsh environmental conditions or may have been used aggressively.',
    recommended_actions:
      'Check battery location: temperature and airflow into batttery. Contact SunPower'
  },
  {
    event_code: '33002',
    event_name: 'battery_communication_outage_critical',
    code: '33002',
    in_use: true,
    error_description: 'Battery communication outage',
    display: true,
    possible_causes: 'PVS cannot reach the battery',
    recommended_actions:
      'Check Etherned and CAN connections between battery gateway, PVS and MIO board.'
  },
  {
    event_code: '33003',
    event_name: 'battery_under_voltage_critical',
    code: '33003',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33004',
    event_name: 'battery_over_voltage_critical',
    code: '33004',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33005',
    event_name: 'battery_over_current_during_charge_critical',
    code: '33005',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33006',
    event_name: 'battery_over_power_during_charge_critical',
    code: '33006',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33007',
    event_name: 'battery_over_current_during_discharge_critical',
    code: '33007',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33008',
    event_name: 'battery_over_power_during_discharge_critical',
    code: '33008',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33009',
    event_name: 'battery_over_current_limit_during_charge_critical',
    code: '33009',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33010',
    event_name: 'battery_over_current_limit_during_discharge_critical',
    code: '33010',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33011',
    event_name: 'battery_under_temperature_during_charge_critical',
    code: '33011',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33012',
    event_name: 'battery_over_temperature_during_charge_critical',
    code: '33012',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33013',
    event_name: 'battery_under_temperature_during_discharge_critical',
    code: '33013',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33014',
    event_name: 'battery_over_temperature_during_discharge_critical',
    code: '33014',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33015',
    event_name: 'battery_cell_delta_voltage_too_high_critical',
    code: '33015',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33016',
    event_name: 'battery_cell_temperature_diff_too_high_critical',
    code: '33016',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33020',
    event_name: 'battery_hardware_under_voltage_critical',
    code: '33020',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33021',
    event_name: 'battery_hardware_over_voltage_critical',
    code: '33021',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33022',
    event_name: 'battery_hardware_over_current_critical',
    code: '33022',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33023',
    event_name: 'battery_hardware_over_temperature_critical',
    code: '33023',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33024',
    event_name: 'battery_adc_module_fault_critical',
    code: '33024',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33025',
    event_name: 'battery_afe_mcu_comm_error_critical',
    code: '33025',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33026',
    event_name: 'battery_pre_charge_failure_critical',
    code: '33026',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33027',
    event_name: 'battery_contactor_welded_critical',
    code: '33027',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33028',
    event_name: 'battery_pos_contactor_drive_fault_critical',
    code: '33028',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33029',
    event_name: 'battery_pre_charge_contactor_drive_fault_critical',
    code: '33029',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33030',
    event_name: 'battery_neg_contactor_drive_fault_critical',
    code: '33030',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33031',
    event_name: 'battery_pos_contactor_offline_critical',
    code: '33031',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33032',
    event_name: 'battery_pre_charge_contactor_offline_critical',
    code: '33032',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33033',
    event_name: 'battery_neg_contactor_offline_critical',
    code: '33033',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33034',
    event_name: 'battery_pos_contactor_welded_critical',
    code: '33034',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33035',
    event_name: 'battery_neg_contactor_welded_critical',
    code: '33035',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33036',
    event_name: 'battery_pack_enumeration_error_critical',
    code: '33036',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33037',
    event_name: 'battery_master_slave_communication_error_critical',
    code: '33037',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33038',
    event_name: 'battery_soft_start_failure_critical',
    code: '33038',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '33039',
    event_name: 'battery_internal_failure_critical',
    code: '33039',
    in_use: true,
    error_description: 'Battery internal fault',
    display: true,
    possible_causes: 'A battery internal fault occurred',
    recommended_actions: 'Please contact SunPower'
  },
  {
    event_code: '34001',
    event_name: 'esshub_over_temperature_critical',
    code: '34001',
    in_use: true,
    error_description: 'MIO board over temperature',
    display: true,
    possible_causes:
      'The ESS enclosure may be located in an overly hot location.\nESS enclosure fans may be blocked or faulty. ',
    recommended_actions:
      'Ensure that ESS is not near a heat source. \nEnsure that ESS fans are not blocked.\nCheck that the inverter air filter is unblocked and clean.\nCheck that the ESS enclosure door is properly locked.'
  },
  {
    event_code: '34010',
    event_name: 'esshub_communication_outage_critical',
    code: '34010',
    in_use: true,
    error_description: 'MIO communication outage',
    display: true,
    possible_causes: 'PVS cannot reach MIO board',
    recommended_actions:
      'Check Etherned and CAN connections between PVS and MIO board'
  },
  {
    event_code: '34011',
    event_name: 'esshub_fw_error_inval_critical',
    code: '34011',
    in_use: true,
    error_description: 'MIO firmware error',
    display: true,
    possible_causes: 'Firmware in MIO board may be corrupted',
    recommended_actions:
      'Update MIO firmware\nRestart device\nIf the problem persists, replace MIO.'
  },
  {
    event_code: '34012',
    event_name: 'esshub_fw_error_spi_bsy_critical',
    code: '34012',
    in_use: true,
    error_description: 'MIO firmware error',
    display: true,
    possible_causes: 'Firmware in MIO board may be corrupted',
    recommended_actions:
      'Update MIO firmware\nRestart device\nIf the problem persists, replace MIO.'
  },
  {
    event_code: '34013',
    event_name: 'esshub_fw_error_spi_inval_cs_critical',
    code: '34013',
    in_use: true,
    error_description: 'MIO firmware error',
    display: true,
    possible_causes: 'Firmware in MIO board may be corrupted',
    recommended_actions:
      'Update MIO firmware\nRestart device\nIf the problem persists, replace MIO.'
  },
  {
    event_code: '34014',
    event_name: 'esshub_fw_error_spi_critical',
    code: '34014',
    in_use: true,
    error_description: 'MIO firmware error',
    display: true,
    possible_causes: 'Firmware in MIO board may be corrupted',
    recommended_actions:
      'Update MIO firmware\nRestart device\nIf the problem persists, replace MIO.'
  },
  {
    event_code: '34015',
    event_name: 'esshub_fw_error_flash_w_key_critical',
    code: '34015',
    in_use: true,
    error_description: 'MIO firmware error',
    display: true,
    possible_causes: 'Firmware in MIO board may be corrupted',
    recommended_actions:
      'Update MIO firmware\nRestart device\nIf the problem persists, replace MIO.'
  },
  {
    event_code: '34016',
    event_name: 'esshub_fw_error_flash_r_critical',
    code: '34016',
    in_use: true,
    error_description: 'MIO firmware error',
    display: true,
    possible_causes: 'Firmware in MIO board may be corrupted',
    recommended_actions:
      'Update MIO firmware\nRestart device\nIf the problem persists, replace MIO.'
  },
  {
    event_code: '34017',
    event_name: 'esshub_fw_error_flash_crc_critical',
    code: '34017',
    in_use: true,
    error_description: 'MIO firmware error',
    display: true,
    possible_causes: 'Firmware in MIO board may be corrupted',
    recommended_actions:
      'Update MIO firmware\nRestart device\nIf the problem persists, replace MIO.'
  },
  {
    event_code: '34018',
    event_name: 'esshub_fw_error_flash_w_critical',
    code: '34018',
    in_use: true,
    error_description: 'MIO firmware error',
    display: true,
    possible_causes: 'Firmware in MIO board may be corrupted',
    recommended_actions:
      'Update MIO firmware\nRestart device\nIf the problem persists, replace MIO.'
  },
  {
    event_code: '34019',
    event_name: 'esshub_fw_error_eeprom_critical',
    code: '34019',
    in_use: true,
    error_description: 'MIO firmware error',
    display: true,
    possible_causes: 'Firmware in MIO board may be corrupted',
    recommended_actions:
      'Update MIO firmware\nRestart device\nIf the problem persists, replace MIO.'
  },
  {
    event_code: '34020',
    event_name: 'esshub_fw_error_eeprom_r_critical',
    code: '34020',
    in_use: true,
    error_description: 'MIO firmware error',
    display: true,
    possible_causes: 'Firmware in MIO board may be corrupted',
    recommended_actions:
      'Update MIO firmware\nRestart device\nIf the problem persists, replace MIO.'
  },
  {
    event_code: '34021',
    event_name: 'esshub_fw_error_eeprom_w_critical',
    code: '34021',
    in_use: true,
    error_description: 'MIO firmware error',
    display: true,
    possible_causes: 'Firmware in MIO board may be corrupted',
    recommended_actions:
      'Update MIO firmware\nRestart device\nIf the problem persists, replace MIO.'
  },
  {
    event_code: '34022',
    event_name: 'esshub_fw_error_led_drv_critical',
    code: '34022',
    in_use: true,
    error_description: 'MIO firmware error',
    display: true,
    possible_causes: 'Firmware in MIO board may be corrupted',
    recommended_actions:
      'Update MIO firmware\nRestart device\nIf the problem persists, replace MIO.'
  },
  {
    event_code: '34023',
    event_name: 'esshub_fw_error_mbs_critical',
    code: '34023',
    in_use: true,
    error_description: 'MIO firmware error',
    display: true,
    possible_causes: 'Firmware in MIO board may be corrupted',
    recommended_actions:
      'Update MIO firmware\nRestart device\nIf the problem persists, replace MIO.'
  },
  {
    event_code: '34024',
    event_name: 'esshub_fw_error_btldr_en_key_critical',
    code: '34024',
    in_use: true,
    error_description: 'MIO firmware error',
    display: true,
    possible_causes: 'Firmware in MIO board may be corrupted',
    recommended_actions:
      'Update MIO firmware\nRestart device\nIf the problem persists, replace MIO.'
  },
  {
    event_code: '34025',
    event_name: 'esshub_fw_error_btldr_already_critical',
    code: '34025',
    in_use: true,
    error_description: 'MIO firmware error',
    display: true,
    possible_causes: 'Firmware in MIO board may be corrupted',
    recommended_actions:
      'Update MIO firmware\nRestart device\nIf the problem persists, replace MIO.'
  },
  {
    event_code: '34026',
    event_name: 'esshub_fw_error_btldr_data_ready_critical',
    code: '34026',
    in_use: true,
    error_description: 'MIO firmware error',
    display: true,
    possible_causes: 'Firmware in MIO board may be corrupted',
    recommended_actions:
      'Update MIO firmware\nRestart device\nIf the problem persists, replace MIO.'
  },
  {
    event_code: '34027',
    event_name: 'esshub_fw_error_btldr_rsp_ready_critical',
    code: '34027',
    in_use: true,
    error_description: 'MIO firmware error',
    display: true,
    possible_causes: 'Firmware in MIO board may be corrupted',
    recommended_actions:
      'Update MIO firmware\nRestart device\nIf the problem persists, replace MIO.'
  },
  {
    event_code: '34028',
    event_name: 'esshub_fw_error_contactor_protect_critical',
    code: '34028',
    in_use: true,
    error_description: 'MIO firmware error',
    display: true,
    possible_causes: 'Firmware in MIO board may be corrupted',
    recommended_actions:
      'Update MIO firmware\nRestart device\nIf the problem persists, replace MIO.'
  },
  {
    event_code: '34029',
    event_name: 'esshub_fw_error_unknown_critical',
    code: '34029',
    in_use: true,
    error_description: 'MIO firmware error',
    display: true,
    possible_causes: 'Firmware in MIO board may be corrupted',
    recommended_actions:
      'Update MIO firmware\nRestart device\nIf the problem persists, replace MIO.'
  },
  {
    event_code: '35000',
    event_name: 'gateway_communication_outage_critical',
    code: '35000',
    in_use: true,
    error_description: 'Gateway communiciation outage',
    display: true,
    possible_causes: 'PVS cannot communicate with Schneider gateway',
    recommended_actions:
      'Check Ethernet connector between PVS and Schneider gateway'
  },
  {
    event_code: '43040',
    event_name: 'battery_cell_under_voltage_permanent',
    code: '43040',
    in_use: true,
    error_description: 'Permanent battery damage: cell under voltage',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '43041',
    event_name: 'battery_cell_over_voltage_permanent',
    code: '43041',
    in_use: true,
    error_description: 'Permanent battery damage: cell over voltage',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '43042',
    event_name: 'battery_cell_delta_voltage_permanent',
    code: '43042',
    in_use: true,
    error_description: 'Permanent battery damage: cell voltage mismatch',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '43043',
    event_name: 'battery_state_of_health_permanent',
    code: '43043',
    in_use: true,
    error_description: 'Permanent battery damage: low state of cell',
    display: true,
    possible_causes: 'Check manual',
    recommended_actions: 'Check manual'
  },
  {
    event_code: '90001',
    event_name: 'SOME_GW_BAT',
    code: '90001',
    in_use: true,
    error_description: '',
    display: false,
    possible_causes: '',
    recommended_actions: ''
  },
  {
    event_code: '90002',
    event_name: 'NO_GW_BAT',
    code: '90002',
    in_use: true,
    error_description: 'Gateway could not find battery',
    display: false,
    possible_causes: 'Gateway was wired incorrectly or the gateway is off.',
    recommended_actions:
      'Check that the gateway is powered on by checking LED lights on gateway. Check ethernet cable between the gateway and PVS. Check that the CAN cable connecting PVS6, MIDC and gateway is properly installed and terminations are correct. Try power cycling the gateway if the problem persists. If the problem still perists, please contact SunPower.'
  },
  {
    event_code: '90004',
    event_name: 'SOME_KOM_BAT',
    code: '90004',
    in_use: true,
    error_description: 'Could not find one or more batteries',
    display: false,
    possible_causes:
      'Terminators may not have been connected properly or batteries are damaged.',
    recommended_actions:
      'Check the  battery DC terminator connections and positions. Check that the CAN daisy chain data connector is properly connected and terminated. Check that the battery LEDs are flashing. If the problem still persists, this may be a sign that the batteries are damaged. Please contact SunPower to arrange for a replacement.'
  },
  {
    event_code: '90005',
    event_name: 'SOME_GW_BAT SOME_KOM_BAT',
    code: '90005',
    in_use: true,
    error_description: 'Gateway and PVS could not find one or more batteries.',
    display: false,
    possible_causes:
      'Terminators may not have been connected properly or batteries are damaged.',
    recommended_actions:
      'Check that the gateway is powered on by checking LED lights on gateway. Check ethernet cable between the gateway and PVS. Check that the CAN cable connecting PVS6, MIDC and gateway is properly installed and terminations are correct. Try power cycling the gateway if the problem persists. If the problem still perists, please contact SunPower.\n\nCheck the  battery DC terminator connections and positions. Check that the CAN daisy chain data connector is properly connected and terminated. Check that the battery LEDs are flashing. If the problem still persists, this may be a sign that the batteries are damaged. Please contact SunPower to arrange for a replacement.'
  },
  {
    event_code: '90006',
    event_name: 'NO_GW_BAT SOME_KOM_BAT',
    code: '90006',
    in_use: true,
    error_description:
      'Gateway could not find any batteries, PVS could no find one or more batteries.',
    display: false,
    possible_causes: 'Gateway was wired incorrectly or the gateway is off.',
    recommended_actions:
      'Check that the gateway is powered on by checking LED lights on gateway. Check ethernet cable between the gateway and PVS. Check that the CAN cable connecting PVS6, MIDC and gateway is properly installed and terminations are correct. Try power cycling the gateway if the problem persists. If the problem still perists, please contact SunPower.'
  },
  {
    event_code: '90008',
    event_name: 'NO_KOM_BAT',
    code: '90008',
    in_use: true,
    error_description: 'PVS could not find any batteries',
    display: false,
    possible_causes:
      'This problem may be due to one of the following causes:\n- Ethernet connection between MIO and master battery may faulty. \n- Ethernet connection between MIO board and MIDC baord may be faulty.\n- CAN cable between PVS6 and MIDC may be faulty.\n- Batteries may be off, faulted or damaged',
    recommended_actions:
      "Check ethernet connections between MIO, master battery and MIDC.\nCheck CAN cable between PVS6 and MIDC.\nCheck that the LEDs indicate whether batteries are powered on. If they're off, please press the battery power button. \nIf the problem still persists, this may be a sign that the batteries are damaged. Please contact SunPower for a replacement."
  },
  {
    event_code: '90009',
    event_name: 'SOME_GW_BAT NO_KOM_BAT',
    code: '90009',
    in_use: true,
    error_description:
      'Gateway could not find one or more batteries, PVS could not find any batteries.',
    display: false,
    possible_causes:
      'This problem may be due to one of the following causes:\n- Ethernet connection between MIO and master battery may faulty. \n- Ethernet connection between MIO board and MIDC baord may be faulty.\n- CAN cable between PVS6 and MIDC may be faulty.\n- Batteries may be off, faulted or damaged',
    recommended_actions:
      "Check ethernet connections between MIO, master battery and MIDC.\nCheck CAN cable between PVS6 and MIDC.\nCheck that the LEDs indicate whether batteries are powered on. If they're off, please press the battery power button. \nIf the problem still persists, this may be a sign that the batteries are damaged. Please contact SunPower for a replacement."
  },
  {
    event_code: '90010',
    event_name: 'NO_GW_BAT NO_KOM_BAT',
    code: '90010',
    in_use: true,
    error_description: 'Gateway and PVS could no find any batteries',
    display: false,
    possible_causes:
      'Terminators may not have been connected properly or batteries are damaged.',
    recommended_actions:
      'Check that the gateway is powered on by checking LED lights on gateway. Check ethernet cable between the gateway and PVS. Check that the CAN cable connecting PVS6, MIDC and gateway is properly installed and terminations are correct. Try power cycling the gateway if the problem persists. If the problem still perists, please contact SunPower.\n\nCheck the  battery DC terminator connections and positions. Check that the CAN daisy chain data connector is properly connected and terminated. Check that the battery LEDs are flashing. If the problem still persists, this may be a sign that the batteries are damaged. Please contact SunPower to arrange for a replacement.'
  },
  {
    event_code: '90016',
    event_name: 'SOME_XW',
    code: '90016',
    in_use: true,
    error_description: 'Could not find one or more battery inverters.',
    display: false,
    possible_causes:
      'A power conductor terminator to the XWPro may be missing or loose\nData conneciton between Xwpro to Gateway (XANbus) is faulty or loose\nOne or more battery inverers are damaged.',
    recommended_actions:
      'Check that the terminator positions to the XW pro are in correct positions. \nCheck that the data connections between XWPro and gateway are correct.\nPower cycle Xwpro inverter. \nIf the problem still persists, this may be a sign that the XWpro is damaged, please contact SunPower to arrange for a replacement.'
  },
  {
    event_code: '90017',
    event_name: 'SOME_GW_BAT SOME_XW',
    code: '90017',
    in_use: true,
    error_description: 'Could not find one or more inverters',
    display: false,
    possible_causes:
      'A power conductor terminator to the XWPro may be missing or loose\nData conneciton between Xwpro to Gateway (XANbus) is faulty or loose\nOne or more battery inverers are damaged.',
    recommended_actions:
      'Check that the terminator positions to the XW pro are in correct positions. \nCheck that the data connections between XWPro and gateway are correct.\nPower cycle Xwpro inverter. \nIf the problem still persists, this may be a sign that the XWpro is damaged, please contact SunPower to arrange for a replacement.'
  },
  {
    event_code: '90018',
    event_name: 'NO_GW_BAT SOME_XW',
    code: '90018',
    in_use: true,
    error_description:
      'Gateway could not find any batteries and PVS could not find one or more inverters.',
    display: false,
    possible_causes: 'Gateway was wired incorrectly or the gateway is off.',
    recommended_actions:
      'Check that the gateway is powered on by checking LED lights on gateway. Check ethernet cable between the gateway and PVS. Check that the CAN cable connecting PVS6, MIDC and gateway is properly installed and terminations are correct. Try power cycling the gateway if the problem persists. If the problem still perists, please contact SunPower.'
  },
  {
    event_code: '90020',
    event_name: 'SOME_KOM_BAT SOME_XW',
    code: '90020',
    in_use: true,
    error_description:
      'PVS could no find one or more inverters and one or more batteries.',
    display: false,
    possible_causes:
      'Some batteries in a group are off or faulted.\nBattery CAN termination in a group is faulted.\nXWpro XANbus cable or termination is faulty.\n',
    recommended_actions:
      'Try waking-up batteries in a group.\nCheck battery CAN terminators in a dasiy chain\nWiggle/replace battery CAN cable\nCheck XWpro X terminator\nWiggle/Replace XANbus cable'
  },
  {
    event_code: '90021',
    event_name: 'SOME_GW_BAT SOME_KOM_BAT SOME_XW',
    code: '90021',
    in_use: true,
    error_description:
      'PVS could no find one or more inverters and one or more batteries.',
    display: false,
    possible_causes:
      'Some batteries in a group are off or faulted.\nBattery CAN termination in a group is faulted.\nXWpro XANbus cable or termination is faulty.\n',
    recommended_actions:
      'Try waking-up batteries in a group.\nCheck battery CAN terminators in a dasiy chain\nWiggle/replace battery CAN cable\nCheck XWpro X terminator\nWiggle/Replace XANbus cable'
  },
  {
    event_code: '90022',
    event_name: 'NO_GW_BAT SOME_KOM_BAT SOME_XW',
    code: '90022',
    in_use: true,
    error_description:
      'Gateway  could not find any batteries and PVS could not find one or more batteries.',
    display: false,
    possible_causes:
      'Terminators may not have been connected properly or batteries are damaged.',
    recommended_actions:
      'Check that the gateway is powered on by checking LED lights on gateway. Check ethernet cable between the gateway and PVS. Check that the CAN cable connecting PVS6, MIDC and gateway is properly installed and terminations are correct. Try power cycling the gateway if the problem persists. If the problem still perists, please contact SunPower.\n\nCheck the  battery DC terminator connections and positions. Check that the CAN daisy chain data connector is properly connected and terminated. Check that the battery LEDs are flashing. If the problem still persists, this may be a sign that the batteries are damaged. Please contact SunPower to arrange for a replacement.'
  },
  {
    event_code: '90024',
    event_name: 'NO_KOM_BAT SOME_XW',
    code: '90024',
    in_use: true,
    error_description:
      "PVS could not find any batteries and it also couldn't find one or more inverters.",
    display: false,
    possible_causes:
      'Some batteries in a group are off or faulted.\nBattery CAN termination in a group is faulted.\nXWpro XANbus cable or termination is faulty.\n',
    recommended_actions:
      'Try waking-up batteries in a group.\nCheck battery CAN terminators in a dasiy chain\nWiggle/replace battery CAN cable\nCheck XWpro X terminator\nWiggle/Replace XANbus cable'
  },
  {
    event_code: '90025',
    event_name: 'SOME_GW_BAT NO_KOM_BAT SOME_XW',
    code: '90025',
    in_use: true,
    error_description:
      'Gateway could not find one or more batteries, PVS could not find any bateries and PVS could not find one or more inverters.',
    display: false,
    possible_causes:
      'Some batteries in a group are off or faulted.\nBattery CAN termination in a group is faulted.\nXWpro XANbus cable or termination is faulty.\n',
    recommended_actions:
      'Try waking-up batteries in a group.\nCheck battery CAN terminators in a dasiy chain\nWiggle/replace battery CAN cable\nCheck XWpro X terminator\nWiggle/Replace XANbus cable'
  },
  {
    event_code: '90026',
    event_name: 'NO_GW_BAT NO_KOM_BAT SOME_XW',
    code: '90026',
    in_use: true,
    error_description:
      'Gateway could not find any batteries, PVS could not find any batteries. PVS could not find one or more inverters.',
    display: false,
    possible_causes: 'Gateway was wired incorrectly or the gateway is off.',
    recommended_actions:
      'Check that the gateway is powered on by checking LED lights on gateway. Check ethernet cable between the gateway and PVS. Check that the CAN cable connecting PVS6, MIDC and gateway is properly installed and terminations are correct. Try power cycling the gateway if the problem persists. If the problem still perists, please contact SunPower.'
  },
  {
    event_code: '90032',
    event_name: 'NO_XW',
    code: '90032',
    in_use: true,
    error_description: 'PVS did not find any inverters.',
    display: false,
    possible_causes:
      'XWpro Power button was not activated\nBad/Loose XANbus cable \nBad/loose/missing XANbus terminator \nBatteries connected to XWpro-X are Off/ Faulted \nXWpro may be damaged',
    recommended_actions:
      'Try pushing XWpro power button for activation\nTry waking-up the batteries to see if XWpro comes online\nWiggle/replace XANbus cable \nCheck XANbus terminator position or connectivity \nReplace damaged XWpro'
  },
  {
    event_code: '90033',
    event_name: 'SOME_GW_BAT NO_XW',
    code: '90033',
    in_use: true,
    error_description:
      'Gateway could not find one or more batteries. PVS could not find any Xwpro invertters.',
    display: false,
    possible_causes:
      'XWpro Power button was not activated\nBad/Loose XANbus cable \nBad/loose/missing XANbus terminator \nBatteries connected to XWpro-X are Off/ Faulted \nXWpro may be damaged',
    recommended_actions:
      'Try pushing XWpro power button for activation\nTry waking-up the batteries to see if XWpro comes online\nWiggle/replace XANbus cable \nCheck XANbus terminator position or connectivity \nReplace damaged XWpro'
  },
  {
    event_code: '90034',
    event_name: 'NO_GW_BAT NO_XW',
    code: '90034',
    in_use: true,
    error_description:
      'Gateway could not find any batteries, PVS could no find any inverters.',
    display: false,
    possible_causes: 'Gateway was wired incorrectly or the gateway is off.',
    recommended_actions:
      'Check that the gateway is powered on by checking LED lights on gateway. Check ethernet cable between the gateway and PVS. Check that the CAN cable connecting PVS6, MIDC and gateway is properly installed and terminations are correct. Try power cycling the gateway if the problem persists. If the problem still perists, please contact SunPower.'
  },
  {
    event_code: '90036',
    event_name: 'SOME_KOM_BAT NO_XW',
    code: '90036',
    in_use: true,
    error_description:
      'PVS could not find any inverters and one or more batteries',
    display: false,
    possible_causes:
      'Battery Faulted behind the XWpro-X\nBad/Loose XANbus cable \nBad/loose XANbus terminator',
    recommended_actions:
      'Try clearing the Battery fault and enable 48V to XWpro-X\nWiggle/replace XANbus cable \nCheck XANbus terminator position and connectivity'
  },
  {
    event_code: '90037',
    event_name: 'SOME_GW_BAT SOME_KOM_BAT NO_XW',
    code: '90037',
    in_use: true,
    error_description:
      'Gateway could not find one or more batteries. PVS could not find one or more batteries. PVS could not find any inverters.',
    display: false,
    possible_causes:
      'Battery Faulted behind the XWpro-X\nBad/Loose XANbus cable \nBad/loose XANbus terminator',
    recommended_actions:
      'Try clearing the Battery fault and enable 48V to XWpro-X\nWiggle/replace XANbus cable \nCheck XANbus terminator position and connectivity'
  },
  {
    event_code: '90038',
    event_name: 'NO_GW_BAT SOME_KOM_BAT NO_XW',
    code: '90038',
    in_use: true,
    error_description:
      'Gateway could not find any batteries. PVS could not find one or more batteries. PVS could not find one or more inverters.',
    display: false,
    possible_causes:
      'Gateway was wired incorrectly or the gateway is off.\nXWpro Power button was not activated\nBad/Loose XANbus cable \nBad/loose/missing XANbus terminator \nBatteries connected to XWpro-X are Off/ Faulted \nXWpro may be damaged',
    recommended_actions:
      'Check that the gateway is powered on by checking LED lights on gateway. Check ethernet cable between the gateway and PVS. Check that the CAN cable connecting PVS6, MIDC and gateway is properly installed and terminations are correct. Try power cycling the gateway if the problem persists. If the problem still perists, please contact SunPower.\n\nTry pushing XWpro power button for activation\nTry waking-up the batteries to see if XWpro comes online\nWiggle/replace XANbus cable \nCheck XANbus terminator position or connectivity \nReplace damaged XWpro'
  },
  {
    event_code: '90040',
    event_name: 'NO_KOM_BAT NO_XW',
    code: '90040',
    in_use: true,
    error_description: 'PVS could not find any batteries or inverters.',
    display: false,
    possible_causes:
      'All Batteries behind an XWpro-X are faulted/Off\nBad/Loose XANbus cable\nBad/Loose XANbus terminator\nBad/loose Battery CAN daisy chain\nBad/loose Battery CAN terminator',
    recommended_actions:
      'Try waking up the batteries to see if XWpro-X comes online \nCheck XWpro-X COM connections \nCheck Battery COM connections\nCheck Battery LED  \n'
  },
  {
    event_code: '90041',
    event_name: 'SOME_GW_BAT NO_KOM_BAT NO_XW',
    code: '90041',
    in_use: true,
    error_description:
      'Gateway could not find one or more batteries. PVS could not find any batteries or inverters.',
    display: false,
    possible_causes:
      'All Batteries behind an XWpro-X are faulted/Off\nBad/Loose XANbus cable\nBad/Loose XANbus terminator\nBad/loose Battery CAN daisy chain\nBad/loose Battery CAN terminator',
    recommended_actions:
      'Try waking up the batteries to see if XWpro-X comes online \nCheck XWpro-X COM connections \nCheck Battery COM connections\nCheck Battery LED  \n'
  },
  {
    event_code: '90042',
    event_name: 'NO_GW_BAT NO_KOM_BAT NO_XW',
    code: '90042',
    in_use: true,
    error_description:
      'Gateway could not find any batteries, PVS could not find any batteries. PVS could not find any inverters.',
    display: false,
    possible_causes:
      'All Batteries behind an XWpro-X are faulted/Off\nBad/Loose XANbus cable\nBad/Loose XANbus terminator\nBad/loose Battery CAN daisy chain\nBad/loose Battery CAN terminator',
    recommended_actions:
      'Try waking up the batteries to see if XWpro-X comes online \nCheck XWpro-X COM connections \nCheck Battery COM connections\nCheck Battery LED  \n'
  },
  {
    event_code: '90098',
    event_name: 'NO_GW_BAT NO_XW NO_GW',
    code: '90098',
    in_use: true,
    error_description: 'PVS could not find batteries or gateway.',
    display: false,
    possible_causes:
      'Bad/Loose MIDC to MIO cable \nBad/Loose PVS6 to MIDC CAN cable\nCheck Gateway and Battery LED',
    recommended_actions:
      'Wiggle/Replace cable\nWiggle/Replace cable\nPowercycle/Press power button'
  },
  {
    event_code: '90102',
    event_name: 'NO_GW_BAT SOME_KOM_BAT NO_XW NO_GW',
    code: '90102',
    in_use: true,
    error_description:
      'PVS coud not find gateway  and could not find one or more batteries.',
    display: false,
    possible_causes:
      'Gateway is frozen \nBad/Loose Ethernet cable to Gateway \nGateway lost Power \nBad/Loose CAN cable to Gateway ',
    recommended_actions:
      'Power cycle Gateway \nCheck Gateway LEDs\nCheck COM connections to Gateway and their Terminators'
  },
  {
    event_code: '90106',
    event_name: 'NO_GW_BAT NO_KOM_BAT NO_XW NO_GW',
    code: '90106',
    in_use: true,
    error_description:
      'PVS could not find gateway, and could not find one or more batteries. PVS coud not find any inverters.',
    display: false,
    possible_causes:
      'XWpro Power button was not activated\nBad/Loose XANbus cable \nBad/loose/missing XANbus terminator \nBatteries connected to XWpro-X are Off/ Faulted \nXWpro may be damaged',
    recommended_actions:
      'Try pushing XWpro power button for activation\nTry waking-up the batteries to see if XWpro comes online\nWiggle/replace XANbus cable \nCheck XANbus terminator position or connectivity \nReplace damaged Xwpro\nPower cycle gateway'
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
