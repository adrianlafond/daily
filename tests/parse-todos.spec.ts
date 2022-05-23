import {
  parseTodos,
  getDefaultTodos,
  WARNING_MULTIPLE_TITLES,
  WARNING_INVALID_DATE_FORMAT,
} from '../src/services';

describe('parseTodos >', () => {
  it('returns default todos when input is empty', () => {
    expect(parseTodos('')).toEqual(getDefaultTodos());
  });

  describe('title >', () => {
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

  describe('date >', () => {
    it('returns a level 2 header as a date', () => {
      const parsed = parseTodos('## 2022-10-31 M');
      expect(parsed.days.length).toBe(1);
      expect(parsed.days[0].date).toBe('2022-10-31 M');
    });
    it('returns a date for each valid level 2 header', () => {
      const parsed = parseTodos('## 2022-10-31 M\n## invalid\n## 2022-11-01 T');
      expect(parsed.days.length).toBe(2);
      expect(parsed.days[0].date).toBe('2022-10-31 M');
      expect(parsed.days[1].date).toBe('2022-11-01 T');
      expect(parsed.warnings.length).toBe(1);
      expect(parsed.warnings[0].line).toBe(2);
      expect(parsed.warnings[0].message).toBe(WARNING_INVALID_DATE_FORMAT);
    });
  });
});
