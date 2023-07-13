import React from 'react';
import './GridComponent.css';

// Define the type for component props (if any)
interface GridComponentProps {}

const GridComponent = (): JSX.Element => {
  return (
    <div className="grid-container">
      <div className="sub-grid">
        <div className="grid-item">1</div>
        <div className="grid-item">2</div>
        <div className="grid-item">3</div>
        <div className="grid-item">4</div>
      </div>
      <div className="empty-container">&nbsp;</div>
      <div className="sub-grid">
        <div className="grid-item">1</div>
        <div className="grid-item">2</div>
        <div className="grid-item">3</div>
        <div className="grid-item">4</div>
      </div>
    </div>
  );
};

export default GridComponent;
