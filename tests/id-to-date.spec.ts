import { idToDate } from '../src/services/id-to-date';

describe('idToDate', () => {
  it('converts a date id to a formatted string with a day', () => {
    expect(idToDate('20220102')).toBe('2022-01-02 Sun');
    expect(idToDate('20221205')).toBe('2022-12-05 M');
    expect(idToDate('20220712')).toBe('2022-07-12 T');
    expect(idToDate('20220713')).toBe('2022-07-13 W');
    expect(idToDate('20220714')).toBe('2022-07-14 R');
    expect(idToDate('20220715')).toBe('2022-07-15 F');
    expect(idToDate('20220716')).toBe('2022-07-16 Sat');
  });
  it('returns a blank date if an id is less than 8 characters', () => {
    expect(idToDate('202211')).toBe('0000-00-00 X');
  });
  it('returns a blank date if an id is less than 8 characters', () => {
    expect(idToDate('202211')).toBe('0000-00-00 X');
  });
  it('returns a blank date if an id cannot be converted to a number', () => {
    expect(idToDate('2022XXXX')).toBe('0000-00-00 X');
  });
});
