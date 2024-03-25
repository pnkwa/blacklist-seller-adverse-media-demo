import { useTranslation } from 'react-i18next'
import { useCallback, useMemo } from 'react'
import classNames from 'classnames'
import { getTitleData } from 'masterdata'
import { useTenantConfigContext } from 'context/TenantConfigContext'
import { PageContentLayout } from 'components/composite/MainLayout/PageContentLayout'
import GuideLogo from 'assets/svg/guide.svg?react'
import { getSpreadsheetSampleDataByClient } from 'utils/template'
import { useMessage } from 'hooks/message'
import { MessageType } from 'components/base/Message'
import { SplitTable } from 'components/base/SplitTable'
import { getTableSpecMaster } from 'specs/guideTableSpecs'
import { copyToClipboard } from 'utils/clipboard'
import ExampleCsv from 'assets/example-csv.png'

const GuidePage = () => {
  const message = useMessage()
  const { t } = useTranslation()
  const { client } = useTenantConfigContext()

  const templates = client.backgroundCheckDashboardConfig?.positions

  const titleCodes = useMemo(() => getTitleData('titles', client), [client])

  const caseTypes = useMemo(
    () => Object.keys(templates ?? {})?.map((key) => templates?.[key].position),
    [templates]
  )

  const fieldsRequiredList = useMemo(
    () => getSpreadsheetSampleDataByClient(client)[0],
    [client]
  )

  const showCopiedMessage = useCallback(
    async (key: string) => {
      try {
        await copyToClipboard(key)
        message.destroy()
        message.render({
          type: MessageType.Success,
          text: t('guide.copied'),
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

  return (
    <PageContentLayout>
      <div className="w-full p-3 bg-base-100 rounded-lg flex justify-center">
        <div
          className={classNames(
            'mt-4 space-y-4 text-center flex-1 w-full',
            `max-w-[800px]`
          )}
        >
          <h1 className="font-bold">{t('guide.title')}</h1>
          <GuideLogo className="mx-auto" />
          <span className={classNames('whitespace-pre-line text-xs')}>
            {t('guide.subTitle')}
          </span>
          <h1 className="font-bold text-start"> {t('guide.header')}</h1>
          <img alt="Example csv" className="py-2" src={ExampleCsv} />
          <span className="whitespace-pre-line text-xs">
            {t('guide.subHeader')}
          </span>
          <div className="overflow-auto flex-1">
            <div
              className={classNames(
                'border-2 whitespace-pre-line text-xs bg-violet-100 space-y-2',
                'p-4 rounded-lg text-start min-w-[700px]'
              )}
            >
              {Object.keys(fieldsRequiredList).map((key) => (
                <div className="grid grid-cols-6" key={key}>
                  <span className="font-bold capitalize">{key}</span>
                  <span className="font-normal col-span-3">
                    {t(`guide.infoRequired.${key}`)}
                  </span>
                  <span className="flex col-span-2">
                    <b>{t('guide.example')}&nbsp;&nbsp;</b>
                    {fieldsRequiredList[key]}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center my-8">
            <span className="whitespace-pre-line text-xs">
              {t('guide.description')}
            </span>
          </div>
          <SplitTable
            title="guide.position"
            data={caseTypes}
            tableSpecs={getTableSpecMaster({
              header: 'position',
              onClick: showCopiedMessage,
            })}
            tdClassName="w-[50%]"
            theadClassName="rounded-lg text-base-100"
          />
          <SplitTable
            title="guide.titleCode"
            data={titleCodes}
            tableSpecs={getTableSpecMaster({
              header: 'titleCode',
              onClick: showCopiedMessage,
            })}
            tdClassName="w-[50%]"
            theadClassName="rounded-lg text-base-100"
          />
        </div>
      </div>
    </PageContentLayout>
  )
}

export default GuidePage
