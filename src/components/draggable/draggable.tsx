/* eslint-disable react/jsx-no-constructed-context-values */
import { h, ComponentChildren } from 'preact';
import { useMemo, useRef, useState } from 'preact/hooks';
import cx from 'classnames';
import style from './style.css';
import { coords } from './coords';
import { DraggableContext, DraggableContextProps } from './draggable-context';

export interface DraggableProps {
  children: ComponentChildren;
  onDragStart?: () => void;
  onDragUpdate?: () => void;
  onDragEnd?: () => void;
}

export const Draggable = ({
  children,
  onDragStart,
  onDragUpdate,
  onDragEnd,
}: DraggableProps) => {
  const el = useRef<HTMLDivElement>(null);
  const start = useRef({ x: 0, y: 0 });
  const [context, setContext] = useState<DraggableContextProps>({
    dragging: false,
  });

  function handleMove(event: MouseEvent | TouchEvent) {
    if (el.current) {
      const { x, y } = coords(event);
      const tx = x - start.current.x;
      const ty = y - start.current.y;
      el.current.style.transform = `translate(${tx}px, ${ty}px)`;
      if (onDragUpdate) {
        onDragUpdate();
      }
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
    setContext({ dragging: false });
    if (onDragEnd) {
      onDragEnd();
    }
  }

  function handleDown(event: MouseEvent | TouchEvent) {
    const { x, y } = coords(event);
    start.current.x = x;
    start.current.y = y;
    setContext({ dragging: true });
    if (onDragStart) {
      onDragStart();
    }
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
    [style['draggable--dragging']]: context.dragging,
  });

  return (
    <DraggableContext.Provider value={context}>
      <div
        ref={el}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        role="presentation"
        className={className}
      >
        {children}
      </div>
    </DraggableContext.Provider>
  );
};
