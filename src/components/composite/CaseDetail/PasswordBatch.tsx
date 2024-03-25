import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { FC, useCallback, useMemo, useRef, useState } from 'react'
import { TooltipBox } from 'components/base/TooltipBox'
import { useOnClickOutside } from 'hooks/clickOutside'
import { BackgroundCheck } from 'types/bgcCore'
import ClipboardIcon from 'assets/svg/icon-clipboard.svg?react'
import { copyToClipboard } from 'utils/clipboard'
import { MessageType } from 'components/base/Message'
import { useMessage } from 'hooks/message'
import { DocumentPasswordConfig } from 'config/documentPasswordConfig'

interface PasswordDocumentProps {
  backgroundCheck: BackgroundCheck
  configs: DocumentPasswordConfig[]
}

export const PasswordBatch: FC<PasswordDocumentProps> = ({
  backgroundCheck,
  configs,
}) => {
  const { t } = useTranslation()
  const message = useMessage()
  const passwordRef = useRef<HTMLDivElement>(null)
  const [showPassword, setShowPassword] = useState<boolean>(false)

  useOnClickOutside(passwordRef, () => setShowPassword(false))

  const copyText = useCallback(
    async (text) => {
      if (!text) return
      try {
        await copyToClipboard(text)
        message.render({
          type: MessageType.Success,
          text: t('caseDetail.documentPasswords.copied'),
        })
      } catch (e) {
        message.render({
          type: MessageType.Error,
          text: (e as { message: string }).message,
        })
      }
    },
    [message, t]
  )

  const getDocumentPassword = useMemo(
    () =>
      configs.flatMap(
        ({ fileName, getDocuments }) =>
          getDocuments(backgroundCheck)?.map((item, index) => (
            <tr key={item?.id} className="border-b-0">
              <td className="text-left">{`${fileName}_${index + 1}`}</td>
              <td className="text-center pl-6">{item?.password ?? '-'}</td>
              {item?.password && (
                <td>
                  <button
                    type="button"
                    className={classNames(
                      'btn btn-ghost btn-sm w-8 h-8 text-gray-500 px-2',
                      'rounded-xl hover:bg-gray-300'
                    )}
                    onClick={() => copyText(item.password)}
                    aria-label="copy"
                  >
                    <ClipboardIcon />
                  </button>
                </td>
              )}
            </tr>
          )) ?? []
      ),
    [backgroundCheck, configs, copyText]
  )

  const hasDocuments = useMemo(
    () =>
      configs.some(({ getDocuments }) => getDocuments(backgroundCheck)?.length),
    [backgroundCheck, configs]
  )

  return (
    <TooltipBox
      show={showPassword}
      ref={passwordRef}
      tooltipClassName="rounded-lg !shadow-2xl !max-w-sm"
      tooltipContent={
        <div className="w-full overflow-scroll custom-scrollbar max-h-52">
          <table className="table table-sm table-pin-rows text-sm text-center">
            <thead>
              <tr className="text-base-content text-left">
                <th>{t('caseDetail.documentPasswords.fileName')}</th>
                <th className="text-left px-[25px]" colSpan={2}>
                  {t('caseDetail.documentPasswords.password')}
                </th>
              </tr>
            </thead>
            <tbody>
              {hasDocuments ? (
                getDocumentPassword
              ) : (
                <tr className="border-b-0">
                  <td className="text-center text-xs" colSpan={3}>
                    {t('caseDetail.documentPasswords.noFile')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      }
    >
      <div className="relative">
        <button
          className={classNames(
            'p-2 w-20 mt-[-8px] absolute  right-0 rounded-lg z-10 font-bold',
            'bg-opacity-10 bg-neutral capitalize text-xs text-center text-neutral',
            'lg:p-2 lg:w-max lg:mt-0 lg:right-0'
          )}
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setShowPassword((prev) => !prev)
          }}
        >
          {t('caseDetail.documentPasswords.title')}
        </button>
      </div>
    </TooltipBox>
  )
}
