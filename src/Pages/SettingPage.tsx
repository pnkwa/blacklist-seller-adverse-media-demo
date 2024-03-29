import classNames from 'classnames'
import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { PageContentLayout } from 'MainLayout/PageContentLayout'

const SettingPage = () => {
  const [apiKey, setApiKey] = useState(
    () => localStorage.getItem('apiKey') ?? ''
  )
  const [bgcUrl, setBgcUrl] = useState(
    () => localStorage.getItem('bgcUrl') ?? ''
  )
  const [disable, setDisable] = useState(true)

  const retrieveDataFromLocalStorage = useCallback(() => {
    const savedApiKey = localStorage.getItem('apiKey')
    const savedBgcUrl = localStorage.getItem('bgcUrl')

    if (savedApiKey !== null) setApiKey(savedApiKey)
    if (savedBgcUrl !== null) setBgcUrl(savedBgcUrl)
  }, [])

  useEffect(() => {
    retrieveDataFromLocalStorage()
  }, [retrieveDataFromLocalStorage])

  const handleApiKeyChange = useCallback((event) => {
    const { value } = event.target
    setApiKey(value)
    setDisable(false)
  }, [])

  const handleBgcUrlChange = useCallback((event) => {
    const { value } = event.target
    setBgcUrl(value)
    setDisable(false)
  }, [])

  const handleSave = useCallback(() => {
    const savedApiKey = localStorage.getItem('apiKey')
    const savedBgcUrl = localStorage.getItem('bgcUrl')

    if (apiKey === savedApiKey && bgcUrl === savedBgcUrl) setDisable(true)

    localStorage.setItem('apiKey', apiKey)
    localStorage.setItem('bgcUrl', bgcUrl)
    setDisable(true)
  }, [apiKey, bgcUrl])

  return (
    <PageContentLayout>
      <div
        className={classNames(
          'content-box px-0 flex-1 flex flex-col overflow-hidden space-y-4 '
        )}
      >
        <div className="m-8 space-y-6">
          <p className="text-3xl">Settings</p>
          <div>
            <p>API Key</p>
            <input
              type="text"
              placeholder="API Key"
              className="input input-bordered w-full max-w-xs my-2"
              onChange={handleApiKeyChange}
              value={apiKey}
            />
          </div>
          <div>
            <p>BGC Url</p>
            <input
              type="text"
              placeholder="BGC Url"
              className="input input-bordered w-full max-w-xs my-2"
              onChange={handleBgcUrlChange}
              value={bgcUrl}
            />
          </div>

          <button
            type="button"
            className={classNames(
              'btn w-fit h-fit rounded-md bg-red-600 text-white',
              'cursor-pointer flex items-center justify-center'
            )}
            onClick={handleSave}
            disabled={disable}
          >
            Save
          </button>
        </div>
      </div>
    </PageContentLayout>
  )
}

export default SettingPage
