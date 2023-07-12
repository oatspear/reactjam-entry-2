import React, { useState } from 'react';
import './ActionBar.css';

// replace this FC practice with the below example
// https://stackoverflow.com/a/59988810

// const PrintName2 = ({ prop1, prop2 }: Props): JSX.Element => { /** */}

const ActionBar: React.FC = () => {
  const [isActionBarVisible, setIsActionBarVisible] = useState(false);

  const toggleActionBar = () => {
    setIsActionBarVisible(!isActionBarVisible);
  };

  return (
    <div className={`action-bar ${isActionBarVisible ? 'visible' : ''}`}>
      <div className="button-row">
        <button className="action-button">Button 1</button>
        <button className="action-button">Button 2</button>
        <button className="action-button">Button 3</button>
        <button className="action-button">Button 4</button>
      </div>
      <button className="toggle-button" onClick={toggleActionBar}>
        Toggle Action Bar
      </button>
    </div>
  );
};

export default ActionBar;
