import { h, ComponentChildren } from 'preact'
import { useRef, useState } from 'preact/hooks'
import cx from 'classnames'
import style from './style.css'
import { coords } from './coords'
import { DraggableContext, DraggableContextProps } from './draggable-context'

export interface DropDetails {
  date: string
  beforeId: string
}

export interface DraggableListItemProps {
  children: ComponentChildren
  data?: string
  onDragStart?: () => void
  onDragUpdate?: (details: DropDetails) => void
  onDragEnd?: (details: DropDetails) => void
}

export const DraggableListItem = ({
  children,
  data,
  onDragStart,
  onDragUpdate,
  onDragEnd
}: DraggableListItemProps) => {
  const el = useRef<HTMLDivElement>(null)

  const start = useRef({ x: 0, y: 0 })
  const dropItem = useRef<HTMLElement | null>(null)

  const [context, setContext] = useState<DraggableContextProps>({
    dragging: false
  })

  function findDropItem (items: HTMLElement[]) {
    if (el.current === null) return dropItem.current

    let start = 0
    let end = items.length
    let item: HTMLElement | null = null

    const elY = el.current.getBoundingClientRect().y
    const startY = items[start].getBoundingClientRect().y

    while (end > start) {
      if (end - start <= 1) {
        item = items[end]
        break
      }
      const mid = Math.floor((end - start) / 2) + start
      const midY = items[mid].getBoundingClientRect().y
      if (elY <= midY) {
        end = mid
        if (start === 0 && elY <= startY) {
          // Element should be dropped at top of list.
          item = items[start]
          break
        }
      } else {
        start = mid
        if (start >= items.length - 1) {
          // Element should be dropped bottom of list.
          item = null
          break
        }
      }
    }

    return item
  }

  function getDropArgs () {
    const args = dropItem.current
      ?.getAttribute('data-draggable-list-item-target')
      ?.split('/')
    if (args != null) {
      return {
        date: args[0],
        beforeId: args[1] !== '' ? args[1] : null
      }
    }
    return null
  }

  function handleMove (event: MouseEvent | TouchEvent) {
    if (el.current != null) {
      const { x, y } = coords(event)
      const tx = x - start.current.x
      const ty = y - start.current.y
      el.current.style.transform = `translate(${tx}px, ${ty}px)`

      const items: HTMLElement[] = Array.from(
        document.querySelectorAll('[data-draggable-list-item-target]')
      ).filter(item => item !== el.current) as HTMLElement[]
      dropItem.current = findDropItem(items)

      if (onDragUpdate != null) {
        onDragUpdate(getDropArgs())
      }
    }
  }

  function handleUp (event: MouseEvent | TouchEvent) {
    if (event instanceof MouseEvent) {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
    } else {
      window.removeEventListener('touchmove', handleMove)
      window.removeEventListener('touchend', handleUp)
      window.removeEventListener('touchcancel', handleUp)
    }
    if (el.current != null) {
      el.current.style.removeProperty('transform')
    }
    setContext({ dragging: false })
    if (onDragEnd != null) {
      onDragEnd(getDropArgs())
    }
  }

  function handleDown (event: MouseEvent | TouchEvent) {
    const { x, y } = coords(event)
    start.current.x = x
    start.current.y = y
    setContext({ dragging: true })
    if (onDragStart != null) {
      onDragStart()
    }
  }

  function handleMouseDown (event: MouseEvent) {
    handleDown(event)
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)
  }

  function handleTouchStart (event: TouchEvent) {
    handleDown(event)
    window.addEventListener('touchmove', handleMove)
    window.addEventListener('touchend', handleUp)
    window.addEventListener('touchcancel', handleUp)
  }

  const className = cx(style.draggable, {
    [style['draggable--dragging']]: context.dragging
  })

  return (
    <DraggableContext.Provider value={context}>
      <div
        ref={el}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        role="presentation"
        className={className}
        data-draggable-list-item-target={data != null ? data : 'true'}
      >
        {children}
      </div>
    </DraggableContext.Provider>
  )
}
