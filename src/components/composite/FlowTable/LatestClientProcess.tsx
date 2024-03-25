import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Flow } from 'types/caseKeeperCore'
import { getLatestClientProcess } from 'utils/flow'

interface LatestClientProcessProps {
  flow: Flow
  withHeader?: boolean
}

export const LatestClientProcess = ({
  flow,
  withHeader = true,
}: LatestClientProcessProps) => {
  const { t } = useTranslation()

  const process = useMemo(() => getLatestClientProcess(flow), [flow])

  return (
    <div className="flex space-x-2">
      {withHeader && (
        <div className="mr-1 min-w-0 opacity-50">
          {t('latestClientProcess.title')}:
        </div>
      )}
      <div className="flex-1">
        {process ? t(`latestClientProcess.${process}`) : '-'}
      </div>
    </div>
  )
}
