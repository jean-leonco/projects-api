'use strict'

const crypto = require('crypto')
const Helpers = use('Helpers')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const File = use('App/Models/File')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class FileController {
  /**
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async show ({ params, response }) {
    try {
      const file = await File.findByOrFail('file', params.file_name)

      return response.download(Helpers.tmpPath(`uploads/${file.file}`))
    } catch (error) {
      return response.status(error.status).send({
        error: { message: 'Something went wrong, could not save file' }
      })
    }
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    try {
      if (!request.file('file')) return

      const upload = request.file('file', { size: '2mb' })

      const random = crypto.randomBytes(16).toString('hex')

      const fileName = `${random}.${upload.subtype}`

      await upload.move(Helpers.tmpPath('uploads'), {
        name: fileName
      })

      if (!upload.moved()) {
        throw upload.error()
      }

      const file = await File.create({
        file: fileName,
        name: upload.clientName,
        type: upload.type,
        subtype: upload.subtype
      })

      return file
    } catch (error) {
      return response.status(error.status).send({
        error: { message: 'Something went wrong, could not save file' }
      })
    }
  }
}

module.exports = FileController
