import { useEffect, useState } from "react"
import reactLogo from "./assets/rune.svg"
import viteLogo from "/vite.svg"

import "./App.css"
import { GameState } from "./logic.ts"

import ModalPopup from './components/ModalPopup';
// import MeterBar from './components/MeterBar';
import BattlefieldView from './components/BattlefieldView.tsx';
import ActionBar from './components/ActionBar';


function App() {
  const [game, setGame] = useState<GameState>()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActionBarVisible, setIsActionBarVisible] = useState(false);

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
    const team = 1;
    for (let i = 0; i < game.locations.length; ++i) {
      const minions = game.locations[i].minions[team];
      for (let j = 0; j < minions.length; ++j) {
        if (!minions[j]) {
          // Rune.actions.spawnMinion({ location: i, team: team, index: j });
          return;
        }
      }
    }
    // Rune.actions.clearMinions();
  };

  const barActions = [
    spawnMinion,
    spawnMinion,
    spawnMinion,
    spawnMinion,
  ];

  useEffect(() => {
    Rune.initClient({
      onChange: ({ newGame }) => {
        setGame(newGame)
      },
    })
  }, []);  

  if (!game) {
    return <div>Loading...</div>
  }

  // <MeterBar steps={7} initialValue={3} />
  return (
    <>
      <div>
        <BattlefieldView battlefield={game.battlefield} />
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
