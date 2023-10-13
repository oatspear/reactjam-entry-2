import './BattlefieldView.css';
import { Battlefield, PlayerIndex, Tile } from '../logic.ts';
import TileView from './TileView.tsx';


interface TileClickCallbacks {
  onSelect: () => void;
}


// Define the type for component props
interface BattlefieldProps {
  battlefield: Battlefield;
  player: PlayerIndex;
}


const BattlefieldView = ({battlefield, player}: BattlefieldProps): JSX.Element => {
  const flip: boolean = player === PlayerIndex.PLAYER1;
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
