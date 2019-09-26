'use strict'

class User {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      username: 'required|unique:users',
      email: 'required|email|unique:users',
      password: 'required|confirmed'
    }
  }

  get messages () {
    return {
      'username.required': 'You must provide an username',
      'username.unique': 'This username is already registered',
      'email.required': 'You must provide a e-mail address',
      'email.email': 'You must provide a valid e-mail address',
      'email.unique': 'This e-mail is already registered',
      'password.required': 'You must provide a password',
      'password.confirmed': 'You must provide the password confirmation field'
    }
  }
}

module.exports = User
