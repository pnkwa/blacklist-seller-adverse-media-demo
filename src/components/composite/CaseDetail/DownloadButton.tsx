import classNames from 'classnames'
import { FC, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useOnClickOutside } from 'hooks/clickOutside'
import { Flow } from 'types/caseKeeperCore'
import ArrowNextIcon from 'assets/svg/icon-chevron-right.svg?react'
import { useTenantConfigContext } from 'context/TenantConfigContext'
import { DownloadDocumentButton } from './DownloadDocumentButton'
import { DownloadSummaryReportButton } from './DownloadSummaryReportButton'

interface DownloadButtonProps {
  flow: Flow
  className?: string
}

const DownloadButton: FC<DownloadButtonProps> = ({ flow, className }) => {
  const refButton = useRef<HTMLButtonElement>(null)
  const [isExpand, setIsExpand] = useState(false)
  const { t } = useTranslation()
  const {
    client: { backgroundCheckDashboardConfig },
  } = useTenantConfigContext()
  const { bgcSummaryReportLanguages } = backgroundCheckDashboardConfig ?? {}

  useOnClickOutside(refButton, () => setIsExpand(false))

  return (
    <div className="dropdown lg:dropdown-end">
      <button
        ref={refButton}
        tabIndex={0}
        onClick={() => !isExpand && setIsExpand(!isExpand)}
        type="button"
        className={classNames(
          'btn btn-outline flex-nowrap font-normal pr-3 bg-white',
          className
        )}
      >
        {t('generic.download')}
        <ArrowNextIcon
          className={classNames(isExpand ? '-rotate-90' : 'rotate-90')}
        />
      </button>
      <ul
        className={classNames(
          'dropdown-content menu bg-base-100 rounded-lg shadow-xl w-72'
        )}
      >
        <DownloadDocumentButton flow={flow} />
        <div
          className={classNames(
            !bgcSummaryReportLanguages?.length &&
              'before:whitespace-pre before:content-[attr(data-tip)]'
          )}
        >
          <DownloadSummaryReportButton flow={flow} />
        </div>
      </ul>
    </div>
  )
}

export default DownloadButton
