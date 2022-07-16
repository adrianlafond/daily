import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Todos, Todo } from '../services';


const name = 'zoom';
const initialState = {
  title: 'Personal',
  days: [{
    date: '20220604',
    todos: [{
      done: false,
      label: 'walk the dog',
    }, {
      done: false,
      label: 'water the plants',
    }, {
      done: false,
      label: 'make dinner'
    }],
  }, {
    date: '20220603',
    todos: [{
      done: false,
      label: 'buy milk',
    }, {
      done: false,
      label: 'pet the cats',
    }, {
      done: false,
      label: 'sweep',
    }],
  }],
  warnings: [],
} as Todos;

export const todosSlice = createSlice({
  name,
  initialState,
  reducers: {
    updateTodoPosition: (state: Todos, action: PayloadAction<{
      from: number;
      to: number;
    }>) => {
      const { from, to } = action.payload;
      let f = 0;
      let d = 0;
      let todo: Todo | null = null;
      while (d < state.days.length) {
        const day = state.days[d];
        f += day.todos.length + 1;// + 1 for the day itself
        if (from < f) {
          [todo] = day.todos.splice(f - from - 1, 1);
          break;
        }
        d += 1;
      }
      console.log(todo);
      // state.days = [];
    },
  }
});

export const { updateTodoPosition } = todosSlice.actions;

export const todosReducer = todosSlice.reducer;
