import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { TooltipBox } from 'components/base/TooltipBox'
import { Flow } from 'types/caseKeeperCore'
import { filterProcesses } from 'utils/caseKeeperCore/processesConfig'

interface RequiredProcessesProps {
  flow: Flow
}

export const RequiredProcesses = ({ flow }: RequiredProcessesProps) => {
  const { t } = useTranslation()

  const processes = useMemo(
    () =>
      flow.backgroundCheck?.processConfigs &&
      filterProcesses(flow.backgroundCheck?.processConfigs),
    [flow.backgroundCheck]
  )

  const title = t('flowTable.requiredProcesses', { count: processes?.length })

  return (
    <TooltipBox
      tooltipContent={
        <>
          <h4 className="font-bold mb-3">{title}</h4>
          {processes?.map((item) => (
            <div
              key={item.key}
              className="flex items-center space-x-2 first:mt-0 mt-6"
            >
              <div
                className={classNames(
                  'w-7 h-7 flex items-center justify-center bg-neutral text-base-100',
                  'rounded-full'
                )}
              >
                {item.SVGIcon && <item.SVGIcon className="w-4 h-4" />}
              </div>
              <span>{t(item.title)}</span>
            </div>
          ))}
        </>
      }
    >
      <span className="tag-label text-neutral bg-neutral/20">{title}</span>
    </TooltipBox>
  )
}
