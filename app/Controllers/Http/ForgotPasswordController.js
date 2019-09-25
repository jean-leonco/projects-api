'use strict'

const { parseISO, isBefore, addDays } = require('date-fns')
const crypto = require('crypto')
const Mail = use('Mail')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

class ForgotPasswordController {
  async store ({ request, response }) {
    try {
      const email = request.input('email')

      const user = await User.findByOrFail('email', email)

      user.token = crypto.randomBytes(10).toString('hex')
      user.token_created_at = new Date()

      await user.save()

      await Mail.send(
        ['emails.forgot_password'],
        {
          email,
          name: user.username,
          action_url: `${request.input('redirect_url')}?token=${user.token}`,
          operating_system: 'Ubuntu',
          browser_name: 'Google Chrome',
          support_url: 'http://app.adonis.com/support'
        },
        message => {
          message.from('jeang.leonco@gmail.com')
          message.to(user.email)
          message.subject('Reset your test password')
        }
      )
    } catch (error) {
      return response.status(error.status).send({
        error: { message: 'Something went wrong, is this e-mail correct?' }
      })
    }
  }

  async update ({ request, response }) {
    try {
      const { token, password } = request.all()

      const user = await User.findByOrFail('token', token)

      const timeLeft = addDays(parseISO(user.token_created_at), 1)

      const tokenExpired = isBefore(timeLeft, new Date())

      if (tokenExpired) {
        return response.status(401).send({
          error: { message: 'Recovery token expired' }
        })
      }

      user.token = null
      user.token_created_at = null
      user.password = password

      await user.save()

      return user
    } catch (error) {
      return response.status(error.status).send({
        error: { message: 'Something went wrong when recovering password' }
      })
    }
  }
}

module.exports = ForgotPasswordController
