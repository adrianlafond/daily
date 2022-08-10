import { h } from 'preact'
import { Days } from '../../components/days'
import { useAppSelector, useAppDispatch } from '../../hooks'
import { RootState } from '../../store'
import { parseTodos } from '../../services'
import { replaceTodos } from '../../features'
import style from './style.css'
import { useEffect } from 'preact/hooks'

const todosStr = `
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
`

export interface TodosProps {
  date: string
}

const Todos = ({ date }: TodosProps) => {
  const { todos } = useAppSelector((state: RootState) => ({
    todos: state.todos
  }))

  const dispatch = useAppDispatch()

  useEffect(() => {
    const todos = parseTodos(todosStr)
    dispatch(replaceTodos({ todos }))
  }, [])

  return (
    <div className={style.todos}>
      <h6>today's date: {date}</h6>
      <Days title={todos.title} days={todos.days} />
    </div>
  )
}

export default Todos
