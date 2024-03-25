import { FC, useCallback, useMemo } from 'react'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { Flow } from 'types/caseKeeperCore'
import VerifyBadge from 'components/base/VerifyBadge'
import InfoCard from 'components/base/InfoCard'
import SuccessIcon from 'assets/svg/status/success.svg?react'
import ErrorIcon from 'assets/svg/status/error.svg?react'
import { useModal } from 'hooks/useModal'
import { BackgroundApprovalStatus, BackgroundCheckStatus } from 'types/bgcCore'
import { getKYCFailedReasons } from 'utils/verificationResult'
import { getUniqueStrings } from 'utils/string'
import { useTenantConfigContext } from 'context/TenantConfigContext'
import { SVGAssetComponent } from 'types/generic'
import { ManualApproveModal } from '../Modal/ManualApprove'

interface ManualApproveProps {
  flow: Flow
  className?: string
  onReload: () => Promise<void>
}

const Button = ({
  label,
  Icon,
  className,
  onClick,
}: {
  label: string
  Icon?: SVGAssetComponent
  className?: string
  onClick: () => void
}) => (
  <button
    type="button"
    onClick={onClick}
    className={classNames('flex btn w-full', className)}
  >
    {Icon && <Icon />}
    {label}
  </button>
)

const ManualApprove: FC<ManualApproveProps> = ({
  flow,
  className,
  onReload,
}) => {
  const modal = useModal()
  const { t } = useTranslation()
  const { client } = useTenantConfigContext()

  const { approvalReasons, rejectionReasons } =
    client.backgroundCheckDashboardConfig ?? {}

  const onCloseModal = useCallback(() => {
    modal.destroy()
  }, [modal])

  const onApproved = useCallback(async () => {
    await onReload()
    modal.destroy()
  }, [modal, onReload])

  const onClick = useCallback(
    (status: BackgroundApprovalStatus) => {
      const masterdata =
        status === BackgroundApprovalStatus.APPROVED
          ? approvalReasons
          : rejectionReasons

      modal.renderElement(
        <ManualApproveModal
          flow={flow}
          status={status}
          masterdata={masterdata}
          onCloseModal={onCloseModal}
          onApproved={onApproved}
        />
      )
    },
    [approvalReasons, flow, modal, onApproved, onCloseModal, rejectionReasons]
  )

  const reasons = useMemo(() => {
    const reasons = getKYCFailedReasons(flow)?.map((reason) =>
      t(`failedReasons.${reason.process}.${reason.errorKey}`, {
        defaultValue: t(`failedReasons.${reason.process}.default`),
      })
    )

    return reasons?.length ? getUniqueStrings(reasons).join(', ') : null
  }, [flow, t])

  if (
    flow?.backgroundCheck?.approvalStatus !==
      BackgroundApprovalStatus.UNSPECIFIED ||
    flow.backgroundCheck.status !== BackgroundCheckStatus.BLOCKED
  )
    return null

  return (
    <InfoCard
      className={classNames('shadow-md', className)}
      title={
        <VerifyBadge
          className="font-semibold text-base sm:text-lg"
          iconClassName="!min-h-[1.5rem] !min-w-[1.5rem] sm:!min-h-[2rem] sm:!min-w-[2rem] mr-2"
          verified={false}
          label="manualApprove.title"
          subTitle="manualApprove.description"
        />
      }
    >
      <div className="flex flex-col h-full justify-between">
        <div className="bg-base-200 flex rounded-md my-4 p-4 text-xs sm:text-sm">
          <p className="font-normal min-w-fit pr-4">
            {t('manualApprove.latestRemark')}
          </p>
          <span className="font-semibold">{reasons ?? '-'}</span>
        </div>
        <div className="grid col-span-2 grid-flow-col gap-2 py-4">
          <Button
            label={t('manualApprove.reject')}
            Icon={ErrorIcon}
            className="text-error btn-error btn-outline hover:!text-white "
            onClick={() => onClick(BackgroundApprovalStatus.REJECTED)}
          />
          <Button
            label={t('manualApprove.approve')}
            Icon={SuccessIcon}
            className="text-white btn-success"
            onClick={() => onClick(BackgroundApprovalStatus.APPROVED)}
          />
        </div>
      </div>
    </InfoCard>
  )
}

export default ManualApprove
