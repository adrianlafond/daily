import { h } from 'preact';
import { Day } from '../../services';
import style from './style.css';
import { TodoItem } from '../todo-item';

export interface DayTodosProps extends Day {}

export const DayTodos = ({ date, todos }: DayTodosProps) => (
  <div className={style['day-todos']}>
    <h3 className={style['day-todos__date']} data-todo={`${date}-0`}>
      {date}
    </h3>
    {todos.map((todo, index) => (
      <TodoItem key={todo.id} {...todo} date={date} index={index + 1} />
    ))}
  </div>
);
