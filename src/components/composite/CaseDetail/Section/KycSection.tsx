/* eslint-disable max-len */
import classNames from 'classnames'
import { FC, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Flow } from 'types/caseKeeperCore'
import { Tabs } from 'components/base/Tabs'
import { verificationConfig } from 'config/verification'
import { getMasterdataTranslation } from 'utils/translations'
import { BackgroundApprovalStatus } from 'types/bgcCore'

import { setReload } from 'reducers'
import VerificationDetail from '../kycDetail/VerificationIndex'
import Overview from '../kycDetail/Overview'
import StatusBatch from '../StatusBatch'

interface BaseBackgroundCheckDetailProps {
  flow: Flow
}

const KycSection: FC<BaseBackgroundCheckDetailProps> = ({ flow }) => {
  const dispatch = useDispatch()
  const { t, i18n } = useTranslation()
  const { verification } = flow

  const hasResult = useMemo(
    () => !!flow?.backgroundCheck?.verificationInfo.kycCompletedAt,
    [flow]
  )

  const filteredConfig = useMemo(
    () =>
      verificationConfig.filter(
        (vc) =>
          flow?.verification?.[`${vc.key}Config`]?.required ??
          vc.key === 'overview'
      ),
    [flow]
  )

  const approvalRemarkReason = useMemo(
    () =>
      flow?.backgroundCheck?.approvalRemark?.reasons
        ?.map((r) => getMasterdataTranslation(r, i18n.language))
        .join(', '),
    [flow?.backgroundCheck?.approvalRemark?.reasons, i18n.language]
  )

  const [open, setOpen] = useState(hasResult)
  const [currentTab, setCurrentTab] = useState(filteredConfig[0].key)

  if (!verification) return null

  return (
    <div
      id="kyc"
      className={classNames(
        'rounded-lg text-base-content',
        'bg-white collapse text-sm w-full px-2 shadow-md',
        hasResult && 'collapse-arrow',
        open && 'collapse-open'
      )}
    >
      <input
        type="checkbox"
        checked={open}
        onChange={(e) => setOpen(e.target.checked)}
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
        <div className="font-bold capitalize">{t(`processes.kyc`)}</div>
        <StatusBatch backgroundCheck={flow.backgroundCheck} process="kyc" />
      </div>
      <div className={classNames('collapse-content w-full overflow-x-auto')}>
        <Tabs
          className="max-w-fit overflow-x-auto pb-2 border-none"
          tabClass="!p-0 mr-4"
          tabsConfig={filteredConfig}
          activeTab={currentTab}
          onChangeTab={(tab) => {
            setCurrentTab(tab)
            dispatch(setReload())
          }}
        />
        {currentTab !== 'overview' && (
          <VerificationDetail
            verification={verification}
            processKey={currentTab}
          />
        )}
        {currentTab === 'overview' && (
          <Overview verification={verification} config={filteredConfig} />
        )}
        {flow?.backgroundCheck?.approvalStatus !==
          BackgroundApprovalStatus.UNSPECIFIED && (
          <div className="bg-warning bg-opacity-10 p-4 text-center rounded-lg my-4">
            <div className="font-bold text-warning">
              {t(
                `manualApprove.confirmModal.${flow?.backgroundCheck?.approvalStatus}.confirmBy`
              )}
              {flow?.backgroundCheck?.approvalRemark?.from ?? '-'}
            </div>
            <div>
              {t(`manualApprove.remark`)} {approvalRemarkReason ?? '-'}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default KycSection
