import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { faFile } from '@fortawesome/free-solid-svg-icons'
import { Loading } from 'components/base'
import { isAbortError } from 'utils/error'
import { logger } from 'utils/logger'
import { handleJsonResponse } from 'utils/fetch'
import { env } from 'config/env'
import { downloadBlobFromUrl } from 'utils/download'
import { ActionButton } from '../ActionButton'

const DocumentationItem: FC<{ id: string; fileName: string }> = ({
  id,
  fileName,
}) => {
  const abortControllerRef = useRef<AbortController | null>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const onClick = useCallback(async () => {
    try {
      setError(false)
      setLoading(true)
      abortControllerRef.current?.abort()
      abortControllerRef.current = new AbortController()
      const url = `${env.TENANT_CONFIG_ASSETS_URL}/assets/${id}`
      await downloadBlobFromUrl(url, fileName).catch(console.error)
      setLoading(false)
    } catch (err) {
      if (isAbortError(err)) return
      setError(true)
      setLoading(false)
      logger.error(err)
    }
  }, [fileName, id])

  return (
    <ActionButton
      key={id}
      faIcon={faFile}
      text={fileName}
      onClick={onClick}
      onRightIconClick={onClick}
      loading={loading}
      error={error}
    />
  )
}

export const Documentation: FC = () => {
  const { t } = useTranslation()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [files, setFiles] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const data = await fetch(
        // eslint-disable-next-line max-len
        `${env.TENANT_CONFIG_URL}/items/background_check_dashboard_settings?fields=help_documents.directus_files_id.*`,
        { headers: { 'x-accept-case': 'camelCase' } }
      )
        .then(handleJsonResponse)
        .then((data) =>
          (data?.data?.helpDocuments || []).map((item) => item?.directusFilesId)
        )
      setFiles(data)
    } catch (err) {
      logger.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  return (
    <div className="flex-1 pt-6 space-y-6 text-xs sm:text-sm text-base-content overflow-y-auto">
      {loading && <Loading className="h-full" />}
      {!loading && files?.length ? (
        <>
          <p>{t('helpPage.documentation.descriptions')}</p>
          <p className="font-bold">
            {t('helpPage.documentation.downloadFiles')}
          </p>
          <div>
            {files.map((item) => (
              <DocumentationItem
                key={item.id}
                id={item.id}
                fileName={item.filenameDownload}
              />
            ))}
          </div>
        </>
      ) : (
        <p>{t('helpPage.documentation.empty')}</p>
      )}
    </div>
  )
}
