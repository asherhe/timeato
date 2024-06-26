/**
 * @param {{type: "work" | "break", setType: (value: "work" | "break") => void, active: boolean}} props
 */
function TypeControls({ type, setType, active }) {
  return (
    <div className={"type-controls" + (active ? "" : " inactive")}>
      {["Work", "Break"].map((val, index) => {
        let valType = val.toLowerCase();
        return (
          <div
            className={"type-btn" + (valType === type ? " active" : "")}
            onClick={active ? () => setType(valType) : () => {}}
            key={index}
          >
            {val}{" "}
          </div>
        );
      })}
    </div>
  );
}

export default TypeControls;
