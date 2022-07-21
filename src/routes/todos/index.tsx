import { h } from 'preact'
import { Days } from '../../components/days'
import { useAppSelector } from '../../hooks'
import { RootState } from '../../store'
import style from './style.css'

export interface TodosProps {
  date: string
}

const Todos = ({ date }: TodosProps) => {
  const { todos } = useAppSelector((state: RootState) => ({
    todos: state.todos
  }))

  return (
    <div className={style.todos}>
      <h1>Todos</h1>
      <h6>date: {date}</h6>
      <Days title={todos.title} days={todos.days} />
    </div>
  )
}

export default Todos
