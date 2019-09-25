'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Task = use('App/Models/Task')

class TaskController {
  /**
   * @param {object} ctx
   */
  async index ({ params }) {
    const tasks = await Task.query()
      .where('project_id', params.projects_id)
      .with('user')
      .fetch()

    return tasks
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, params }) {
    try {
      const data = request.only([
        'user_id',
        'title',
        'description',
        'due_date',
        'file_id'
      ])

      const task = await Task.create({
        ...data,
        project_id: params.projects_id
      })

      return task
    } catch (error) {
      return response.status(error.status).send({
        error: { message: 'Something went wrong, could not save task' }
      })
    }
  }

  /**
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async show ({ params, response }) {
    try {
      const task = await Task.findOrFail(params.id)

      return task
    } catch (error) {
      return response.status(error.status).send({
        error: { message: 'Something went wrong, could not find task' }
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
      const task = await Task.findOrFail(params.id)

      const data = request.only([
        'user_id',
        'title',
        'description',
        'due_date',
        'file_id'
      ])

      task.merge(data)
      await task.save()

      return task
    } catch (error) {
      return response.status(error.status).send({
        error: { message: 'Something went wrong, could not save task' }
      })
    }
  }

  /**
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async destroy ({ params, response }) {
    try {
      const task = await Task.findOrFail(params.id)

      task.delete()

      return response.send({
        sucess: { message: 'Task sucessfully deleted' }
      })
    } catch (error) {
      return response.status(error.status).send({
        error: { message: 'Something went wrong, could not delete task' }
      })
    }
  }
}

module.exports = TaskController
