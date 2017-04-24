import { App, Mailbox, el } from './alm/alm';

const canvasMailbox = new Mailbox<HTMLElement | null>(null);

enum ArrowKey {
    Left,
    Right
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
    pos: number;
    desired: number;
    canvasWidth: number;
    canvasHeight: number;
    i: number;
    d: number;
    kP: number;
    kI: number;
    kD: number;
    lastFrameTime: number;
    force: number;
    lastPushTime: number;
};

type Action = {
    'type': Actions;
    data?: any;
};

function new_appstate(): AppState {
    return {
        canvasCtx: null,
        pos: 0,
        desired: 0,
        canvasWidth: 400,
        canvasHeight: 400,
        i: 0,
        d: 0,
        kP: 0.2,
        kI: 0.01,
        kD: 0.5,
        lastFrameTime: Date.now(),
        force: 20,
        lastPushTime: Date.now()
    };
}

function draw(model) {
    const ctx = model.canvasCtx;
    const cW = model.canvasWidth;
    const cH = model.canvasHeight;

    // draw a line
    ctx.clearRect(0, 0, cW, cH);
    ctx.beginPath();
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#325FA2';
    ctx.arc((cW / 2) + model.pos, cH / 2, 50, 0, Math.PI * 2, true);
    ctx.stroke();
}

function update_model(action: Action, model: AppState): AppState {
    const dispatch = {};

    dispatch[Actions.Tick] = () => {
        if (!model.canvasCtx) { return model; }
        const time = Date.now();
        const dt = time - model.lastFrameTime;
        draw(model);
        const e_t = model.desired - model.pos;
        model.i = Math.floor(model.i + e_t * dt);
        model.d = Math.floor((e_t - model.d) / dt);
        const dP = model.kP * e_t +
            model.kI * model.i +
            model.kD * model.d;
        model.pos = Math.floor(model.pos + (dP / 5));
        model.lastFrameTime = time;
        return model;
    };

    dispatch[Actions.CanvasUpdate] = () => {
        const canvasEl = action.data;
        model.canvasCtx = canvasEl.getContext('2d');
        return model;
    };

    dispatch[Actions.Push] = () => {
        model.pos = action.data === ArrowKey.Left
            ? model.pos - model.force
            : model.pos + model.force;
        model.lastPushTime = Date.now();
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
        model.force = action.data;
        return model;
    };

    if (isNaN(model.pos)) {
        model.pos = 0;
        model.i = 0;
        model.d = 0;
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
            data: ArrowKey.Left
        }))
        .connect(scope.actions);

    // right arrow
    scope.events.keydown
        .filter(evt => evt.getRaw().keyCode === 39)
        .map(evt => ({
            type: Actions.Push,
            data: ArrowKey.Right
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
                }, [])])
        ]);

    const force_bar = el('div', {
        'class': 'horizontal-bar',
        'id': 'force-bar'
    }, [
            el('span', {}, [
                el('label', { 'for': 'inp-force' }, ['Force =']),
                el('input', {
                    'type': 'text',
                    'value': state.force,
                    'id': 'inp-force'
                }, [])])
        ]);

    return el('div', { 'id': 'main' }, [
        el('canvas', {
            'id': 'the_canvas',
            'height': state.canvasHeight,
            'width': state.canvasWidth
        }, [])
            .subscribe(canvasMailbox),
        ctrl_bar,
        force_bar
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
