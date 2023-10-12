import './BattlefieldView.css';
import { Battlefield, Minion, Tile } from '../logic.ts';
import TileView from './TileView.tsx';
import MinionPin from './MinionPin.tsx';


// Define the type for component props
interface BattlefieldProps {
  battlefield: Battlefield;
  flip: boolean;
}


function newTileView(tile: Tile, i: number): JSX.Element {
  return (<TileView key={i} tile={tile} />);
}


function newMinionPin(minion: Minion): JSX.Element {
  return (<MinionPin key={minion.uid} minion={minion} />);
}


const BattlefieldView = ({battlefield, flip}: BattlefieldProps): JSX.Element => {
  const className = flip ? "battlefield flip" : "battlefield";
  const tiles = flip ? battlefield.tiles.toReversed() : battlefield.tiles;
  return (
    <div className={className}>
      { tiles.map(newTileView) }
      { Object.values(battlefield.minions).map(newMinionPin) }
    </div>
  );
};

export default BattlefieldView;
