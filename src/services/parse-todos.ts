import { Todos } from './types';

export function getDefaultTodos(): Todos {
  return {
    title: '[Untitled]',
    days: [],
  };
}

/**
 * Parses todos data in markdown format into a data object.
 */
export function parseTodos(text: string): Todos {
  const data = getDefaultTodos();

  const lines = text.split('\n');
  lines.forEach((line) => {
    if (line.startsWith('# ')) {
      data.title = line.substring(2).trim();
    }
  });

  return data;
}
