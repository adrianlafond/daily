import { h } from 'preact';
import { useRef, useState } from 'preact/hooks';
import { Todo } from '../../services';
import { Draggable } from '../draggable';
import style from './style.css';

export interface TodoItemProps extends Todo {}

let uidNum = 0;

export const TodoItem = ({ label, done }: TodoItemProps) => {
  const [editing, setEditing] = useState(false);

  const uid = useRef(`todo-${uidNum++}`);

  function handleDblClick() {
    setEditing(true);
  }

  function handleInputBlur() {
    setEditing(false);
  }

  function handleInputKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      (event.target as HTMLInputElement).blur();
    }
  }

  function handleInputRef(input: HTMLInputElement | null) {
    if (input) {
      input.focus();
    }
  }

  return (
    <Draggable>
      <div className={style.todo}>
        <input
          id={uid.current}
          type="checkbox"
          checked={done}
          disabled={editing}
        />
        {editing ? (
          <input
            value={label}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            ref={handleInputRef}
          />
        ) : (
          <label htmlFor={uid.current} onDblClick={handleDblClick}>
            {label}
          </label>
        )}
      </div>
    </Draggable>
  );
};
