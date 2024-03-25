import classNames from 'classnames'
import { FC, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Verification } from 'types/caseKeeperCore'
import { Tabs } from 'components/base/Tabs'

import { VerificationProcess } from 'types/kycCore'
import { TabItemConfig } from 'types/generic/tabs'
import BackIdCardDetail from './BackIdCardDetail'
import FrontIdCardDetail from './FrontIdCardDetail'
import PassportDetail from './PassportDetail'
import DopaDetail from './DopaDetail'
import FaceRecognitionDetail from './FaceRecognitionDetail'

interface BaseBackgroundCheckDetailProps {
  verification: Verification
  processKey: string
}

enum ProcessResultMenuTab {
  LATEST = 'latest',
  ATTEMPT_HISTORY = 'attemptHistory',
}

const processNotValidField = [
  'overview',
  VerificationProcess.LIVENESS,
  VerificationProcess.DOPA,
]

const tabsConfig: TabItemConfig[] = [
  {
    key: ProcessResultMenuTab.LATEST,
    label: 'caseDetail.verification.processResultMenuTab.latest',
  },
  {
    key: ProcessResultMenuTab.ATTEMPT_HISTORY,
    label: 'caseDetail.verification.processResultMenuTab.attemptHistory',
  },
]

const VerificationIndex: FC<BaseBackgroundCheckDetailProps> = ({
  verification,
  processKey,
}) => {
  const { t } = useTranslation()

  const [currentTab, setCurrentTab] = useState(tabsConfig[0].key)
  const [showVerified, setShowVerified] = useState(false)
  const [hideToggle, setHideToggle] = useState(true)

  const filteredTabConfig = useMemo(() => {
    const filtered =
      verification?.[`${processKey}Results`]?.length <= 1
        ? tabsConfig.slice(0, 1)
        : tabsConfig
    setCurrentTab(filtered[0].key)
    return filtered
  }, [processKey, verification])

  const showAttempts = useMemo(
    () => currentTab === ProcessResultMenuTab.ATTEMPT_HISTORY,
    [currentTab]
  )

  useEffect(() => {
    const shouldHide =
      processNotValidField.includes(processKey) ||
      verification?.[`${processKey}Result`].verified

    setHideToggle(shouldHide)
    setShowVerified(shouldHide ? showAttempts : true)
  }, [processKey, showAttempts, verification])

  return (
    <div
      id="kyc"
      className={classNames('w-ful space-y-2 sm:relative overflow-x-auto')}
    >
      <Tabs
        className="max-w-fit overflow-x-auto border-none"
        tabClass="!p-0 mr-4"
        tabsConfig={filteredTabConfig}
        activeTab={currentTab}
        onChangeTab={(tab) => setCurrentTab(tab)}
      />
      {!hideToggle && (
        <label
          htmlFor="showOnlyNotVerified"
          className="label inline-block sm:absolute sm:top-6 sm:right-0"
        >
          <span className="cursor-pointer whitespace-pre">
            {t('caseDetail.showOnlyNotVerified')}
          </span>
          <input
            id="showOnlyNotVerified"
            type="checkbox"
            className="toggle toggle-sm toggle-primary align-middle ml-3"
            checked={showVerified}
            onChange={(e) => setShowVerified(e?.target?.checked)}
          />
        </label>
      )}
      {processKey === VerificationProcess.PASSPORT && (
        <PassportDetail
          showAttempts={showAttempts}
          verification={verification}
          showVerified={showVerified}
        />
      )}
      {processKey === VerificationProcess.FRONT_ID_CARD && (
        <FrontIdCardDetail
          showAttempts={showAttempts}
          verification={verification}
          showVerified={showVerified}
          setHideToggle={setHideToggle}
        />
      )}
      {processKey === VerificationProcess.BACK_ID_CARD && (
        <BackIdCardDetail
          showAttempts={showAttempts}
          verification={verification}
          showVerified={showVerified}
        />
      )}
      {processKey === VerificationProcess.DOPA && (
        <DopaDetail showAttempts={showAttempts} verification={verification} />
      )}
      {/* This verification component include liveness and faceRecognition */}
      {processKey === VerificationProcess.LIVENESS && (
        <FaceRecognitionDetail
          showAttempts={showAttempts}
          verification={verification}
        />
      )}
    </div>
  )
}

export default VerificationIndex
