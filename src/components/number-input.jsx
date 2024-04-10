import { useCallback } from "react";

/**
 *
 * @param {{val: number, setVal: (val: number) => void, min: number, max: number, step: number}} props
 */
function NumberInput({
  val,
  setVal,
  min = undefined,
  max = undefined,
  step = 1,
}) {
  const onChange = useCallback(
    (e) => {
      let v = parseFloat(e.target.value);
      setVal(v);
    },
    [setVal]
  );

  return (
    <input
      className="input-number"
      type="number"
      value={val}
      min={min}
      max={max}
      step={step}
      onChange={onChange}
    />
  );
}

export default NumberInput;
