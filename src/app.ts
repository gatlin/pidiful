import { App, Mailbox, el } from './alm/alm';
import { Vector } from './vector';
import { Ball } from './ball';

const canvasMailbox = new Mailbox<HTMLElement | null>(null);

enum Direction {
    Left,
    Right,
    Up,
    Down,
    None
};

enum Actions {
    Tick,
    CanvasUpdate,
    Push,
    ToggleShowLog,
    ToggleAutoCorrect,
    SetPoint
};

type AppState = {
    geometry: Object;
    canvasCtx: any;
    ball: Ball;
    canvasWidth: number;
    canvasHeight: number;
    lastFrameTime: number;
    lastPushTime: number;
    push_force: number;
    show_log: boolean;
    refresh_rate: number;
};

type Action = {
    'type': Actions;
    data?: any;
};

function window_geometry() {
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
        viewHeight: viewHeight,
        viewWidth: window.innerWidth,
        pixelRation: pixelRatio
    };
}

function new_appstate(): AppState {
    const geom = window_geometry();
    return {
        geometry: geom,
        canvasCtx: null,
        ball: new Ball(20, 1.0, new Vector(
            0,
            geom.viewHeight - 20),
            new Vector(0, geom.viewHeight / 2)),
        canvasWidth: geom.viewWidth * 0.9,
        canvasHeight: geom.viewHeight,
        lastFrameTime: Date.now(),
        lastPushTime: 0,
        push_force: 500,
        show_log: true,
        refresh_rate: 1000.0 / 60.0
    };
}

function draw(model) {
    const ctx = model.canvasCtx;
    const cW = model.canvasWidth;
    const cH = model.canvasHeight;
    ctx.clearRect(0, 0, cW, cH);
    model.ball.draw(ctx, cW, cH);
}

function valid_number(n) {
    return (!isNaN(n));
}

function update_model(action: Action, model: AppState): AppState {
    const dispatch = {};

    dispatch[Actions.Tick] = () => {
        if (!model.canvasCtx) { return model; }

        const currentTime = Date.now();
        const dt = (currentTime - model.lastFrameTime) / 1000;

        const bound_left = -1 * (model.canvasWidth / 2);
        const bound_right = model.canvasWidth / 2;

        const gravity = new Vector(0, -980);

        model.ball
            .update(dt, gravity)
            .bounds_check(model.canvasHeight, bound_right, 0, bound_left);

        if (currentTime - model.lastPushTime > 500) {
            model.ball.acc.multiplyScalar(0.75);
        }

        model.lastFrameTime = currentTime;
        draw(model);

        return model;
    };

    dispatch[Actions.CanvasUpdate] = () => {
        const canvasEl = action.data;
        model.canvasCtx = canvasEl.getContext('2d');
        return model;
    };

    dispatch[Actions.Push] = () => {
        switch (action.data) {
            case Direction.Left:
                model.ball.acc.x -= model.push_force;
                break;
            case Direction.Right:
                model.ball.acc.x += model.push_force;
                break;

            case Direction.Up:
                model.ball.acc.y += model.push_force;
                break;

            case Direction.Down:
                model.ball.acc.y -= model.push_force;
                break;

            default:
                model.lastPushTime = Date.now();
                break;
        }
        return model;
    };

    dispatch[Actions.ToggleShowLog] = () => {
        model.show_log = !model.show_log;
        return model;
    }

    dispatch[Actions.ToggleAutoCorrect] = () => {
        model.ball.assist = !model.ball.assist;
        if (model.ball.assist) {
            model.ball.i = new Vector();
            model.ball.d = new Vector();
        }
        return model;
    }

    dispatch[Actions.SetPoint] = () => {
        const evt = action.data;
        const rect = evt
            .target
            .getBoundingClientRect();

        const xCoord = evt.clientX - rect.left;
        const yCoord = evt.clientY - rect.top;

        model.ball.desired = new Vector(
            xCoord - (model.canvasWidth / 2),
            model.canvasHeight - yCoord
        );
        /*
                model.ball.i = new Vector();
                model.ball.d = new Vector();
        */
        return model;
    };
    return dispatch[action.type]();
}

function main(scope) {
    scope.ports.inbound.tick
        .map(() => ({ type: Actions.Tick }))
        .connect(scope.actions);

    // left arrow
    scope.events.keydown
        .filter(evt => evt.getRaw().keyCode === 37)
        .map(evt => ({
            type: Actions.Push,
            data: Direction.Left
        }))
        .connect(scope.actions);

    // right arrow
    scope.events.keydown
        .filter(evt => evt.getRaw().keyCode === 39)
        .map(evt => ({
            type: Actions.Push,
            data: Direction.Right
        }))
        .connect(scope.actions);

    // up arrow
    scope.events.keydown
        .filter(evt => evt.getRaw().keyCode === 38)
        .map(evt => ({
            type: Actions.Push,
            data: Direction.Up
        }))
        .connect(scope.actions);

    // down arrow
    scope.events.keydown
        .filter(evt => evt.getRaw().keyCode === 40)
        .map(evt => ({
            type: Actions.Push,
            data: Direction.Down
        }))
        .connect(scope.actions);

    // all
    scope.events.keyup
        .map(evt => ({
            type: Actions.Push,
            data: Direction.None
        }))
        .connect(scope.actions);

    scope.events.change
        .filter(evt => evt.getId() === 'show-log-ctrl')
        .map(evt => ({
            type: Actions.ToggleShowLog
        }))
        .connect(scope.actions);

    scope.events.change
        .filter(evt => evt.getId() === 'auto-correct-ctrl')
        .map(evt => ({
            type: Actions.ToggleAutoCorrect
        }))
        .connect(scope.actions);

    scope.events.keydown
        .filter(evt => evt.getRaw().keyCode === 32)
        .map(evt => ({
            type: Actions.ToggleAutoCorrect
        }))
        .connect(scope.actions);

    scope.events.click
        .filter(evt => evt.getId() === 'the_canvas')
        .map(evt => ({
            type: Actions.SetPoint,
            data: evt.getRaw()
        }))
        .connect(scope.actions);

    canvasMailbox
        .filter(cnvs => cnvs !== null)
        .map(cnvs => ({
            type: Actions.CanvasUpdate,
            data: cnvs
        }))
        .connect(scope.actions);
}

function render(state) {

    const push_bar = el('div', {
        'class': 'horizontal-bar',
        'id': 'push-bar'
    }, [
            //el('button', { 'class': 'push-btn', 'id': 'left-btn' }, ['Left']),
            //el('button', { 'class': 'push-btn', 'id': 'right-btn' }, ['Right'])
        ]);

    const log_bar = state.show_log
        ? el('span', {}, [
            el('p', {}, [state.ball.pos.toString()]),
            el('p', {}, [state.ball.vel.toString()]),
            el('p', {}, [state.ball.acc.toString()])])
        : el('span', {}, []);

    const show_log_ctrl_attrs = {
        'type': 'checkbox',
        'id': 'show-log-ctrl'
    };

    if (state.show_log) {
        show_log_ctrl_attrs['checked'] = 'checked';
    }
    const show_log_ctrl = el('input', show_log_ctrl_attrs, []);

    const auto_correct_attrs = {
        'type': 'checkbox',
        'id': 'auto-correct-ctrl',
        'key': 'auto-correct-' + Date.now().toString()
    };

    if (state.ball.assist) {
        auto_correct_attrs['checked'] = 'checked';
    }

    const auto_correct_ctrl = el('input', auto_correct_attrs, []);

    return el('div', { 'id': 'main' }, [
        el('canvas', {
            'id': 'the_canvas',
            'height': state.canvasHeight,
            'width': state.canvasWidth
        }, [])
            .subscribe(canvasMailbox),
        auto_correct_ctrl,
        push_bar,
        show_log_ctrl,
        log_bar,
    ]);
}

const app = new App<AppState>({
    domRoot: 'app',
    state: new_appstate(),
    update: update_model,
    render: render,
    ports: {
        inbound: ['tick']
    },
    main: main
});

const runtime = app.start();

function tick(ts) {
    runtime.ports.inbound.tick.send(null);
    window.requestAnimationFrame(tick);
}

window.requestAnimationFrame(tick);
