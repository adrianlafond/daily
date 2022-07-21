import { h } from 'preact'
import { Todos } from '../../services'
import { DayTodos } from '../day-todos'
import style from './style.css'

export interface DaysProps extends Omit<Todos, 'warnings'> {}

export const Days = ({ title, days }: DaysProps) => (
  <div className={style.days}>
    <h2>{title}</h2>
    {days.map(day => <DayTodos key={day.date} {...day} />)}
  </div>
)
