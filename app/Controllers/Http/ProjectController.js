'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Project = use('App/Models/Project')

class ProjectController {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async index () {
    const projects = await Project.query()
      .with('user')
      .fetch()

    return projects
  }

  /**

   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    try {
      const data = request.only(['title', 'description'])

      const project = await Project.create({ ...data, user_id: auth.user.id })

      return project
    } catch (error) {
      return response.status(error.status).send({
        error: { message: 'Something went wrong, could not save project' }
      })
    }
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async show ({ params, response }) {
    try {
      const project = await Project.findOrFail(params.id)

      await project.load('user')
      await project.load('tasks')

      return project
    } catch (error) {
      return response.status(error.status).send({
        error: { message: 'Something went wrong, could not find project' }
      })
    }
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    try {
      const project = await Project.findOrFail(params.id)
      const data = request.only(['title', 'description'])

      project.merge(data)
      await project.save()

      return project
    } catch (error) {
      return response.status(error.status).send({
        error: { message: 'Something went wrong, could not save project' }
      })
    }
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    try {
      const project = await Project.findOrFail(params.id)

      await project.delete()
      return response.send({
        sucess: { message: 'Project sucessfully deleted' }
      })
    } catch (error) {
      return response.status(error.status).send({
        error: { message: 'Something went wrong, could not delete project' }
      })
    }
  }
}

module.exports = ProjectController
