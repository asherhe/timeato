import { useCallback } from "react";

/**
 *
 * @param {{val: boolean, setVal: (val: boolean) => void}} props
 */
function CheckBox({ val, setVal }) {
  const onClick = useCallback(() => setVal(!val), [val, setVal]);

  return (
    <input
      className="input-toggle"
      type="checkbox"
      defaultChecked={val}
      onClick={onClick}
    />
  );
}

export default CheckBox;
