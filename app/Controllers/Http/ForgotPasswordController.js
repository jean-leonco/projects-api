'use strict'

const { parseISO, isBefore, addDays } = require('date-fns')
const crypto = require('crypto')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

const Kue = use('Kue')
const Job = use('App/Jobs/ForgotPasswordMail')

class ForgotPasswordController {
  async store ({ request, response }) {
    try {
      const email = request.input('email')

      const user = await User.findByOrFail('email', email)

      user.token = crypto.randomBytes(10).toString('hex')
      user.token_created_at = new Date()

      await user.save()

      const { redirect_url: url, system, browser } = request.all()

      Kue.dispatch(
        Job.key,
        { email, user, url, system, browser },
        { attempts: 3 }
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
