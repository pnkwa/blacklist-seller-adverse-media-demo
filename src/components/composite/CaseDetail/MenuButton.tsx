import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import classNames from 'classnames'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Flow, Event } from 'types/caseKeeperCore'
import ArrowNextIcon from 'assets/svg/icon-chevron-right.svg?react'
import TrashIcon from 'assets/svg/trash-icon.svg?react'
import DownloadIcon from 'assets/svg/icon-download.svg?react'
import BatchIcon from 'assets/svg/icon-batch.svg?react'
import useOnClickOutside from 'hooks/useOnClickOutside'
import { SVGAssetComponent } from 'types/generic'
import { useCaseKeeperContext } from 'context/CaseKeeperContext'
import { downloadSpreadSheet } from 'utils/download'
import { dateFormats } from 'config/dateFormats'
import { sortByKey } from 'utils/common'
import { sendLinkReportMapping } from 'helpers/export'
import { useModal } from 'hooks/useModal'
import { routes } from 'config/routes'
import { checkPermissions } from 'utils/permission'
import { deleteFlowPrms } from 'config/permission'
import { BackgroundCheckStatus } from 'types/bgcCore'
import { Dialog } from '../Dialog'
import { ResendLinkButton } from '../FlowTable/ResendLinkButton'
import { Tag } from '../InputTag'
import TagModal from '../Modal/Tags'

interface MenuButtonProps {
  flow: Flow
  className?: string
}

const MenuItem: FC<{
  onClick: () => void
  disabled?: boolean
  Icon: SVGAssetComponent
  label: string
  hidden?: boolean
}> = ({ onClick, Icon, label, disabled, hidden }) => (
  <li hidden={hidden}>
    <button
      type="submit"
      className={classNames(
        'm-1 btn btn-sm btn-ghost font-normal justify-start',
        'shadow-none h-12 pt-4 items-center disabled:bg-transparent'
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon className="h-[14px] w-[14px]" />
      <span>{label}</span>
    </button>
  </li>
)

interface MenuTagItemProps {
  flow: Flow
  label: string
}

const MenuTagItem: FC<MenuTagItemProps> = ({ flow, label }) => {
  const modal = useModal()
  const [flowState, setFlowState] = useState(flow)

  const onOpenTagPopup = useCallback(() => {
    modal.renderElement(
      <TagModal
        closeModal={() => modal.destroy()}
        flow={flowState}
        label={label}
        setFlowState={setFlowState}
      />
    )
  }, [flowState, label, modal])

  useEffect(() => {
    setFlowState(flow)
  }, [flow])

  return (
    <li>
      <button
        className={classNames('flex flex-wrap gap-2 rounded p-3 m-1')}
        type="submit"
        onClick={onOpenTagPopup}
      >
        <div className="flex gap-2 w-full items-center">
          <BatchIcon className="h-[14px] w-[14px]" />
          <span>
            {label} ({flowState?.tags?.length ?? 0})
          </span>
        </div>
        {!!flowState?.tags?.length && (
          <div
            className={classNames(
              'flex flex-wrap gap-2 overflow-y-auto max-h-60'
            )}
          >
            {flowState?.tags?.map((tag) => <Tag key={tag} text={tag} />)}
          </div>
        )}
      </button>
    </li>
  )
}

const MenuButton: FC<MenuButtonProps> = ({ flow, className }) => {
  const modal = useModal()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { fetchEvents, permissions, deleteFlow } = useCaseKeeperContext()

  const refButton = useRef<HTMLButtonElement>(null)
  const [isExpand, setIsExpand] = useState(false)

  useOnClickOutside(refButton, () => setIsExpand(false))

  const onDownloadSendLinkReportClick = useCallback(async () => {
    const { id } = flow || {}
    if (!id) return

    const flowEvents = await fetchEvents({
      'key-$in': 'flow.created,flow.notification.sent',
      dataId: id,
    })

    const currentTime = moment().format(dateFormats.compactISODate)
    downloadSpreadSheet(
      (flowEvents.data as Event<Flow>[])
        .sort(sortByKey('createdAt'))
        ?.map(sendLinkReportMapping),
      `${currentTime}_Send_Link_Log.csv`,
      'text/csv'
    )
  }, [fetchEvents, flow])

  const onConfirmDelete = useCallback(async () => {
    try {
      modal.render({
        onConfirm: async () => {
          await deleteFlow(flow.id)
          return navigate(routes.backgroundCheck)
        },
        content: (
          <>
            <div className="font-semibold text-xl pb-4">
              {t('caseDetail.menuButton.deletePopup.title')}
            </div>
            <div>{t('caseDetail.menuButton.deletePopup.subTitle')}</div>
          </>
        ),
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      modal.render({
        onConfirm: () => modal.destroy(),
        cancelButtonClassName: 'hidden',
        content: <Dialog title={t(`generic.${e.message}`)} />,
      })
    }
  }, [deleteFlow, flow.id, modal, navigate, t])

  const canDeleteFlow = useMemo(
    () => checkPermissions(deleteFlowPrms, permissions),
    [permissions]
  )

  const isDisabledDeleteButton = useMemo(
    () =>
      flow.backgroundCheck?.status === BackgroundCheckStatus.PENDING_OPERATION,
    [flow.backgroundCheck?.status]
  )

  return (
    <div className="dropdown dropdown-end">
      <button
        ref={refButton}
        tabIndex={0}
        onClick={() => !isExpand && setIsExpand(!isExpand)}
        type="button"
        className={classNames(
          'btn btn-primary btn-outline bg-base-100 flex-nowrap font-normal pr-3',
          className
        )}
      >
        {t('caseDetail.menuButton.title')}
        <ArrowNextIcon
          className={classNames(isExpand ? '-rotate-90' : 'rotate-90')}
        />
      </button>
      <ul className="dropdown-content menu bg-base-100 sm:w-60 rounded-lg shadow-xl w-[calc(100vw-2rem)]">
        <MenuTagItem label={t('caseDetail.menuButton.tag')} flow={flow} />
        <MenuItem
          onClick={onDownloadSendLinkReportClick}
          Icon={DownloadIcon}
          label={t('caseDetail.menuButton.sendHistory')}
        />
        <li>
          <ResendLinkButton
            flow={flow}
            classNameBtn="m-1 justify-start items-center shadow-none h-12 pt-4 disabled:bg-transparent"
          />
        </li>
        <MenuItem
          onClick={onConfirmDelete}
          Icon={TrashIcon}
          hidden={!canDeleteFlow}
          label={t('caseDetail.menuButton.delete')}
          disabled={isDisabledDeleteButton}
        />
      </ul>
    </div>
  )
}

export default MenuButton
