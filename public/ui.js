
"use strict";

let stop;

const UI = () => {
    const [running, setRunning] = React.useState(false);

    const togglerun = (e) => {
        if (!running) {
            stop = start();
            setRunning(true);
        } else {
            stop();
            setRunning(false);
        }
    };

    return (
        <div>
            <button id="togglerun" onClick={togglerun}>
                {running ? 'Pause' : 'Run'}
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
    return (
        <React.Fragment>
            <tr className="typeheader" style={{
                color: onType,
            }}>
                <td colSpan="2">{onType}</td>
                <td>{count}</td>
            </tr>
            {rules.map(({ by, factor }, ix) => (
                <tr key={ix} className="">
                    <td className="bycolor">{by}</td>
                    <td colSpan="2" className="slidertd">
                        <div className="slider" style={{
                            width: `${(factor + 100) / 2}%`
                        }} />
                        <span className="factor" style={{
                            color: by
                        }}>{factor}</span>
                    </td>
                </tr>
            ))}
        </React.Fragment>
    );
};

const domContainer = document.getElementById('uiright');
const root = ReactDOM.createRoot(domContainer);
root.render(<UI />);
