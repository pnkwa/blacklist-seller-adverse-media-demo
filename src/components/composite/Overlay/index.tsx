import { useSelector } from 'react-redux'
import { getOverlayType } from 'reducers/ui'
import { OverlayType } from 'types/generic/overlay'
import { OverlayEffect } from './OverlayEffect'
import { GenericOverlay } from './GenericOverlay'
import { CreateCaseOverlay } from './CreateCaseOverlay'
import { LoadingOverlay } from './LoadingOverlay'
import { FilterOverlay } from './FilterOverlay'
import { FilterTransactionOverlay } from './FilterTransactionOverlay'
import { DuplicateOverlay } from './DuplicateOverlay'
import { PositionCriteriaSettingsOverlay } from './PositionCriteriaSettingsOverlay'

const overlayComponents: Record<OverlayType, React.FC> = {
  [OverlayType.GENERIC]: GenericOverlay,
  [OverlayType.LOADING]: LoadingOverlay,
  [OverlayType.CREATE_CASE]: CreateCaseOverlay,
  [OverlayType.FILTER]: FilterOverlay,
  [OverlayType.FILTER_TRANSACTION]: FilterTransactionOverlay,
  [OverlayType.DUPLICATE]: DuplicateOverlay,
  [OverlayType.POSITION_CRITERIA_SETTINGS]: PositionCriteriaSettingsOverlay,
}

export const Overlay: React.FC = () => {
  const overlayType = useSelector(getOverlayType)

  const Component = overlayType && overlayComponents[overlayType]

  return (
    <OverlayEffect isShow={!!Component}>
      {Component ? <Component /> : null}
    </OverlayEffect>
  )
}
