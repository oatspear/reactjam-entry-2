import { useEffect, useState } from "react"
import reactLogo from "./assets/rune.svg"
import viteLogo from "/vite.svg"

import "./App.css"
import { EventType, GameState, PlayerIndex, getPlayerIndex } from "./logic.ts"

import ModalPopup from './components/ModalPopup';
// import MeterBar from './components/MeterBar';
import BattlefieldView, { BattlefieldCallbacks } from './components/BattlefieldView.tsx';
import ActionBar from './components/ActionBar';


enum UIState {
  INITIAL = 0,
  INPUT_MAIN,
  INPUT_MOVE,
}


function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return { width, height };
}


function App() {
  const [uiState, setUiState] = useState<UIState>(UIState.INITIAL);
  const [game, setGame] = useState<GameState>();
  const [myPlayerId, setMyPlayerId] = useState<string | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActionBarVisible, setIsActionBarVisible] = useState(false);

  const [selectedTile, setSelectedTile] = useState<number | undefined>();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const toggleActionBar = () => {
    setIsActionBarVisible(!isActionBarVisible);
  };

  const spawnMinion = () => {
    if (game == null) { return; }
    const benchIndex: number = 0;
    const spawnPoint: number = 0;
    const moveTo: number = 0;
    Rune.actions.spawn({ benchIndex, spawnPoint, moveTo });
  };

  const barActions = [
    spawnMinion,
    spawnMinion,
    spawnMinion,
    spawnMinion,
  ];

  useEffect(() => {
    Rune.initClient({
      onChange: ({ newGame, yourPlayerId }) => {
        setGame(newGame);
        setMyPlayerId(yourPlayerId);
      },
    })
  }, []);  

  if (!game) {
    return <div>Loading...</div>
  }

  const { height, width } = getWindowDimensions();
  const playerIndex: PlayerIndex = getPlayerIndex(game, myPlayerId);

  const battlefieldCallbacks: BattlefieldCallbacks = {
    onTileSelected(i: number) {
      const tile = game.battlefield.tiles[i];
      const minion = game.battlefield.minions[tile.minion]
      if (minion != null) {
        if (minion.owner === playerIndex) {
          alert("Selected your own minion")
          const from = i;
          const to = i + 1;
          Rune.actions.move({ from, to });
        } else {
          alert("Selected an enemy minion")
        }
      }
    }
  };

  return (
    <>
      <div className="flex-column-centered">
        <code>width: {width} ~ height: {height}</code>
        <BattlefieldView battlefield={game.battlefield} player={playerIndex} callbacks={battlefieldCallbacks} />
        <button onClick={toggleActionBar}>Toggle Action Bar</button>
        <ActionBar isVisible={isActionBarVisible} actions={barActions} />
        <button onClick={openModal}>Open Modal</button>
        {isModalOpen && (
          <ModalPopup message="Hello, I'm a modal!" onClose={closeModal} />
        )}
      </div>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://developers.rune.ai" target="_blank">
          <img src={reactLogo} className="logo rune" alt="Rune logo" />
        </a>
      </div>
      <div className="card">
        <button>
          count is {game.turnsTaken}
        </button>
        <p>
          Edit <code>src/App.tsx</code> or <code>src/logic.ts</code> and save to
          test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and Rune logos to learn more
      </p>
    </>
  )
}

export default App
