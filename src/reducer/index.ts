/**
 * @module reducer
 * The state reducer function.
 */

import { Actions } from '../actions';
import { State, Direction, window_geometry } from '../store';
import Vector from '../vector';

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

            const gravity = new Vector(0, -980);

            const ball = state.ball
                .update(dt, gravity)
                .bounds_check(state.canvasHeight, bound_right, 0, bound_left);

            const acc = state.ball.acc;

            if (currentTime - state.lastPushTime > 500) {
                acc.multiplyScalar(0.75);
            }

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
            const ball = state.ball;
            ball.toggleRunning();
            return state;
        }


        case Actions.SetPoint: {
            const ball = state.ball;
            if (!ball.run) {
                return { ...state };
            }

            const evt = action.data;
            const rect = evt.target.getBoundingClientRect();

            const xCoord = evt.clientX - rect.left;
            const yCoord = evt.clientY - rect.top;

            ball.desired = new Vector(
                xCoord - (state.canvasWidth / 2),
                state.canvasHeight - yCoord
            );

            return {
                ...state,
                ball
            };
        }

        case Actions.Push: {
            switch (action.data) {
                case Direction.Left:
                    break;

                case Direction.Right:
                    break;

                case Direction.Up:
                    break;

                case Direction.Down:
                    break;
            }
        }

        default:
            return state;
    }
};

export default reducer;
