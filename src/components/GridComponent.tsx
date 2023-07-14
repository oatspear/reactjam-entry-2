import React from 'react';
import './GridComponent.css';

// Define the type for component props (if any)
interface GridComponentProps {
  minions: Array<number>;
}

function tfGridItem(minion: number) {
  return <div className={"grid-item " + (!!minion ? "" : "empty")}>{minion}</div>;
}

const GridComponent = ({minions}: GridComponentProps): JSX.Element => {
  const $enemies = [0, 0, 0, 0].map(tfGridItem);
  const $minions = minions.map(tfGridItem);

  return (
    <div className="grid-container">
      <div className="sub-grid">
        { $enemies }
      </div>
      <div className="empty-container">&nbsp;</div>
      <div className="sub-grid">
        { $minions }
      </div>
    </div>
  );
};

export default GridComponent;
