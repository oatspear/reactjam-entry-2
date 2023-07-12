import React from 'react';
import './GridComponent.css';

// Define the type for component props (if any)
interface GridComponentProps {}

const GridComponent: React.FC<GridComponentProps> = () => {
  return (
    <div className="grid-container">
      <div className="sub-grid">
        <div className="grid-item">Grid Item 1</div>
        <div className="grid-item">Grid Item 2</div>
        <div className="grid-item">Grid Item 3</div>
        <div className="grid-item">Grid Item 4</div>
      </div>
      <div className="empty-container">Empty Container</div>
      <div className="sub-grid">
        <div className="grid-item">Grid Item 1</div>
        <div className="grid-item">Grid Item 2</div>
        <div className="grid-item">Grid Item 3</div>
        <div className="grid-item">Grid Item 4</div>
      </div>
    </div>
  );
};

export default GridComponent;
