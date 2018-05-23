/**
 * @module reducer
 * The state reducer function.
 */

import { Actions } from '../actions';
import { State, window_geometry } from '../store';
import { Vector } from '../physics';

function draw({ canvasCtx, canvasWidth, canvasHeight, ball }) {
    canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    ball.draw(canvasCtx, canvasWidth, canvasHeight);
}

const reducer = (state: State, action): State => {
    switch (action.type) {
        case Actions.Tick: {
            if (!state.canvasCtx) {
                return state;
            }

            const currentTime = Date.now();
            const dt = (currentTime - state.lastFrameTime) / 1000;

            const bound_left = -1 * (state.canvasWidth / 2);
            const bound_right = state.canvasWidth / 2;

            const ball = state.ball
                .step(dt)
                .pid(dt)
                .bounds_check(state.canvasHeight, bound_right, 0, bound_left);

            const acc = ball.acc;

            draw(state);

            return {
                ...state,
                lastFrameTime: currentTime,
                ball
            };
        }

        case Actions.CanvasUpdate: {
            const canvasEl = action.data;
            const canvasCtx = canvasEl.getContext('2d');
            return {
                ...state,
                canvasCtx
            };
        }

        case Actions.ToggleShowLog:
            return { ...state, show_log: !state.show_log };

        case Actions.ToggleRun: {
            let { ball } = state;
            ball.toggleRunning();
            return {
                ...state,
                ball
            };
        }

        case Actions.Sling: {
            const ball = state.ball;
            const evt = action.data;
            const rect = evt
                .target
                .getBoundingClientRect();

            const x = (evt.clientX - rect.left) - (state.canvasWidth / 2);
            const y = state.canvasHeight - (evt.clientY - rect.top);

            ball.vel = new Vector(
                (ball.pos.x - x) / 10,
                (ball.pos.y - y) / 10
            );

            return {
                ...state,
                ball
            };
        }

        default:
            return state;
    }
};

export default reducer;
