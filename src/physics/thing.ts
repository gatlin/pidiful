import { Vector } from './vector';

/**
 * Physical entities in our simulation.
 */
export abstract class Thing {
    public mass: number;
    public pos: Vector;
    public vel: Vector;
    public acc: Vector;
    constructor(
        mass,
        pos = new Vector(),
        vel = new Vector(),
        acc = new Vector(),
    ) {
        this.mass = mass;
        this.pos = pos;
        this.vel = vel;
        this.acc = acc;
    }

    /**
     * Perform physics after a time step dt, taking into account other forces
     * (such as drag).
     */
    public step(dt: number, otherForces: Vector = new Vector()): this {
        const gravity = new Vector(0, -9.81);
        const drag = this.drag_force().divideScalar(this.mass);
        this.acc
            .add(drag.add(gravity).clone())
            .divideScalar(2);

        this.vel.add(this.acc.clone().multiplyScalar(dt));
        this.pos.add(this.vel.clone().multiplyScalar(dt * 100));
        return this;
    }

    abstract drag_force(): Vector;
    abstract bounds_check(t: number, r: number, b: number, l: number): this;
    abstract draw(ctx: any, cW: number, cH: number): void;
}
