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

    div(divider) {
        this.x /= divider;
        this.y /= divider;
        return this;
    }

    static create(...args) {
        return new Vector(...args);
    }

    static fromObject({ x = 0, y = 0 }) {
        return Vector.create(x, y);
    }
}