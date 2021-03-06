/**
 * @module store
 * The state types as well as the initial application state.
 */

import { Vector, Ball } from '../physics';

export enum Direction {
    Left,
    Right,
    Up,
    Down
};

export type State = {
    geometry: Object;
    ball: Ball;
    canvasCtx: any; // fixme
    canvasWidth: number;
    canvasHeight: number;
    lastFrameTime: number;
    lastPushTime: number;
    push_force: number;
    show_log: boolean;
    refresh_rate: number;
}

export function window_geometry() {
    const winSize = Math.min(window.innerWidth,
        window.innerHeight - 50);
    let viewHeight;
    if (winSize >= 480) {
        viewHeight = 0.75 * winSize;
    } else {
        viewHeight = 0.95 * winSize;
    }
    if (viewHeight < 480) {
        viewHeight = window.innerWidth;
    }

    const pixelRatio = window.devicePixelRatio || 1;

    return {
        viewHeight,
        viewWidth: window.innerWidth,
        pixelRatio
    };
}

export const initialState = () => {
    const geometry = window_geometry();
    console.log
    let radius = geometry.viewHeight / 20.0 / geometry.pixelRatio;
    if (radius < 20) {
        radius = 20;
    }
    return {
        geometry,
        canvasCtx: null,
        ball: new Ball(
            radius,
            1.0,
            new Vector(0, 0)),
        canvasWidth: geometry.viewWidth - 10,
        canvasHeight: geometry.viewHeight,
        lastFrameTime: Date.now(),
        lastPushTime: 0,
        push_force: 500,
        show_log: true,
        refresh_rate: 1000.0 / 60.0
    };
};
