
"use strict";

const ConfigContext = React.createContext();

const UI = (function () {
    const UI = ({ simulation }) => {
        const { name } = React.useContext(ConfigContext);
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
                        {name}
                    </h1>
                    <Rules />
                </div>
            </div>
        );
    }

    const Rules = () => {
        const { types, rules } = React.useContext(ConfigContext);
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
        const { types } = React.useContext(ConfigContext);
        const allRules = Object.keys(types)
            .map(type => rules
                .find(({ by }) => by === type) ||
                ({ by: type, factor: 0 }));

        return (
            <React.Fragment>
                <tr className="typeheader" style={{
                    color: onType,
                }}>
                    <td>{onType}</td>
                    <td>{count}</td>
                </tr>
                {allRules.map(({ by, factor }, ix) => (
                    <SingleTypeRule key={ix} by={by} factor={factor} />
                ))}
            </React.Fragment>
        );
    };

    const SingleTypeRule = ({ by, factor }) => {
        const sliderWidth = (factor * (-1) + 100) / 2;
        const factorDisplayStr = `${
            // show a plus sign for positive numbers, for symmetry.
            factor < 0 ? '+' : ''
            }${
            // flip the values, such that attractions are positive.
            factor * (-1)
            }`;

        return (
            <tr className="">
                <td colSpan="2" className="slidertd">
                    <div className="slider" style={{
                        width: `${sliderWidth}%`,
                        backgroundColor: by,
                    }} />
                    <span className="factor">
                        {factorDisplayStr}
                    </span>
                    &nbsp;
                </td>
            </tr>
        );
    };

    return UI;
})();
