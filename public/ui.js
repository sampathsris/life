
"use strict";

const UI = (function () {
    const ConfigContext = React.createContext({
        types: {}, rules: [],
    });

    const UI = ({ simulation }) => {
        const [config, setConfig] = React.useState(simulation.getConfig());
        const [started, setStarted] = React.useState(false);
        const [running, setRunning] = React.useState(false);
        const [sliderMOValue, setSliderMOValue] = React.useState(null);

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
                    <Rules {...{
                        updateRule,
                        setSliderMOValue
                    }}/>
                    <SlierMouseOverValue sliderMOValue={sliderMOValue} />
                </div>
            </ConfigContext.Provider>
        );
    }

    const SlierMouseOverValue = ({ sliderMOValue }) => {
        if (!sliderMOValue) {
            return '';
        }

        const { value, x, y } = sliderMOValue;

        return (
            <div className="slidermov" style={{
                left: x + 15,
                top: y + 15,
            }}>
                {value}
            </div>
        );
    };

    const Rules = ({ updateRule, setSliderMOValue }) => {
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
                            {...{
                                ...rule,
                                updateRule,
                                setSliderMOValue,
                            }}/>
                    ))}
                </tbody>
            </table>
        );
    };

    const TypeRules = ({
        onType, count, rules, updateRule, setSliderMOValue
    }) => {
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
                    <td colSpan="2">{onType}</td>
                    <td>{count}</td>
                </tr>
                {allRules.map(({ by, factor }, ix) => (
                    <SingleTypeRule
                        key={ix}
                        {...{
                            by,
                            factor,
                            updateFactor,
                            setSliderMOValue,
                        }}/>
                ))}
            </React.Fragment>
        );
    };

    /* Given a mouse event and an HTML element calculate a percentage of
       how far along the element was the mouse event */
    const getMouseEventPercent = (clientPosition, position, fullDimention) =>
        ((position - clientPosition) * 100 / fullDimention);
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

    const getAdjustedSliderValue = absoluteValue =>
        Math.round((absoluteValue - 50) * 2);

    const SingleTypeRule = ({
        by, factor, updateFactor, setSliderMOValue
    }) => {
        const sliderWidth = (factor * (-1) + 100) / 2;
        // flip the values, such that attractions are positive.
        const factorDisplayStr = `${factor * (-1)}`;
        const sliderRef = React.useRef(null);
        const [showIndicator, setShowIndicator] = React.useState(null);

        const onSliderClick = e => {
            let newFactor = getMouseEventPercentClient(
                e, sliderRef.current, 'x');
            newFactor = getAdjustedSliderValue(newFactor);
            // again, flip the values, because we do so when displaying.
            updateFactor(by, newFactor * -1);
        }

        const onSliderMouseMove = e => {
            let moValue = getMouseEventPercentClient(
                e, sliderRef.current, 'x');
            setShowIndicator(moValue);

            let adjustedMOValue = getAdjustedSliderValue(moValue);
            setSliderMOValue({
                value: adjustedMOValue,
                x: e.clientX,
                y: e.clientY,
            });
        };

        const onSliderMouseOut = () => {
            setSliderMOValue(null);
            setShowIndicator(null);
        };

        const buttons = [ '⏮️', '◀️', '⏸️', '▶️', '⏭️' ];
        const setFactor = label => {
            switch (label) {
                case '⏮️':
                    return updateFactor(by, 100);
                case '◀️':
                    return updateFactor(by, factor + 1);
                case '⏸️':
                    return updateFactor(by, 0);
                case '▶️':
                    return updateFactor(by, factor - 1);
                case '⏭️':
                    return updateFactor(by, -100);
                default:
                    break;
            }
        };

        return (
            <tr className="ruletr">
                <td className="factortd" style={{
                    color: by
                }}>
                    {factorDisplayStr}
                </td>
                <td
                    className="slidertd"
                    onClick={onSliderClick}
                    onMouseMove={onSliderMouseMove}
                    onMouseOut={onSliderMouseOut}
                    ref={sliderRef}>
                    <div className="slider" style={{
                        width: `${sliderWidth}%`,
                        backgroundColor: by,
                    }} />
                    { /* next line is required to stop row from collapsing */}
                    &nbsp;
                    <div
                        className="slidermoindicator"
                        style={{
                            display: showIndicator ? 'inline-block' : 'none',
                            left: `calc(${showIndicator}% - 0.5%)`
                        }}>
                        &nbsp;
                    </div>
                </td>
                <td>
                    {
                        buttons.map((label, ix) => (
                            <span
                                key={ix}
                                className="rulebtn"
                                onClick={() => setFactor(label)}>
                                {label}
                            </span>
                        ))
                    }
                </td>
            </tr>
        );
    };

    return UI;
})();
