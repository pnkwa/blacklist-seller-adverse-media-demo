import classNames from 'classnames'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BackgroundCheck, BackgroundCheckProcessName } from 'types/bgcCore'
import { incomeDocumentPasswordConfigs } from 'config/documentPasswordConfig'
import StatusBatch from './StatusBatch'
import { PasswordBatch } from './PasswordBatch'

interface BaseBackgroundCheckDetailProps {
  className?: string
  process: BackgroundCheckProcessName
  /** the result to render when the process is not "pending" or "blocked" */
  children: React.ReactNode

  backgroundCheck?: BackgroundCheck

  classNameChild?: string
}

/**
 * base component for displaying background check process result
 * contains background check's common logic to show "pending" and "blocked" ui
 */
const BaseBackgroundCheckDetail: React.FC<BaseBackgroundCheckDetailProps> = ({
  className,
  process,
  children,
  backgroundCheck,
  classNameChild,
}) => {
  const { t } = useTranslation()

  const hasResult = useMemo(
    () =>
      !!backgroundCheck?.[process]?.verified ||
      !!backgroundCheck?.[process]?.completed,
    [backgroundCheck, process]
  )
  const [open, setOpen] = useState(() => hasResult)
  const processType = process.includes('income')

  return (
    <div
      id={process}
      className={classNames(
        'rounded-lg text-base-content',
        'bg-white collapse text-sm w-full px-2 shadow-md',
        hasResult && 'collapse-arrow',
        open && 'collapse-open',
        className
      )}
    >
      <input
        type="checkbox"
        onChange={(e) => {
          setOpen(e.target.checked)
        }}
        checked={open}
        hidden={!hasResult}
      />
      <div
        role="button"
        aria-hidden="true"
        className={classNames(
          'w-full h-14 rounded-t-lg collapse-title',
          'flex items-center justify-between'
        )}
      >
        <div className="font-bold capitalize">{t(`processes.${process}`)}</div>
        <div className="flex flex-grow justify-end space-x-4 ">
          {backgroundCheck && processType && (
            <PasswordBatch
              backgroundCheck={backgroundCheck}
              configs={incomeDocumentPasswordConfigs}
            />
          )}
          <StatusBatch backgroundCheck={backgroundCheck} process={process} />
        </div>
      </div>
      <div
        className={classNames(
          'collapse-content w-full overflow-x-auto',
          classNameChild
        )}
      >
        {children}
      </div>
    </div>
  )
}

export default BaseBackgroundCheckDetail
