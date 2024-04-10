import { useCallback, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import NumberInput from "./number-input";
import CheckBox from "./checkbox";

/**
 * @typedef {{work: number, break: number, longbreak: number, longfreq: number, autoStart: boolean }} config
 * @type {config}
 */
export const defaultConfig = {
  work: 1500,
  break: 300,
  longbreak: 900,
  longfreq: 4,
  autoStart: false,
};

/**
 * @param {{config: config, setConfig: (v: config) => void}} props
 */
export function TimerConfig({ config, setConfig }) {
  const [show, setShow] = useState(false);

  /**
   * sets some config property `prop` to `val`
   * @param {string} prop
   * @param {*} val
   */
  const setProp = useCallback(
    (prop, val) => {
      let c = structuredClone(config);
      c[prop] = val;
      setConfig(c);
    },
    [config, setConfig]
  );

  return (
    <div className={"timer-config" + (show ? " show" : "")}>
      <div className="timer-config-button" onClick={() => setShow(!show)}>
        <FontAwesomeIcon icon={faGear} />
      </div>
      <div className="timer-config-menu">
        <div className="timer-config-title">Settings</div>
        <div className="timer-config-list">
          <div>
            <span className="timer-config-list-title">Work duration:</span>
            <span>
              <NumberInput
                val={config.work / 60}
                setVal={(v) => setProp("work", v * 60)}
                min="1"
              />
              &nbsp;minutes
            </span>
          </div>
          <div>
            <span className="timer-config-list-title">Break duration:</span>
            <span>
              <NumberInput
                val={config.break / 60}
                setVal={(v) => setProp("break", v * 60)}
                min="1"
              />
              &nbsp;minutes
            </span>
          </div>
          <div>
            <span className="timer-config-list-title">
              Long break duration:
            </span>
            <span>
              <NumberInput
                val={config.longbreak / 60}
                setVal={(v) => setProp("longbreak", v * 60)}
                min="1"
              />
              &nbsp;minutes
            </span>
          </div>
          <div>
            <span className="timer-config-list-title">
              Long break frequency:
            </span>
            <span>
              <NumberInput
                val={config.longfreq}
                setVal={(v) => setProp("longfreq", v)}
                min="0"
              />
              &nbsp;breaks
            </span>
          </div>
          <div>
            <span className="timer-config-list-title">
              Auto start next timer?
            </span>
            <CheckBox
              val={config.autoStart}
              setVal={(v) => setProp("autoStart", v)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
