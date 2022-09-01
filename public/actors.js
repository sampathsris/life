
"use strict";

const WORLD_SIZE = 500;

class Actors {
    static get #PARTICLE_SIZE() { return 2; }
    static get #DEFAULT_FORCE_MAX_RANGE() { return 80; }
    static get #DEFAULT_ACCELERATION_FACTOR() { return 0.3; }
    static get #WALL_REBOUND() { return 0.01; }

    particles = [];
    #types;
    #groups;
    #rules;
    #forceMaxRange;
    #accelerationFactor;

    constructor({
        types, rules,
        forceMaxRange = Actors.#DEFAULT_FORCE_MAX_RANGE,
        accelerationFactor = Actors.#DEFAULT_ACCELERATION_FACTOR,
    }) {
        this.#types = types;
        this.#rules = rules;
        this.#forceMaxRange = forceMaxRange;
        this.#accelerationFactor = accelerationFactor;

        this.#groups = Object.keys(types).reduce((result, color) => {
            const group = this.#createGroup(types[color], color);
            result[color] = group;
            return result;
        }, {});

        this.particles = Object.keys(this.#groups)
            .reduce((result, key) => {
                return result.concat(this.#groups[key]);
            }, this.particles);

    }

    runRules(delta_t) {
        for (let rule of this.#rules) {
            let [on, by, factor] = rule;
            this.#runRule(
                this.#groups[on],
                this.#groups[by],
                factor * 0.01, delta_t
            );
        }
    }

    #createParticle(color, size = Actors.#PARTICLE_SIZE) {
        return {
            x: this.#random(),
            y: this.#random(),
            vx: 0, vy: 0,
            color, size, mass: 1,
        };
    }

    #createGroup(number, color) {
        const group = [];

        for (let i = 0; i < number; i++) {
            const p = this.#createParticle(color);
            group.push(p);
        }

        return group;
    }

    #random() {
        return Math.random() *
            WORLD_SIZE * 0.8 +
            WORLD_SIZE * 0.1;
    }

    #runRule(pg1, pg2, g, delta_t) {
        for (let i = 0; i < pg1.length; i++) {
            let ax = 0;
            let ay = 0;
            let a = pg1[i];

            for (let j = 0; j < pg2.length; j++) {
                let b = pg2[j];

                let dx = a.x - b.x;
                let dy = a.y - b.y;
                let d_square = dx * dx + dy * dy;
                let d = Math.sqrt(d_square);

                if (d > 0 && d < this.#forceMaxRange) {
                    // The equation for force takes the form of fundametal 
                    // interaction equations. E.g.: Equation for gravity is
                    //          G * M * m
                    //      F = —————————
                    //             r^2
                    // 
                    // `M` and `m`  should be `a.mass` and `b.mass`. However,
                    // since the acceleration would be `F / a.mass`, that term
                    // cancels out and we get the following equation:
                    let a_by_d = g * b.mass / d;
                    // Also, rather than dividing by d^2, we divide by d. The
                    // reason is, in the next step we need to calculate the
                    // x and y components of the force. This is done like so
                    // (θ being the angle of the force to the X axis):
                    //
                    //    fx = F * cos(θ) = F * dx / d
                    //    fy = F * sin(θ) = F * dy / d
                    //
                    // However, since we will anyway have to divide again by d,
                    // we just use d instead of d^2. This way we covert two
                    // inefficient division operations to multiplications.
                    //
                    // Since a mass and a displacement term is missing, what we
                    // get from the above equation actually isn't the force, but
                    // `a / d` (acceleration devided by dispacement).

                    // break the force into x and y components.
                    ax += (a_by_d * dx);
                    ay += (a_by_d * dy);
                }
            }

            // Now we know the components of accelration in x and y axis. These
            // are `ax` and `ay` respectively. We can now calculate the 
            // displacements like so:
            //      s = u * t + (1/2) * a * (t^2)
            // Rearrange to save a multiplication, and also use 0.5 to save a
            // division.
            //      s = (u + 0.5 * a * t) * t
            // a.x += (a.vx + 0.5 * ax * delta_t) * delta_t;
            // a.y += (a.vy + 0.5 * ay * delta_t) * delta_t;

            // We can also find the new velocity of the particle given by,
            //
            //      v = u + at
            // a.vx += ax * delta_t;
            // a.vy += ay * delta_t;

            a.vx = (a.vx + ax) * this.#accelerationFactor;
            a.vy = (a.vy + ay) * this.#accelerationFactor;

            a.x += a.vx;
            a.y += a.vy;

            // if (a.x <= 0 || a.x >= WORLD_SIZE) { a.vx *= WALL_REBOUND; }
            // if (a.y <= 0 || a.y >= WORLD_SIZE) { a.vy *= WALL_REBOUND; }

            if (a.x <= 0 || a.x >= Actors.WORLD_SIZE) {
                a.vx += Actors.#WALL_REBOUND * a.x < 0 ? 1 : -1;
            }
            if (a.y <= 0 || a.y >= Actors.WORLD_SIZE) {
                a.vy += Actors.#WALL_REBOUND * a.y < 0 ? 1 : -1;
            }
        }
    }
}
