
"use strict";

class PreConfig {
    static twoParticles;
    static threeParticles;
    static cells;
    static cellsAndMitochrondrea;
    static tadpoles;

    static {
        const yellow = 'yellow';
        const red = 'magenta';
        const green = 'lime';
        
        const combine = (...params) => Object.assign({}, ...params);
        
        const reds200 = { [red]: 200 };
        const greens200 = { [green]: 200 };
        const yellows200 = { [yellow]: 200 };
        const redAndYellow = combine(reds200, yellows200);
        const redYellowAndGreen = combine(reds200, yellows200, greens200);
        
        PreConfig.twoParticles = {
            name: 'Just two particles.',
            types: { [yellow]: 2 },
            rules: [[ yellow, yellow, -100 ]],
            forceMaxRange: 200,
            accelerationFactor: 1,
        };

        PreConfig.threeParticles = {
            name: 'Just three particles.',
            types: { [yellow]: 3 },
            rules: [[ yellow, yellow, -100]],
            forceMaxRange: 200,
            accelerationFactor: 1,
        };

        PreConfig.cells = {
            name: 'Cells.',
            types: redAndYellow,
            rules: [
                [ red, red, -10 ],
                [ red, yellow, -1 ],
                [ yellow, red, 1 ],
                [ yellow, yellow, 1 ],
            ],
        };

        PreConfig.cellsAndMitochrondrea = {
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

        PreConfig.tadpoles = {
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
        };
    }
}
