import { useTranslation } from 'react-i18next'
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Waypoint } from 'react-waypoint'
import { useCaseKeeperContext } from 'context/CaseKeeperContext'
import { Flow } from 'types/caseKeeperCore'
import { dateFormats } from 'config/dateFormats'
import { routes } from 'config/routes'
import { dateFormat } from 'utils/date'
import { baseFilter } from 'utils/filter'
import { logger } from 'utils/logger'
import { FETCH_LIST_LIMIT } from 'config/pagination'
import { Spinner } from 'components/base'
import { isAbortError } from 'utils/error'
import { Dropdown } from '../../base/Dropdown'

interface HistoryDetailProps {
  flow: Flow
}

export const HistoryDropdown: FC<HistoryDetailProps> = ({ flow }) => {
  const [flows, setFlows] = useState<Flow[]>([])
  const [page, setPage] = useState<number>(1)
  const [count, setCount] = useState<number>(1)

  const navigate = useNavigate()
  const abortControllerRef = useRef<AbortController | null>()

  const { t } = useTranslation()
  const { fetchFlows } = useCaseKeeperContext()

  const loadData = useCallback(async () => {
    try {
      if (!flow?.proprietorId) return
      abortControllerRef.current?.abort()
      abortControllerRef.current = new AbortController()
      const response = await fetchFlows(
        {
          ...baseFilter,
          [`proprietorId-$eq`]: flow.proprietorId,
        },
        { createdAt: 'DESC' },
        page,
        FETCH_LIST_LIMIT,
        abortControllerRef.current.signal
      )
      setFlows((prev) => [...prev, ...response.data])
      setCount(response.meta?.count ?? 1)
      setPage((prev) => prev + 1)
    } catch (err) {
      if (isAbortError(err)) return
      logger.error(err)
    }
  }, [fetchFlows, flow.proprietorId, page])

  const options = useMemo(() => {
    const options = flows.map((option, index) => ({
      key: option?.id,
      label: t('caseDetail.historyDropdown.label', {
        attempt: count - index,
        date: dateFormat(option?.createdAt, dateFormats.dayMonthYear),
      }),
      value: option?.id,
    }))

    if (count / FETCH_LIST_LIMIT <= page - 1) return options
    return [
      ...options,
      {
        key: 'spinner',
        value: null,
        label: (
          <Waypoint onEnter={loadData}>
            <div className="flex justify-center items-center">
              <Spinner />
            </div>
          </Waypoint>
        ),
      },
    ]
  }, [count, flows, loadData, page, t])

  const currentAttempt = useMemo(
    () =>
      options.find(
        ({ value }) => typeof value === 'string' && flow?.id === value
      ),
    [options, flow?.id]
  )

  useEffect(() => {
    if (!flows.find(({ id }) => flow?.id === id)) loadData()
  }, [flow?.id, flows, loadData])

  return (
    <Dropdown
      placeholder={t('generic.loading')}
      className="text-sm min-w-[18rem] z-30"
      menuPosition="fixed"
      options={options}
      value={currentAttempt}
      onChange={({ value }) =>
        value &&
        navigate(routes.caseDetail.replace(':id', value), {
          replace: true,
        })
      }
    />
  )
}
