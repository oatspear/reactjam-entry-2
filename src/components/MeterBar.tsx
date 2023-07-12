import React, { useState, useEffect } from 'react';
import './MeterBar.css';

interface MeterBarProps {
  steps: number;
  initialValue: number;
}

const MeterBar = ({ steps, initialValue }: MeterBarProps): JSX.Element => {
  const [value, setValue] = useState(initialValue);
  const [markerPosition, setMarkerPosition] = useState(0);

  useEffect(() => {
    const newPosition = (value / (steps - 1)) * 100;
    setMarkerPosition(newPosition);
  }, [value, steps]);

  const handleClick = (step: number) => {
    setValue(step);
  };

  return (
    <div className="meter-bar">
      <div className="marker" style={{ left: `${markerPosition}%` }}>
        {value}
      </div>
      <div className="bar">
        {Array.from({ length: steps }, (_, index) => (
          <div
            key={index}
            className={`step ${index === value ? 'active' : ''}`}
            onClick={() => handleClick(index)}
          >
            {index}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeterBar;

/*
import React from 'react';
import MeterBar from './MeterBar';

const App: React.FC = () => {
  return (
    <div>
      <h1>My App</h1>
      <MeterBar steps={7} initialValue={3} />
    </div>
  );
};

export default App;

*/
