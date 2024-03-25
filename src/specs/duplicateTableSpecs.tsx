import i18n from 'i18n'
import { EvaluationResultLabel } from 'components/composite/FlowTable/EvaluationResultLabel'
import { KYCFailedReasons } from 'components/composite/FlowTable/KYCFailedReasons'
import { LatestClientProcess } from 'components/composite/FlowTable/LatestClientProcess'
import { ResultProgress } from 'components/composite/FlowTable/ResultProgress'
import { StatusLabel } from 'components/composite/FlowTable/StatusLabel'
import { processesName } from 'config/processes'
import { BackgroundCheckStatus } from 'types/bgcCore'
import { TableSpec } from 'types/generic/table'
import { getDisplayedBackgroundCheckStatus } from 'utils/backgroundCheck'
import { dateFormat } from 'utils/date'
import { Flow } from 'types/caseKeeperCore'

export const duplicateTableSpecs = (
  onClick: (flow: Flow) => void
): TableSpec<Flow>[] => [
  {
    key: 'radio',
    headerClassName: 'after:w-0 rounded-l-lg border-none min-w-[60px]',
    contentClassName: 'text-center',
    renderValue: (flow) => (
      <input
        type="radio"
        name="selectedDuplicateFlow"
        className="radio radio-primary w-4 h-4"
        onClick={() => onClick(flow)}
      />
    ),
  },
  {
    key: 'createdAt',
    sortKey: 'createdAt',
    header: 'duplicate.header.createdAt',
    headerClassName: 'min-w-[120px]',
    renderValue: ({ backgroundCheck }) =>
      dateFormat(backgroundCheck?.createdAt, undefined, '-'),
  },
  {
    key: 'completedAt',
    sortKey: 'completedAt',
    header: 'duplicate.header.completedAt',
    headerClassName: 'min-w-[120px]',
    renderValue: ({ backgroundCheck }) =>
      dateFormat(backgroundCheck?.completedAt, undefined, '-'),
  },
  {
    key: 'checkedProcess',
    header: 'duplicate.header.process',
    headerClassName: 'min-w-[230px]',
    renderValue: ({ backgroundCheck, verification }) => (
      <ul className="list-disc list-inside">
        {processesName.map(
          (process) =>
            (backgroundCheck?.processConfigs?.[process] ||
              verification?.[`${process}Config`]?.required) && (
              <li className="font-normal" key={process}>
                {i18n.t(`createCaseForm.labels.${process}`)}
              </li>
            )
        )}
      </ul>
    ),
  },
  {
    key: 'status',
    header: 'duplicate.header.status',
    headerClassName: 'min-w-[140px]',
    renderValue: (flow) => <StatusLabel flow={flow} />,
  },
  {
    key: 'details',
    header: 'duplicate.header.details',
    headerClassName: 'min-w-[400px]',
    contentClassName: 'w-full sm:w-auto sm:flex justify-between sm:table-cell',
    renderValue: (item) => {
      const status = getDisplayedBackgroundCheckStatus(item.backgroundCheck)
      switch (status) {
        case BackgroundCheckStatus.OPEN:
        case BackgroundCheckStatus.PENDING_CLIENT:
        case BackgroundCheckStatus.EXPIRED:
          return <LatestClientProcess flow={item} />
        case BackgroundCheckStatus.BLOCKED:
          return <KYCFailedReasons flow={item} maxDisplayItems={2} />
        case BackgroundCheckStatus.PENDING_OPERATION:
          return <ResultProgress flow={item} displayInfo={false} />
        case BackgroundCheckStatus.VERIFIED:
        case BackgroundCheckStatus.COMPLETED:
          return <EvaluationResultLabel flow={item} />
        default:
          return null
      }
    },
  },
]
