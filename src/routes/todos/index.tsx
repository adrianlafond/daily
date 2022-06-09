import { h } from 'preact';
import { Days } from '../../components/days';
import style from './style.css';

export interface TodosProps {
  date: string;
}

const days = [{
  date: '2022-06-04 Sat',
  todos: [{
    done: false,
    label: 'walk the dog',
  }, {
    done: false,
    label: 'water the plants',
  }],
}];

const Todos = ({ date }: TodosProps) => (
  <div className={style.todos}>
    <h1>Todos</h1>
    <h2>{date}</h2>
    <Days title="Personal" days={days} />
  </div>
);

export default Todos;
