import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { getPercentage } from 'utils/number'
import { routes } from 'config/routes'
import { FlowsResultKey } from 'types/caseKeeperCore'
import {
  ErrorPlaceholder,
  NoCasesPlaceholder,
} from 'components/base/DetailPlaceholder'
import { useFlows } from 'hooks/useFlows'
import { SeeDetailsButton } from './SeeDetailsButton'

ChartJS.register(ArcElement, Tooltip, Legend)

const VERIFIED_COLOR = '#0EB366'
const COMPLETED_COLOR = '#F32735'

interface ResultSummaryBoxProps {
  className?: string
}

interface LegentDisplayProps {
  color: string
  label: string
  count: number
}

const LegendDisplay = ({ color, label, count }: LegentDisplayProps) => (
  <div>
    <div className="flex">
      <div
        style={{ backgroundColor: color }}
        className="p-1.5 h-1 rounded-full mr-2 mt-1.5"
      />
      <span className="font-bold">{label}</span>
    </div>
    <p className="text-3xl mt-2 font-bold">{count}</p>
  </div>
)

export const ResultSummaryBox = ({ className }: ResultSummaryBoxProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { count: completedCount = 0, error: completedError } = useFlows(
    FlowsResultKey.COMPLETED
  )
  const { count: verifiedCount = 0, error: verifiedError } = useFlows(
    FlowsResultKey.VERIFIED
  )

  const totalCount = completedCount + verifiedCount
  const error = completedError || verifiedError

  const chartData = useMemo(
    (): ChartData<'doughnut', string[], unknown> => ({
      datasets: [
        {
          data: [
            getPercentage(completedCount, totalCount).toFixed(),
            getPercentage(verifiedCount, totalCount).toFixed(),
          ],
          backgroundColor: [COMPLETED_COLOR, VERIFIED_COLOR],
          borderWidth: 0,
        },
      ],
    }),
    [completedCount, totalCount, verifiedCount]
  )

  return (
    <div
      className={classNames(
        'content-box px-0 pb-0 lg:max-w-[400px] max-h-full overflow-hidden flex flex-col',
        className
      )}
    >
      <div className="px-6 mb-2 flex space-x-4 justify-between">
        <div className="font-bold">
          {t('overviewPage.resultSummaryBox.title')}
        </div>
        <SeeDetailsButton
          onClick={() => {
            const search = new URLSearchParams({ tab: FlowsResultKey.RECEIVED })
            navigate(`${routes.backgroundCheck}?${search}`)
          }}
        />
      </div>
      <div className="px-6 pb-8 flex-1 overflow-auto">
        <div className="relative w-72 h-72 mx-auto mt-12 mb-6">
          {error && <ErrorPlaceholder />}
          {!error &&
            (completedCount || verifiedCount ? (
              <>
                <Doughnut
                  data={chartData}
                  options={{
                    cutout: '87%',
                    plugins: {
                      tooltip: {
                        mode: 'nearest',
                        intersect: false,
                        callbacks: {
                          label: (v) => `${v.formattedValue}%`,
                        },
                        backgroundColor: '#ffffff',
                        bodyColor: '#1f2937',
                        borderColor: '#eeeeee',
                        boxPadding: 4,
                        padding: 12,
                        borderWidth: 1,
                        caretSize: 4,
                        bodyFont: {
                          size: 16,
                          family: "'DB Heavent Now', Helvetica, sans-serif",
                        },
                      },
                    },
                  }}
                />
                <div className="text-center absolute space-y-2 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <p>{t('overviewPage.resultSummaryBox.allResults')}</p>
                  <p className="text-3xl font-bold">{totalCount}</p>
                </div>
              </>
            ) : (
              <NoCasesPlaceholder className="h-64" />
            ))}
        </div>
        {!error && (completedCount || verifiedCount) ? (
          <div className="w-80 mx-auto flex justify-between space-x-4">
            <LegendDisplay
              label={t('overviewPage.resultSummaryBox.notPassed')}
              color={COMPLETED_COLOR}
              count={completedCount}
            />
            <LegendDisplay
              label={t('overviewPage.resultSummaryBox.passed')}
              color={VERIFIED_COLOR}
              count={verifiedCount}
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}
