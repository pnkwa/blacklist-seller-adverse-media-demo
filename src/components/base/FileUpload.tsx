import classNames from 'classnames'
import { Accept, useDropzone } from 'react-dropzone'
import { useTranslation } from 'react-i18next'
import DropFileIcon from 'assets/svg/icon-drop-file.svg?react'

interface FileUploadProps {
  onDrop?: (files: File[]) => void
  maxFiles?: number
  acceptFileTypes?: Accept
}
export const FileUpload: React.FC<FileUploadProps> = ({
  onDrop,
  maxFiles,
  acceptFileTypes,
}) => {
  const { t } = useTranslation()
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles,
    // TODO: Add file size limitation and popup warning
    // maxSize: 1000000,
    accept: acceptFileTypes,
  })

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <div
        className={classNames(
          'border border-gray-300 rounded-xl border-dotted flex flex-col items-center',
          'justify-center py-12 cursor-pointer hover:border-primary hover:bg-primary/10 duration-200'
        )}
      >
        <DropFileIcon className="text-primary" />
        <p className="text-xs">
          {t('fileUpload.drag')}
          <span className="font-bold underline ml-1">
            {t('fileUpload.click')}
          </span>
        </p>
      </div>
    </div>
  )
}
