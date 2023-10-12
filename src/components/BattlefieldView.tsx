import './BattlefieldView.css';
import { Battlefield, Minion, Tile } from '../logic.ts';
import TileView from './TileView.tsx';


// Define the type for component props
interface BattlefieldProps {
  battlefield: Battlefield;
  flip: boolean;
}


const BattlefieldView = ({battlefield, flip}: BattlefieldProps): JSX.Element => {
  const className = flip ? "battlefield flip" : "battlefield";
  const tiles = flip ? battlefield.tiles.toReversed() : battlefield.tiles;
  const minions = battlefield.minions;

  function newTileView(tile: Tile, i: number): JSX.Element {
    const minion = minions[tile.minion];
    return (<TileView key={i} tile={tile} minion={minion} />);
  }

  return (
    <div className={className}>
      { tiles.map(newTileView) }
    </div>
  );
};

export default BattlefieldView;
