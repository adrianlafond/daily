import { h, ComponentChildren } from 'preact';
import { useRef, useState } from 'preact/hooks';
import cx from 'classnames';
import style from './style.css';
import { coords } from './coords';

export interface DraggableProps {
  children: ComponentChildren;
}

export const Draggable = ({ children }: DraggableProps) => {
  const el = useRef<HTMLDivElement>(null);
  const start = useRef({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  function handleMove(event: MouseEvent | TouchEvent) {
    if (el.current) {
      const { x, y } = coords(event);
      const tx = x - start.current.x;
      const ty = y - start.current.y;
      el.current.style.transform = `translate(${tx}px, ${ty}px)`;
    }
  }

  function handleUp(event: MouseEvent | TouchEvent) {
    if (event instanceof MouseEvent) {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    } else {
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
      window.removeEventListener('touchcancel', handleUp);
    }
    if (el.current) {
      el.current.style.removeProperty('transform');
    }
    setDragging(false);
  }

  function handleDown(event: MouseEvent | TouchEvent) {
    const { x, y } = coords(event);
    start.current.x = x;
    start.current.y = y;
    setDragging(true);
  }

  function handleMouseDown(event: MouseEvent) {
    handleDown(event);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  }

  function handleTouchStart(event: TouchEvent) {
    handleDown(event);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleUp);
    window.addEventListener('touchcancel', handleUp);
  }

  const className = cx(style.draggable, {
    [style['draggable--dragging']]: dragging,
  });

  return (
    <div
      ref={el}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      role="presentation"
      className={className}
    >
      {children}
    </div>
  );
};
