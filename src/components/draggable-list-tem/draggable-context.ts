import { createContext } from 'preact';

export interface DraggableContextProps {
  dragging: boolean;
}

export const DraggableContext = createContext<DraggableContextProps>({
  dragging: false,
});
