import Vector from './vector';

export default class Ball {

    public C_d: number;
    public i: Vector;
    public lastPos: Vector;

    constructor(
        public radius: number,
        public mass: number,
        public pos: Vector,
        public desired: Vector = new Vector(0, 0),
        public vel: Vector = new Vector(0, 0),
        public acc: Vector = new Vector(0, 0),
        public run: boolean = false,
        public kP: Vector = new Vector(0.8, 0.85),
        public kI: Vector = new Vector(0.05, 0.15),
        public kD: Vector = new Vector(0.01, 0.05)) {
        this.C_d = 0.27;
        this.i = new Vector();
        this.lastPos = new Vector();
    }

    public move(vec) {
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

    public update(dt: number, otherForces: Vector): this {
        if (this.run) {
            const err_t = this.desired.clone().subtract(this.pos);
            const inp_t = this.pos.clone().subtract(this.lastPos);
            this.i.add(err_t.clone().multiplyScalar(dt).multiply(this.kI));
            const correction = err_t
                .multiply(this.kP)
                .add(this.i)
                .subtract(inp_t.multiply(this.kD));
            this.acc.add(correction);
        }
        else {
            this.desired = this.pos.clone();
        }

        this.lastPos = this.pos.clone();
        this.pos.add(
            this.vel.clone()
                .multiplyScalar(dt)
                .add(this.acc.clone()
                    .multiplyScalar(0.5 * dt * dt)));

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

        otherForces
            .multiplyScalar(this.mass)
            .add(new Vector(
                horiz_multiplier * drag,
                vert_multiplier * drag));

        const avg_acc = otherForces
            .divideScalar(this.mass)
            .add(this.acc.clone())
            .divideScalar(2);

        this.vel.add(avg_acc.multiplyScalar(dt));

        if (Math.abs(this.acc.x) <= 0.001) {
            this.acc.floor();
        }

        if (Math.abs(this.vel.x) < 0.001 ||
            Math.abs(this.vel.y) < 0.001) {
            this.vel.floor();
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
