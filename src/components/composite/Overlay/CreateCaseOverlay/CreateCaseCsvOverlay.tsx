import papaparse from 'papaparse'
import { Trans, useTranslation } from 'react-i18next'
import { read as readExcel, utils as xlsxUtils } from 'xlsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useCallback, useMemo } from 'react'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import { replaceQuotesCSVField } from 'utils/common'
import { FileUpload } from 'components/base'
import ExcelIcon from 'assets/svg/icon-excel.svg?react'
import { downloadSpreadSheet } from 'utils/download'
import { useTenantConfigContext } from 'context/TenantConfigContext'
import {
  CSVResults,
  getSpreadsheetSampleDataByClient,
  parseCSVToFlowInput,
  parseXLSXToFlowInput,
} from 'utils/template'
import { ValidatedImportSpreadsheet } from 'types/generic'
import { useModal } from 'hooks/useModal'
import { SpreadsheetMimetype } from 'types/generic/spreadsheet'
import { routes } from 'config/routes'
import { Dialog } from '../../Dialog'

const exportFileNameCSV = 'upload-cases-example.csv'
const exportFileNameXLSX = 'upload-cases-example.xlsx'
interface CreateCaseCsvOverlayProps {
  onClosePopup: () => void
  onSubmit: (result: ValidatedImportSpreadsheet) => void
}
export const CreateCaseCsvOverlay: React.FC<CreateCaseCsvOverlayProps> = ({
  onClosePopup,
  onSubmit,
}) => {
  const { t } = useTranslation()
  const { client } = useTenantConfigContext()
  const modal = useModal()

  const sampleData = useMemo(
    () => getSpreadsheetSampleDataByClient(client),
    [client]
  )

  const exportFile = useCallback(
    (type: SpreadsheetMimetype, fileName) =>
      downloadSpreadSheet(sampleData, fileName, type),
    [sampleData]
  )

  const onExportCSV = useCallback(
    () => exportFile('text/csv', exportFileNameCSV),
    [exportFile]
  )
  const onExportXLSX = useCallback(
    () => exportFile('application/vnd.ms-excel', exportFileNameXLSX),
    [exportFile]
  )

  const handleError = useCallback(
    (error) => {
      if (!(error instanceof Error)) return
      modal.render({
        onConfirm: modal.destroy,
        content: (
          <Dialog
            title={t(error.message)}
            message={t('createCaseCsv.invalidDescription')}
          />
        ),
      })
    },
    [modal, t]
  )

  const onImport = useCallback(
    async (file) => {
      if (file.type === 'text/csv') {
        papaparse.parse(file, {
          header: true,
          transform: replaceQuotesCSVField,
          complete: (res: CSVResults) => {
            try {
              const results = parseCSVToFlowInput(res, client)
              onSubmit(results)
            } catch (err) {
              handleError(err)
            }
          },
        })
        return
      }
      const arrayFileBuffer = await file.arrayBuffer()
      const workbook = readExcel(arrayFileBuffer, { type: 'buffer' })
      const xlsxData: Record<string, string>[] = xlsxUtils.sheet_to_json(
        workbook.Sheets[workbook.SheetNames[0]]
      )
      try {
        const xlsxResults = parseXLSXToFlowInput(xlsxData, client)
        onSubmit(xlsxResults)
      } catch (err) {
        handleError(err)
      }
    },
    [client, handleError, onSubmit]
  )

  return (
    <Dialog
      title={t('createCaseCsv.title')}
      cancelButtonLabel={t('generic.cancel')}
      titleIconImg={<FontAwesomeIcon icon={faXmark} onClick={onClosePopup} />}
      className="h-fit w-full max-h-lg max-w-lg text-base-content"
      message={t('createCaseCsv.description')}
      messageClass="font-light text-sm"
    >
      <div className="flex-1 flex flex-col space-y-2">
        <FileUpload
          acceptFileTypes={{
            'text/csv': ['.csv'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
              ['.xlsx'],
          }}
          onDrop={(files: File[]) => {
            if (!files?.length) return
            const file = files[0]
            onImport(file)
          }}
        />
        <div className="flex flex-row justify-between p-5 rounded-xl my-1 bg-base-200">
          <div className="flex flex-col items-start space-y-2 pr-8">
            <div className="flex flex-row space-x-3 items-center justify-center">
              <ExcelIcon className="mt-0.5" />
              <p className="font-bold text-xs">
                {t('createCaseCsv.exampleFile.title')}
              </p>
            </div>
            <p className="text-2xs font-light">
              {t('createCaseCsv.exampleFile.description')}
            </p>
            <Link
              to={routes.guide}
              target="_blank"
              className="text-error underline text-xs"
            >
              {t('createCaseCsv.exampleFile.instruction')}
            </Link>
          </div>
          <div className="flex flex-col justify-center px-3 space-y-2">
            <button
              type="button"
              className={classNames(
                'btn btn-md shadow-md w-20 h-10 text-2xs font-light bg-white border',
                'border-gray-200'
              )}
              onClick={onExportXLSX}
            >
              <Trans>{t('generic.downloadXLSX')}</Trans>
            </button>
            <button
              type="button"
              className={classNames(
                'btn btn-md shadow-md w-20 h-10 text-2xs font-light bg-white border',
                'border-gray-200'
              )}
              onClick={onExportCSV}
            >
              <Trans>{t('generic.downloadCSV')}</Trans>
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  )
}
