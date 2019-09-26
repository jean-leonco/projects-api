'use strict'

const Mail = use('Mail')
const Helpers = use('Helpers')

const TaskHook = (exports = module.exports = {})

TaskHook.sendNewTaskMail = async taskInstance => {
  if (!taskInstance.user_id && !taskInstance.dirty.user_id) return

  const { email, username } = await taskInstance.user().fetch()
  const { id } = await taskInstance.project().fetch()
  const file = await taskInstance.file().fetch()

  const { title } = taskInstance

  await Mail.send(
    ['emails.new_task'],
    {
      name: username,
      task: title,
      hasAttachment: !!file,
      action_url: `http://app.adonis.com/projects/${id}/tasks/${taskInstance.id}`
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
