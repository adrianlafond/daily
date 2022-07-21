import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Todos, Todo, parseTodos, todoUid } from '../services'
import { days } from '../services/id-to-date'


const name = 'zoom'
const initialState = parseTodos(`
# personal

## 2022-10-31 M
- [ ] buy milk
- [ ] buy milk
- [x] water plants

## 2022-11-01 T
- [ ] buy milk
- [ ] take out the garbage
- [ ] buy milk
- [ ] vacuum
`) as Todos

function getDay(state: Todos, date: string) {
  return state.days.find(item => item.date === date)
}

function addTodoAction(state: Todos, action: PayloadAction<{
  date: string;
  label: string;
  done?: boolean;
}>) {
  const todo: Todo = {
    label: action.payload.label,
    done: !!action.payload.done,
    id: todoUid(),
  }
  const day = getDay(state, action.payload.date)
  if (day) {
    day.todos.push(todo)
  }
}

function deleteTodoAction(state: Todos, action: PayloadAction<{
  date: string;
  id: string;
}>) {
  const { date, id } = action.payload
  const day = getDay(state, date)
  if (day) {
    for (let i = 0; i < day.todos.length; i++) {
      if (day.todos[i].id === id) {
        day.todos.splice(i, 1)
        break
      }
    }
  }
}

function editTodoLabelAction(state: Todos, action: PayloadAction<{
  date: string;
  id: string;
  label: string;
}>) {
  const { date, id, label } = action.payload
  const day = getDay(state, date)
  if (day) {
    for (let i = 0; i < day.todos.length; i++) {
      if (day.todos[i].id === id) {
        day.todos[i].label = label
        break
      }
    }
  }
}

function editTodoDoneAction(state: Todos, action: PayloadAction<{
  date: string;
  id: string;
  done: boolean;
}>) {
  const { date, id, done } = action.payload
  const day = getDay(state, date)
  if (day) {
    for (let i = 0; i < day.todos.length; i++) {
      if (day.todos[i].id === id) {
        day.todos[i].done = done
        break
      }
    }
  }
}

export const todosSlice = createSlice({
  name,
  initialState,
  reducers: {
    updateTodoPosition: (state: Todos, action: PayloadAction<{
      from: number;
      to: number;
    }>) => {
      const { from, to } = action.payload
      let f = 0
      let d = 0
      let todo: Todo | null = null
      while (d < state.days.length) {
        const day = state.days[d]
        f += day.todos.length + 1// + 1 for the day itself
        if (from < f) {
          [todo] = day.todos.splice(f - from - 1, 1)
          break
        }
        d += 1
      }
      console.log(todo)
      // state.days = [];
    },

    addTodo: addTodoAction,
    deleteTodo: deleteTodoAction,
    editTodoLabel: editTodoLabelAction,
    editTodoDone: editTodoDoneAction,
  }
})

export const {
  updateTodoPosition,
  addTodo,
  deleteTodo,
  editTodoLabel,
  editTodoDone,
} = todosSlice.actions

export const todosReducer = todosSlice.reducer
