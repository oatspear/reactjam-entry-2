import { useEffect, useState } from "react"
import reactLogo from "./assets/rune.svg"
import viteLogo from "/vite.svg"

import "./App.css"
import { GameState } from "./logic.ts"

import ModalPopup from './components/ModalPopup';
import MeterBar from './components/MeterBar';
import Battlefield from './components/Battlefield';
import ActionBar from './components/ActionBar';


function App() {
  const [game, setGame] = useState<GameState>()
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    Rune.initClient({
      onChange: ({ newGame }) => {
        setGame(newGame)
      },
    })
  }, [])

  if (!game) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div>
        <h1>My App</h1>
        <MeterBar steps={7} initialValue={3} />
        <Battlefield />
        <ActionBar />
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
      <h1>Vite + Rune</h1>
      <div className="card">
        <button onClick={() => Rune.actions.increment({ amount: 1 })}>
          count is {game.count}
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
