import { Day, Todos } from './types'
import { idToDate, idToFormattedDate } from './id-to-date'
import { todoUid } from './todo-uid'

export function getDefaultTodos(): Todos {
  return {
    title: '[Untitled]',
    days: [],
    warnings: [],
  }
}

export const WARNING_MULTIPLE_TITLES =
  'Multiple level 1 ("#") headers were found.'
export const WARNING_INVALID_DATE_FORMAT = 'Date is in invalid format.'
export const WARNING_DUPLICATED_DATE = 'The same date was repeated.'

/**
 * Parses todos data in markdown format into a data object.
 */
export function parseTodos(markdown: string): Todos {
  const data = getDefaultTodos()

  const lines = markdown.trim().split('\n')
  let titleFound = false
  let currentDay: Day | null = null

  function processTitle(text: string, line: number) {
    currentDay = null
    if (titleFound) {
      data.warnings.push({
        line,
        message: WARNING_MULTIPLE_TITLES,
      })
    } else {
      titleFound = true
      data.title = text.substring(2).trim()
    }
  }

  function processDate(text: string, line: number) {
    currentDay = null
    const rawDate = text.substring(3).trim()
    const date = idToDate(rawDate)
    if (date) {
      const value = date.valueOf()
      const existingDay = data.days.find(day => day.value === value)
      if (existingDay) {
        currentDay = existingDay
        data.warnings.push({
          line,
          message: WARNING_DUPLICATED_DATE,
        })
      } else {
        currentDay = {
          date: idToFormattedDate(date),
          value,
          todos: [],
        }
        data.days.push(currentDay)
      }
    } else {
      data.warnings.push({
        line,
        message: WARNING_INVALID_DATE_FORMAT,
      })
    }
  }

  function processTodo(text:string, _line: number) {
    if (!currentDay) {
      return
    }
    currentDay.todos.push({
      done: text.startsWith('- [x]'),
      label: text.substring(5).trim(),
      id: todoUid(),
    })
  }

  function sortDates() {
    data.days.sort((a: Day, b: Day) => a.value - b.value)
  }

  lines.forEach((text, lineNumber) => {
    const line = lineNumber + 1
    if (text.startsWith('# ')) {
      processTitle(text, line)
    } else if (text.startsWith('## ')) {
      processDate(text, line)
    } else if (text.startsWith('- [ ]') || text.startsWith('- [x]')) {
      processTodo(text, line)
    } else if (text.trim() !== '') {
      currentDay = null
    }
  })

  sortDates()

  return data
}
