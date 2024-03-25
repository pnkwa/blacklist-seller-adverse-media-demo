import { FC, useCallback, useMemo } from 'react'
import { OptionProps, components } from 'react-select'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useTenantConfigContext } from 'context/TenantConfigContext'
import { processesName } from 'config/processes'
import { FlowInput } from 'types/caseKeeperCore'
import { PositionOption, getPositionOptions } from 'utils/form'
import { Dropdown } from 'components/base/Dropdown'
import DiamondBadgeIcon from 'assets/svg/diamond-badge.svg?react'
import { useLead } from 'hooks/useLead'
import { Dialog } from '../../Dialog'

const { Option } = components

const OptionWithIcon = (props: OptionProps<PositionOption>) => {
  const { data } = props
  const { label, value } = data
  const alias = value?.leadAlias

  return (
    <Option {...props}>
      <div className="flex flex-row items-center">
        {alias && <DiamondBadgeIcon className="h-7 ml-[-1%] mr-1" />}
        {label}
      </div>
    </Option>
  )
}

interface ChoosePositionOverlayProps {
  flowInput?: FlowInput
  onChange: (e) => void
  onConfirm: () => void
  onCancel: () => void
  onClosePopup: () => void
}

export const ChoosePositionOverlay: FC<ChoosePositionOverlayProps> = ({
  flowInput,
  onChange,
  onConfirm,
  onCancel,
  onClosePopup,
}) => {
  const { t } = useTranslation()
  const { client } = useTenantConfigContext()
  const { onFindAndShowLead } = useLead()

  const options = useMemo(() => getPositionOptions(client), [client])

  const onChangeCase = useCallback(
    (e: PositionOption) => {
      if (e.value !== flowInput) {
        if (e.value?.leadAlias) {
          onFindAndShowLead(e.value.leadAlias)
          onChange(undefined)
        } else onChange(e.value)
      }
    },
    [flowInput, onChange, onFindAndShowLead]
  )

  const requiredProcess = useMemo(
    () =>
      processesName.filter(
        (process) =>
          flowInput?.backgroundCheck?.processConfigs?.[process] ||
          flowInput?.verification?.[`${process}Config`]?.required
      ),
    [flowInput]
  )

  const selectedPosition = useMemo(() => {
    if (!flowInput) return null
    const option = options.find(({ value }) => flowInput === value)
    return {
      label: option?.label,
      value: option?.value,
    }
  }, [flowInput, options])

  return (
    <Dialog
      title={t('createCaseForm.title')}
      titleIconImg={<FontAwesomeIcon icon={faXmark} onClick={onClosePopup} />}
      message={t('createCaseForm.choosePosition')}
      messageClass="text-sm font-light"
      className="h-full w-full max-w-xl text-base-content"
      confirmButtonLabel={t('generic.next')}
      cancelButtonLabel={t('generic.back')}
      isConfirmButtonDisabled={!flowInput}
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      <div className="flex-1 flex flex-col">
        <Dropdown
          className="text-sm w-full z-50"
          placeholder={t('createCaseForm.labels.selectPosition')}
          menuPosition="fixed"
          value={selectedPosition}
          options={options}
          onChange={onChangeCase}
          components={{
            Option: OptionWithIcon,
          }}
        />
        {flowInput ? (
          <div className="flex-1 space-y-4 pt-6 overflow-y-auto top-0  whitespace-normal">
            <p className="text-sm font-bold">
              {t('createCaseForm.labels.recommendedProcess', {
                count: requiredProcess.length,
              })}
            </p>
            {requiredProcess.map((process) => (
              <p className="label-text pl-2" key={process}>
                {t(`createCaseForm.labels.${process}`)}
              </p>
            ))}
          </div>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </Dialog>
  )
}
