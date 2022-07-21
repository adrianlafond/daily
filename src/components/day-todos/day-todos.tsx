import { h } from 'preact'
import { Day } from '../../services'
import style from './style.css'
import { TodoItem } from '../todo-item'
import { useAppDispatch } from '../../hooks'
import { addTodo } from '../../features'

export interface DayTodosProps extends Day {}

export const DayTodos = ({ date, todos }: DayTodosProps) => {
  const dispatch = useAppDispatch()

  function handleAddTodo () {
    dispatch(addTodo({ date, label: 'what?' }))
  }

  return (
    <div className={style['day-todos']}>
      <h3 className={style['day-todos__date']} data-todo={`${date}-0`}>
        {date}
      </h3>
      {todos.map((todo, index) => (
        <TodoItem key={todo.id} {...todo} date={date} index={index + 1} />
      ))}
      <button onClick={handleAddTodo}>add todo</button>
    </div>
  )
}
