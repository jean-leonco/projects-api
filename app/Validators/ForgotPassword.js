'use strict'

class ForgotPassword {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      email: 'required|email',
      redirect_url: 'required|url'
    }
  }

  get messages () {
    return {
      'email.required': 'You must provide a e-mail address',
      'email.email': 'You must provide a valid e-mail address',
      'redirect_url.required': 'You must provide a redirect url',
      'redirect_url.url': 'The redirect url must be an url'
    }
  }
}

module.exports = ForgotPassword
