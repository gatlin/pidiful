import { Vector } from './vector';

export class Ball {
    public radius: number;
    public mass: number;
    public pos: Vector;
    public vel: Vector;
    public acc: Vector;
    public desired: Vector;

    public kP: Vector;
    public kI: Vector;
    public kD: Vector;
    public assist: boolean;
    public C_d: number;
    public i: Vector;
    public d: Vector;

    constructor(radius, mass, pos, desired = new Vector(0, 0),
        vel = new Vector(0, 0),
        acc = new Vector(0, 0),
        assist = false,
        kP = new Vector(0.8, 0.8),
        kI = new Vector(0.08, 0.5),
        kD = new Vector(0.3, 0.1)) {
        this.radius = radius;
        this.mass = mass;
        this.pos = pos;
        this.vel = vel;
        this.acc = acc;
        this.desired = desired;
        this.assist = assist;
        this.kP = kP;
        this.kI = kI;
        this.kD = kD;
        this.C_d = 0.47;
        this.i = new Vector();
        this.d = new Vector();
    }

    public update(dt: number, otherForces: Vector): this {

        if (this.assist) {
            const err_t = this.desired.clone().subtract(this.pos);
            this.i.add(err_t.clone().multiplyScalar(dt));
            const correction = err_t.multiply(this.kP)
                .add(this.i.clone().multiply(this.kI))
                .subtract(this.d.clone().multiply(this.kD));
            this.d = err_t;

            this.acc.add(correction);
        }

        this.pos.add(
            this.vel.clone()
                .multiplyScalar(dt)
                .add(this.acc.clone()
                    .multiplyScalar(0.5 * dt * dt)));

        const horiz_multiplier = this.vel.x === 0
            ? 0 : this.vel.x > 0
                ? -1
                : 1;

        const vert_multiplier = this.vel.y === 0
            ? 0 : this.vel.y > 0
                ? -1
                : 1;

        const drag_area = Math.PI * this.radius * this.radius;
        const air_density = 0.75;
        const drag = drag_area * this.C_d * air_density * 0.5;
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
