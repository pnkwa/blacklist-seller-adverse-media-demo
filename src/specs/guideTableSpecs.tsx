import i18n from 'i18n'
import { Masterdata } from 'types/generic'
import { TableSpec } from 'types/generic/table'
import { getMasterdataTranslation } from 'utils/translations'

const renderValue = (
  masterdata: Masterdata,
  onClick: (value: string) => void,
  shouldDisplayLabel: boolean
) => {
  const value = shouldDisplayLabel
    ? getMasterdataTranslation(masterdata) ??
      getMasterdataTranslation(masterdata, 'th')
    : masterdata.key
  return (
    <div className="tooltip tooltip-right" data-tip={i18n.t('guide.tooltip')}>
      <div
        aria-hidden
        role="button"
        onClick={() => value && onClick(value)}
        className="inline-block break-words whitespace-pre-wrap w-full"
      >
        {value}
      </div>
    </div>
  )
}

export const getTableSpecMaster = ({ header, onClick }): TableSpec[] => [
  {
    key: 'name',
    header: `guide.${header}`,
    headerClassName: 'bg-primary',
    renderValue: (masterdata: Masterdata) =>
      renderValue(masterdata, onClick, true),
  },
  {
    key: 'value',
    header: 'guide.code',
    headerClassName: 'bg-primary',
    renderValue: (masterdata: Masterdata) =>
      renderValue(masterdata, onClick, false),
  },
]
