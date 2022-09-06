
"use strict";

class World {
    #m;
    #actors;
    #width;
    #height;
    #lastTimeStamp = null;
    #requestId;

    constructor(canvasContext2D, actors) {
        this.#m = canvasContext2D;
        const { width, height } = canvasContext2D.canvas;
        this.#width = width;
        this.#height = height;
        this.#actors = actors;

        this.#draw();
    }

    #update(time) {
        this.#updateImpl(time);
        this.#requestId = requestAnimationFrame(this.#update.bind(this));
    }

    #updateImpl(time) {
        const delta_t =
            (time - (this.#lastTimeStamp || time)) * // time difference
            0.001 * // because milliseconds
            10; // speed factor
        this.#lastTimeStamp = time;
        this.#actors.runRules(delta_t);

        this.#draw();
    }

    #draw() {
        this.#m.clearRect(0, 0, this.#width, this.#height);

        for (let i = 0; i < this.#actors.particles.length; i++) {
            this.#drawParticle(this.#actors.particles[i]);
        }
    }

    #drawParticle({ x, y, color, size }) {
        this.#m.fillStyle = color;
        this.#m.beginPath();
        this.#m.arc(x, y, size, 0, 2 * Math.PI);
        this.#m.fill();
    }

    run() {
        this.#requestId = requestAnimationFrame(this.#update.bind(this));
    }

    runOnce() {
        requestAnimationFrame(this.#updateImpl.bind(this));
    }

    pause() {
        if (this.#requestId) {
            cancelAnimationFrame(this.#requestId);
        }

        this.#requestId = null;
    }
}
