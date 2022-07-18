import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Todos, Todo, parseTodos } from '../services';


const name = 'zoom';
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
`) as Todos;

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
