import classNames from 'classnames'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { SpreadsheetMimetype } from 'types/generic/spreadsheet'

interface SpreadsheetFormatDropdownProps {
  onExport?: (mimetype: SpreadsheetMimetype) => () => void
  onExportCsv?: () => void
  onExportXlsx?: () => void
  side?: 'left' | 'right'
  className?: string
}

export const SpreadSheetFormatDropdown: FC<SpreadsheetFormatDropdownProps> = ({
  onExport,
  onExportCsv,
  onExportXlsx,
  side,
  className,
}) => {
  const { t } = useTranslation()
  if (!(onExport || (onExportCsv && onExportXlsx)))
    throw new Error('need export function')

  return (
    <div
      className={classNames(
        `shadow-md absolute -${side}-14 top-0 bg-base-100 rounded-lg`,
        'whitespace-nowrap space-y-2 p-1.5 text-base-content',
        className
      )}
    >
      <ul className="text-sm">
        <li>
          <button
            type="button"
            className="list-item-menu-button p-2.5"
            onClick={onExportCsv ?? onExport?.('text/csv')}
          >
            {t('format.csv')}
          </button>
        </li>
        <li>
          <button
            type="button"
            className="list-item-menu-button p-2.5"
            onClick={onExportXlsx ?? onExport?.('application/vnd.ms-excel')}
          >
            {t('format.xlsx')}
          </button>
        </li>
      </ul>
    </div>
  )
}
