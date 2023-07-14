import React from 'react';
import GridComponent from './GridComponent';
import './Battlefield.css';

// Define the type for component props (if any)
interface BattlefieldProps {
  minions: Array<number>;
}

const Battlefield = ({minions}: BattlefieldProps): JSX.Element => {
  return (
    <div className="battlefield">
      <GridComponent minions={minions.slice(0, 4)} />
      <GridComponent minions={minions.slice(4, 8)} />
      <GridComponent minions={minions.slice(8, 12)} />
    </div>
  );
};

export default Battlefield;
