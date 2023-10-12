import './TileView.css';
import { Minion, PlayerIndex, Tile, TileType } from '../logic.ts';
import MinionPin from './MinionPin.tsx';


// Define the type for component props
interface TileProps {
  tile: Tile;
  minion: Minion | undefined;
}


const TileView = ({ tile, minion }: TileProps): JSX.Element => {
  if (tile.type === TileType.UNPATHABLE) {
    return (
      <div className="tile"></div>
    );
  }

  let className = "tile";
  if (tile.type === TileType.BASE) {
    className += " tile-base";
  } else if (tile.type === TileType.SPAWN) {
    className += " tile-spawn";
  } else if (tile.type === TileType.NORMAL) {
    className += " tile-normal";
  }

  if (tile.owner === PlayerIndex.PLAYER1) {
    className += " player-1";
  } else if (tile.owner === PlayerIndex.PLAYER2) {
    className += " player-2";
  }

  function handleClick() {
    alert(`Clicked Tile-${tile.index}`);
  }

  return (
    <div className={className} onClick={handleClick}>
      { minion != null && <MinionPin minion={minion} /> }
    </div>
  );
};

export default TileView;
