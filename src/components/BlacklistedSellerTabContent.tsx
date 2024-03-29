import classNames from 'classnames'
import IconLink from 'assets/svg/icon-link.svg?react'
import { dateFormat } from 'utils/date'
import { dateFormats } from 'config/dateFormat'
import { BlacklistedSellerResult } from 'types/result'
import { Spinner } from 'base/Spinner'
import NotFoundImage from 'assets/svg/not-found.svg?react'

const tableHeaderClassNames = classNames(
  'text-left font-normal p-4 bg-base-200/50 relative',
  "after:content-[''] after:absolute after:w-[1px] after:inset-y-3 after:bg-base-300 after:right-0 last:after:hidden"
)

const headerLabels = [
  'รายการ',
  'สินค้า',
  'ช่องทางการช่องโกง',
  'วันที่เกิดเหตุ',
  'ดูรายละเอียด',
]

interface BlacklistedSellerTabContentProps {
  blacklistedSellerdata: BlacklistedSellerResult[]
  loading?: boolean
}

const BlacklistedSellerTabContent: React.FC<
  BlacklistedSellerTabContentProps
> = ({ blacklistedSellerdata, loading }) => {
  console.log('🚀 ~ blacklistedSellerdata:', blacklistedSellerdata)
  return (
    <>
      {loading && (
        <div className="flex items-center justify-center">
          <Spinner className="text-primary my-8" />
        </div>
      )}

      {!loading && blacklistedSellerdata.length > 0 && (
        <div className="w-full h-full overflow-auto">
          <table className="table text-sm text-base-content text-left">
            <thead>
              <tr>
                {headerLabels.map((label, index) => (
                  <th key={index} className={tableHeaderClassNames}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {blacklistedSellerdata.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.product ?? '-'}</td>
                  <td>{item.sellingPage ?? '-'}</td>
                  <td>
                    {dateFormat(item.transferDate, dateFormats.dayMonthYear) ??
                      '-'}
                  </td>
                  <td>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View details of ${item.url}`}
                    >
                      <IconLink />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && blacklistedSellerdata.length === 0 && (
        <div className="flex justify-center items-center flex-col">
          <NotFoundImage className="w-[400px] h-[400px]" />
          Not found blacklisted seller.
        </div>
      )}
    </>
  )
}

export default BlacklistedSellerTabContent
