import { idToDate } from '../src/services/id-to-date'

describe('idToDate', () => {
  it('converts a date id to a proper date', () => {
    expect(idToDate('2022-01-02 Sun')?.toISOString())
      .toBe('2022-01-02T05:00:00.000Z')
    expect(idToDate('2022-12-05 M')?.toISOString())
      .toBe('2022-12-05T05:00:00.000Z')
    expect(idToDate('2022-07-12 T')?.toISOString())
      .toBe('2022-07-12T04:00:00.000Z')
    expect(idToDate('2022-07-13 W')?.toISOString())
      .toBe('2022-07-13T04:00:00.000Z')
    expect(idToDate('2022-07-14 R')?.toISOString())
      .toBe('2022-07-14T04:00:00.000Z')
    expect(idToDate('2022-07-15 F')?.toISOString())
      .toBe('2022-07-15T04:00:00.000Z')
    expect(idToDate('2022-07-16 Sat')?.toISOString())
      .toBe('2022-07-16T04:00:00.000Z')
  })
})
