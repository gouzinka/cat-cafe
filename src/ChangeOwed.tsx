import React, {useEffect, useState} from "react";
import useCatFacts from "./hooks/useCatFacts";

interface ChangeOwedProps {
  change: Record<string, number>;
  submitCount: number;
}

const ChangeOwed = ({change, submitCount}: ChangeOwedProps) => {
  const isChangeDue = Object.values(change).some((count) => count > 0);
  // We want to display only used denominations
  // Display from the biggest - since we use denominations as a number for a key, ES added automatic sorting in ascending order
  const sorteddArray = [...Object.entries(change)]
    .filter(([_, count]) => count > 0)
    .reverse();

  const {fact, isLoading} = useCatFacts(submitCount);

  return (
    <div className="box">
      {isChangeDue ? (
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
      ) : (
        <div>
          <h2 className="box__heading">You paid the exact amount!</h2>
          <h4 className="box__subheading">Here is a cat fact for you:</h4>
          <div className="box__content">
            {isLoading ? (
              <div data-testid="spinner" className="spinner"></div>
            ) : (
              <p className="box__citation">{fact}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangeOwed;
