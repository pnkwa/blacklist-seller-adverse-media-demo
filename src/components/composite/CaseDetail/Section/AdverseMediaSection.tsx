import { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { BackgroundCheckProcessName } from 'types/bgcCore'
import NotFoundSvg from 'assets/svg/not-found-news.svg?react'
import InfoSvg from 'assets/svg/status/info.svg?react'
import { Flow } from 'types/caseKeeperCore'
import BaseBackgroundCheckDetail from '../BaseBackgroundCheckDetail'

interface AdverseMediaSectionProps {
  flow?: Flow
}

const AdverseMediaSection: FC<AdverseMediaSectionProps> = ({ flow }) => {
  const { t } = useTranslation()

  const { backgroundCheck } = flow ?? {}
  const { results, selectedResultIds, searchTerm } =
    backgroundCheck?.adverseMedia ?? {}

  const selectedResults = useMemo(
    () => results?.filter((r) => selectedResultIds?.includes(r.id)),
    [results, selectedResultIds]
  )

  return (
    <BaseBackgroundCheckDetail
      backgroundCheck={backgroundCheck}
      process={BackgroundCheckProcessName.ADVERSE_MEDIA}
    >
      <div className="inline-flex pb-5 w-full">
        <div className="inline-block w-fit border-r pr-4">
          <p className="font-bold text-xs">
            {t('caseDetail.adverseMedia.detected')}
          </p>
          <p className="text-lg text-base-content/60 pl-2">
            {t('caseDetail.adverseMedia.record', {
              countRecord: selectedResults?.length ?? 0,
            })}
          </p>
        </div>
        <div className="inline-block w-fit pl-4">
          <p className="font-bold text-xs">
            {t('caseDetail.adverseMedia.from')}
          </p>
          <p className="text-lg text-base-content/60 pl-2">{searchTerm}</p>
        </div>
      </div>
      {selectedResults?.length ? (
        <div className="space-y-4">
          {selectedResults.map(
            ({ displayLink, link, title, description, image }) => (
              <a
                key={`${displayLink}`}
                className="border rounded-lg w-full p-4 flex justify-between"
                href={link}
                target="blank"
              >
                <div className="space-y-1 text-left">
                  <div className="font-bold">{displayLink}</div>
                  <div className="font-bold">{title}</div>
                  <div className="text-sm">{description}</div>
                </div>
                {image && (
                  <img
                    alt={title}
                    className="w-auto h-28 rounded-md ml-4"
                    src={image}
                  />
                )}
              </a>
            )
          )}
          <div
            className={classNames(
              'flex gap-3 border p-4 bg-base-100 rounded-md border-neutral/60',
              'items-center'
            )}
          >
            <InfoSvg className="text-neutral min-h-[1.5rem] min-w-[1.5rem]" />
            <span>{t('caseDetail.adverseMedia.footer', { searchTerm })}</span>
          </div>
        </div>
      ) : (
        <div>
          <div className="p-6 overflow-x-auto sm:overflow-x-visible mx-auto">
            <div className="flex justify-center mt-4 mb-4">
              <NotFoundSvg />
            </div>
            <div className="whitespace-pre-line text-center">
              {t('caseDetail.adverseMedia.notFound', { searchTerm })}
            </div>
          </div>
        </div>
      )}
    </BaseBackgroundCheckDetail>
  )
}

export default AdverseMediaSection
