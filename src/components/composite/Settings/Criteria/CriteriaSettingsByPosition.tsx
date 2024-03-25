import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useDispatch } from 'react-redux'
import { faMagnifyingGlass, faPencil } from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames'
import { useTenantConfigContext } from 'context/TenantConfigContext'
import { canConfigCriteria, getPositionCriteriaMapping } from 'utils/criteria'
import { getMasterdataTranslation } from 'utils/translations'
import { TableSpec } from 'types/generic/table'
import { PositionConfig } from 'types/tenantConfig'
import { Table } from 'components/base/Table'
import { openEditPositionCriteriaAction } from 'listenerMiddleware/openEditPositionCriteria'

const EditButton = ({ positionConfig }: { positionConfig: PositionConfig }) => {
  const { client } = useTenantConfigContext()
  const dispatch = useDispatch()
  const criteriaMapping = getPositionCriteriaMapping(positionConfig)
  if (!canConfigCriteria(criteriaMapping)) return null
  return (
    <button
      type="button"
      aria-label="edit"
      onClick={() =>
        dispatch(openEditPositionCriteriaAction({ positionConfig, client }))
      }
    >
      <FontAwesomeIcon icon={faPencil} />
    </button>
  )
}

const tableSpecs: TableSpec<PositionConfig>[] = [
  {
    key: 'position',
    header: 'settingsPage.criteria.position',
    renderValue: (p) => getMasterdataTranslation(p.position),
  },
  {
    key: 'edit',
    headerClassName: 'w-12',
    renderValue: (p) => {
      const criteriaMapping = getPositionCriteriaMapping(p)
      if (!canConfigCriteria(criteriaMapping)) return null
      return <EditButton positionConfig={p} />
    },
  },
]

export const CriteriaSettingsByPosition = () => {
  const { t } = useTranslation()
  const { client } = useTenantConfigContext()
  const [search, setSearch] = useState('')

  const positions = useMemo(
    () =>
      Object.values(client.backgroundCheckDashboardConfig?.positions ?? {})
        .filter((p) => {
          if (p.leadAlias) return false
          if (!search) return true
          return getMasterdataTranslation(p.position)
            ?.toLowerCase()
            .includes(search.toLowerCase())
        })
        .map((p) => ({ ...p, id: p.position?.key })),
    [client.backgroundCheckDashboardConfig?.positions, search]
  )

  return (
    <div className="space-y-4">
      <div className="relative flex-1 pr-2 max-w-lg">
        <input
          type="text"
          className={classNames(
            'input h-10 border-base-300 rounded-lg bg-transparent',
            'text-xs w-full pl-10'
          )}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('settingsPage.criteria.searchByPosition')}
        />
        <div className="absolute top-2 left-4">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="text-base-neutral opacity-50"
          />
        </div>
      </div>
      <Table tableSpecs={tableSpecs} data={positions} />
    </div>
  )
}
