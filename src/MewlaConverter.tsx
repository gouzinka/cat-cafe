import React, {useState} from "react";
import ChangeOwed from "./ChangeOwed";

function MewlaConverter() {
  const [change, setChange] = useState({});

  const calculateChange = () => {
    // ---
    // TODO: Implement your change-calculating logic here
    // ---
  };

  return (
    <div>
      <form id="cash-calculator">
        <div className="cash-line">
          <input
            id="amountCharged"
            name="amountCharged"
            type="text"
            placeholder="We need"
          />
        </div>
        <div className="cash-line">
          <input
            id="amountTendered"
            name="amountTendered"
            type="text"
            placeholder="You pay"
          />
        </div>
        <button id="calculate" type="submit" onClick={calculateChange}>
          Calculate Change
        </button>
      </form>

      <div id="results">
        <ChangeOwed change={change} />
      </div>
    </div>
  );
}

export default MewlaConverter;
