
"use strict";

class Simulation {
    #world;
    #config = null;
    #canvasContext = null;

    constructor(config, canvasContext2D) {
        this.#config = config;
        this.#canvasContext = canvasContext2D;
        this.#createSimulation();
    }
    
    #createSimulation () {
        const actors = new Actors(this.#config);
        this.#world = new World(this.#canvasContext, actors);
    };

    start () {
        this.#world.run();
    }

    stop () {
        this.#world.pause();
    }

    reset() {
        this.stop();
        this.#createSimulation();
        this.#world.runOnce();
    }

    restart() {
        this.reset();
        this.start();
    }
}
