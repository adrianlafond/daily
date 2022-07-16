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
export const WARNING_INVALID_DATE_FORMAT = 'Date in invalid format.';

export function isValidDate(value: string) {
  const regex = /^\d{4}-\d{2}-\d{2} [Sun|M|T|W|R|F|Sat]$/;
  return regex.test(value);
}

/**
 * Parses todos data in markdown format into a data object.
 */
export function parseTodos(markdown: string): Todos {
  const data = getDefaultTodos();

  const lines = markdown.trim().split('\n');
  let titleFound = false;

  function processTitle(text: string, line: number) {
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

  function processDate(text: string, line: number) {
    const date = text.substring(3).trim();
    if (isValidDate(date)) {
      data.days.push({
        date,
        todos: [],
      });
    } else {
      data.warnings.push({
        line,
        message: WARNING_INVALID_DATE_FORMAT,
      });
    }
  }

  lines.forEach((text, lineNumber) => {
    const line = lineNumber + 1;
    if (text.startsWith('# ')) {
      processTitle(text, line);
    } else if (text.startsWith('## ')) {
      processDate(text, line);
    }
  });

  return data;
}
