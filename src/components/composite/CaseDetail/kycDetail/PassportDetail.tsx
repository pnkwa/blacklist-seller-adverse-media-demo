import { FC, useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'
import ErrorsBox from 'components/base/ErrorsBox'
import { Table } from 'components/base/Table'
import { getFullNationality } from 'services/nationality'
import { Verification } from 'types/caseKeeperCore'
import { PassportResult } from 'types/kycCore'
import { idCardSpace } from 'specs/IdCardSpecs'
import { getPassportDataTable } from 'specs/passportSpecs'
import { sortByKey } from 'utils/common'
import AttemptTitle from './AttemptTitle'

interface PassportDetailProps {
  showAttempts?: boolean
  verification: Verification
  showVerified: boolean
}

const getPassportImageUrl = (passportResult) =>
  passportResult?.idCardImageUrl ?? passportResult?.response?.passportImageUrl

const Detail = ({
  passportResult,
  verification,
  showVerified,
}: {
  passportResult: PassportResult
  verification: Verification
  showVerified: boolean
}) => {
  const [result, setResult] = useState(passportResult)

  const errors = useMemo(() => passportResult.errors ?? [], [passportResult])

  useEffect(() => {
    const ocrCountryCode = passportResult.response?.result?.mrz_nationality
    const editsCountryCode = passportResult.edits?.nationality
    const countryCodes = [...new Set([ocrCountryCode, editsCountryCode])]
    Promise.all(countryCodes.map(getFullNationality)).then((countryNames) => {
      const getCountryName = (code?: string) =>
        countryNames[countryCodes.indexOf(code)]
      const ocrNationality = getCountryName(ocrCountryCode)
      const editNationality = getCountryName(editsCountryCode)
      setResult({
        ...passportResult,
        ocrNationality,
        editNationality,
      })
    })
  }, [passportResult])

  return (
    <div className="mb-8 sm:mb-2">
      <div className="grid grid-rows-1 sm:grid-cols-2 sm:grid-rows-none items-center mb-6 sm:mb-0">
        <div
          className={classNames(
            'flex justify-center mt-6 my-3',
            !errors.length && 'sm:col-span-2 row-span-1'
          )}
        >
          <a
            href={getPassportImageUrl(passportResult)}
            target="_blank"
            rel="noreferrer"
          >
            <img
              alt="passportImage"
              className="rounded-lg max-w-xs max-h-60"
              src={getPassportImageUrl(passportResult)}
            />
          </a>
        </div>
        {!!errors.length && <ErrorsBox prefix="passport" errors={errors} />}
      </div>
      <div className="w-full overflow-x-auto">
        <Table
          key="passportTable"
          tableClassName="min-w-[600px] lg:w-full"
          theadClassName="rounded-lg"
          tdClassName="px-1 pt-1 py-2 sm:pb-4 sm:pt-4 sm:px-4 w-[25%]"
          rowClassName="border-none"
          tableSpecs={idCardSpace}
          data={getPassportDataTable({
            ...verification,
            passportResult: result,
          })
            .filter((record) => (showVerified ? record.isValid : true))
            .map((c) => ({
              ...c,
              header: `caseDetail.verification.fields.${c.header}`,
            }))}
        />
      </div>
    </div>
  )
}

const PassportDetail: FC<PassportDetailProps> = ({
  verification,
  showAttempts = false,
  showVerified,
}) => {
  const passportResultsLength = useMemo(
    () => verification.passportResults?.length ?? 0,
    [verification.passportResults?.length]
  )

  const passportResults = useMemo(
    () =>
      verification?.passportResults
        ?.sort(sortByKey('updatedAt'))
        .slice(showAttempts ? 1 : 0, showAttempts ? undefined : 1) ?? [],
    [showAttempts, verification?.passportResults]
  )
  return (
    <div className="w-full">
      {passportResults?.map((passportResult, index) => (
        <>
          <AttemptTitle
            errorTranslationPrefix="caseDetail.verification.attempt.passport"
            count={passportResultsLength - index - (showAttempts ? 1 : 0)}
            date={passportResult.updatedAt}
          />
          <Detail
            passportResult={passportResult}
            verification={verification}
            showVerified={showVerified}
          />
        </>
      ))}
    </div>
  )
}

export default PassportDetail
