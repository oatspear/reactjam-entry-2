import GridComponent from './GridComponent';
import './Battlefield.css';
import { LocationState } from '../logic';


// Define the type for component props
interface BattlefieldProps {
  locations: Array<LocationState>;
}


function newLocationComponent(location: LocationState, i: number): JSX.Element {
  const enemies = location.minions[0];
  const minions = location.minions[1];
  return (<GridComponent key={i} enemies={enemies} minions={minions} />);
}


const Battlefield = ({locations}: BattlefieldProps): JSX.Element => {
  return (
    <div className="battlefield">
      { locations.map(newLocationComponent) }
    </div>
  );
};

export default Battlefield;
