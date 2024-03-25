import { getMasterdataTranslation, isLegacyMasterdata } from './translations'

jest.mock('i18n', () => ({ language: 'en' }))

describe('isLegacyMasterdata', () => {
  it('should return true when data is in legacy value structure', () => {
    const value = {
      key: 'cat',
      code: '001',
      translations: { th: { label: 'แมว' }, en: { label: 'Cat' } },
    }
    expect(isLegacyMasterdata(value)).toBe(true)
  })

  it('should return false when data is in new value structure', () => {
    const value = {
      key: 'cat',
      translations: { th: 'แมว', en: 'Cat' },
    }
    expect(isLegacyMasterdata(value)).toBe(false)
  })

  it('should return false when data is undefined or null', () => {
    expect(isLegacyMasterdata(undefined)).toBe(false)
    expect(isLegacyMasterdata(null)).toBe(false)
  })
})

describe('getMasterdataTranslation', () => {
  it('should return translation label from legacy value structure', () => {
    const value = {
      key: 'cat',
      code: '001',
      translations: { th: { label: 'แมว' }, en: { label: 'Cat' } },
    }
    expect(getMasterdataTranslation(value)).toBe('Cat')
  })

  it('should return translation label from new value structure', () => {
    const value = {
      key: 'cat',
      translations: { th: 'แมว', en: 'Cat' },
    }
    expect(getMasterdataTranslation(value)).toBe('Cat')
  })

  it('should return undefined when value is undefined', () => {
    const value = undefined
    expect(getMasterdataTranslation(value)).toBe(undefined)
  })
})
