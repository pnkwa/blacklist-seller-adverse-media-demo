import moment from 'moment'
import { Masterdata } from 'types/generic'
import { getMasterdataTranslation } from './translations'

export const temporalToMasterdata = (temporalValue: string): Masterdata => {
  const m = moment.duration(temporalValue)
  const months = m.months()
  const years = m.years()
  const monthsTh = months ? `${months} เดือน` : ''
  const monthsEn = months ? `${months} month${months > 1 ? 's' : ''}` : ''
  const yearsTh = years ? `${years} ปี` : ''
  const yearsEn = years ? `${years} year${years > 1 ? 's' : ''}` : ''
  return {
    key: temporalValue,
    translations: {
      th: [yearsTh, monthsTh].join(' ').trim(),
      en: [yearsEn, monthsEn].join(' ').trim(),
    },
  }
}

export const masterdataToOption = (item: Masterdata) => ({
  value: item.key,
  label: getMasterdataTranslation(item),
})
