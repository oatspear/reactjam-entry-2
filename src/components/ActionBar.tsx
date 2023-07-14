import React from 'react';
import './ActionBar.css';

// replace this FC practice with the below example
// https://stackoverflow.com/a/59988810

// const PrintName2 = ({ prop1, prop2 }: Props): JSX.Element => { /** */}

interface ActionBarProps {
  isVisible: boolean;
  actions: Array<() => void>
}

const ActionBar = ({isVisible, actions}: ActionBarProps): JSX.Element => {
  return (
    <div className={`action-bar ${isVisible ? 'visible' : ''}`}>
      <div className="button-row">
        <button className="action-button" onClick={actions[0]}>1</button>
        <button className="action-button" onClick={actions[1]}>2</button>
        <button className="action-button" onClick={actions[2]}>3</button>
        <button className="action-button" onClick={actions[3]}>4</button>
      </div>
    </div>
  );
};

export default ActionBar;
