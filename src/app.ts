import { App, Mailbox, el } from './alm/alm';
import { Vector } from './vector';
const canvasMailbox = new Mailbox<HTMLElement | null>(null);

enum Direction {
    Left,
    Right,
    None
};

enum Actions {
    Tick,
    CanvasUpdate,
    Push,
    UpdateKP,
    UpdateKI,
    UpdateKD,
    UpdateForce
};

type AppState = {
    canvasCtx: any;
    pos: Vector;
    vel: Vector;
    acc: Vector;
    mass: number;
    radius: number;
    desired: Vector;
    canvasWidth: number;
    canvasHeight: number;
    i: number;
    d: number;
    kP: number;
    kI: number;
    kD: number;
    lastFrameTime: number;
    push_force: number;
};

type Action = {
    'type': Actions;
    data?: any;
};

function new_appstate(): AppState {
    return {
        canvasCtx: null,
        pos: new Vector(0, 600 - 32),
        vel: new Vector(0, 0),
        acc: new Vector(0, 0),
        mass: 1,
        radius: 32,
        desired: new Vector(0, 0),
        canvasWidth: 800,
        canvasHeight: 600,
        i: 0,
        d: 0,
        kP: 0.2,
        kI: 0.01,
        kD: 0.5,
        lastFrameTime: Date.now(),
        push_force: 1000
    };
}

function draw(model) {
    const ctx = model.canvasCtx;
    const cW = model.canvasWidth;
    const cH = model.canvasHeight;
    const r = model.radius - 7;

    // draw a circle
    ctx.clearRect(0, 0, cW, cH);
    ctx.beginPath();
    ctx.lineWidth = 7;
    ctx.strokeStyle = '#325FA2';
    ctx.arc((cW / 2) + model.pos.getX(),
        (cH - model.pos.getY()), r, 0, Math.PI * 2, true);
    ctx.stroke();
}

function update_model(action: Action, model: AppState): AppState {
    const dispatch = {};

    dispatch[Actions.Tick] = () => {
        if (!model.canvasCtx) { return model; }

        const currentTime = Date.now();
        const dt = (currentTime - model.lastFrameTime) / 1000; // in seconds

        const fy = new Vector(0, -1000);

        const delta = model.vel.clone().multiplyScalar(dt);
        model.pos.add(delta);

        const avg_acc = fy.add(model.acc).divideScalar(2);
        model.vel.add(avg_acc.multiplyScalar(dt));

        if (model.pos.y - model.radius < 0) {
            model.vel.y *= -0.5;
            model.pos.y = model.radius;
        }

        const bound_left = -1 * (model.canvasWidth / 2);
        if (model.pos.x < bound_left) {
            model.vel.x *= -0.5;
            model.pos.x = bound_left;
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
                model.acc.add(new Vector(-1 * model.push_force, 0));
                break;
            case Direction.Right:
                model.acc.add(new Vector(model.push_force, 0));
                break;
        }
        return model;
    };

    dispatch[Actions.UpdateKP] = () => {
        model.kP = action.data;
        return model;
    };

    dispatch[Actions.UpdateKI] = () => {
        model.kI = action.data;
        return model;
    };

    dispatch[Actions.UpdateKD] = () => {
        model.kD = action.data;
        return model;
    };

    dispatch[Actions.UpdateForce] = () => {
        model.push_force = action.data;
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

    // stopping
    scope.events.keyup
        .filter(evt => evt.getRaw().keyCode === 37 ||
            evt.getRaw().keyCode === 39)
        .map(evt => ({
            type: Actions.Push,
            data: Direction.None
        }))
        .connect(scope.actions);

    scope.events.change
        .filter(evt => evt.getId() === 'inp-kP')
        .map(evt => ({
            type: Actions.UpdateKP,
            data: evt.getValue()
        }))
        .connect(scope.actions);

    scope.events.change
        .filter(evt => evt.getId() === 'inp-kI')
        .map(evt => ({
            type: Actions.UpdateKI,
            data: evt.getValue()
        }))
        .connect(scope.actions);

    scope.events.change
        .filter(evt => evt.getId() === 'inp-kD')
        .map(evt => ({
            type: Actions.UpdateKD,
            data: evt.getValue()
        }))
        .connect(scope.actions);

    scope.events.change
        .filter(evt => evt.getId() === 'inp-force')
        .map(evt => ({
            type: Actions.UpdateForce,
            data: parseInt(evt.getValue())
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
                el('label', { 'for': 'inp-kP' }, ['kP =']),
                el('input', {
                    'type': 'text',
                    'value': state.kP,
                    'id': 'inp-kP'
                }, [])]),
            el('span', {}, [
                el('label', { 'for': 'inp-kI' }, ['kI =']),
                el('input', {
                    'type': 'text',
                    'value': state.kI,
                    'id': 'inp-kI'
                }, [])]),
            el('span', {}, [
                el('label', { 'for': 'inp-kD' }, ['kD =']),
                el('input', {
                    'type': 'text',
                    'value': state.kD,
                    'id': 'inp-kD'
                }, [])]),
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

    return el('div', { 'id': 'main' }, [
        el('canvas', {
            'id': 'the_canvas',
            'height': state.canvasHeight,
            'width': state.canvasWidth
        }, [])
            .subscribe(canvasMailbox),
        push_bar,
        ctrl_bar,
        el('p', {}, [state.pos.toString()]),
        el('p', {}, [state.vel.toString()]),
        el('p', {}, [state.acc.toString()])
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
