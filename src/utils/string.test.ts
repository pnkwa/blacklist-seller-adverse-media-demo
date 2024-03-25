import { joinStrings, getFirstLetter } from './string'

describe('joinStrings', () => {
  it('should return strings joined with space by default', () => {
    expect(joinStrings(['string1', 'string2'])).toBe('string1 string2')
  })

  it('should skip undefined', () => {
    expect(joinStrings(['string1', undefined, 'string2', null])).toBe(
      'string1 string2'
    )
  })

  it('should trim and remove extra spaces', () => {
    expect(joinStrings(['string1 ', '    string2  '])).toBe('string1 string2')
  })

  it('should return empty string if called with null or undefined', () => {
    expect(joinStrings([undefined])).toBe('')
    expect(joinStrings([null])).toBe('')
    expect(joinStrings([undefined, null])).toBe('')
  })
})

describe('getFirstLetter', () => {
  it('should return first en letter', () => {
    expect(getFirstLetter('cat')).toBe('c')
    expect(getFirstLetter('CAT')).toBe('C')
  })

  it('should return first th letter', () => {
    expect(getFirstLetter('มาา')).toBe('ม')
    expect(getFirstLetter('กิกิ')).toBe('ก')
  })

  it('should prioitize thai consonant over vowels', () => {
    expect(getFirstLetter('เม')).toBe('ม')
    expect(getFirstLetter('เโแม')).toBe('ม')
  })

  it('should return first vowel if not consonant are present', () => {
    expect(getFirstLetter('เ')).toBe('เ')
  })

  it('should return empty string when value is empty or undefined', () => {
    expect(getFirstLetter(undefined)).toBe('')
    expect(getFirstLetter('')).toBe('')
  })
})
