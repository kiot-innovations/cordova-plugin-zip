export class UpdateFeatureFlagsError extends Error {
  constructor(message) {
    super(message)
    this.name = 'UpdateFeatureFlagsError'
    this.message = message
  }
}
