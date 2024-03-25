import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames'
import ManualCreateCaseIcon from 'assets/svg/icon-manual-create-case.svg?react'
import CsvCreateCaseIcon from 'assets/svg/icon-csv-create-case.svg?react'
import { Dialog } from '../../Dialog'
import { CreateCaseProcess } from './types'

enum CreateType {
  MANUAL_INPUT = 'manualInput',
  CSV_INPUT = 'csvInput',
}

interface CreateCaseTypeProps {
  type: string
  icon: React.ReactElement
  onClick?: () => void
}

const CreateCaseType: React.FC<CreateCaseTypeProps> = ({
  type,
  icon,
  onClick,
}) => {
  const { t } = useTranslation()

  return (
    <button
      type="button"
      className={classNames(
        'btn btn-outline border-base-300 rounded-3xl shadow-xl shadow-black/5',
        'flex flex-col w-[15rem] h-[15rem] whitespace-normal'
      )}
      onClick={onClick}
    >
      <div className="h-1/2">{icon}</div>
      <h3 className="text-sm font-bold">
        {t(`createCaseForm.types.${type}.title`)}
      </h3>
      <p className="text-xs font-light">
        {t(`createCaseForm.types.${type}.subTitle`)}
      </p>
    </button>
  )
}

interface CreateCaseTypeOverlayProps {
  onConfirm: (createCaseProcess: CreateCaseProcess) => void
  onClosePopup: () => void
}

export const CreateCaseTypeOverlay: React.FC<CreateCaseTypeOverlayProps> = ({
  onConfirm,
  onClosePopup,
}) => {
  const { t } = useTranslation()

  const createCaseType = useMemo(
    () => [
      {
        key: CreateType.MANUAL_INPUT,
        icon: <ManualCreateCaseIcon />,
        onClick: () => onConfirm(CreateCaseProcess.CHOOSE_POSITION),
      },
      {
        key: CreateType.CSV_INPUT,
        icon: <CsvCreateCaseIcon />,
        onClick: () => onConfirm(CreateCaseProcess.IMPORT_FILE),
      },
    ],
    [onConfirm]
  )

  return (
    <Dialog
      title={t('createCaseForm.title')}
      titleIconImg={<FontAwesomeIcon icon={faXmark} onClick={onClosePopup} />}
      message={t('createCaseForm.types.manualInput.header')}
      messageClass="text-sm font-light text-gray-500"
      className="max-w-xl text-base-content"
      confirmButtonLabel={t('generic.next')}
      cancelButtonLabel={t('generic.back')}
    >
      <div className="flex justify-between items-center gap-x-6">
        {createCaseType.map(({ key, icon, onClick }) => (
          <CreateCaseType key={key} type={key} icon={icon} onClick={onClick} />
        ))}
      </div>
    </Dialog>
  )
}
