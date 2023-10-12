import './BattlefieldView.css';
import { Battlefield, Tile } from '../logic.ts';
import TileView from './TileView.tsx';


// Define the type for component props
interface BattlefieldProps {
  battlefield: Battlefield;
}


function newTileView(tile: Tile, i: number): JSX.Element {
  return (<TileView key={i} tile={tile} />);
}


const BattlefieldView = ({battlefield}: BattlefieldProps): JSX.Element => {
  return (
    <div className="battlefield">
      { battlefield.tiles.map(newTileView) }
    </div>
  );
};

export default BattlefieldView;
