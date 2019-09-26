'use strict'

class Session {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      email: 'required|email',
      password: 'required'
    }
  }

  get messages () {
    return {
      'email.required': 'You must provide a e-mail address',
      'email.email': 'You must provide a valid e-mail address',
      'password.required': 'You must provide a password'
    }
  }
}

module.exports = Session
