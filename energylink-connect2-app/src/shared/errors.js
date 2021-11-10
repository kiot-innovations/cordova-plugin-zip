export class UpdateFeatureFlagsError extends Error {
  constructor(message) {
    super(message)
    this.name = 'UpdateFeatureFlagsError'
    this.message = message
  }
}

export class UpdateTuturialsError extends Error {
  constructor(message) {
    super(message)
    this.name = 'UpdateTuturialsError'
    this.message = message
  }
}
