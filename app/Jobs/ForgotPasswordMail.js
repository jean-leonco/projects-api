'use strict'

const Mail = use('Mail')

class ForgotPasswordMail {
  static get concurrency () {
    return 2
  }

  static get key () {
    return 'ForgotPasswordMail-job'
  }

  async handle ({ email, user, url, system, browser }) {
    await Mail.send(
      ['emails.forgot_password'],
      {
        email,
        name: user.username,
        action_url: `${url}?token=${user.token}`,
        operating_system: system,
        browser_name: browser,
        support_url: 'http://app.adonis.com/support'
      },
      message => {
        message.from('jeang.leonco@gmail.com')
        message.to(user.email)
        message.subject('Reset your test password')
      }
    )
  }
}

module.exports = ForgotPasswordMail
