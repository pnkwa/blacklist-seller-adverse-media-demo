import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { overlayButtonAction } from 'actions'
import { closeOverlay } from 'reducers/ui'
import { Applicant, FlowInput } from 'types/caseKeeperCore'
import { getMasterdataTranslation } from 'utils/translations'
import { processesName } from 'config/processes'
import { parsePhoneNumber } from 'utils/string'
import { Dialog } from 'components/composite/Dialog'
import { NotifyType } from 'types/kycCore'

interface ApplicantDetailProps {
  applicant: Applicant
}

export const ApplicantDetail: React.FC<ApplicantDetailProps> = ({
  applicant,
}) => {
  const { t } = useTranslation()
  const {
    title,
    firstName,
    middleName,
    lastName,
    notifyType,
    phoneNumber,
    email,
  } = applicant

  const data = useMemo(
    () => [
      {
        label: t('createCaseForm.result.title'),
        value: getMasterdataTranslation(title) ?? '-',
      },
      {
        label: t('createCaseForm.result.name'),
        value: [firstName, middleName, lastName].join(' ') ?? '-',
      },
      {
        label: t('createCaseForm.result.address'),
        value:
          notifyType === NotifyType.EMAIL
            ? email
            : parsePhoneNumber(phoneNumber),
      },
    ],
    [email, firstName, lastName, middleName, notifyType, phoneNumber, t, title]
  )

  return (
    <div className="grid grid-cols-12 gap-y-4 gap-x-2">
      {data.map(({ label, value }) => (
        <div
          className="sm:col-span-4 col-span-6 text-xs sm:text-sm"
          key={label}
        >
          <p className="font-light text-base-content/50">{t(label)}</p>
          <p className="text-base-content whitespace-pre-line">{value}</p>
        </div>
      ))}
    </div>
  )
}

interface CreateCaseResultOverlayOverlayProps {
  flowInput?: FlowInput
  applicants: Applicant[]
  onCancel: () => void
  onClosePopup: () => void
}

export const CreateCaseResultOverlay: React.FC<
  CreateCaseResultOverlayOverlayProps
> = ({ flowInput, applicants, onCancel, onClosePopup }) => {
  const { t } = useTranslation()

  const dispatch = useDispatch()

  const requiredProcess = useMemo(
    () =>
      processesName.filter(
        (process) =>
          flowInput?.backgroundCheck?.processConfigs?.[process] ||
          flowInput?.verification?.[`${process}Config`]?.required
      ),
    [flowInput]
  )

  const onSubmit = useCallback(async () => {
    const inputs = applicants.map((applicant) => ({
      verification: {
        ...flowInput?.verification,
        notifyType: applicant.notifyType,
        email: applicant.email,
        phoneNumber: applicant.phoneNumber,
      },
      backgroundCheck: {
        ...flowInput?.backgroundCheck,
        verificationInfo: {
          position: flowInput?.position,
          department: applicant.department
            ? {
                translations: {
                  en: applicant.department,
                  th: applicant.department,
                },
              }
            : undefined,
          baseSalary: Number(applicant.baseSalary) || undefined,
        },
      },
      proprietor: {
        ...applicant,
      },
      flowName: flowInput?.flowName,
      packageCode: flowInput?.packageCode,
    })) as FlowInput[]
    dispatch(overlayButtonAction({ confirmed: true, data: { inputs } }))
    dispatch(closeOverlay())
  }, [applicants, dispatch, flowInput])

  return (
    <Dialog
      title={t('createCaseForm.result.header')}
      confirmButtonLabel={t('createCaseForm.result.confirm')}
      cancelButtonLabel={t('generic.back')}
      titleIconImg={<FontAwesomeIcon icon={faXmark} onClick={onClosePopup} />}
      className="h-full w-full max-w-xl"
      messageClass="text-sm font-light"
      childClass="overflow-hidden"
      onConfirm={onSubmit}
      onCancel={onCancel}
    >
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4 border-b pb-4 mb-4 text-sm sm:text-md">
          <span className="font-bold pr-2">
            {t('createCaseForm.result.inspection')}
          </span>
          <span className="font-medium">
            {t('createCaseForm.result.inspectionNumber', {
              count: requiredProcess.length,
            })}
          </span>
          <ol className="list-decimal list-inside space-y-2 pl-4">
            {requiredProcess.map((process) => (
              <li className="font-light" key={process}>
                {t(`createCaseForm.labels.${process}`)}
              </li>
            ))}
          </ol>
        </div>
        <div className="space-y-4">
          <div className="text-sm sm:text-md">
            <span className="font-bold pr-2">
              {t('createCaseForm.result.applicant')}
            </span>
            <span className="font-medium">
              {t('createCaseForm.result.applicantNumber', {
                count: applicants?.length,
              })}
            </span>
          </div>
          {applicants &&
            applicants.map((applicant, index) => (
              <ApplicantDetail
                applicant={applicant}
                key={`applicant-${index}`}
              />
            ))}
        </div>
      </div>
    </Dialog>
  )
}
