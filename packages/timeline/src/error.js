/* 
TODO
replace the errors with new custom errors in @twreporter/core
*/

export class GoogleAPIsError extends Error {
  constructor(message, payload = {}) {
    super(message)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GoogleAPIsError) // add `.stack` to instance
    }
    this.name = 'GoogleAPIsError'
    this.payload = payload
  }
}

export class ActionError extends Error {
  constructor(message, payload = {}) {
    super(message)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ActionError) // add `.stack` to instance
    }
    this.name = 'ActionError'
    this.payload = payload
  }
}
