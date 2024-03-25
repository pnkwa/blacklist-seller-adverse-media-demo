import { isS3URLExpired } from './s3'

describe('isS3URLExpired', () => {
  beforeEach(() => {
    // Freeze time to a known point in time
    jest
      .useFakeTimers()
      .setSystemTime(new Date('2023-04-28T12:00:00Z').getTime())
  })

  afterEach(() => {
    // Restore real time behavior after each test
    jest.useRealTimers()
  })

  it('returns true for an expired URL', () => {
    const url =
      'https://example.com?X-Amz-Algorithm=A&X-Amz-Date=20220101T000000Z&X-Amz-Expires=600'
    expect(isS3URLExpired(url)).toBe(true)
  })

  it('returns false for a non-expired URL', () => {
    const url =
      'https://example.com?X-Amz-Algorithm=A&X-Amz-Date=20230501T000000Z&X-Amz-Expires=600'
    expect(isS3URLExpired(url)).toBe(false)
  })

  it('returns true for a URL that expired exactly at the current time', () => {
    const url =
      'https://example.com?X-Amz-Algorithm=A&X-Amz-Date=20230428T120000Z&X-Amz-Expires=0'
    expect(isS3URLExpired(url)).toBe(true)
  })

  it('returns false for a URL that will expire in the future', () => {
    const url =
      'https://example.com?X-Amz-Algorithm=A&X-Amz-Date=20230428T120000Z&X-Amz-Expires=3600'
    expect(isS3URLExpired(url)).toBe(false)
  })

  it('returns true for a URL that expired in the past', () => {
    const url =
      'https://example.com?X-Amz-Algorithm=A&X-Amz-Date=20200101T000000Z&X-Amz-Expires=0'
    expect(isS3URLExpired(url)).toBe(true)
  })

  it('returns false for a URL with an invalid X-Amz-Date parameter', () => {
    const url =
      'https://example.com?X-Amz-Algorithm=A&X-Amz-Date=invalid-date&X-Amz-Expires=600'
    expect(isS3URLExpired(url)).toBe(false)
  })

  it('returns false for a URL with an invalid X-Amz-Expires parameter', () => {
    const url =
      'https://example.com?X-Amz-Algorithm=A&X-Amz-Date=20220501T000000Z&X-Amz-Expires=invalid-number'
    expect(isS3URLExpired(url)).toBe(false)
  })

  it('returns false for a non-expired URL but get invalid X-Amz-Expires parameter', () => {
    const url =
      'https://example.com?X-Amz-Algorithm=A&X-Amz-Date=20230429T120000Z&X-Amz-Expires=invalid-number'
    expect(isS3URLExpired(url)).toBe(false)
  })
})
