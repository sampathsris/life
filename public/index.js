
"use strict";

const WORLD_SIZE = 500;
const PARTICLE_SIZE = 2;
const DEFAULT_FORCE_MAX_RANGE = 80;
const DEFAULT_ACCELERATION_FACTOR = 0.3;

const createActors = ({
    types, rules,
    forceMaxRange = DEFAULT_FORCE_MAX_RANGE,
    accelerationFactor = DEFAULT_ACCELERATION_FACTOR,
}) => {
    const particle = (x, y, color, size = PARTICLE_SIZE) => {
        return {
            x, y, vx: 0, vy: 0,
            color, size, mass: 1,
        };
    }

    const random = () => Math.random() * WORLD_SIZE * 0.8 + WORLD_SIZE * 0.1;

    let particles = [];
    // const attractor = {
    //     x: WORLD_SIZE / 2,
    //     y: WORLD_SIZE / 2,
    //     size: 50,
    //     color: 'grey',
    //     mass: 10,
    //     range: 1000,
    // };
    // const attractorGroup = [attractor];
    // particles.push(attractor);

    const create = (number, color) => {
        const group = [];

        for (let i = 0; i < number; i++) {
            const p = particle(random(), random(), color);
            group.push(p);
        }

        return group;
    };

    const WALL_REBOUND = 0.01;

    const runRule = (pg1, pg2, g, delta_t) => {
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

                if (d > 0 && d < forceMaxRange) {
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

            a.vx = (a.vx + ax) * accelerationFactor;
            a.vy = (a.vy + ay) * accelerationFactor;

            a.x += a.vx;
            a.y += a.vy;

            // if (a.x <= 0 || a.x >= WORLD_SIZE) { a.vx *= WALL_REBOUND; }
            // if (a.y <= 0 || a.y >= WORLD_SIZE) { a.vy *= WALL_REBOUND; }
            
            if (a.x <= 0 || a.x >= WORLD_SIZE) {
                a.vx += WALL_REBOUND * a.x < 0 ? 1 : -1;
            }
            if (a.y <= 0 || a.y >= WORLD_SIZE) {
                a.vy += WALL_REBOUND * a.y < 0 ? 1 : -1;
            }
        }
    }

    const groups = Object.keys(types).reduce((result, key) => {
        const group = create(types[key], key);
        result[key] = group;
        return result;
    }, {});

    particles = Object.keys(groups).reduce((result, key) => {
        return result.concat(groups[key]);
    }, particles);

    const runRules = (delta_t) => {
        for (let rule of rules) {
            let [ on, by, factor ] = rule;
            runRule(groups[on], groups[by], factor * 0.01, delta_t);
        }
    }

    return [
        particles,
        runRules,
    ];
};

const createWorld = (parentId, actors) => {
    const [ particles, runRules ] = actors;

    const getWorldSpace = (parentId) => {
        const root = document.getElementById(parentId);
        const canvas = document.createElement('canvas');
        canvas.height = WORLD_SIZE;
        canvas.width = WORLD_SIZE;
        root.appendChild(canvas);
        return canvas.getContext('2d');
    }
    
    const m = getWorldSpace(parentId);

    const draw = ({ x, y, color, size }) => {
        m.fillStyle = color;
        //m.fillRect(x, y, size, size);
        m.beginPath();
        m.arc(x, y, size, 0, 2 * Math.PI);
        m.fill();
    };

    let lastTimeStamp;
    let requestId;
    const update = (time) => {
        const delta_t =
            time - (lastTimeStamp || time) * // time difference
            0.001 * // because milliseconds
            10; // speed factor
        lastTimeStamp = time;
        runRules(delta_t * 0.001); 
    
        m.clearRect(0, 0, WORLD_SIZE, WORLD_SIZE);
    
        for (let i = 0; i < particles.length; i++) {
            draw(particles[i]);
        }
        requestId = requestAnimationFrame(update);
    };
    
    return () => {
        // this is the function that starts the animation
        requestId = requestAnimationFrame(update);

        return () => {
            // this function will stop the animation
            cancelAnimationFrame(requestId);
        };
    };
}

let config = { types: [], rules: [] };

const yellow = 'yellow';
const red = 'magenta';
const green = 'lime';

const combine = (...params) => Object.assign({}, ...params);
const reds200 = { [red]: 200 };
const greens200 = { [green]: 200 };
const yellows200 = { [yellow]: 200 };
const redAndYellow = combine(reds200, yellows200);
const redYellowAndGreen = combine(reds200, yellows200, greens200);

const twoParticles = {
    name: 'Just two particles.',
    types: { [yellow]: 2 },
    rules: [[ yellow, yellow, -100 ]],
    forceMaxRange: 200,
    accelerationFactor: 1,
};
const threeParticles = {
    name: 'Just three particles.',
    types: { [yellow]: 3 },
    rules: [[ yellow, yellow, -100]],
    forceMaxRange: 200,
    accelerationFactor: 1,
}
const cells = {
    name: 'Cells.',
    types: redAndYellow,
    rules: [
        [ red, red, -10 ],
        [ red, yellow, -1 ],
        [ yellow, red, 1 ],
        [ yellow, yellow, 1 ],
    ],
};
const cellsAndMitochrondrea = {
    name: 'Cells and mitochrondrea.',
    types: redYellowAndGreen,
    rules: [
        [ red, red, 10 ],
        [ yellow, red, 15 ],
        [ green, green, -70 ],
        [ green, red, -20 ],
        [ red, green, -10 ],
    ],
};
const tadpoles = {
    name: 'Tadpoles.',
    types: redYellowAndGreen,
    rules: [
        [ green, green, -0.32 ],
        [ green, red, -0.17 ],
        [ green, yellow, 0.34 ],
        [ red, red, -0.10 ],
        [ red, green, -0.34 ],
        [ yellow, yellow, 0.15 ],
        [ yellow, green, -0.20 ],
    ]
}

config = twoParticles;
config = threeParticles;
config = cells;
config = cellsAndMitochrondrea;
// config = tadpoles;

const start = createWorld('canvascontainer', createActors(config));
