import { PlayerState } from '../logic';
import './PlayerActionBar.css';

import iconPlayerFlag from "../assets/flag-player.png";
import iconEnemyFlag from "../assets/flag-enemy.png";
import { useState } from 'react';

// Define the type for component props
interface PlayerActionBarProps {
  player: PlayerState;
  enemy: PlayerState;
  playerAvatarUrl: string;
  enemyAvatarUrl: string;
}


const PlayerActionBar = ({ player, enemy, playerAvatarUrl, enemyAvatarUrl }: PlayerActionBarProps): JSX.Element => {
  const [showMinionDeck, setShowMinionDeck] = useState<boolean>(true);
  const [isThisPlayer, setIsThisPlayer] = useState<boolean>(true);

  const swichActionPlayer = () => { setIsThisPlayer(!isThisPlayer) };
  const setDeckViewToMinions = () => { setShowMinionDeck(true) };
  const setDeckViewToTech = () => { setShowMinionDeck(false) };

  const avatarUrl: string = isThisPlayer ? playerAvatarUrl : enemyAvatarUrl;

  return (
    <div className="player-action-bar">
      <div className="switch-controls">
        <input
          className="hidden radio-label"
          type="radio"
          name="deck-menu"
          id="button-minion-deck"
          onChange={setDeckViewToMinions}
          checked={showMinionDeck}
        />
        <label className="button-label" htmlFor="button-minion-deck">&#9876;</label>

        <div className="player-switch" onClick={swichActionPlayer}>
          { isThisPlayer && <img className="flag" src={iconPlayerFlag} /> }
          <div className="player-avatar">
            <img src={avatarUrl} />
          </div>
          { !isThisPlayer && <img className="flag" src={iconEnemyFlag} /> }
        </div>

        <input
          className="hidden radio-label"
          type="radio"
          name="deck-menu"
          id="button-tech-deck"
          onChange={setDeckViewToTech}
          checked={!showMinionDeck}
        />
        <label className="button-label" htmlFor="button-tech-deck">&#128736;</label>
      </div>

      <div className="roster">
        <div className="item">1</div>
        <div className="item">2</div>
        <div className="item">3</div>
        <div className="item">4</div>
        <div className="item">5</div>
        <div className="item">6</div>
      </div>
    </div>
  );
};

export default PlayerActionBar;
