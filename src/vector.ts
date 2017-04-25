export class Vector {
    public x: number;
    public y: number;

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    public getX() { return this.x; }
    public getY() { return this.y; }

    public

    public length() {
        return Math.sqrt(
            this.x * this.x + this.y * this.y
        );
    }

    public add(vec) {
        this.x += vec.x;
        this.y += vec.y;
        return this;
    }

    public subtract(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
        return this;
    }

    public multiply(vec) {
        this.x *= vec.x;
        this.y *= vec.y;
        return this;
    }

    public divide(vec) {
        this.x /= vec.x;
        this.y /= vec.y;
        return this;
    }

    public addScalar(scalar) {
        this.x += scalar;
        this.y += scalar;
        return this;
    }

    public multiplyScalar(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    public divideScalar(scalar) {
        this.x /= scalar;
        this.y /= scalar;
        return this;
    }

    public invertX() {
        this.x *= -1;
        return this;
    }

    public invertY() {
        this.y *= -1;
        return this;
    }

    public invert() {
        return this.invertX().invertY();
    }

    public normalize() {
        const len = this.length();
        if (0 === len) {
            this.x = 1;
            this.y = 0;
        }
        else {
            this.divide(new Vector(len, len));
        }
        return this;
    }

    public square() {
        this.x = this.x * this.x;
        this.y = this.y * this.y;
        return this;
    }

    public clone() {
        return new Vector(this.x, this.y);
    }

    public dot(vec) {
        return this.x * vec.x + this.y * vec.y;
    }

    public cross(vec) {
        return (this.x * vec.y) - (this.y * vec.x);
    }

    public toString() {
        return '<' + this.x + ' , ' + this.y + '>';
    }
}
