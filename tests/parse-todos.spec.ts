import {
  parseTodos,
  getDefaultTodos,
  WARNING_MULTIPLE_TITLES,
} from '../src/services';

describe('parseTodos', () => {
  it('returns default todos when input is empty', () => {
    expect(parseTodos('')).toEqual(getDefaultTodos());
  });
  it('returns a level 1 header as the title', () => {
    expect(parseTodos('# test header').title).toBe('test header');
  });
  it('returns a warning if more than one level 1 header is found', () => {
    const parsed = parseTodos('# test header\n# second header');
    expect(parsed.title).toBe('test header');
    expect(parsed.warnings.length).toBe(1);
    expect(parsed.warnings[0].line).toBe(2);
    expect(parsed.warnings[0].message).toBe(WARNING_MULTIPLE_TITLES);
  });
});
