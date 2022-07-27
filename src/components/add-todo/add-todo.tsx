import { h } from 'preact'
import { useAppDispatch } from '../../hooks'
import { addTodo } from '../../features'
import { Day } from '../../services'
import { useRef, useState } from 'preact/hooks'

export interface AddTodoProps {
  /**
   * The date that the Todo should be added to.
   */
  date: Day['date']
}

export const AddTodo = ({ date }: AddTodoProps) => {
  const dispatch = useAppDispatch()

  const [adding, setAdding] = useState(false)

  // Stores current value of `adding` so latest value can be accessed inside a
  // setTimeout function.
  const addingValue = useRef(adding)

  const inputRef = useRef<HTMLInputElement>(null)

  function dispatchAddTodo (label: string) {
    const trimmed = label.trim()
    if (trimmed !== '') {
      dispatch(addTodo({ date, label }))
    }
  }

  function handleKeyDown (event: KeyboardEvent) {
    if (event.key === 'Escape') {
      stopAdding()
      event.preventDefault()
    } else if (event.key === 'Enter') {
      if (inputRef.current != null) {
        const value = inputRef.current.value
        dispatchAddTodo(value)
      }
      stopAdding()
    }
  }

  function handleBlur () {
    stopAdding()
  }

  function startAdding () {
    setAdding(true)
    // Need to wait a tick for <input> to render after `adding` becomes true:
    window.setTimeout(() => {
      if (addingValue.current && (inputRef.current != null)) {
        inputRef.current.focus()
      }
    }, 0)
  }

  function stopAdding () {
    setAdding(false)
  }

  addingValue.current = adding

  return adding
    ? (
    <input ref={inputRef} onKeyDown={handleKeyDown} onBlur={handleBlur} />
      )
    : (
    <button onClick={startAdding}>add todo</button>
      )
}
