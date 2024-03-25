import mockFile from '__mocks__/file-mock'
import { BackgroundCheckProcessName } from 'types/bgcCore'
import { filterProcesses } from './processesConfig'

describe('filterProcesses', () => {
  const processesConfig = {
    [BackgroundCheckProcessName.EDUCATION]: { maxTranscripts: 10 },
    [BackgroundCheckProcessName.INCOME]: { validatePayslipCount: 3 },
    [BackgroundCheckProcessName.CRIMINAL_RECORD]: true,
    [BackgroundCheckProcessName.SOCIAL_SECURITY_HISTORY]: false,
    [BackgroundCheckProcessName.ADVERSE_MEDIA]: false,
    [BackgroundCheckProcessName.BANKRUPTCY]: false,
    [BackgroundCheckProcessName.SANCTION]: false,
    [BackgroundCheckProcessName.EMPLOYMENT_REFERENCE]: false,
  }

  it('should filter processes correctly with additional processes', () => {
    const result = filterProcesses(processesConfig, ['kyc'])
    expect(result).toHaveLength(4)
    expect(result).toEqual([
      { key: 'kyc', title: 'processes.kyc', SVGIcon: mockFile },
      {
        key: 'criminalRecord',
        title: 'processes.criminalRecord',
        SVGIcon: mockFile,
      },
      { key: 'education', title: 'processes.education', SVGIcon: mockFile },
      { key: 'income', title: 'processes.income', SVGIcon: mockFile },
    ])
  })

  it('should handle empty additional processes', () => {
    const result = filterProcesses(processesConfig)
    expect(result).toHaveLength(3)
    expect(result).toEqual([
      {
        key: 'criminalRecord',
        title: 'processes.criminalRecord',
        SVGIcon: mockFile,
      },
      { key: 'education', title: 'processes.education', SVGIcon: mockFile },
      { key: 'income', title: 'processes.income', SVGIcon: mockFile },
    ])
  })

  it('should handle processes with different configuration options', () => {
    const result = filterProcesses({
      ...processesConfig,
      [BackgroundCheckProcessName.EMPLOYMENT_REFERENCE]: true,
      [BackgroundCheckProcessName.SANCTION]: true,
    })
    expect(result).toHaveLength(5)
    expect(result).toEqual([
      {
        key: 'criminalRecord',
        title: 'processes.criminalRecord',
        SVGIcon: mockFile,
      },
      { key: 'sanction', title: 'processes.sanction', SVGIcon: mockFile },
      { key: 'education', title: 'processes.education', SVGIcon: mockFile },
      { key: 'income', title: 'processes.income', SVGIcon: mockFile },
      {
        key: 'employmentReference',
        title: 'processes.employmentReference',
        SVGIcon: mockFile,
      },
    ])
  })
})
