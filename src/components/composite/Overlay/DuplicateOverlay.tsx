import moment from 'moment'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWarning, faXmark } from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames'
import { closeOverlay, getOverlayProps } from 'reducers'
import SendIcon from 'assets/svg/icon-send.svg?react'
import { Table } from 'components/base/Table'
import { duplicateTableSpecs } from 'specs/duplicateTableSpecs'
import { Flow, FlowInput } from 'types/caseKeeperCore'
import { BackgroundCheckStatus } from 'types/bgcCore'
import { logger } from 'utils/logger'
import { sortBackgroundCheckByKey } from 'utils/sort'
import { overlayButtonAction } from 'actions'
import { dateFormats } from 'config/dateFormats'
import { DuplicateFlow } from 'types/caseKeeperCore/duplicateFlow'
import { Order } from 'types/generic'
import { useModal } from 'hooks/useModal'
import { dateFormat } from 'utils/date'
import { ResendLinkButton } from '../FlowTable/ResendLinkButton'
import { Dialog } from '../Dialog'
import { WarningConfirmModal } from '../Modal/WarningConfirmModal'
import { ApplicantDetail } from './CreateCaseOverlay/CreateCaseResultOverlay'

const { OPEN, PENDING_CLIENT, PENDING_OPERATION, COMPLETED, VERIFIED } =
  BackgroundCheckStatus

const resendLinkStatuses = [OPEN, PENDING_CLIENT]

const reuseStatuses = [PENDING_OPERATION, COMPLETED, VERIFIED]

export const DuplicateOverlay = () => {
  const modal = useModal()
  const dispatch = useDispatch()

  const { t } = useTranslation()

  const [selectedFlow, setSelectedFlow] = useState<Flow>()
  const [sortOrder, setSortOrder] = useState<Order<Flow>>({ createdAt: 'DESC' })

  const overlayProps = useSelector(getOverlayProps)
  const { duplicates, initialFlow } = (overlayProps as DuplicateFlow) ?? {}

  const duplicateFlows = useMemo(() => {
    if (!Object.keys(sortOrder).length) return duplicates
    const key = Object.keys(sortOrder)[0]
    return duplicates
      ?.slice()
      ?.sort(sortBackgroundCheckByKey(key, sortOrder[key]))
  }, [duplicates, sortOrder])

  const latestDuplicateFlow = useMemo(
    () =>
      duplicates
        ?.filter((d) => d?.backgroundCheck?.createdAt)
        ?.sort(sortBackgroundCheckByKey('createdAt'))[0],
    [duplicates]
  )

  const isDisabled = useCallback(
    (requiredStatus) => {
      if (!selectedFlow || !selectedFlow?.backgroundCheck?.status) return true
      return !requiredStatus.includes(selectedFlow?.backgroundCheck?.status)
    },
    [selectedFlow]
  )

  const onSkip = useCallback(() => {
    dispatch(overlayButtonAction({ confirmed: true }))
    dispatch(closeOverlay())
  }, [dispatch])

  const onCreateCase = useCallback(
    (flow: FlowInput) => {
      try {
        dispatch(overlayButtonAction({ confirmed: true, data: flow }))
        dispatch(closeOverlay())
      } catch (e) {
        logger.error(e)
      }
    },
    [dispatch]
  )

  const notifyData = useMemo(
    () => ({
      notifyType: initialFlow?.proprietor?.notifyType,
      inviteType: initialFlow?.proprietor?.notifyType,
      phoneNumber: initialFlow?.proprietor?.phoneNumber,
      email: initialFlow?.proprietor?.email,
    }),
    [initialFlow]
  )

  const onReuse = useCallback(() => {
    if (!selectedFlow) return
    const body = {
      ...initialFlow,
      proprietor: {
        id: selectedFlow?.proprietorId,
        ...notifyData,
      },
      verification: {
        id: selectedFlow?.verificationId,
        ...notifyData,
      },
    }
    onCreateCase(body)
  }, [selectedFlow, initialFlow, notifyData, onCreateCase])

  const onCreateNew = useCallback(() => {
    const body = {
      ...initialFlow,
      proprietor: {
        id: selectedFlow
          ? selectedFlow?.proprietorId
          : latestDuplicateFlow?.proprietorId,
        ...notifyData,
      },
    }
    onCreateCase(body)
  }, [
    initialFlow,
    selectedFlow,
    latestDuplicateFlow?.proprietorId,
    notifyData,
    onCreateCase,
  ])

  const onClosePopup = () => {
    modal.renderElement(
      <WarningConfirmModal
        title={t('duplicate.modal.title')}
        subTitle={t('duplicate.modal.subTitle')}
        confirmButtonLabel={t('generic.confirm')}
        cancelButtonLabel={t('createCaseForm.modal.cancelButton')}
        onCancel={() => modal.destroy()}
        onConfirm={() => {
          dispatch(overlayButtonAction({ confirmed: false }))
          dispatch(closeOverlay())
          modal.destroy()
        }}
      />
    )
  }

  return (
    <Dialog
      title={t('duplicate.title')}
      className="w-full max-w-4xl h-full"
      childClass="overflow-hidden"
      titleIconImg={<FontAwesomeIcon icon={faXmark} onClick={onClosePopup} />}
    >
      <div
        className={classNames(
          'flex-1 block sm:flex flex-col h-full overflow-y-auto overflow-x-hidden',
          'space-y-4'
        )}
      >
        <div className="flex sm:flex-col flex-col-reverse sm:space-y-4">
          <ApplicantDetail applicant={overlayProps?.initialFlow?.proprietor} />
          <div
            className={classNames(
              'flex items-center space-x-4 p-4 bg-error/10 border border-error',
              'rounded-xl mb-4'
            )}
          >
            <FontAwesomeIcon icon={faWarning} className="h-5 text-error" />
            <div className="text-xs text-error space-y-2">
              <p className="font-bold">
                {t('duplicate.warning.title', {
                  date: dateFormat(
                    latestDuplicateFlow?.backgroundCheck?.createdAt,
                    dateFormats.dayMonthYear
                  ),
                  day: moment(
                    latestDuplicateFlow?.backgroundCheck?.createdAt
                  ).fromNow(),
                })}
              </p>
              <p className="font-normal">{t('duplicate.warning.subTitle')}</p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table
            key="duplicateTable"
            data={duplicateFlows}
            sortOrder={sortOrder}
            onSort={(order) => setSortOrder(order)}
            tableSpecs={duplicateTableSpecs(setSelectedFlow)}
            tableClassName="text-left"
          />
        </div>
      </div>
      <div className="pt-6 w-full flex sm:flex-row flex-col-reverse justify-between items-center">
        <button
          type="button"
          className={classNames(
            'sm:w-36 w-full btn btn-outline border-base-300 text-sm font-normal',
            '!shadow sm:m-0 mt-2'
          )}
          onClick={onSkip}
        >
          {t('duplicate.cancel')}
        </button>
        <div className="sm:w-fit w-full flex sm:flex-row flex-col-reverse sm:m-0">
          <div className="flex space-x-2 sm:m-0 mt-2">
            <button
              type="button"
              className="sm:w-36 flex-1 btn btn-primary text-sm font-normal"
              disabled={isDisabled(resendLinkStatuses)}
            >
              {selectedFlow && !isDisabled(resendLinkStatuses) ? (
                <ResendLinkButton
                  flow={selectedFlow}
                  onConfirm={onSkip}
                  classNameBtn="sm:w-36 btn-md !hover:bg-none shadow-none"
                />
              ) : (
                <>
                  <SendIcon />
                  <span>{t('resendLink.button')}</span>
                </>
              )}
            </button>
            <button
              type="submit"
              className="sm:w-32 flex-1 btn btn-primary text-sm font-normal"
              disabled={isDisabled(reuseStatuses)}
              onClick={onReuse}
            >
              {t('generic.reuse')}
            </button>
          </div>
          <button
            type="submit"
            className="sm:w-32 btn btn-primary text-sm font-normal sm:ml-2 m-0"
            onClick={onCreateNew}
          >
            {t('generic.createNew')}
          </button>
        </div>
      </div>
    </Dialog>
  )
}
