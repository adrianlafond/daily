import { h, Fragment } from 'preact';
import { useRef, useState } from 'preact/hooks';
import cx from 'classnames';
import { ChangeEvent } from 'preact/compat';
import { Todo } from '../../services';
import { Draggable } from '../draggable';
import { useAppDispatch } from '../../hooks';
import { deleteTodo, editTodoLabel, editTodoDone } from '../../features';
import style from './style.css';

export interface TodoItemProps extends Todo {
  date: string;
  index: number;
}

let uidNum = 0;

export const TodoItem = ({ label, done, date, id, index }: TodoItemProps) => {
  const [editing, setEditing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const element = useRef<HTMLDivElement>(null);

  const cancelled = useRef(false);

  const dispatch = useAppDispatch();

  const uid = useRef(`todo-${uidNum++}`);

  function handleDragStart() {
    setDragging(true);
  }

  function handleDragEnd() {
    setDragging(false);
  }

  function handleDragUpdate() {
    const items: HTMLElement[] = Array.from(
      document.querySelectorAll('[data-todo]'));
    items.splice(items.findIndex(item => item === element.current), 1);
    const elY = element.current?.getBoundingClientRect().y;

    if (elY != null) {
      let start = 0;
      let end = items.length;
      const findDropIndex = (): number => {
        if (end === start) {
          return end;
        }
        if (end - start === 1) {
          return start;
        }
        const mid = Math.floor((end - start) / 2 + start);
        const midY = items[mid].getBoundingClientRect().y;
        if (elY === midY) {
          return mid;
        }
        if (elY < midY) {
          end = mid;
          return findDropIndex();
        }
        start = mid;
        return findDropIndex();
      };
      const dropIndex = findDropIndex();
      items.forEach((item, i) => {
        item.style.marginBottom = i === dropIndex ? '24px' : 'unset';
        // item.style.borderBottom = i === dropIndex ? '1px solid red' : 'none';
      });
    }
  }

  function handleDblClick() {
    setEditing(true);
  }

  function handleInputBlur(event: FocusEvent) {
    setEditing(false);
    if (cancelled.current) {
      cancelled.current = false;
    } else {
      const { value } = event.target as HTMLInputElement;
      dispatch(editTodoLabel({ date, id, label: value }));
    }
  }

  function handleInputKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      (event.target as HTMLInputElement).blur();
    } else if (event.key === 'Escape') {
      cancelled.current = true;
      (event.target as HTMLInputElement).blur();
    }
  }

  function handleInputRef(input: HTMLInputElement | null) {
    if (input) {
      input.focus();
    }
  }

  function handleDeleteTodo() {
    dispatch(deleteTodo({ date, id }));
  }

  function handleDoneChange(event: ChangeEvent) {
    const value = (event.target as HTMLInputElement).checked;
    dispatch(editTodoDone({ date, id, done: value }));
  }

  const blockClassName = cx(style.todo, {
    [style['todo--dragging']]: dragging,
  });

  const inlineBlockClassName = cx(style['todo__inline-block'], {
    [style['todo__inline-block--dragging']]: dragging,
  });

  return (
    <Draggable
      onDragStart={handleDragStart}
      onDragUpdate={handleDragUpdate}
      onDragEnd={handleDragEnd}
    >
      <div
        className={blockClassName}
        ref={element}
        data-todo={`${date}-${index}`}
      >
        <div className={inlineBlockClassName}>
          <input
            id={uid.current}
            type="checkbox"
            checked={done}
            onChange={handleDoneChange}
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
            <>
              <label htmlFor={uid.current} onDblClick={handleDblClick}>
                {label}
              </label>
              <button onClick={handleDeleteTodo}>x</button>
            </>
          )}
        </div>
      </div>
    </Draggable>
  );
};
