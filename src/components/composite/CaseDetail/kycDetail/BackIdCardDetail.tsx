import { FC, useMemo } from 'react'
import classNames from 'classnames'
import ErrorsBox from 'components/base/ErrorsBox'
import { Table } from 'components/base/Table'
import { Verification } from 'types/caseKeeperCore'
import BackIdCardImage from 'assets/svg/idcard-back-result.svg?react'
import { sortByKey } from 'utils/common'
import { getBackIdCard, idCardSpace } from 'specs/IdCardSpecs'
import AttemptTitle from './AttemptTitle'

interface BackIdCardDetailProps {
  showAttempts?: boolean
  verification: Verification
  showVerified: boolean
}

const BackIdCardDetail: FC<BackIdCardDetailProps> = ({
  verification,
  showVerified,
  showAttempts = false,
}) => {
  const backIdCardResultsLength = useMemo(
    () => verification.backIdCardResults?.length ?? 0,
    [verification.backIdCardResults?.length]
  )

  const backIdCardResults = useMemo(
    () =>
      verification?.backIdCardResults
        ?.filter(
          (item) =>
            item.completed ?? item.response?.error ?? item.errors?.length
        )
        .sort(sortByKey('updatedAt')) ?? [],
    [verification?.backIdCardResults]
  )

  return (
    <div className="w-full">
      {backIdCardResults?.map((result, index) => (
        <>
          <AttemptTitle
            errorTranslationPrefix="caseDetail.verification.attempt.backIdCard"
            count={backIdCardResultsLength - index - (showAttempts ? 1 : 0)}
            date={result.updatedAt}
          />
          <div className="mb-8 sm:mb-2">
            <div className="grid grid-rows-1 sm:grid-cols-2 sm:grid-rows-none items-center mb-6 sm:mb-0">
              <BackIdCardImage
                className={classNames(
                  'w-full flex justify-center my-4',
                  !result?.errors?.length && 'sm:col-span-2 row-span-2'
                )}
              />
              {!!result?.errors?.length && (
                <ErrorsBox errors={result.errors} prefix="backIdCard" />
              )}
            </div>
            <div className="w-full overflow-x-auto">
              <Table
                key="backIdCardTable"
                theadClassName="rounded-lg"
                tableClassName="min-w-[600px] lg:w-full"
                tdClassName="px-0 py-2 sm:pb-4 sm:pt-4 sm:px-4 w-[25%]"
                rowClassName="border-none"
                data={getBackIdCard(result)
                  .filter((record) => (showVerified ? record?.isValid : true))
                  .map((c) => ({
                    ...c,
                    header: `caseDetail.verification.fields.${c.header}`,
                  }))}
                tableSpecs={idCardSpace}
              />
            </div>
          </div>
        </>
      ))}
    </div>
  )
}

export default BackIdCardDetail
