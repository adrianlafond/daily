import { h } from 'preact';
import { useRef, useState } from 'preact/hooks';
import cx from 'classnames';
import { Todo } from '../../services';
import { Draggable } from '../draggable';
import style from './style.css';

export interface TodoItemProps extends Todo {
  date: string;
  index: number;
}

let uidNum = 0;

export const TodoItem = ({ label, done, date, index }: TodoItemProps) => {
  const [editing, setEditing] = useState(false);
  const [dragging, setDragging] = useState(false);

  const uid = useRef(`todo-${uidNum++}`);

  function handleDragStart() {
    setDragging(true);
  }

  function handleDragEnd() {
    setDragging(false);
  }

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

  const blockClassName = cx(style.todo, {
    [style['todo--dragging']]: dragging,
  });

  const inlineBlockClassName = cx(style['todo__inline-block'], {
    [style['todo__inline-block--dragging']]: dragging,
  });

  return (
    <Draggable onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className={blockClassName} data-todo={`${date}-${index}`}>
        <div className={inlineBlockClassName}>
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
      </div>
    </Draggable>
  );
};
