import { App, Mailbox, el } from './alm/alm';
import { Vector } from './vector';
import { Ball } from './ball';

const canvasMailbox = new Mailbox<HTMLElement | null>(null);

enum Direction {
    Left,
    Right,
    Up,
    None
};

enum Actions {
    Tick,
    CanvasUpdate,
    Push,
    UpdateKPx,
    UpdateKIx,
    UpdateKDx,
    UpdateKPy,
    UpdateKIy,
    UpdateKDy,
    UpdateForce,
    ToggleShowLog,
    ToggleAutoCorrect
};

type AppState = {
    canvasCtx: any;
    ball: Ball;
    desired: Vector;
    canvasWidth: number;
    canvasHeight: number;
    i: Vector;
    d: Vector;
    kP: Vector;
    kI: Vector;
    kD: Vector;
    lastFrameTime: number;
    lastPushTime: number;
    push_force: number;
    show_log: boolean;
    autoCorrect: boolean;
};

type Action = {
    'type': Actions;
    data?: any;
};

function new_appstate(): AppState {
    return {
        canvasCtx: null,
        ball: new Ball(20, 1.2, new Vector(0, 300 - 20)),
        desired: new Vector(0, 150),
        canvasWidth: 800,
        canvasHeight: 300,
        i: new Vector(0.0, 0.0),
        d: new Vector(0.0, 0.0),
        kP: new Vector(0.0, 0.0),
        kI: new Vector(0.0, 0.0),
        kD: new Vector(0.0, 0.0),
        lastFrameTime: Date.now(),
        lastPushTime: 0,
        push_force: 500,
        show_log: false,
        autoCorrect: false
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

        const gravity = new Vector(0, -1000);

        /* now for the PID calculations */
        if (model.autoCorrect) {
            const ball = model.ball;
            const err_t = model.desired.clone()
                .subtract(ball.pos)
                ;

            const dt_p = dt * 1000;

            model.i.x += err_t.x * dt_p;
            model.i.y += err_t.y * dt_p;

            model.d.x = (err_t.x - model.d.x + 0.01) / (dt_p + 0.001);
            model.d.y = (err_t.y - model.d.y + 0.01) / (dt_p + 0.001);

            const correction = new Vector(
                err_t.x * model.kP.x +
                model.i.x * model.kI.x +
                model.d.x * model.kD.x,
                err_t.y * model.kP.y +
                model.i.y * model.kI.y +
                model.d.y * model.kD.y
            )
                .divideScalar(100);

            if (isNaN(correction.x) || isNaN(correction.y)) {
                console.log('correction has a NaN again!');
                console.log('correction', correction.toString());
                console.log('err_t', err_t.toString());
                console.log('kP', model.kP.toString());
                console.log('kI', model.kI.toString());
                console.log('kD', model.kD.toString());
                console.log('model.i', model.i.toString());
                console.log('model.d', model.d.toString());
                console.log('dt', dt);
                console.log('ball.acc', ball.acc.toString());
                console.log('gravity', gravity.toString());
            }
            gravity.add(correction).floor();

        }

        model.ball = model.ball
            .update(dt, gravity)
            .bounds_check(model.canvasHeight, bound_right, 0, bound_left);

        if (!model.autoCorrect && currentTime - model.lastPushTime > 500) {
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
        if (model.autoCorrect) {
            return model;
        }
        switch (action.data) {
            case Direction.Left:
                model.ball.acc.add(new Vector(-1 * model.push_force, 0));
                break;
            case Direction.Right:
                model.ball.acc.add(new Vector(model.push_force, 0));
                break;

            case Direction.Up:
                model.ball.acc.add(new Vector(0, model.push_force));
                break;

            case Direction.None:
                model.lastPushTime = Date.now();
                break
        }
        return model;
    };

    dispatch[Actions.UpdateKPx] = () => {
        model.kP.x = action.data;
        return model;
    };

    dispatch[Actions.UpdateKIx] = () => {
        model.kI.x = action.data;
        return model;
    };

    dispatch[Actions.UpdateKDx] = () => {
        model.kD.x = action.data;
        return model;
    };

    dispatch[Actions.UpdateKPy] = () => {
        model.kP.y = action.data;
        return model;
    };

    dispatch[Actions.UpdateKIy] = () => {
        model.kI.y = action.data;
        return model;
    };

    dispatch[Actions.UpdateKDy] = () => {
        model.kD.y = action.data;
        return model;
    };

    dispatch[Actions.UpdateForce] = () => {
        model.push_force = action.data;
        return model;
    };

    dispatch[Actions.ToggleShowLog] = () => {
        model.show_log = !model.show_log;
        return model;
    }

    dispatch[Actions.ToggleAutoCorrect] = () => {
        model.autoCorrect = !model.autoCorrect;
        if (model.autoCorrect) {
            model.i = new Vector();
            model.d = new Vector();
        }
        return model;
    }

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

    scope.events.keyup
        .map(evt => ({
            type: Actions.Push,
            data: Direction.None
        }))
        .connect(scope.actions);

    scope.events.change
        .filter(evt => evt.getId() === 'inp-kP-x')
        .map(evt => parseFloat(evt.getValue()))
        .filter(valid_number)
        .map(n => ({
            type: Actions.UpdateKPx,
            data: n
        }))
        .connect(scope.actions);

    scope.events.change
        .filter(evt => evt.getId() === 'inp-kI-x')
        .map(evt => parseFloat(evt.getValue()))
        .filter(valid_number)
        .map(n => ({
            type: Actions.UpdateKIx,
            data: n
        }))
        .connect(scope.actions);

    scope.events.change
        .filter(evt => evt.getId() === 'inp-kD-x')
        .map(evt => parseFloat(evt.getValue()))
        .filter(valid_number)
        .map(n => ({
            type: Actions.UpdateKDx,
            data: n
        }))
        .connect(scope.actions);

    scope.events.change
        .filter(evt => evt.getId() === 'inp-kP-y')
        .map(evt => parseFloat(evt.getValue()))
        .filter(valid_number)
        .map(n => ({
            type: Actions.UpdateKPy,
            data: n
        }))
        .connect(scope.actions);

    scope.events.change
        .filter(evt => evt.getId() === 'inp-kI-y')
        .map(evt => parseFloat(evt.getValue()))
        .filter(valid_number)
        .map(n => ({
            type: Actions.UpdateKIy,
            data: n
        }))
        .connect(scope.actions);

    scope.events.change
        .filter(evt => evt.getId() === 'inp-kD-y')
        .map(evt => parseFloat(evt.getValue()))
        .filter(valid_number)
        .map(n => ({
            type: Actions.UpdateKDy,
            data: n
        }))
        .connect(scope.actions);

    scope.events.change
        .filter(evt => evt.getId() === 'inp-force')
        .map(evt => parseFloat(evt.getValue()))
        .filter(valid_number)
        .map(n => ({
            type: Actions.UpdateForce,
            data: n
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

    canvasMailbox
        .filter(cnvs => cnvs !== null)
        .map(cnvs => ({
            type: Actions.CanvasUpdate,
            data: cnvs
        }))
        .connect(scope.actions);
}

function render(state) {

    const ctrl_bar = el('div', {
        'class': 'horizontal-bar',
        'id': 'ctrl-bar'
    }, [
            el('span', {}, [
                el('label', { 'for': 'inp-kP-x' }, ['kP.x =']),
                el('input', {
                    'type': 'text',
                    'value': state.kP.x,
                    'id': 'inp-kP-x'
                }, []),
                el('label', { 'for': 'inp-kP-y' }, ['kP.y =']),
                el('input', {
                    'type': 'text',
                    'value': state.kP.y,
                    'id': 'inp-kP-y'
                }, [])
            ]),
            el('span', {}, [
                el('label', { 'for': 'inp-kI-x' }, ['kI.x =']),
                el('input', {
                    'type': 'text',
                    'value': state.kI.x,
                    'id': 'inp-kI-x'
                }, []),
                el('label', { 'for': 'inp-kI-y' }, ['kI.y =']),
                el('input', {
                    'type': 'text',
                    'value': state.kI.y,
                    'id': 'inp-kI-y'
                }, [])
            ]),
            el('span', {}, [
                el('label', { 'for': 'inp-kD-x' }, ['kD.x =']),
                el('input', {
                    'type': 'text',
                    'value': state.kD.x,
                    'id': 'inp-kD-x'
                }, []),
                el('label', { 'for': 'inp-kD-y' }, ['kD.y =']),
                el('input', {
                    'type': 'text',
                    'value': state.kD.y,
                    'id': 'inp-kD-y'
                }, [])
            ]),
            el('span', {}, [
                el('label', { 'for': 'inp-force' }, ['F =']),
                el('input', {
                    'type': 'text',
                    'value': state.push_force,
                    'id': 'inp-force'
                }, [])
            ])
        ]);


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
        'id': 'auto-correct-ctrl'
    };

    if (state.autoCorrect) {
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
        ctrl_bar,
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

runtime.state.recv(st => {
    //console.log('state updated');
});

function tick() {
    runtime.ports.inbound.tick.send(null);
    window.requestAnimationFrame(tick);
}

tick();
