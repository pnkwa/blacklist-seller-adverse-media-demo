import i18n from 'i18n'

export const displayFields = [
  'alias',
  'citizenship',
  'birthDate',
  'identificationDocuments',
  'remark',
]

export const sanctionTableSpec = [
  {
    key: 'column',
    contentClassName: 'w-[200px] align-top',
    renderValue: (item) => (
      <div className="font-bold">
        {i18n.t(item?.column ? `caseDetail.sanction.${item?.column}` : '-')}
      </div>
    ),
  },
  {
    key: 'value',
    renderValue: (item) => (
      <div className="inline-block break-words whitespace-pre-wrap w-full">
        {i18n.t(item?.value ?? '-')}
      </div>
    ),
  },
]
