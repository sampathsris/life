
"use strict";

(function () {
    const getWorldSpace = (parentId) => {
        const canvasContainer = document.getElementById(parentId);
        const canvas = document.createElement('canvas');
        canvas.height = WORLD_SIZE;
        canvas.width = WORLD_SIZE;
        canvasContainer.appendChild(canvas);
        return canvas.getContext('2d');
    }

    let config = { types: [], rules: [] };

    config = PreConfig.twoParticles;
    config = PreConfig.threeParticles;
    // config = PreConfig.cells;
    // config = PreConfig.cellsAndMitochrondrea;
    // config = PreConfig.tadpoles;
    
    const canvasContext2D = getWorldSpace('canvascontainer');
    const simulation = new Simulation(config, canvasContext2D);
    const domContainer = document.getElementById('uiright');
    const root = ReactDOM.createRoot(domContainer);

    root.render(
        <UI simulation={simulation} />
    );
})()
