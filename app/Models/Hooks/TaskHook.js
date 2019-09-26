'use strict'

const Kue = use('Kue')
const Job = use('App/Jobs/NewTaskMail')

const TaskHook = (exports = module.exports = {})

TaskHook.sendNewTaskMail = async taskInstance => {
  if (!taskInstance.user_id && !taskInstance.dirty.user_id) return

  const { email, username } = await taskInstance.user().fetch()
  const { id: project_id } = await taskInstance.project().fetch()
  const file = await taskInstance.file().fetch()

  const { id: task_id, title } = taskInstance

  Kue.dispatch(
    Job.key,
    { email, username, title, file, project_id, task_id },
    { attempts: 3 }
  )
}
