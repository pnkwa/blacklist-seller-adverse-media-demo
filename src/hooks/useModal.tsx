import { useEffect } from 'react'
import { Modal, ModalProps } from 'components/composite/Modal'
import { useModalContext } from 'components/composite/Modal/ModalProvider'

// eslint-disable-next-line import/no-unused-modules
export interface ModalRenderProps extends ModalProps {
  closeOnAction?: boolean
}

export const useModal = () => {
  const { renderElement, destroy } = useModalContext()

  useEffect(destroy, [destroy])

  const render = ({ closeOnAction = true, ...config }: ModalRenderProps) => {
    renderElement(
      <Modal
        {...{
          ...config,
          onCancel: (e) => {
            if (config.onCancel) config.onCancel(e)
            if (closeOnAction) destroy()
          },
          onConfirm: (e) => {
            if (config.onConfirm) config.onConfirm(e)
            if (closeOnAction) destroy()
          },
        }}
      />
    )
  }

  return {
    renderElement,
    render,
    destroy,
  }
}
