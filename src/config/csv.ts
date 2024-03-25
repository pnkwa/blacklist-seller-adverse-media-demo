import { UnparseConfig } from 'papaparse'
import { ImportSpreadsheet } from 'types/generic'

export const unparseConfig: UnparseConfig = {
  quotes: false,
  quoteChar: '"',
  escapeChar: '"',
  delimiter: ',',
  header: true,
  newline: '\r\n',
  skipEmptyLines: false,
}

export const sampleSpreadSheetData: ImportSpreadsheet = {
  position: 'software',
  passportNumber: 'ABA987541',
  citizenId: '"1122334455667"',
  title: 'ด.ช.',
  firstName: 'จอห์น',
  middleName: 'ดี้',
  lastName: 'โด',
  dateOfBirth: '"1978-07-05"',
  baseSalary: '9999.99',
  phoneNumber: '"0823456789"',
  email: 'john.doe@example.com',
  notifyType: 'sms',
  department: 'Department of mockery',
}
