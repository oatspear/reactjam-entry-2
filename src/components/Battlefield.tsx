import React from 'react';
import GridComponent from './GridComponent';
import './Battlefield.css';

// Define the type for component props (if any)
interface BattlefieldProps {}

const Battlefield = (): JSX.Element => {
  return (
    <div className="battlefield">
      <GridComponent />
      <GridComponent />
      <GridComponent />
    </div>
  );
};

export default Battlefield;
