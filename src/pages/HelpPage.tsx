import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { PageContentLayout } from 'components/composite/MainLayout/PageContentLayout'
import { Tabs } from 'components/base/Tabs'
import { TabItemConfig } from 'types/generic/tabs'
import { Documentation } from 'components/composite/helps/Documentation'

const tabsConfig: TabItemConfig[] = [
  {
    key: 'documentation',
    label: 'helpPage.documentation.title',
    content: <Documentation />,
  },
]

const HelpPage = () => {
  const { t } = useTranslation()
  const [currentTab, setCurrentTab] = useState(tabsConfig[0].key)

  return (
    <PageContentLayout title={t('helpPage.pageTitle')}>
      <div className="content-box flex-1 flex flex-col overflow-hidden">
        <Tabs
          tabsConfig={tabsConfig}
          activeTab={currentTab}
          onChangeTab={setCurrentTab}
        />
      </div>
    </PageContentLayout>
  )
}

export default HelpPage
