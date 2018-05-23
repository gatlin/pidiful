import Vector from './vector';

export default class Ball {

    public C_d: number;
    public i: Vector;
    public lastPos: Vector;
    public error: Vector;
    public p: Vector;
    public d: Vector;

    constructor(
        public radius: number,
        public mass: number,
        public pos: Vector,
        public desired: Vector = new Vector(0, 0),
        public vel: Vector = new Vector(0, 0),
        public acc: Vector = new Vector(0, 0),
        public run: boolean = false,
        public kP: Vector = new Vector(5.0, 9.95),
        public kI: Vector = new Vector(0.01, 1.0),
        public kD: Vector = new Vector(0.04, 0.01),
    ) {
        this.C_d = 0.47;
        this.i = new Vector();
        this.lastPos = new Vector();
        this.error = new Vector();

        this.p = new Vector();
        this.d = new Vector();
    }

    public adjust(vec) {
        this.acc.add(vec);
        return this;
    }

    public activate() {
        this.run = true;
        this.lastPos = this.pos.clone();
        this.i = new Vector();
        return this;
    }

    public deactivate() {
        this.run = false;
        this.desired = this.pos.clone();
        return this;
    }

    public toggleRunning() {
        if (this.run) {
            return this.deactivate();
        }
        return this.activate();
    }

    // Each thing in this particular universe must take care of its own physics
    public update(dt: number): this {
        const gravity = new Vector(0, -980);
        const drag_area = Math.PI * this.radius * this.radius;
        const air_density = 0.75;
        const drag = drag_area * this.C_d * air_density * 0.5;

        const horiz_multiplier = this.vel.x === 0
            ? 0 : this.vel.x > 0
                ? -1
                : 1;

        const vert_multiplier = this.vel.y === 0
            ? 0 : this.vel.y > 0
                ? -1
                : 1;

        const reality = gravity
            .multiplyScalar(this.mass)
            .add(new Vector(
                horiz_multiplier * drag,
                vert_multiplier * drag));

        this.acc.add(reality);

        this.lastPos = this.pos.clone();
        this.pos.add(
            this.vel.clone()
                .multiplyScalar(dt)
                .add(this.acc.clone()
                    .multiplyScalar(0.5 * dt * dt)));

        this.vel.add(this.acc.multiplyScalar(dt));

        if (Math.abs(this.acc.x) <= 0.001) {
            this.acc.floor();
        }

        if (Math.abs(this.vel.x) < 0.001 ||
            Math.abs(this.vel.y) < 0.001) {
            this.vel.floor();
        }
        return this;
    }

    public pid(dt: number): this {
        if (this.run) {
            const err_t = this.desired.clone().subtract(this.pos);
            this.error = err_t.clone();
            const inp_t = this.pos.clone().subtract(this.lastPos);

            this.p = err_t.multiply(this.kP);
            this.i.add(err_t.clone().multiplyScalar(dt).multiply(this.kI));
            this.d = inp_t.multiply(this.kD);

            const correction = this.p
                .add(this.i)
                .subtract(this.d);
            this.acc.add(correction);
        }
        else {
            this.desired = this.pos.clone();
        }

        return this;
    }

    public bounds_check(t, r, b, l) {

        if (this.pos.y + this.radius > t) {
            this.pos.y = t - this.radius;
            this.vel.y *= -0.5;
        }

        if (this.pos.x + this.radius > r) {
            this.pos.x = r - this.radius - 1;
            this.vel.x *= -0.5;
            this.acc.x *= 0.9;
        }

        if (this.pos.y - this.radius < b) {
            this.vel.y *= -0.5;
            this.pos.y = this.radius;
        }

        if (this.pos.x - this.radius < l) {
            this.pos.x = l + this.radius;
            this.vel.x *= -0.5;
            this.acc.x *= 0.9;
        }

        return this;
    }

    public draw(ctx, cW, cH) {
        ctx.beginPath();
        ctx.lineWidth = 7;
        ctx.strokeStyle = '#325FA2';
        ctx.arc((cW / 2) + this.pos.x,
            (cH - this.pos.y),
            this.radius - 7,
            0,
            Math.PI * 2,
            true);
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#000000';
        ctx.arc((cW / 2) + this.desired.x,
            (cH - this.desired.y),
            5,
            0,
            Math.PI * 2,
            true);
        ctx.stroke();
    }
}
