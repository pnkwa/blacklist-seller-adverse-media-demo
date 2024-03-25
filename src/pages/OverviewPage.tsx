import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { BackgroundCountOverviewBox } from 'components/composite/Overview/BackgroundCountOverviewBox'
import { OverviewTable } from 'components/composite/Overview/OverviewTable'
import { ResultSummaryBox } from 'components/composite/Overview/ResultSummaryBox'
import { PageContentLayout } from 'components/composite/MainLayout/PageContentLayout'
import { CreatedAtFilter } from 'components/composite/CreatedAtFilter'

const OverviewPage = () => {
  const { t } = useTranslation()

  return (
    <PageContentLayout
      title={
        <>
          <div className="flex-1 my-2">{t('overviewPage.pageTitle')}</div>
          <CreatedAtFilter />
        </>
      }
      titleClassName="!block sm:!flex"
    >
      <BackgroundCountOverviewBox className="w-full" />
      <div
        className={classNames(
          'flex-1 overflow-hidden block lg:flex flex-wrap',
          'space-y-4 lg:space-y-0 lg:space-x-4 place-items-start'
        )}
      >
        <OverviewTable className="w-full lg:flex-[5]" />
        <ResultSummaryBox className="w-full lg:flex-[3]" />
      </div>
    </PageContentLayout>
  )
}

export default OverviewPage
