import { Vector } from './vector';
import { Thing } from './thing';
import { air_density } from './constants';

/**
 * A magical flying ball that does course correction using a PID controller.
 */
export class Ball extends Thing {

    public C_d: number;
    public i: Vector;
    public p: Vector;
    public d: Vector;
    public error: Vector;
    public kP: Vector;
    public kI: Vector;
    public kD: Vector;
    public radius: number;
    public run: boolean;
    public estimated_pos: Vector;
    public estimated_vel: Vector;

    constructor(
        radius: number,
        mass: number,
        pos: Vector,
        error: Vector = new Vector(0, 0),
        vel: Vector = new Vector(0, 0),
        acc: Vector = new Vector(0, 0),
        run: boolean = true,
        kP: Vector = new Vector(1.0, 7.25),
        kI: Vector = new Vector(0, 0),
        kD: Vector = new Vector(0, 0),
    ) {
        super(mass, pos, vel, acc);
        this.C_d = 0.47;
        this.radius = radius;
        this.p = new Vector();
        this.i = new Vector();
        this.d = new Vector();
        this.run = run;
        this.kP = kP;
        this.kI = kI;
        this.kD = kD;
        this.estimated_pos = this.pos.clone();
        this.estimated_vel = this.vel.clone();
        this.error = error;
    }

    public activate() {
        this.run = true;
        this.estimated_pos = new Vector();
        this.i = new Vector();
        this.error.add(new Vector(0, 100));
        return this;
    }

    public deactivate() {
        this.run = false;
        this.error = new Vector();
        this.p = new Vector();
        this.i = new Vector();
        this.d = new Vector();
        this.estimated_pos = new Vector();
        this.estimated_vel = new Vector();
        return this;
    }

    public toggleRunning() {
        if (this.run) {
            return this.deactivate();
        }
        return this.activate();
    }

    public drag_force(): Vector {
        const drag_area = Math.PI * this.radius * this.radius / (10000);
        const drag_scalar = drag_area * this.C_d * air_density * 0.5;

        let x = (this.vel.x * this.vel.x) / Math.abs(this.vel.x);
        let y = (this.vel.y * this.vel.y) / Math.abs(this.vel.y);

        if (isNaN(x)) {
            x = 0;
        }
        if (isNaN(y)) {
            y = 0;
        }
        const horiz_multiplier = this.vel.x === 0
            ? 0 : this.vel.x > 0
                ? -1
                : 1;

        const vert_multiplier = this.vel.y === 0
            ? 0 : this.vel.y > 0
                ? -1
                : 1;

        const drag = new Vector(
            horiz_multiplier * drag_scalar * x,
            vert_multiplier * drag_scalar * y
        );

        return drag;
    }

    // Actually respond to the signal
    public pid(dt: number): this {
        if (!this.run) {
            return this;
        }

        // We will pretend we are a vehicle with a functioning accelerometer.
        // We don't, strictly speaking, know our velocity or our absolute
        // position.
        // The error will be the distance we want to have traveled.
        // Using acceleration we will compute how far we actually traveled, and
        // update the error accordingly.

        const acc = this.acc.clone();
        this.estimated_vel.add(acc.clone().multiplyScalar(dt));
        this.estimated_pos.add(acc.clone().multiplyScalar(dt * 100));
        return this;
    }

    public bounds_check(t, r, b, l) {

        if (this.pos.y > (t - this.radius)) {
            this.pos.y = t - this.radius;
            this.vel.y *= -0.5;
        }

        if (this.pos.x + this.radius > r) {
            this.pos.x = r - this.radius;
            this.vel.x *= -0.7;
        }

        if (this.pos.y <= b) {
            this.vel.y *= -0.7;
            this.vel.x *= 0.99;
            this.pos.y = b;
        }

        if (this.pos.x - this.radius < l) {
            this.pos.x = l + this.radius;
            this.vel.x *= -0.7;
        }

        return this;
    }

    public draw(ctx, cW, cH) {
        const desired = this.pos.clone().add(this.error);
        ctx.beginPath();
        ctx.lineWidth = 7;
        ctx.strokeStyle = '#325FA2';
        ctx.arc((cW / 2) + this.pos.x,
            (cH - this.pos.y - this.radius),
            this.radius - 7,
            0,
            Math.PI * 2,
            true);
        ctx.stroke();
        /*
                if (this.run) {
                    ctx.beginPath();
                    ctx.strokeStyle = '#000000';
                    ctx.arc((cW / 2) + setPoint.x,
                        (cH - setPoint.y),
                        5,
                        0,
                        Math.PI * 2,
                        true);
                    ctx.stroke();
                }
        */
    }
}
