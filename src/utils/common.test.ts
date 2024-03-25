import 'moment/locale/th'
import {
  pick,
  isEmpty,
  pathOr,
  path,
  isNil,
  joinStringsWithJoiner,
} from './common'

describe('pick', () => {
  const mockObj = {
    a: true,
    b: true,
    c: true,
  }
  it('should return only a', () => {
    const response = pick(mockObj, ['a'])
    expect(response).toHaveProperty('a', true)
  })
  it('should return only a b', () => {
    const response = pick(mockObj, ['a', 'b'])
    expect(response).toHaveProperty('a', true)
    expect(response).toHaveProperty('b', true)
  })
  it('should return a b c', () => {
    const response = pick(mockObj, ['a', 'b', 'c'])
    expect(response).toHaveProperty('a', true)
    expect(response).toHaveProperty('b', true)
    expect(response).toHaveProperty('c', true)
  })
  it('should return empty object if value is string', () => {
    expect(pick('test', [''])).toEqual({})
  })
  it('should return empty object if value is array', () => {
    expect(pick(['test'], [''])).toEqual({})
  })
  it('should return empty object if value is null', () => {
    expect(pick(null, [''])).toEqual({})
  })
  it('should return empty object if value is undefined', () => {
    expect(pick(undefined, [''])).toEqual({})
  })
  it('should return empty object if props is empty', () => {
    expect(pick(mockObj, [])).toEqual({})
  })
  it('should return empty object if props is null', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(pick(mockObj, null as any)).toEqual({})
  })
  it('should return empty object if props is not array', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(pick(mockObj, {} as any)).toEqual({})
  })
})

describe('isEmpty', () => {
  it('should return true if array is empty', () => {
    expect(isEmpty([])).toBeTruthy()
  })
  it('should return true if object is empty', () => {
    expect(isEmpty({})).toBeTruthy()
  })
  it('should return false if array is not empty', () => {
    expect(isEmpty(['test'])).toBeFalsy()
  })
  it('should return false if object is not empty', () => {
    expect(isEmpty({ test: 'test' })).toBeFalsy()
  })
  it('should return true if value is null', () => {
    expect(isEmpty(null)).toBeTruthy()
  })
  it('should return false if value is string', () => {
    expect(isEmpty('test')).toBeFalsy()
  })
})

describe('pathOr', () => {
  const obj = {
    foo: {
      bar: {
        baz: 'value',
      },
    },
    arr: [1, 2, 3],
  }

  it('should return the value at the given path', () => {
    expect(pathOr('default', ['foo', 'bar', 'baz'], obj)).toBe('value')
    expect(pathOr('default', ['arr', 1], obj)).toBe(2)
  })

  it('should return the default value if the path does not exist', () => {
    expect(pathOr('default', ['foo', 'bar', 'qux'], obj)).toBe('default')
    expect(pathOr('default', ['nonexistent', 'path'], obj)).toBe('default')
  })

  it('should return the default value if the value is undefined', () => {
    expect(pathOr('default', ['foo', 'undefinedProp'], obj)).toBe('default')
    expect(pathOr('default', ['arr', 10], obj)).toBe('default')
  })
})

describe('path', () => {
  const obj = {
    foo: {
      bar: {
        baz: 'value',
      },
    },
    arr: [1, 2, 3],
  }

  it('should return the value at the given path', () => {
    expect(path(['foo', 'bar', 'baz'], obj)).toBe('value')
    expect(path(['arr', 1], obj)).toBe(2)
  })

  it('should return undefined if the path does not exist', () => {
    expect(path(['foo', 'bar', 'qux'], obj)).toBeUndefined()
    expect(path(['nonexistent', 'path'], obj)).toBeUndefined()
  })

  it('should return undefined if the value is undefined', () => {
    expect(path(['foo', 'undefinedProp'], obj)).toBeUndefined()
    expect(path(['arr', 10], obj)).toBeUndefined()
  })
})

describe('isNil', () => {
  it('should return true for null and undefined values', () => {
    expect(isNil(null)).toBe(true)
    expect(isNil(undefined)).toBe(true)
  })

  it('should return false for non-null and non-undefined values', () => {
    expect(isNil(0)).toBe(false)
    expect(isNil('')).toBe(false)
    expect(isNil(false)).toBe(false)
    expect(isNil({})).toBe(false)
    expect(isNil([])).toBe(false)
  })
})

describe('joinStringsWithJoiner', () => {
  it('should join strings with a comma', () => {
    const values = ['apple', 'banana', 'cherry']
    const mapValue = (value: string) => value.toUpperCase()
    const joiner = ' and '
    const result = joinStringsWithJoiner(values, joiner, mapValue)
    expect(result).toBe('APPLE,BANANA and CHERRY')
  })

  it('should join strings with a hyphen', () => {
    const values = ['one', 'two', 'three']
    const mapValue = (value: string) => value.toUpperCase()
    const joiner = ' and '
    const result = joinStringsWithJoiner(values, joiner, mapValue)
    expect(result).toBe('ONE,TWO and THREE')
  })

  it('should return the first value if there is only one value', () => {
    const values = ['single']
    const mapValue = (value: string) => value.toUpperCase()
    const joiner = ' and '
    const result = joinStringsWithJoiner(values, joiner, mapValue)
    expect(result).toBe('SINGLE')
  })

  it('should return an empty string if there are no values', () => {
    const values: string[] = []
    const mapValue = (value: string) => value.toUpperCase()
    const joiner = ' and '
    const result = joinStringsWithJoiner(values, joiner, mapValue)
    expect(result).toBe('')
  })
})
