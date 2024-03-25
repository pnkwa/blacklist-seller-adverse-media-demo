import { temporalToMasterdata } from './masterdata'

describe('temporalToMasterdata', () => {
  it('converts temporal value to Masterdata with correct translations', () => {
    // Test case 1: P1Y2M
    const result1 = temporalToMasterdata('P1Y2M')
    expect(result1).toEqual({
      key: 'P1Y2M',
      translations: {
        th: '1 ปี 2 เดือน',
        en: '1 year 2 months',
      },
    })

    // Test case 2: P3Y
    const result2 = temporalToMasterdata('P3Y')
    expect(result2).toEqual({
      key: 'P3Y',
      translations: {
        th: '3 ปี',
        en: '3 years',
      },
    })
  })
})
