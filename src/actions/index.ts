/**
 * @module actions
 * Two sorts of things are exported from here: the {@link Actions} enum and the
 * actual action creators.
 */

import { Vector } from '../physics';

export enum Actions {
    Tick,
    CanvasUpdate,
    ToggleShowLog,
    ToggleRun,
    Sling
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

export const sling = data => ({
    type: Actions.Sling,
    data
});
