import React, { ChangeEvent, useCallback, useMemo } from 'react'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfo } from '@fortawesome/free-solid-svg-icons'
import { useTenantConfigContext } from 'context/TenantConfigContext'
import { getFilterPopup, setFilterPopupOptions } from 'reducers'
import { getMasterData } from 'masterdata'
import { emptyPositionOption } from 'masterdata/flow'
import { TooltipBox } from 'components/base/TooltipBox'
import { FilterFieldConfig, FilterFieldType } from 'types/generic'
import { getMasterdataTranslation } from 'utils/translations'
import { DashboardFilterFieldConfig, tagOptions } from 'config/filter'
import { DateRangePicker } from 'components/form/DateRangePicker'
import { InputTag } from '../InputTag'
import { PositionDropdown } from './PositionDropdown'
import { PositionTableField } from './PositionTableField'

const FieldContainer: React.FC<{
  label: React.ReactNode
  children: React.ReactNode
}> = ({ label, children }) => {
  return (
    <div className="flex-1 grid grid-cols-3 gap-4">
      <div className="col-span-1 text-sm mt-2">{label}</div>
      <div className="col-span-2 rounded-lg">{children}</div>
    </div>
  )
}

interface FilterPopupProps {
  dashboardTabConfig: DashboardFilterFieldConfig
  isReset: boolean
  searchInputValue: string
  searchFieldTooltipText: string | undefined
  onReset: () => void
  onSearchInputChange: (e: ChangeEvent<HTMLInputElement>) => void
}

interface FilterFieldProps {
  config: FilterFieldConfig
  isReset: boolean
  onReset: () => void
}

const FilterField: React.FC<FilterFieldProps> = ({
  config,
  isReset,
  onReset,
}) => {
  const dispatch = useDispatch()
  const { fieldType, key } = config
  const { t } = useTranslation()
  const { client } = useTenantConfigContext()
  const { filter } = useSelector(getFilterPopup)
  const templates = getMasterData('positions', client)

  const caseTypeOptions = useMemo(
    () =>
      Object.keys(templates).map((key) => ({
        key: templates[key]?.position?.key,
        translations: templates[key]?.position?.translations,
      })),
    [templates]
  )

  const clearFilter = useCallback(
    (key: string | string[]) =>
      dispatch(
        setFilterPopupOptions({
          removedKeys: typeof key === 'string' ? [key] : key,
        })
      ),
    [dispatch]
  )

  const setFilter = useCallback(
    (value, fieldKey?) => {
      if (value) {
        dispatch(
          setFilterPopupOptions({
            filter: {
              [fieldKey ?? key]: value,
            },
          })
        )
      } else clearFilter([key])
    },
    [clearFilter, dispatch, key]
  )

  switch (fieldType) {
    case FilterFieldType.DATE_RANGE_PICKER:
      return (
        <DateRangePicker
          value={filter?.[key]}
          onSubmitDate={(value) => {
            if (value.length && value.every((v) => v)) setFilter(value)
            else setFilter(undefined)
          }}
          defaultValue={undefined}
          className="pl-4 h-8 text-xs text-gray-400"
        />
      )
    case FilterFieldType.CASE_TYPE_DROPDOWN:
      return (
        <PositionDropdown
          placeholder={t('filters.placeholder.positions')}
          options={[emptyPositionOption, ...caseTypeOptions]}
          renderer={(item) => (
            <PositionTableField
              label={getMasterdataTranslation(item)}
              key={item.key}
            />
          )}
          isReset={isReset}
          onReset={onReset}
          onChange={setFilter}
          defaultValue={filter?.[key]}
          className="h-8 rounded-lg w-full"
          classNameIcon="right-3 top-2"
        />
      )
    case FilterFieldType.TAG_DROPDOWN:
      return (
        <div className="flex w-full">
          <PositionDropdown
            defaultValue={filter?.tagOperator}
            placeholder={t('tag.placeholder.tagOperator')}
            options={tagOptions}
            renderer={(item) => (
              <PositionTableField label={getMasterdataTranslation(item)} />
            )}
            isReset={isReset}
            onReset={onReset}
            onChange={(e) => setFilter(e, 'tagOperator')}
            className="h-[2.65rem] rounded-lg w-20 mr-1"
            classNameIcon="right-3 top-2"
          />
          <InputTag
            tags={filter?.[key]}
            header={t('tag.title.filter')}
            containerClassName="h-10 border-0"
            isReset={isReset}
            onReset={onReset}
            onAddTag={(_tag, newTags) => setFilter(newTags)}
            onDeleteTag={(_tag, newTags) => setFilter(newTags)}
          />
        </div>
      )
    default:
      return null
  }
}

export const FilterPopup: React.FC<FilterPopupProps> = ({
  dashboardTabConfig,
  onSearchInputChange,
  onReset,
  isReset,
  searchFieldTooltipText,
  searchInputValue,
}) => {
  const { t } = useTranslation()
  const { client } = useTenantConfigContext()

  const fields = useMemo(
    () => dashboardTabConfig?.getFilterFieldConfigs(client),
    [client, dashboardTabConfig]
  )

  return (
    <div className="space-y-6 flex-1 p-1 overflow-y-auto overflow-x-hidden">
      <FieldContainer label={t('filters.search')}>
        <div className="relative">
          <input
            type="text"
            className={classNames(
              'input input-primary w-full h-8 appearance-none bg-transparent',
              'text-xs px-4 border-base-300 focus:border-none'
            )}
            value={searchInputValue}
            onChange={onSearchInputChange}
            placeholder={t('filters.placeholder.search')}
          />
          <div className="absolute top-0.5 right-0">
            <TooltipBox
              tooltipContent={searchFieldTooltipText}
              tooltipClassName="text-base-100 bg-neutral p-3"
            >
              <FontAwesomeIcon
                icon={faInfo}
                className={classNames(
                  'p-0.5 mr-2 rounded-full border w-2 h-2 text-neutral',
                  'border-neutral'
                )}
              />
            </TooltipBox>
          </div>
        </div>
      </FieldContainer>
      {fields?.map(({ key, fieldType, label }) => {
        return (
          <FieldContainer key={key} label={t(label)}>
            <FilterField
              config={{ key, fieldType, label }}
              isReset={isReset}
              onReset={onReset}
            />
          </FieldContainer>
        )
      })}
    </div>
  )
}
