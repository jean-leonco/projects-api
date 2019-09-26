'use strict'

const Mail = use('Mail')
const Helpers = use('Helpers')

class NewTaskMail {
  static get concurrency () {
    return 2
  }

  static get key () {
    return 'NewTaskMail-job'
  }

  async handle ({ username, email, title, file, project_id, task_id }) {
    await Mail.send(
      ['emails.new_task'],
      {
        name: username,
        task: title,
        hasAttachment: !!file,
        action_url: `http://app.adonis.com/projects/${project_id}/tasks/${task_id}`
      },
      message => {
        message.from('jeang.leonco@gmail.com')
        message.to(email)
        message.subject('New task designated to you')

        if (file) {
          message.attach(Helpers.tmpPath(`uploads/${file.file}`), {
            filename: file.name
          })
        }
      }
    )
  }
}

module.exports = NewTaskMail
