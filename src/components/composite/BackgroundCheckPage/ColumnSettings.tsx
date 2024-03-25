/* eslint-disable jsx-a11y/label-has-associated-control */
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faColumns } from '@fortawesome/free-solid-svg-icons'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { TooltipBox } from 'components/base/TooltipBox'
import { useTenantConfigContext } from 'context/TenantConfigContext'
import { useOnClickOutside } from 'hooks/clickOutside'
import { FlowTableTabItemConfig, FlowsResultKey } from 'types/caseKeeperCore'
import { backgroundCheckMainTabs } from 'specs/bgcTabs'
import { useFlowTableTabs } from 'hooks/useFlowTableTabs'
import { useLocalStorage } from 'hooks/useLocalStorage'
import { getColumnTogglesLocalStorageKey } from 'utils/flow'
import { ColumnSettingsValue } from 'types/generic/table'
import { setColumnSettings } from 'reducers'
import { getDefaultDisplayColumn } from 'utils/backgroundCheck'

export const ColumnSettings = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { client } = useTenantConfigContext()
  const [showMenu, setShowMenu] = useState<boolean>(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useOnClickOutside(menuRef, () => setShowMenu(false))

  const tabsConfig = useMemo(
    (): FlowTableTabItemConfig[] =>
      backgroundCheckMainTabs.map((item) => ({
        ...item,
        tableSpecs: item.tableSpecs(client),
      })),
    [client]
  )

  const {
    currentTab,
    currentTabConfig: { tableSpecs },
  } = useFlowTableTabs(tabsConfig, FlowsResultKey.ALL)

  const [value, setValue] = useLocalStorage<ColumnSettingsValue>(
    getColumnTogglesLocalStorageKey(currentTab)
  )

  const onCheckedItem = useCallback(
    (key: string, value: boolean) => {
      setValue((prev) => {
        const newValue = tableSpecs.reduce(
          (result, curr) => ({
            ...result,
            [curr.key]: prev?.[curr.key] ?? getDefaultDisplayColumn(curr.key),
          }),
          {}
        )
        return { ...newValue, [key]: value }
      })
    },
    [setValue, tableSpecs]
  )

  const onCheckedShowAll = useCallback(
    (value: boolean) => {
      setValue(() =>
        tableSpecs.reduce(
          (result, curr) => ({ ...result, [curr.key]: value }),
          {}
        )
      )
    },
    [setValue, tableSpecs]
  )

  useEffect(() => {
    dispatch(setColumnSettings(value))
  }, [dispatch, value])

  return (
    <TooltipBox
      show={showMenu}
      ref={menuRef}
      tooltipClassName="px-2"
      tooltipContent={
        <ul className="overflow-auto menu flex-nowrap w-56 max-h-96 overflow-y-auto p-0">
          <li>
            <label className="text-sm">
              <input
                type="checkbox"
                className="checkbox checkbox-sm checkbox-primary"
                checked={!value || tableSpecs.every((col) => value[col.key])}
                onChange={(e) => onCheckedShowAll(e.target.checked)}
              />
              {t('generic.showAllColumns')}
            </label>
          </li>
          {tableSpecs.map((col) => (
            <li key={col.key}>
              <label className="text-sm">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm checkbox-primary"
                  checked={value?.[col.key] ?? getDefaultDisplayColumn(col.key)}
                  onChange={(e) => onCheckedItem(col.key, e.target.checked)}
                />
                {t(`${col.header}`)}
              </label>
            </li>
          ))}
        </ul>
      }
    >
      <button
        type="button"
        className="btn btn-sm btn-circle btn-ghost"
        aria-label="toggle-columns"
        onClick={() => setShowMenu((prev) => !prev)}
      >
        <FontAwesomeIcon icon={faColumns} className="text-lg" />
      </button>
    </TooltipBox>
  )
}
