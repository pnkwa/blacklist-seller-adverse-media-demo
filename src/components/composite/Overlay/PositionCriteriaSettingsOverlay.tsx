import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { overlayButtonAction } from 'actions'
import { closeOverlay, getOverlayProps } from 'reducers'
import { useModal } from 'hooks/useModal'
import {
  getPositionCriteriaMapping,
  validateCriteriaMapping,
} from 'utils/criteria'
import { getMasterdataTranslation } from 'utils/translations'
import { PositionConfig } from 'types/tenantConfig'
import { Dialog } from '../Dialog'
import { WarningConfirmModal } from '../Modal/WarningConfirmModal'
import { CriteriaForm } from '../Settings/Criteria/CriteriaForm'
import { CriteriaSettingsLabel } from '../Settings/Criteria/CriteriaSettingsLabel'

export const PositionCriteriaSettingsOverlay: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const modal = useModal()
  const props = useSelector(getOverlayProps)

  const positionConfig = props.positionConfig as PositionConfig

  const [criteriaMapping, setCriteriaMapping] = useState(() =>
    getPositionCriteriaMapping(positionConfig)
  )
  const [edited, setEdited] = useState(false)

  const onCancel = useCallback(() => {
    const exit = () => {
      dispatch(overlayButtonAction({ confirmed: false }))
      dispatch(closeOverlay())
      modal.destroy()
    }

    if (edited)
      modal.renderElement(
        <WarningConfirmModal
          title={t('settingsPage.criteria.positionOverlay.cancelTitle')}
          subTitle={t('settingsPage.criteria.positionOverlay.cancelSubTitle')}
          modalClass="!max-w-[24rem]"
          onCancel={() => modal.destroy()}
          onConfirm={exit}
        />
      )
    else exit()
  }, [dispatch, edited, modal, t])

  const onConfirm = useCallback(async () => {
    dispatch(overlayButtonAction({ confirmed: true, data: criteriaMapping }))
    dispatch(closeOverlay())
  }, [criteriaMapping, dispatch])

  return (
    <Dialog
      title={t('settingsPage.criteria.positionOverlay.title', {
        position: getMasterdataTranslation(positionConfig.position),
      })}
      className="max-w-4xl w-full text-base-content overflow-auto flex flex-col max-h-full"
      confirmButtonLabel={t('generic.save')}
      cancelButtonLabel={t('generic.cancel')}
      isConfirmButtonDisabled={
        !edited || !validateCriteriaMapping(criteriaMapping)
      }
      onConfirm={onConfirm}
      onCancel={onCancel}
      childClass="space-y-4 overflow-auto"
      btnWrapperClass="ml-auto w-full max-w-sm"
    >
      <CriteriaSettingsLabel />
      <CriteriaForm
        onChange={(v) => {
          setEdited(true)
          setCriteriaMapping(v)
        }}
        criteriaMapping={criteriaMapping}
        initialCriteriaMapping={getPositionCriteriaMapping(positionConfig)}
        className="flex-1"
      />
    </Dialog>
  )
}
