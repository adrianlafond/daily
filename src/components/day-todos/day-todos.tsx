import { h } from 'preact';
import { Day } from '../../services';
import style from './style.css';
import { TodoItem } from '../todo-item';

export interface DayTodosProps extends Day {}

export const DayTodos = ({ date, todos }: DayTodosProps) => (
  <div className={style['day-todos']}>
    <h2>{date}</h2>
    {todos.map(todo => <TodoItem key={todo.label} {...todo} />)}
  </div>
);
