import { FC, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { BackgroundApprovalStatus } from 'types/bgcCore'
import { Flow } from 'types/caseKeeperCore'
import { getMasterdataTranslation } from 'utils/translations'
import { Masterdata } from 'types/generic'
import { joinStrings } from 'utils/string'
import { useCaseKeeperContext } from 'context/CaseKeeperContext'
import { Modal } from '../Modal'

interface ManualApproveModalProps {
  flow: Flow
  status: BackgroundApprovalStatus
  masterdata?: Masterdata[]
  onCloseModal: () => void
  onApproved: () => void
}

const Checkbox = ({
  key,
  checked,
  label,
  onChange,
}: {
  key: string
  checked: boolean
  label?: string
  onChange: () => void
}) => (
  <div key={key} className="flex gap-4">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="checkbox w-5 h-5 rounded-full"
    />
    <span className="text-sm">{label ?? key}</span>
  </div>
)

const defaultApprovalMasterdata = {
  key: 'other',
  translations: {
    en: 'Others',
    th: 'อื่นๆ',
  },
}

export const ManualApproveModal: FC<ManualApproveModalProps> = ({
  flow,
  status,
  onCloseModal,
  onApproved,
  masterdata = [],
}) => {
  const { i18n, t } = useTranslation()
  const { userInfo, updateBackgroundCheck } = useCaseKeeperContext()

  const [reasons, setReasons] = useState<string[]>([])
  const [customMasterdata, setCustomMasterdata] = useState<Masterdata>()
  const [isRequired, setIsRequired] = useState(false)

  const updateApproval = useCallback(
    async (reasons: string[] = [], customMasterdata?: Masterdata) => {
      try {
        if (!flow?.backgroundCheckId) return
        const filteredReason = reasons
          .map((r) =>
            r === defaultApprovalMasterdata.key
              ? customMasterdata
              : masterdata?.find((m) => m.key === r)
          )
          .filter((r) => r) as Masterdata[]

        await updateBackgroundCheck(flow.backgroundCheckId, {
          approvalStatus: status,
          approvalRemark: {
            reasons: filteredReason,
          },
        })
      } catch (err) {
        console.error(err)
      }
    },
    [flow?.backgroundCheckId, masterdata, status, updateBackgroundCheck]
  )

  const onSubmit = useCallback(async () => {
    if (
      reasons.includes(defaultApprovalMasterdata.key) &&
      !customMasterdata?.key
    ) {
      setIsRequired(true)
      return
    }
    await updateApproval(reasons, customMasterdata)
    onApproved()
  }, [customMasterdata, onApproved, reasons, updateApproval])

  const handleCheckboxChange = useCallback((selectedReason: string) => {
    if (selectedReason?.includes(defaultApprovalMasterdata.key))
      setIsRequired(false)
    setReasons((prevReasons) => {
      if (prevReasons.includes(selectedReason)) {
        return prevReasons.filter((reason) => reason !== selectedReason)
      }
      return [...prevReasons, selectedReason]
    })
  }, [])

  const onChangeText = useCallback((e) => {
    setIsRequired(false)
    const { value } = e.target
    setCustomMasterdata({
      key: value,
      translations: {
        th: value,
        en: value,
      },
    })
  }, [])

  const displayedUsername = useMemo(
    () =>
      joinStrings([userInfo?.firstName, userInfo?.lastName]) ||
      userInfo?.username,
    [userInfo]
  )

  return (
    <Modal
      onCancel={onCloseModal}
      onConfirm={onSubmit}
      confirmButtonClassName={classNames(
        'text-white',
        status === BackgroundApprovalStatus.APPROVED
          ? 'btn-success'
          : 'btn-error'
      )}
      isConfirmButtonDisabled={false}
      modalClass="sm:!w-[500px] !pt-5"
    >
      <div className="w-full pb-2">
        <div className="pb-6">
          <p className="font-bold pb-2">
            {t(`manualApprove.confirmModal.${status}.title`)}
          </p>
          <p className="text-sm">
            {t(`manualApprove.confirmModal.${status}.confirmBy`)}
            {displayedUsername ?? '-'}
          </p>
        </div>
        <p className="font-bold pb-4">
          {t(`manualApprove.confirmModal.${status}.remarkTitle`)}
        </p>
        <div className="flex flex-col gap-4">
          {[...masterdata, defaultApprovalMasterdata]?.map(
            (reason: Masterdata) => {
              const label = getMasterdataTranslation(reason, i18n.language)
              const { key } = reason
              return (
                <Checkbox
                  key={key}
                  label={label}
                  checked={reasons.includes(key)}
                  onChange={() => handleCheckboxChange(key)}
                />
              )
            }
          )}
          <div className="ml-9 flex flex-col">
            <input
              type="text"
              onChange={onChangeText}
              disabled={!reasons.includes(defaultApprovalMasterdata.key)}
              className={classNames(
                'text-sm rounded-md flex-1 p-1 w-4/5 input border',
                'border-neutral/20'
              )}
            />
            {isRequired && (
              <span className="text-error pl-2 text-xs">
                {t('validation.required')}
              </span>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}
