import { h } from 'preact';
import { Days } from '../../components/days';
import style from './style.css';

export interface TodosProps {
  date: string;
}

const days = [{
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
}];

const Todos = ({ date }: TodosProps) => (
  <div className={style.todos}>
    <h1>Todos</h1>
    <h6>date: {date}</h6>
    <Days title="Personal" days={days} />
  </div>
);

export default Todos;
