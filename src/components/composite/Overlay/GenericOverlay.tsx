import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { overlayButtonAction } from 'actions'
import { closeOverlay, getOverlayProps } from 'reducers'
import { Dialog } from '../Dialog'

export const GenericOverlay = () => {
  const props = useSelector(getOverlayProps)
  const {
    title,
    message,
    okButtonText,
    withCancel,
    closeOnAction = true,
    onOK,
    onCancel,
    ...rest
  } = props ?? {}
  const { t } = useTranslation()
  const dispatch = useDispatch()

  return (
    <Dialog
      title={t(title)}
      message={t(message)}
      confirmButtonLabel={t(okButtonText)}
      onConfirm={() => {
        onOK?.()
        dispatch(overlayButtonAction({ confirmed: true }))
        if (closeOnAction) dispatch(closeOverlay())
      }}
      onCancel={
        withCancel
          ? () => {
              onCancel?.()
              dispatch(overlayButtonAction({ confirmed: false }))
              if (closeOnAction) dispatch(closeOverlay())
            }
          : undefined
      }
      {...rest}
    />
  )
}
