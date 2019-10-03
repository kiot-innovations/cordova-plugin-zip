import { createMigrate } from 'redux-persist'

const migrations = {
  energyData: {
    1: () => () => ({}),
    2: () => () => ({})
  },
  alerts: {
    1: () => () => ({})
  }
}

export const migrationsMap = {
  energyData: createMigrate(migrations.energyData, { debug: true }),
  alerts: createMigrate(migrations.alerts, { debug: true })
}

export const storesVersions = {
  historyReducer: 0,
  userReducer: 0,
  languageReducer: 0,
  alertsReducer: 1,
  wifiReducer: 0,
  energyDataReducer: 2,
  storageReducer: 0,
  environmentReducer: 0,
  shareReducer: 0
}
