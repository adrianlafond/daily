import {
  parseTodos,
  getDefaultTodos,
  WARNING_MULTIPLE_TITLES,
  WARNING_INVALID_DATE_FORMAT,
  WARNING_DUPLICATED_DATE
} from '../src/services'

function prep (value: TemplateStringsArray) {
  return value[0].split('\n').map(line => line.trim()).join('\n')
}

describe('parseTodos >', () => {
  it('returns default todos when input is empty', () => {
    expect(parseTodos('')).toEqual(getDefaultTodos())
  })

  describe('title >', () => {
    const data = prep`
      # todos

      # second title

      ## 2022-10-31 M
      - [ ] buy milk
      - [ ] water plants

      Ignored text.

      ## 2022-11-01 T
      - [ ] buy milk
      - [ ] take out the garbage
    `

    const dataSansTitle = prep`
      ## 2022-10-31 M
      - [ ] buy milk
      - [ ] water plants

      Ignored text.

      ## 2022-11-01 T
      - [ ] buy milk
      - [ ] take out the garbage
    `

    it('returns a level 1 header as the title', () => {
      expect(parseTodos(data).title).toBe('todos')
    })
    it('returns a warning if more than one level 1 header is found', () => {
      const parsed = parseTodos(data)
      expect(parsed.warnings.length).toBe(1)
      expect(parsed.warnings[0].line).toBe(3)
      expect(parsed.warnings[0].message).toBe(WARNING_MULTIPLE_TITLES)
    })
    it('returns a default title if none is provided in the data', () => {
      const parsed = parseTodos(dataSansTitle)
      expect(parsed.title).toBe(getDefaultTodos().title)
    })
  })

  describe('date >', () => {
    const data = prep`
      ## 2022-10-31 M
      - [ ] buy milk
      - [ ] water plants

      ## invalid
      - [ ] buy milk

      ## 2022-11-01 T
      - [ ] buy milk
      - [ ] take out the garbage
    `

    const dataBadOrder = prep`
      ## 2022-11-01 T
      - [ ] buy milk
      - [ ] take out the garbage

      ## 2022-10-31 M
      - [ ] buy milk
      - [ ] water plants
    `

    const dataRepeatedDate = prep`
      ## 2022-11-01 T
      - [ ] buy milk
      - [ ] take out the garbage

      ## 2022-11-01 T
      - [ ] buy milk
      - [ ] water plants
    `

    it('returns level 2 headers with valid dates as titles as dates', () => {
      const parsed = parseTodos(data)
      expect(parsed.days.length).toBe(2)
      expect(parsed.days[0].date).toBe('2022-10-31 M')
      expect(parsed.days[1].date).toBe('2022-11-01 T')
    })
    it('returns a warning for level 2 headers with invalid dates', () => {
      const parsed = parseTodos(data)
      expect(parsed.warnings.length).toBe(1)
      expect(parsed.warnings[0].line).toBe(5)
      expect(parsed.warnings[0].message).toBe(WARNING_INVALID_DATE_FORMAT)
    })
    it('sorts dates to be chronologically correct', () => {
      const parsed = parseTodos(dataBadOrder)
      expect(parsed.days.length).toBe(2)
      expect(parsed.days[0].date).toBe('2022-10-31 M')
      expect(parsed.days[1].date).toBe('2022-11-01 T')
    })
    it('merges duplicated dates and returns a warning', () => {
      const parsed = parseTodos(dataRepeatedDate)
      expect(parsed.days.length).toBe(1)
      expect(parsed.days[0].date).toBe('2022-11-01 T')
      expect(parsed.warnings[0].line).toBe(5)
      expect(parsed.warnings[0].message).toBe(WARNING_DUPLICATED_DATE)
    })
  })

  describe('todos >', () => {
    const data = prep`
      ## 2022-10-31 M
      - [ ] buy milk
      - [ ] buy milk
      - [x] water plants

      ## invalid
      - [ ] ignored task

      ## 2022-11-01 T
      - [ ] buy milk
      - [ ] take out the garbage

      ## 2022-11-01 T
      - [ ] buy milk
      - [ ] vacuum
    `

    it('includes todos with their associated date', () => {
      const parsed = parseTodos(data)
      const { todos } = parsed.days[0]
      expect(todos.length).toBe(3)
      expect(todos[0].label).toBe('buy milk')
      expect(todos[0].done).toBe(false)
    })
    it('includes duplicated todos each with a unique id', () => {
      const parsed = parseTodos(data)
      const { todos } = parsed.days[0]
      expect(todos.length).toBe(3)
      expect(todos[0].label).toBe('buy milk')
      expect(todos[0].done).toBe(false)
      expect(todos[1].label).toBe('buy milk')
      expect(todos[1].done).toBe(false)
      expect(todos[0].id).not.toBe(todos[1].id)
    })
    it('includes a "done" start for each todo', () => {
      const parsed = parseTodos(data)
      const { todos } = parsed.days[0]
      expect(todos.length).toBe(3)
      expect(todos[0].done).toBe(false)
      expect(todos[1].done).toBe(false)
      expect(todos[2].done).toBe(true)
    })
    it('does not includes tasks with invalid dates', () => {
      const parsed = parseTodos(data)
      let taskFound = false
      for (let i = 0; i < parsed.days.length; i++) {
        for (let j = 0; j < parsed.days[i].todos.length; j++) {
          if (parsed.days[i].todos[j].label === 'ignored task') {
            taskFound = true
            break
          }
        }
      }
      expect(taskFound).toBe(false)
    })
    it('merges the todos from duplicated dates', () => {
      const parsed = parseTodos(data)
      expect(parsed.days.length).toBe(2)
      expect(parsed.days[0].date).toBe('2022-10-31 M')
      expect(parsed.days[1].date).toBe('2022-11-01 T')
      expect(parsed.days[1].todos.length).toBe(4)
      expect(parsed.days[1].todos[0].label).toBe('buy milk')
      expect(parsed.days[1].todos[1].label).toBe('take out the garbage')
      expect(parsed.days[1].todos[2].label).toBe('buy milk')
      expect(parsed.days[1].todos[3].label).toBe('vacuum')
      // Todos 0 and 2 have same label but unique id:
      expect(parsed.days[1].todos[0].id).not.toBe(parsed.days[1].todos[2].id)
    })
  })
})
