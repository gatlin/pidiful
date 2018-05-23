/**
 * @module reducer
 * The state reducer function.
 */

import { Actions } from '../actions';
import { State, window_geometry } from '../store';
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
            const drag_area = Math.PI * state.ball.radius * state.ball.radius;
            const air_density = 0.75;
            const drag = drag_area * state.ball.C_d * air_density * 0.5;

            const horiz_multiplier = state.ball.vel.x === 0
                ? 0 : state.ball.vel.x > 0
                    ? -1
                    : 1;

            const vert_multiplier = state.ball.vel.y === 0
                ? 0 : state.ball.vel.y > 0
                    ? -1
                    : 1;

            const reality = gravity
                .multiplyScalar(state.ball.mass)
                .add(new Vector(
                    horiz_multiplier * drag,
                    vert_multiplier * drag));

            const ball = state.ball
                .adjust(reality)
                .update(dt)
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

        default:
            return state;
    }
};

export default reducer;
