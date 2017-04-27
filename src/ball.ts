import { Vector } from './vector';

export class Ball {
    public radius: number;
    public mass: number;
    public pos: Vector;
    public vel: Vector;
    public acc: Vector;
    public desired: Vector;
    public i: Vector;
    public d: Vector;
    public kP: Vector;
    public kI: Vector;
    public kD: Vector;
    public assist: boolean;

    constructor(radius, mass, pos, desired = new Vector(0, 0),
        vel = new Vector(0, 0),
        acc = new Vector(0, 0),
        assist = true, i = new Vector(), d = new Vector(),
        kP = new Vector(0.2, 0.8),
        kI = new Vector(0.01, 0.1),
        kD = new Vector(0.5, 1.5)) {
        this.radius = radius;
        this.mass = mass;
        this.pos = pos;
        this.vel = vel;
        this.acc = acc;
        this.desired = desired;
        this.assist = assist;
        this.i = i;
        this.d = d;
        this.kP = kP;
        this.kI = kI;
        this.kD = kD;
    }

    public update(dt: number, otherForces: Vector): this {
        if (this.assist) {
            const err_t = this.desired.clone()
                .subtract(this.pos)
                .multiplyScalar(1000);

            const dt_p = dt * 100;

            this.i.x += (err_t.x * dt_p) / 100;
            this.i.y += (err_t.y * dt_p) / 100;

            this.d.x = ((err_t.x - this.d.x) / (dt_p + 0.001)) / 100;
            this.d.y = ((err_t.y - this.d.y) / (dt_p + 0.001)) / 100;

            const correction = new Vector(
                err_t.x * this.kP.x +
                this.i.x * this.kI.x +
                this.d.x * this.kD.x,
                err_t.y * this.kP.y +
                this.i.y * this.kI.y +
                this.d.y * this.kD.y
            )
                .divideScalar(100);

            this.acc = correction;
            //            otherForces.add(correction);
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
        const drag_coefficient = drag_area * 1.2 * 0.47 / 100;
        const avg_acc = otherForces
            .add(new Vector(
                horiz_multiplier * drag_coefficient
                , vert_multiplier * drag_coefficient))
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
        }

        if (this.pos.y - this.radius < b) {
            this.vel.y *= -0.5;
            this.pos.y = this.radius;
        }

        if (this.pos.x - this.radius < l) {
            this.pos.x = l + this.radius + 1;
            this.vel.x *= -0.5;
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
