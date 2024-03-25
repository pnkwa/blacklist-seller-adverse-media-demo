import React from 'react'
import classNames from 'classnames'
import {
  ConfirmCancelButton,
  ConfirmCancelButtonProps,
} from './ConfirmCancelButton'
import { OverlayEffect } from './Overlay/OverlayEffect'

export interface ModalProps extends ConfirmCancelButtonProps {
  content?: React.ReactNode
  children?: React.ReactNode
  modalClass?: string
  buttonClassName?: string
}

export const Modal = ({
  children,
  content,
  modalClass,
  buttonClassName,
  ...buttonProps
}: ModalProps) => {
  return (
    <OverlayEffect isShow>
      <div
        className={classNames(
          'modal-content mx-4 px-6 pt-8 pb-5 bg-base-100 max-w-xl text-base-content rounded-3xl overflow-hidden',
          modalClass
        )}
      >
        {content}
        {children}
        <ConfirmCancelButton
          className={classNames('pt-8', buttonClassName)}
          {...buttonProps}
        />
      </div>
    </OverlayEffect>
  )
}
