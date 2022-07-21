
export function coords(event: MouseEvent | TouchEvent) {
  if (event instanceof MouseEvent) {
    return { x: event.clientX, y: event.clientY }
  }
  if (event instanceof TouchEvent) {
    return { x: event.touches[0].clientX, y: event.touches[0].clientY }
  }
  return { x: 0, y: 0 }
}
