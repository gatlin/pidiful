/**
 * @module actions
 * Two sorts of things are exported from here: the {@link Actions} enum and the
 * actual action creators.
 */

import { Direction } from '../store';

export enum Actions {
    Tick,
    CanvasUpdate,
    ToggleShowLog,
    ToggleRun,
    SetPoint
};

export const tick = () => ({
    type: Actions.Tick
});

export const canvasUpdate = data => ({
    type: Actions.CanvasUpdate,
    data
});

export const toggleShowLog = () => ({
    type: Actions.ToggleShowLog
});

export const toggleRun = () => ({
    type: Actions.ToggleRun
});

export const setPoint = data => ({
    type: Actions.SetPoint,
    data
});
