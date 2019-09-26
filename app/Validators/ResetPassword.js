'use strict'

class ResetPassowrd {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      token: 'required',
      password: 'required|confirmed'
    }
  }

  get messages () {
    return {
      'token.required': 'You must provide a token',
      'password.required': 'You must provide a password',
      'password.confirmed': 'You must provide the password confirmation field'
    }
  }
}

module.exports = ResetPassowrd
