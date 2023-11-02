class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    copy() {
        return Vector.create(this.x, this.y);
    }

    set(x = this.x, y = this.x) {
        if (x instanceof Vector) {
            this.x = x.x;
            this.y = x.y;
        } else {
            this.x = x;
            this.y = y;
        }
        return this;
    }

    add(other) {
        this.x += other.x;
        this.y += other.y;
        return this;
    }

    limit(limiter = 1) {
        const mag = Math.sqrt(this.x * this.x + this.y * this.y);
        if (mag > limiter) this.mag(limiter);
        return this;
    }

    mult(multiplier) {
        this.x *= multiplier;
        this.y *= multiplier;
        return this;
    }

    div(divider) {
        this.x /= divider;
        this.y /= divider;
        return this;
    }

    sub(subtracter) {
        this.x -= subtracter.x;
        this.y -= subtracter.y;
        return this;
    }

    normalize() {
        const mag = Math.sqrt(this.x * this.x + this.y * this.y);
        if (mag > 0) this.div(mag);
        return this;
    }

    mag(magnitude = 1) {
        return this.normalize().mult(magnitude);
    }

    magnitute() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    heading() {
        return Math.atan2(this.y, this.x);
    }

    fromAngle(angle) {
        return this.set(Math.cos(angle), Math.sin(angle));
    }

    dist(vec) {
        return vec.copy().sub(this).magnitute();
    }

    lerp(target, amount) {
        amount = Math.max(0, Math.min(1, amount));

        this.x = this.x + (target.x - this.x) * amount;
        this.y = this.y + (target.y - this.y) * amount;

        return this;
    }

    static create(...args) {
        return new Vector(...args);
    }

    static fromObject({ x = 0, y = 0 }) {
        return Vector.create(x, y);
    }

    static fromAngle(angle) {
        return Vector.create(Math.cos(angle), Math.sin(angle));
    }

    static dist(vec1, vec2) {
        return Math.sqrt(
            Math.pow(vec1.x - vec2.x, 2) + Math.pow(vec1.y - vec2.y, 2)
        );
    }

    static sub(vec1, vec2) {
        return vec1.copy().sub(vec2);
    }
}
