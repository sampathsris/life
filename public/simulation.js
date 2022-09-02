
"use strict";

class Simulation {
    #world;
    #actors;
    #config;
    #canvasContext;

    constructor(config, canvasContext2D) {
        this.#config = config;
        this.#canvasContext = canvasContext2D;
        this.#createSimulation();
    }
    
    #createSimulation () {
        this.#actors = new Actors(this.#config);
        this.#world = new World(this.#canvasContext, this.#actors);
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

    updateRule(on, by, newFactor) {
        return this.#actors.updateRule(on, by, newFactor);
    }

    getConfig() {
        return this.#actors.getConfig();
    }
}
