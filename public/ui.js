
"use strict";

const UI = () => {
    const [running, setRunning] = React.useState(false);

    const togglerun = (e) => {
        if (!running) {
            stop = simulation.start();
            setRunning(true);
        } else {
            simulation.stop();
            setRunning(false);
        }
    };

    const restart = () => {
        simulation.stop();
        simulation.restart();
    };

    return (
        <div>
            <button
                id="togglerun"
                onClick={togglerun}>
                {running ? 'Pause' : 'Run'}
            </button>
            <button
                id="restart"
                onClick={restart}
                disabled={!running}>
                Restart
            </button>
            <div id="rules">
                <h1 id="rulesheader">
                    {config.name}
                </h1>
                <Rules />
            </div>
        </div>
    );
}

const Rules = () => {
    const { types, rules } = config;
    const ruleSet = Object.keys(types)
        .map(onType => ({
            onType,
            count: types[onType],
            rules: rules
                .filter(([on]) => on === onType)
                .map(([_, by, factor]) => ({ by, factor }))
        }));
    return (
        <table>
            <tbody>
                {ruleSet.map((rule, ix) => (
                    <TypeRules
                        key={ix}
                        {...rule} />
                ))}
            </tbody>
        </table>
    );
};

const TypeRules = ({ onType, count, rules }) => {
    const allRules = Object.keys(config.types)
        .map(type => rules
            .find(({ by }) => by === type) ||
            ({ by: type, factor: 0 }));

    return (
        <React.Fragment>
            <tr className="typeheader" style={{
                color: onType,
            }}>
                <td colSpan="2">{onType}</td>
                <td>{count}</td>
            </tr>
            {allRules.map(({ by, factor }, ix) => (
                <tr key={ix} className="">
                    {/* <td className="bycolor">by</td> */}
                    <td colSpan="3" className="slidertd">
                        <div className="slider" style={{
                            width: `${(factor * (-1) + 100) / 2}%`,
                            backgroundColor: by,
                        }} />
                        <span className="factor" style={{
                            //color: by
                        }}>{factor < 0 ? '+' : ''}{factor * (-1)}</span>
                        &nbsp;
                    </td>
                </tr>
            ))}
        </React.Fragment>
    );
};

const domContainer = document.getElementById('uiright');
const root = ReactDOM.createRoot(domContainer);
root.render(<UI />);
