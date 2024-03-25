import { useTranslation } from 'react-i18next'
import { PageContentLayout } from 'components/composite/MainLayout/PageContentLayout'
import { BackgroundCheckTable } from 'components/composite/BackgroundCheckPage/BackgroundCheckTable'
import { CreatedAtFilter } from 'components/composite/CreatedAtFilter'
import { FilterContainer } from 'components/composite/BackgroundCheckPage/FilterContainer'
import { CreateCaseButton } from 'components/composite/CreateCaseButton'

const BackgroundCheckPage = () => {
  const { t } = useTranslation()

  return (
    <PageContentLayout
      title={
        <>
          <div className="flex-1">{t('backgroundCheckPage.pageTitle')}</div>
          <div className="hidden sm:block">
            <CreatedAtFilter />
          </div>
          <div className="block sm:hidden">
            <CreateCaseButton />
          </div>
        </>
      }
    >
      <div className="content-box px-0 flex-1 flex flex-col overflow-hidden">
        <div className="px-6 space-y-6 mb-6 sm:hidden">
          <CreatedAtFilter />
          <FilterContainer />
        </div>
        <div className="px-6 hidden sm:flex mb-6 justify-between items-center space-x-2">
          <FilterContainer />
          <CreateCaseButton />
        </div>
        <BackgroundCheckTable />
      </div>
    </PageContentLayout>
  )
}

export default BackgroundCheckPage
