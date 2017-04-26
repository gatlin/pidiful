import { Vector } from './vector';

export class Ball {
    public radius: number;
    public mass: number;
    public pos: Vector;
    public vel: Vector;
    public acc: Vector;

    constructor(radius, mass, pos, vel = new Vector(0, 0),
        acc = new Vector(0, 0)) {
        this.radius = radius;
        this.mass = mass;
        this.pos = pos;
        this.vel = vel;
        this.acc = acc;
    }

    public update(dt: number, otherForces: Vector): this {
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

        if (Math.abs(this.acc.x) < 0.0001) {
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
    }
}
