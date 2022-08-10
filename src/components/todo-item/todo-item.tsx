import { h, Fragment } from 'preact'
import { ChangeEvent, memo } from 'preact/compat'
import { useRef, useState } from 'preact/hooks'
import cx from 'classnames'
import { Todo } from '../../services'
import { DraggableListItem, DropDetails } from '../draggable-list-tem'
import { useAppDispatch } from '../../hooks'
import {
  deleteTodo,
  editTodoLabel,
  editTodoDone,
  updateTodoPosition
} from '../../features'
import style from './style.css'

export interface TodoItemProps extends Todo {
  date: string
}

let uidNum = 0

export const TodoItem = memo(({ label, done, date, id }: TodoItemProps) => {
  const [editing, setEditing] = useState(false)
  const [dragging, setDragging] = useState(false)
  const element = useRef<HTMLDivElement>(null)

  const cancelled = useRef(false)

  const dispatch = useAppDispatch()

  const uid = useRef(`todo-${uidNum++}`)

  function handleDragStart () {
    setDragging(true)
  }

  function handleDragEnd (details: DropDetails) {
    setDragging(false)
    dispatch(updateTodoPosition({
      id,
      date,
      newDate: details?.date,
      beforeId: details?.beforeId
    }))
  }

  function handleDragUpdate (details: DropDetails) {
    // ...
  }

  function handleDblClick () {
    setEditing(true)
  }

  function handleInputBlur (event: FocusEvent) {
    setEditing(false)
    if (cancelled.current) {
      cancelled.current = false
    } else {
      const { value } = event.target as HTMLInputElement
      dispatch(editTodoLabel({ date, id, label: value }))
    }
  }

  function handleInputKeyDown (event: KeyboardEvent) {
    if (event.key === 'Enter') {
      (event.target as HTMLInputElement).blur()
    } else if (event.key === 'Escape') {
      cancelled.current = true;
      (event.target as HTMLInputElement).blur()
    }
  }

  function handleInputRef (input: HTMLInputElement | null) {
    if (input != null) {
      input.focus()
    }
  }

  function handleDeleteTodo () {
    dispatch(deleteTodo({ date, id }))
  }

  function handleDoneChange (event: ChangeEvent) {
    const value = (event.target as HTMLInputElement).checked
    dispatch(editTodoDone({ date, id, done: value }))
  }

  const blockClassName = cx(style.todo, {
    [style['todo--dragging']]: dragging
  })

  const inlineBlockClassName = cx(style['todo__inline-block'], {
    [style['todo__inline-block--dragging']]: dragging
  })

  return (
    <DraggableListItem
      onDragStart={handleDragStart}
      onDragUpdate={handleDragUpdate}
      onDragEnd={handleDragEnd}
      data={`${date}/${id}`}
    >
      <div
        className={blockClassName}
        ref={element}
      >
        <div className={inlineBlockClassName}>
          <input
            id={uid.current}
            type="checkbox"
            checked={done}
            onChange={handleDoneChange}
            disabled={editing}
          />
          {editing
            ? (
            <input
              value={label}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              ref={handleInputRef}
            />
              )
            : (
            <>
              <label htmlFor={uid.current} onDblClick={handleDblClick}>
                {label}
              </label>
              <button onClick={handleDeleteTodo}>x</button>
            </>
              )}
        </div>
      </div>
    </DraggableListItem>
  )
})
