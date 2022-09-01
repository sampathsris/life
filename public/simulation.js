
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
        // const actors = createActors(this.#config);
        const actors = new Actors(this.#config);
        this.#world = new World(this.#canvasContext, actors);
        // this.#starter = createWorld(this.#canvasContext, actors);
    };

    start () {
        this.#world.run();
    }

    stop () {
        this.#world.pause();
    }

    restart() {
        this.stop();
        this.#createSimulation();
        this.start();
    }
}
