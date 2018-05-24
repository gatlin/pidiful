/**
 * @module reducer
 * The state reducer function.
 */

import { Actions } from '../actions';
import { State, window_geometry, Direction } from '../store';
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

        case Actions.Throttle: {
            const { ball } = state;
            if (!ball.run) {
                return state;
            }
            switch (action.data) {
                case Direction.Left:
                    ball.acc.subtract(new Vector(ball.thrust, 0));
                    break;

                case Direction.Right:
                    ball.acc.add(new Vector(ball.thrust, 0));
                    break;

                case Direction.Up:
                    ball.acc.add(new Vector(0, ball.thrust * 10));
                    break;

                case Direction.Down:
                    ball.acc.subtract(new Vector(0, ball.thrust));
                    break;
            }
            return state;
        }

        default:
            return state;
    }
};

export default reducer;
