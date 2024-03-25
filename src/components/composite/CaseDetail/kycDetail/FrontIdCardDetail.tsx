import classNames from 'classnames'
import { FC, useEffect, useMemo } from 'react'
import ErrorsBox from 'components/base/ErrorsBox'
import { Table } from 'components/base/Table'
import { Verification } from 'types/caseKeeperCore'
import { sortByKey } from 'utils/common'
import { idCardSpace, getFrontIdCardTableData } from 'specs/IdCardSpecs'
import { FrontIdCardErrorCode, ProcessErrorKey } from 'types/kycCore'
import AttemptTitle from './AttemptTitle'

interface FrontIdCardDetailProps {
  showAttempts?: boolean
  showVerified?: boolean
  verification: Verification
  setHideToggle: (value: boolean) => void
}

const FrontIdCardDetail: FC<FrontIdCardDetailProps> = ({
  verification,
  showVerified,
  showAttempts = false,
  setHideToggle,
}) => {
  const frontIdCardResultsLength = useMemo(
    () => verification.frontIdCardResults?.length ?? 0,
    [verification.frontIdCardResults?.length]
  )

  const filteredResults = useMemo(
    () =>
      verification?.frontIdCardResults
        ?.filter(
          (item) =>
            item.completed ?? item.response?.error ?? item.errors?.length
        )
        .sort(sortByKey('updatedAt'))
        .slice(showAttempts ? 1 : 0, showAttempts ? undefined : 1) ?? [],
    [showAttempts, verification?.frontIdCardResults]
  )

  const hideToggle = useMemo(() => {
    if (verification?.frontIdCardResult) return true
    return (
      !verification?.frontIdCardResult?.errors?.some(({ key }) =>
        (
          [
            FrontIdCardErrorCode.COMPARISON,
            FrontIdCardErrorCode.ABOUT_TO_EXPIRE,
            FrontIdCardErrorCode.EXPIRED,
            FrontIdCardErrorCode.RESTRICTED_AGE,
            FrontIdCardErrorCode.LIGHT,
          ] as ProcessErrorKey[]
        ).includes(key)
      ) && !showAttempts
    )
  }, [showAttempts, verification?.frontIdCardResult])

  useEffect(() => {
    setHideToggle(hideToggle)
  }, [hideToggle, setHideToggle])

  return (
    <div className="w-full">
      {filteredResults?.map((result, index) => (
        <div>
          <AttemptTitle
            errorTranslationPrefix="caseDetail.verification.attempt.frontIdCard"
            count={frontIdCardResultsLength - index - (showAttempts ? 1 : 0)}
            date={result.updatedAt}
          />
          <div className="mb-8 sm:mb-2">
            <div className="grid grid-rows-1 sm:grid-cols-2 sm:grid-rows-none items-center mb-6 sm:mb-0">
              <div
                className={classNames(
                  'w-full flex justify-center',
                  !result?.errors?.length && 'sm:col-span-2 row-span-1'
                )}
              >
                <div className={classNames('flex justify-center mt-6 my-3')}>
                  <a
                    aria-label="idCardImage"
                    href={result?.idCardImageUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      alt="idCardImage"
                      className="rounded-lg max-w-xs max-h-60"
                      src={result?.idCardImageUrl}
                    />
                  </a>
                </div>
                {(result?.idCardImageFrames?.length ?? 0) > 1 && (
                  <div className="flex justify-center my-3 mb-6 space-x-3 items-center">
                    {result?.idCardImageFrames?.map(({ fileKey, fileUrl }) => (
                      <a
                        aria-label={`id-card-image-${fileKey}`}
                        key={fileKey}
                        href={fileUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          alt="IdCardImageFrames"
                          className="rounded max-w-[120px] max-h-[120px]"
                          src={fileUrl}
                        />
                      </a>
                    ))}
                  </div>
                )}
              </div>
              {!!result?.errors?.length && (
                <ErrorsBox prefix="frontIdCard" errors={result?.errors} />
              )}
            </div>
            <div className="w-full overflow-x-auto">
              <Table
                key="frontIdCardTable"
                tableClassName="min-w-[600px] lg:w-full"
                data={getFrontIdCardTableData(verification, result)
                  ?.filter((record) => (showVerified ? record.isValid : true))
                  .map((c) => ({
                    ...c,
                    header: `caseDetail.verification.fields.${c.header}`,
                  }))}
                theadClassName="rounded-lg"
                tdClassName="px-1 pt-1 py-2 sm:pb-4 sm:pt-4 sm:px-4 w-[25%]"
                tableSpecs={idCardSpace}
                rowClassName="border-none"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default FrontIdCardDetail
