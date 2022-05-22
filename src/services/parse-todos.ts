import { Todos } from './types';

export function getDefaultTodos(): Todos {
  return {
    title: '[Untitled]',
    days: [],
    warnings: [],
  };
}

export const WARNING_MULTIPLE_TITLES =
  'Multiple level 1 ("#") headers were found.';

/**
 * Parses todos data in markdown format into a data object.
 */
export function parseTodos(markdown: string): Todos {
  const data = getDefaultTodos();

  const lines = markdown.split('\n');
  let titleFound = false;

  function parseTitle(text: string, line: number) {
    if (titleFound) {
      data.warnings.push({
        line,
        message: WARNING_MULTIPLE_TITLES,
      });
    } else {
      titleFound = true;
      data.title = text.substring(2).trim();
    }
  }

  lines.forEach((text, lineNumber) => {
    const line = lineNumber + 1;
    if (text.startsWith('# ')) {
      parseTitle(text, line);
    }
  });

  return data;
}
