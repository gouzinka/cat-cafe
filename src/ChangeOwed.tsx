import React, {useEffect, useState} from "react";
import useCatFacts from "./hooks/useCatFacts";

interface ChangeOwedProps {
  change: Record<string, number>;
}

const ChangeOwed = ({change}: ChangeOwedProps) => {
  const [shouldFetchFact, setShouldFetchFact] = useState(false);
  const isChangeDue = Object.values(change).some((count) => count > 0);
  const sorteddArray = [...Object.entries(change)]
    .filter(([_, count]) => count > 0)
    .reverse();

  useEffect(() => {
    if (!isChangeDue) {
      setShouldFetchFact((prev) => !prev);
    }
  }, [change, isChangeDue]);

  const {fact, isLoading} = useCatFacts(shouldFetchFact);

  return (
    <div className="box">
      {!isChangeDue && (
        <div>
          <h2 className="box__heading">You paid the exact amount!</h2>
          <h4 className="box__subheading">Here is a cat fact for you:</h4>
          <div className="box__content">
            {isLoading ? (
              <div className="spinner"></div>
            ) : (
              <p className="box__citation">{fact}</p>
            )}
          </div>
        </div>
      )}
      {isChangeDue && (
        <div>
          <h2 className="box__heading">Customer change</h2>
          <ul className="box__content">
            {sorteddArray.map(([denomination, count]) => (
              <li className="box__item" key={denomination}>
                <h4 className="box__count">{count}</h4>
                <h6 className="box__denomination">{denomination}&nbsp;Mewla</h6>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChangeOwed;
