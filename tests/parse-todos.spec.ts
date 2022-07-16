import * as fs from 'fs';
import * as path from 'path';

import {
  parseTodos,
  getDefaultTodos,
  WARNING_MULTIPLE_TITLES,
  WARNING_INVALID_DATE_FORMAT,
} from '../src/services';

function file(filename: string) {
  const fullPath = path.join(__dirname, `./data/${filename}.md`);
  return fs.readFileSync(fullPath, { encoding: 'utf8' });
}

function testParseTodos(filename: string) {
  return parseTodos(file(filename));
}

describe('parseTodos >', () => {
  it('returns default todos when input is empty', () => {
    expect(parseTodos('')).toEqual(getDefaultTodos());
  });

  describe('title >', () => {
    it('returns a level 1 header as the title', () => {
      expect(testParseTodos('header1').title).toBe('test header');
    });
    it('returns a warning if more than one level 1 header is found', () => {
      const parsed = testParseTodos('header2');
      expect(parsed.title).toBe('test header');
      expect(parsed.warnings.length).toBe(1);
      expect(parsed.warnings[0].line).toBe(2);
      expect(parsed.warnings[0].message).toBe(WARNING_MULTIPLE_TITLES);
    });
  });

  describe('date >', () => {
    it('returns a level 2 header as a date', () => {
      const parsed = testParseTodos('dates1');
      expect(parsed.days.length).toBe(1);
      expect(parsed.days[0].date).toBe('2022-10-31 M');
    });
    it('returns a date for each valid level 2 header', () => {
      const parsed = testParseTodos('dates2');
      expect(parsed.days.length).toBe(2);
      expect(parsed.days[0].date).toBe('2022-10-31 M');
      expect(parsed.days[1].date).toBe('2022-11-01 T');
      expect(parsed.warnings.length).toBe(1);
      expect(parsed.warnings[0].line).toBe(2);
      expect(parsed.warnings[0].message).toBe(WARNING_INVALID_DATE_FORMAT);
    });
  });
});
