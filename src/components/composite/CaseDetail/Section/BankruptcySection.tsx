import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { BackgroundCheckProcessName } from 'types/bgcCore'
import { joinStrings } from 'utils/string'
import { Flow } from 'types/caseKeeperCore'
import BaseBackgroundCheckDetail from '../BaseBackgroundCheckDetail'

interface BankruptcySectionProps {
  flow?: Flow
}

const DetailCell: React.FC<{
  label?: string
  value?: string | null
}> = ({ label, value }) => {
  return (
    <div className="grid grid-cols-2 py-2">
      <div className="font-bold text-xs ">{label}</div>
      <div className="text-xs  my-1 mr-1 pl-4 break-words">
        <p>{value ?? '-'}</p>
      </div>
    </div>
  )
}

const BankruptcySection: FC<BankruptcySectionProps> = ({ flow }) => {
  const { t, i18n } = useTranslation()

  const { backgroundCheck } = flow ?? {}
  const { foundRecord } = backgroundCheck?.bankruptcy ?? {}
  const {
    court,
    data,
    byPlaintiff,
    bankruptcyBlackCaseNo,
    bankruptcyRedCaseNo,
    caseNo,
  } = backgroundCheck?.bankruptcy?.result ?? {}

  return (
    <BaseBackgroundCheckDetail
      backgroundCheck={backgroundCheck}
      process={BackgroundCheckProcessName.BANKRUPTCY}
    >
      <div className="py-4 bg-base-100">
        <div className="text-xs ">
          <div
            className={classNames(
              'bg-base-200 rounded-md p-4 pl-8 text-sm',
              foundRecord ? 'text-error mb-4' : 'text-neutral-500'
            )}
          >
            {t(`caseDetail.bankruptcy.${foundRecord ? 'found' : 'notFound'}`)}
          </div>
          {foundRecord && (
            <>
              <div className="w-full grid grid-cols-4 py-2">
                <div className="col-span-1 font-bold text-xse">
                  {t('caseDetail.bankruptcy.headers.caseNo')}
                </div>
                <div className="col-span-3 text-xs my-1 mr-1 pl-4 break-words">
                  <p>{joinStrings([caseNo, court]) || '-'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2">
                <DetailCell
                  label={t(
                    'caseDetail.bankruptcy.headers.bankruptcyBlackCaseNo'
                  )}
                  value={bankruptcyBlackCaseNo}
                />
                <DetailCell
                  label={t('caseDetail.bankruptcy.headers.bankruptcyRedCaseNo')}
                  value={bankruptcyRedCaseNo}
                />
              </div>
              <div className="w-full grid grid-cols-4 border-b-2 mb-2 pt-2 pb-4">
                <div className="col-span-1 font-bold text-xs pr-4">
                  {t('caseDetail.bankruptcy.headers.byPlaintiff')}
                </div>
                <div className="col-span-3 text-xs my-1 mr-1 px-4 break-words">
                  <p>{byPlaintiff ?? '-'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2">
                {data?.map((key) =>
                  key.map((item, index) => {
                    if (!item.translation && !item.value) return null
                    return (
                      <DetailCell
                        label={item.translation?.[i18n.language]}
                        value={item?.value}
                        key={index}
                      />
                    )
                  })
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </BaseBackgroundCheckDetail>
  )
}

export default BankruptcySection
