
"use strict";

const UI = (function () {
    const ConfigContext = React.createContext({
        types: {}, rules: [],
    });

    const UI = ({ simulation }) => {
        const [config, setConfig] = React.useState(simulation.getConfig());
        const [started, setStarted] = React.useState(false);
        const [running, setRunning] = React.useState(false);

        const togglerun = (e) => {
            if (!running) {
                stop = simulation.start();
                setRunning(true);
                setStarted(true);
            } else {
                simulation.stop();
                setRunning(false);
            }
        };

        const reset = () => {
            simulation.stop();
            setRunning(false);
            simulation.reset();
        };

        const updateRule = (on, by, newFactor) => {
            const newConfig = simulation.updateRule(on, by, newFactor);
            setConfig(newConfig);
        };

        return (
            <ConfigContext.Provider value={config}>
                <button
                    id="togglerun"
                    onClick={togglerun}>
                    {running ? 'Pause' : 'Run'}
                </button>
                <button
                    id="reset"
                    onClick={reset}
                    disabled={!started}>
                    Reset
                </button>
                <div id="rules">
                    <h1 id="rulesheader">
                        Rules
                    </h1>
                    <Rules updateRule={updateRule} />
                </div>
            </ConfigContext.Provider>
        );
    }

    const Rules = ({ updateRule }) => {
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
                            {...rule}
                            updateRule={updateRule} />
                    ))}
                </tbody>
            </table>
        );
    };

    const TypeRules = ({ onType, count, rules, updateRule }) => {
        const { types } = React.useContext(ConfigContext);
        const allRules = Object.keys(types)
            .map(type => rules
                .find(({ by }) => by === type) ||
                ({ by: type, factor: 0 }));

        const updateFactor = (by, newFactor) =>
            updateRule(onType, by, newFactor);

        return (
            <React.Fragment>
                <tr className="typeheader" style={{
                    color: onType,
                }}>
                    <td>{onType}</td>
                    <td>{count}</td>
                </tr>
                {allRules.map(({ by, factor }, ix) => (
                    <SingleTypeRule
                        key={ix} by={by} factor={factor}
                        updateFactor={updateFactor} />
                ))}
            </React.Fragment>
        );
    };

    /* Given a mouse event and an HTML element calculate a percentage of
       how far along the element was the mouse event */
    const getMouseEventPercent = (clientPosition, position, fullDimention) =>
        ((clientPosition - position) * 100 / fullDimention);
    const getMouseEventPercentClient = (
        { clientX, clientY },    // mouse event
        element,                 // html element
        direction                // 'x', 'y', or 'both'
    ) => {
        const {
            x, y, width, height,
        } = element.getBoundingClientRect();

        if (direction === 'x') {
            return getMouseEventPercent(x, clientX, width);
        } else if (direction === 'y') {
            return getMouseEventPercent(y, clientY, height);
        } else if (direction === 'both') {
            return {
                px: getMouseEventPercent(x, clientX, width),
                py: getMouseEventPercent(y, clientY, height),
            };
        }
    };

    const SingleTypeRule = ({ by, factor, updateFactor }) => {
        const sliderWidth = (factor * (-1) + 100) / 2;
        const factorDisplayStr = `${
            // show a plus sign for positive numbers, for symmetry.
            factor < 0 ? '+' : ''
            }${
            // flip the values, such that attractions are positive.
            factor * (-1)
            }`;
        const sliderRef = React.useRef(null);
        const onSliderClick = e => {
            let newFactor = getMouseEventPercentClient(
                e, sliderRef.current, 'x');
            newFactor = Math.round((newFactor + 50) * -2);
            // again, flip the values, because we do so when displaying.
            updateFactor(by, newFactor * -1);
        }

        return (
            <tr className="">
                <td
                    colSpan="2"
                    className="slidertd"
                    onClick={onSliderClick}
                    ref={sliderRef}>
                    <div className="slider" style={{
                        width: `${sliderWidth}%`,
                        backgroundColor: by,
                    }} />
                    <span className="factor">
                        {factorDisplayStr}
                    </span>
                    { /* next line is required to stop row from collapsing */}
                    &nbsp;
                </td>
            </tr>
        );
    };

    return UI;
})();
