class Rectangle {
    constructor(x, y, w, h) {
        // from center
        this.x = x;
        this.y = y;

        // half-length
        this.w = w;
        this.h = h;
    }

    intersects(range) {
        return !(
            range.x - range.w > this.x + this.w ||
            range.x + range.w < this.x - this.w ||
            range.y - range.h > this.y + this.h ||
            range.y + range.h < this.y - this.h
        );
    }

    contains(point) {
        return (
            point.x >= this.x - this.w &&
            point.x <= this.x + this.w &&
            point.y >= this.y - this.h &&
            point.y <= this.y + this.h
        );
    }

    subdivide(region) {
        switch (region) {
            case "ne":
                return new Rectangle(
                    this.x + this.w / 2,
                    this.y - this.h / 2,
                    this.w / 2,
                    this.h / 2
                );
            case "nw":
                return new Rectangle(
                    this.x - this.w / 2,
                    this.y - this.h / 2,
                    this.w / 2,
                    this.h / 2
                );
            case "se":
                return new Rectangle(
                    this.x + this.w / 2,
                    this.y + this.h / 2,
                    this.w / 2,
                    this.h / 2
                );
            case "sw":
                return new Rectangle(
                    this.x - this.w / 2,
                    this.y + this.h / 2,
                    this.w / 2,
                    this.h / 2
                );
        }
    }
}

class QuadTree {
    constructor(boundary = new Rectangle(0, 0, 0, 0), capacity = 4) {
        // Rectangle class
        this.boundary = boundary;

        // the max number of points in a section
        this.capacity = capacity;

        // list of points in the quad
        this.points = [];

        // if the quad as been divided into other quads
        this.divided = false;

        this.northeast = null;
        this.northwest = null;
        this.southeast = null;
        this.southwest = null;
    }

    // divide the quad into 4 region like quad
    // northeast, northwest, southeast, southwest
    subdivide() {
        const b = this.boundary;

        this.northeast = new QuadTree(b.subdivide("ne"), this.capacity);
        this.northwest = new QuadTree(b.subdivide("nw"), this.capacity);
        this.southeast = new QuadTree(b.subdivide("se"), this.capacity);
        this.southwest = new QuadTree(b.subdivide("sw"), this.capacity);

        this.divided = true;
    }

    // adds a point like object to the quad
    // or if the quad is at max capacity divide it
    // and insert it in the corresponding region
    // point = point.x && point.y
    insert(point) {
        if (!this.boundary.contains(point.position)) return false;

        if (this.points.length < this.capacity) {
            this.points.push(point);
            return true;
        }
        if (!this.divided) this.subdivide();

        if (this.northeast?.insert(point)) return true;
        if (this.northwest?.insert(point)) return true;
        if (this.southeast?.insert(point)) return true;
        if (this.southwest?.insert(point)) return true;
    }

    // query the points like object in a given range and returns them
    query(range, found = []) {
        if (!this.boundary.intersects(range)) return found;
        for (let i = 0; i < this.points.length; i += 1)
            if (range.contains(this.points[i].position))
                found.push(this.points[i]);

        if (this.divided) {
            this.northeast?.query(range, found);
            this.northwest?.query(range, found);
            this.southwest?.query(range, found);
            this.southeast?.query(range, found);
        }

        return found;
    }
}
