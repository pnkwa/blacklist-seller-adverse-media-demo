import { startAppListening } from 'store'
import { openCreateCaseAction, openCreateCaseEffect } from './openCreateCase'
import {
  openEditPositionCriteriaAction,
  openEditPositionCriteriaEffect,
} from './openEditPositionCriteria'

export const startAllListeners = () => {
  startAppListening({
    actionCreator: openCreateCaseAction,
    effect: openCreateCaseEffect,
  })
  startAppListening({
    actionCreator: openEditPositionCriteriaAction,
    effect: openEditPositionCriteriaEffect,
  })
}
