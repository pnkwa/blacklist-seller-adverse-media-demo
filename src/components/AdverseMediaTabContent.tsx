import classNames from 'classnames'
import { Spinner } from 'base/Spinner'
import { AdverseMediaResult } from 'types/result'
import NotFoundImage from 'assets/svg/not-found.svg?react'

const tableHeaderClassNames = classNames(
  'text-left font-normal p-4 bg-base-200/50 relative',
  "after:content-[''] after:absolute after:w-[1px] after:inset-y-3 after:bg-base-300 after:right-0 last:after:hidden"
)

const headerLabels = ['News', 'Category', 'Images']

interface AdverseMediaResultProps {
  adverseMediadata: AdverseMediaResult[]
  loading?: boolean
}

const AdverseMediaTabContent: React.FC<AdverseMediaResultProps> = ({
  adverseMediadata,
  loading,
}) => {
  return (
    <>
      {adverseMediadata.length > 0 && (
        <table
          className={classNames(
            'table text-sm text-base-content text-left ',
            'right-0'
          )}
        >
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
            {adverseMediadata.map((item, index) => (
              <tr key={index}>
                <td className="max-w-[300px]">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className={classNames(
                      ' p-4 flex-1 flex',
                      'outline-base-500 rounded-lg hover:bg-gray-100'
                    )}
                  >
                    <div className="flex-1 space-y-1">
                      <div className="font-bold">{item.title}</div>
                      <div>{item.description}</div>
                    </div>
                  </a>
                </td>
                <td className="max-w-[100px]">
                  {item.tags
                    .map((tag) => tag.translations && tag.translations.en)
                    .filter((en) => en)
                    .join(', ')}
                </td>
                <td>
                  <div className="min-w-[150px] w-[150px] h-[110px]">
                    {item.image && (
                      <img
                        alt={item.title}
                        src={item.image}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {!loading && adverseMediadata.length === 0 && (
        <div className="flex justify-center items-center flex-col">
          <NotFoundImage className="w-[400px] h-[400px]" />
          No adverse media data.
        </div>
      )}
      {loading && (
        <div className="flex items-center justify-center">
          <Spinner className="text-primary my-8" />
        </div>
      )}
    </>
  )
}

export default AdverseMediaTabContent
