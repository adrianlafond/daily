import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Todos, Todo, todoUid, idToFormattedDate, Day, days } from '../services'

const name = 'zoom'
const initialState: Todos = {
  title: '[Untitled]',
  days: [],
  warnings: []
}

/**
 * Returns the Day instance corresponding to @param date.
 */
function getDay (state: Todos, date: string) {
  return state.days.find(item => item.date === date)
}

/**
 * Adds @param day to @param state by splicing it into the correct position
 * chronologically.
 */
function spliceDay (state: Todos, day: Day) {
  if (state.days.length === 0) {
    state.days.push(day)
  } else if (state.days.length === 1) {
    if (day.value < state.days[0].value) {
      state.days.unshift(day)
    } else {
      state.days.push(day)
    }
  }
  const splice = (day: Day, index1 = 0, index2 = state.days.length - 1) => {
    if (day.value > state.days[index1].value &&
      day.value < state.days[index2].value) {
      state.days.splice(index1, 0, day)
    }
    if (day.value < state.days[index1].value) {
      if (index1 === 0) {
        state.days.unshift(day)
      } else {
        state.days.splice(index1 - 1, 0, day)
      }
    } else if (day.value > state.days[index2].value) {
      state.days.splice(index2, 0, day)
    } else {
      const mid = Math.floor(state.days.length / 2)
      if (day.value === state.days[mid].value) {
        // Do nothing because we are not replacing a day if it already exists.
      } else if (day.value < state.days[mid].value) {
        splice(day, index1, mid)
      } else {
        splice(day, mid, index2)
      }
    }
  }
  splice(day)
  return state
}

function replaceTodosAction (state: Todos, action: PayloadAction<{
  todos: Todos
}>) {
  const { title, days, warnings } = action.payload.todos
  state.title = title
  state.days = days
  state.warnings = warnings

  const date = new Date()
  const today = idToFormattedDate(date)
  if (!(getDay(state, today) != null)) {
    const day: Day = {
      date: today,
      value: date.valueOf(),
      todos: []
    }
    spliceDay(state, day)
  }
}

function addTodoAction (state: Todos, action: PayloadAction<{
  date: string
  label: string
  done?: boolean
}>) {
  const todo: Todo = {
    label: action.payload.label,
    done: action.payload.done ?? false,
    id: todoUid()
  }
  const day = getDay(state, action.payload.date)
  if (day != null) {
    day.todos.push(todo)
  }
}

function deleteTodoAction (state: Todos, action: PayloadAction<{
  date: string
  id: string
}>) {
  const { date, id } = action.payload
  const day = getDay(state, date)
  if (day != null) {
    for (let i = 0; i < day.todos.length; i++) {
      if (day.todos[i].id === id) {
        day.todos.splice(i, 1)
        break
      }
    }
  }
}

function editTodoLabelAction (state: Todos, action: PayloadAction<{
  date: string
  id: string
  label: string
}>) {
  const { date, id, label } = action.payload
  const day = getDay(state, date)
  if (day != null) {
    for (let i = 0; i < day.todos.length; i++) {
      if (day.todos[i].id === id) {
        day.todos[i].label = label
        break
      }
    }
  }
}

function editTodoDoneAction (state: Todos, action: PayloadAction<{
  date: string
  id: string
  done: boolean
}>) {
  const { date, id, done } = action.payload
  const day = getDay(state, date)
  if (day != null) {
    for (let i = 0; i < day.todos.length; i++) {
      if (day.todos[i].id === id) {
        day.todos[i].done = done
        break
      }
    }
  }
}

function updateTodoPositionAction (state: Todos, action: PayloadAction<{
  date: string
  id: string
  newDate?: string
  beforeId?: string
}>) {
  const { date, id, newDate, beforeId } = action.payload
  const oldDay = getDay(state, date)
  const newDay = newDate != null ? getDay(state, newDate) : state.days[state.days.length - 1]
  const oldIndex = oldDay?.todos.findIndex(todo => todo.id === id)
  if (oldIndex != null) {
    const spliced = oldDay?.todos.splice(oldIndex, 1)
    if (!(spliced != null)) {
      return state
    }
    const todo = spliced[0]
    if (beforeId != null) {
      const beforeIndex = newDay?.todos.findIndex(todo => todo.id === beforeId)
      if (beforeIndex != null) {
        if (beforeIndex !== -1) {
          newDay?.todos.splice(beforeIndex, 0, todo)
        } else {
          newDay?.todos.push(todo)
        }
      }
    } else {
      newDay?.todos.push(todo)
    }
  }
  return state
}

export const todosSlice = createSlice({
  name,
  initialState,
  reducers: {
    addTodo: addTodoAction,
    deleteTodo: deleteTodoAction,
    editTodoLabel: editTodoLabelAction,
    editTodoDone: editTodoDoneAction,
    replaceTodos: replaceTodosAction,
    updateTodoPosition: updateTodoPositionAction
  }
})

export const {
  addTodo,
  deleteTodo,
  editTodoLabel,
  editTodoDone,
  replaceTodos,
  updateTodoPosition
} = todosSlice.actions

export const todosReducer = todosSlice.reducer
