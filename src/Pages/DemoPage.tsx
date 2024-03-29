import { resourceLimits } from 'worker_threads'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import { PageContentLayout } from 'MainLayout/PageContentLayout'
import IconSearchCandidate from 'assets/svg/icon-search-candidate.svg?react'
import MagnifyingGlass from 'assets/magnifying-glass.png'
import { Tabs } from 'base/Tabs'
import AdverseMediaTabContent from 'components/AdverseMediaTabContent'
import BlacklistedSellerTabContent from 'components/BlacklistedSellerTabContent'
import { TabItemConfig } from 'types/tabs'
import { createDemo, reloadBackgroundCheckData } from 'api/api'

const DemoPage = () => {
  const [activeTab, setActiveTab] = useState('media')
  const [loading, setLoading] = useState(false)
  console.log('🚀 ~ DemoPage ~ loading:', loading)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [adverseMediaData, setAdverseMediaData] = useState([])
  const [blacklistedSeller, setBlacklistedSeller] = useState([])

  const rawResults = useRef(null)
  const [backgroundCheckId, setBackgroundCheckId] = useState<string>()

  const to = useRef<NodeJS.Timeout>()

  const handleChangeTab = (key) => {
    setActiveTab(key)
  }

  const firstNameChange = useCallback((event) => {
    const { value } = event.target
    setFirstName(value)
  }, [])

  const lastNameChange = useCallback((event) => {
    const { value } = event.target
    setLastName(value)
  }, [])

  const apiKey = localStorage.getItem('apiKey') ?? undefined
  const bgcUrl = localStorage.getItem('bgcUrl') ?? undefined

  const handleSearch = useCallback(async () => {
    try {
      setLoading(true)
      setAdverseMediaData([])
      const response = await createDemo<{ id: string }>(
        `${bgcUrl}/backgroundChecks`,
        apiKey,
        {
          processConfigs: {
            adverseMedia: {
              maxResults: 3,
            },
            education: false,
            employmentReference: false,
            bankruptcy: false,
            sanction: false,
            criminalRecord: false,
            socialSecurityHistory: false,
            income: false,
            blacklistedSeller: true,
          },
          verificationInfo: {
            kycVerified: true,
            firstNameTH: firstName,
            lastNameTH: lastName,
          },
        }
      )
      setBackgroundCheckId(response.id)
    } catch (error) {
      console.error('Error:', error)
    }
  }, [apiKey, bgcUrl, firstName, lastName])

  const tabs: TabItemConfig[] = [
    {
      key: 'media',
      label: 'Adverse Media',
      content: (
        <AdverseMediaTabContent
          adverseMediadata={adverseMediaData}
          loading={loading}
        />
      ),
    },
    {
      key: 'blacklisted',
      label: 'Blacklisted Seller',
      content: (
        <BlacklistedSellerTabContent
          blacklistedSellerdata={blacklistedSeller}
          loading={loading}
        />
      ),
    },
  ]

  const reload = useCallback(async () => {
    try {
      setLoading(true)
      const results = await reloadBackgroundCheckData(
        apiKey,
        bgcUrl,
        backgroundCheckId
      )
      rawResults.current = results
      console.log('🚀 ~ reload ~ results:', results)
      if (!results.length) {
        setLoading(false)
        setBackgroundCheckId(undefined)
      }
      const validResults = results.filter((r) => r.sentiment === 'negative')
      console.log('🚀 ~ .then ~ validResults:', validResults)
      if (
        !validResults.length &&
        results.every((r) => r.sentiment !== undefined)
      ) {
        setBackgroundCheckId(undefined)
      }
      setAdverseMediaData(validResults)
      // setBlacklistedSeller(results)
    } catch (error) {
      console.error('Error:', error)
      setLoading(false)
    }
  }, [apiKey, backgroundCheckId, bgcUrl])

  useEffect(() => {
    if (
      !backgroundCheckId ||
      (adverseMediaData.length &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (rawResults.current as any[] | null)?.every(
          (rr) => rr.sentiment !== undefined
        ))
    )
      return

    const createTimeout = () => {
      to.current = setInterval(() => reload(), 1000)
    }

    reload()
      .then(createTimeout)
      .catch(() => {
        createTimeout()
      })

    // eslint-disable-next-line consistent-return
    return () => {
      if (to.current) clearTimeout(to.current)
      to.current = undefined
      setLoading(false)
    }
    // reload()
  }, [adverseMediaData.length, backgroundCheckId, bgcUrl, rawResults, reload])

  return (
    <PageContentLayout>
      <div className="content-box px-0 flex-1 flex flex-col ">
        <div className="flex flex-col justify-center my-6 mx-16 items-center">
          <IconSearchCandidate className="my-2" />
          <p className="font-bold text-lg">Search Candidates</p>
          <p className="text-center text-neutral-400	">
            Background Checker service is a 100% digital solution that empowers
            organizations, companies, and HR departments to thoroughly examine
            applicants’ profiles. This service reduces the HR workload, allowing
            for quicker integration of new employees into the system while
            ensuring a detailed and comprehensive evaluation of applicants
          </p>
        </div>
        <div
          className={classNames(
            'px-6 hidden sm:flex mb-6 justify-center items-center space-x-4'
          )}
        >
          <input
            type="text"
            placeholder="First name"
            className="input input-bordered w-full max-w-xs"
            value={firstName}
            onChange={firstNameChange}
          />
          <input
            type="text"
            placeholder="Last name"
            className="input input-bordered w-full max-w-xs"
            value={lastName}
            onChange={lastNameChange}
          />
          <button
            type="button"
            className={classNames(
              'btn w-fit h-fit rounded-md bg-red-600',
              'cursor-pointer flex items-center justify-center'
            )}
            onClick={handleSearch}
          >
            <img className="w-4 h-4" src={MagnifyingGlass} alt="search" />
          </button>
        </div>
        <div className="flex-1 overflow-hidden flex flex-col ">
          <div className="w-full flex space-x-4 px-6">
            <div className="flex-1 overflow-hidden">
              <Tabs
                tabs={tabs}
                activeTab={activeTab}
                onChangeTab={handleChangeTab}
              />
            </div>
          </div>
        </div>
      </div>
    </PageContentLayout>
  )
}

export default DemoPage
