import classNames from 'classnames'
import IconLink from 'assets/svg/icon-link.svg?react'
import { dateFormat } from 'utils/date'
import { dateFormats } from 'config/dateFormat'
import { BlacklistedSellerResult } from 'types/result'
import { Spinner } from 'base/Spinner'
import NotFoundImage from 'assets/svg/not-found.svg?react'

const tableHeaderClassNames = classNames(
  'text-left font-normal p-4 bg-base-200/50 relative text-center',
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
                  <td className="text-center">{index + 1}</td>
                  <td className="text-center">{item.product ?? null}</td>
                  <td className="text-center">
                    {item.sellingPage ?? 'คลิกลิงก์เพื่อดูรายละเอียด'}
                  </td>
                  <td className="text-center">
                    {dateFormat(item.transferDate, dateFormats.dayMonthYear) ??
                      null}
                  </td>
                  <td className="flex justify-center">
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
