import { parseTodos } from './parse-todos';
import { Todos } from './types';

/**
 * Opens a file from local file system.
 */
export async function openTodosFile(): Promise<Todos | null> {
  const options = {
    types: [
      {
        description: 'Markdown',
        accept: {
          'text/*': ['.md', '.markdown'],
        },
      },
    ],
    excludeAcceptAllOption: true,
    multiple: false,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [fileHandle] = await window.showOpenFilePicker(options);

  if (fileHandle.kind === 'file') {
    const file = await fileHandle.getFile();
    const text = await file.text();
    return parseTodos(text);
  }
  return null;
}
