import { configureStore } from '@reduxjs/toolkit'
import {
  todosReducer
} from '../features'

export const store = configureStore({
  reducer: {
    todos: todosReducer
  }
  // middleware: getDefaultMiddleware =>
  //   getDefaultMiddleware().concat(locationsApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
