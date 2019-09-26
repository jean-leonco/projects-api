'use strict'

class Task {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      title: 'required',
      description: 'required',
      due_date: 'date'
    }
  }

  get messages () {
    return {
      'title.required': 'You must provide a title',
      'description.required': 'You must provide a description',
      'due_date.date': 'Due date must be a date'
    }
  }
}

module.exports = Task
