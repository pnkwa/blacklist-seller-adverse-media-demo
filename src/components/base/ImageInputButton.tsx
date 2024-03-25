import { FC, useCallback } from 'react'
import { t } from 'i18next'
import { ActionButton } from 'components/composite/ActionButton'
import IconCamera from 'assets/svg/icon-camera.svg?react'
import { renderMessage } from 'hooks/message'
import { validateFileType } from 'utils/file'
import { MessageType } from './Message'

interface ImageInputButtonProps {
  onSelectImage: (file: File) => void
}

const acceptType = 'image/png'

const showError = (errorMessage: string) => {
  renderMessage({
    type: MessageType.Error,
    text: errorMessage,
    destroyOnClose: true,
  })
}

export const ImageInputButton: FC<ImageInputButtonProps> = ({
  onSelectImage,
}) => {
  const onChange = useCallback(
    (e: Event) => {
      const { files } = e.target as HTMLInputElement
      const file = files?.[0]
      if (!file) return
      const isValidFileType = validateFileType(file, acceptType)
      if (!isValidFileType) {
        showError(t('settingsPage.general.logoSetting.requiredType'))
        return
      }

      const img = new Image()
      img.onload = () => {
        if (img.width <= 500 && img.height <= 500) {
          onSelectImage(file)
        } else {
          showError(t('settingsPage.general.logoSetting.requiredLogo'))
        }
      }

      img.src = URL.createObjectURL(file)
    },
    [onSelectImage]
  )

  const selectImage = useCallback(() => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', acceptType)
    input.click()
    input.addEventListener('change', onChange)
  }, [onChange])

  return (
    <ActionButton
      text={t('settingsPage.general.logoSetting.changeImage')}
      btnClassName="p-2 border-2 border-black rounded-[10px] h-fit"
      contentClassName="justify-center"
      svgIcon={IconCamera}
      onClick={selectImage}
    />
  )
}
