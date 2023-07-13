import React, { useState } from 'react';
import './ActionBar.css';

// replace this FC practice with the below example
// https://stackoverflow.com/a/59988810

// const PrintName2 = ({ prop1, prop2 }: Props): JSX.Element => { /** */}

const ActionBar = (): JSX.Element => {
  const [isActionBarVisible, setIsActionBarVisible] = useState(false);

  const toggleActionBar = () => {
    setIsActionBarVisible(!isActionBarVisible);
  };

  return (
    <>
      <div className={`action-bar ${isActionBarVisible ? 'visible' : ''}`}>
        <div className="button-row">
          <button className="action-button">1</button>
          <button className="action-button">2</button>
          <button className="action-button">3</button>
          <button className="action-button">4</button>
        </div>
      </div>
      <button onClick={toggleActionBar}>
        Toggle Action Bar
      </button>
    </>
  );
};

export default ActionBar;
