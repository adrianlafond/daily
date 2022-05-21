import { h } from 'preact';
import { useState } from 'preact/hooks';

import style from './style.css';
import { openTodosFile, getDefaultTodos } from '../../services';

export interface DaysProps {
  date?: string;
}

const Days = ({ date }: DaysProps) => {
  const [days, setDays] = useState(getDefaultTodos());

  const handleOpenFile = async () => {
    const data = await openTodosFile();
    if (data) {
      setDays(data);
    }
  };

  return (
    <div className={style.days}>
      <h1>{days.title}</h1>

      <h2>{date}</h2>
      <p>This is the Days component.</p>

      <button onClick={handleOpenFile}>Open file</button>
    </div>
  );
};

export default Days;
