import { useEffect, useState } from "react"

import "./App.css"
import { EventType, GameState, PlayerIndex, PlayerState, getPlayerIndex } from "./logic.ts"

import ModalPopup from './components/ModalPopup';
import BattlefieldView, { BattlefieldCallbacks } from './components/BattlefieldView.tsx';
import ActionBar from './components/ActionBar';
import EnemyActionPanel from "./components/EnemyActionPanel.tsx";
import PlayerStatusBar from "./components/PlayerStatusBar.tsx";


type PlayersObject = Record<string, { playerId: string, displayName: string, avatarUrl: string }>;

interface ClientPlayerInfo {
  playerId: string;
  displayName: string;
  avatarUrl: string;
  index: PlayerIndex;
  resources: number;
}

interface DisplayMinionStats {
  power: number;
  health: number;
  movement: number;
}

enum UIState {
  INITIAL = 0,
  ANIMATING,
  INPUT_MAIN,
  INPUT_MOVE,
  INPUT_ATTACK,
  INPUT_PLAYER_BENCH,
  INPUT_PLAYER_TECH,
  INPUT_PLAYER_GRAVEYARD,
  INPUT_ENEMY_MINION,
  INPUT_ENEMY_BENCH,
  INPUT_ENEMY_TECH,
  INPUT_ENEMY_GRAVEYARD,
}


function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return { width, height };
}


function getTopBottomPlayers(
  game: GameState,
  playerIndex: PlayerIndex,
  players: PlayersObject
): ClientPlayerInfo[] {
  const clientPlayers = [];
  for (const state of game.players) {
    clientPlayers.push({ ...players[state.id], index: state.index, resources: state.resources });
  }
  if (playerIndex === PlayerIndex.PLAYER1) {
    return clientPlayers.reverse();
  }
  return clientPlayers;
}


function newEnemyActionPanel(game: GameState, enemyIndex: PlayerIndex, uiState: UIState): JSX.Element {
  const player: PlayerState = game.players[enemyIndex];
  const isActive: boolean = uiState === UIState.INPUT_ENEMY_BENCH
    || uiState === UIState.INPUT_ENEMY_TECH
    || uiState === UIState.INPUT_ENEMY_GRAVEYARD;
  const handleShowBench = () => alert("show bench");
  const handleShowTech = () => alert("show tech");
  const handleShowGraveyard = () => alert("show graveyard");
  return (
    <EnemyActionPanel
      player={player}
      isActive={isActive}
      handleShowBench={handleShowBench}
      handleShowTech={handleShowTech}
      handleShowGraveyard={handleShowGraveyard}
    />
  );
}


function newPlayerActionPanel(game: GameState, playerIndex: PlayerIndex, uiState: UIState): JSX.Element {
  const player: PlayerState = game.players[playerIndex];
  return (
    <div className="player-action-panel">
      <div className="bench">B</div>
      <div className="tech">T</div>
      <div className="graveyard">G</div>
    </div>
  );
}


function App() {
  // game state
  const [game, setGame] = useState<GameState | undefined>();
  const [myPlayerId, setMyPlayerId] = useState<string | undefined>();
  const [players, setPlayers] = useState<PlayersObject>({});
  // layer visibility
  const [uiState, setUiState] = useState<UIState>(UIState.INITIAL);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isActionBarVisible, setIsActionBarVisible] = useState<boolean>(false);
  // UI state variables
  const [selectedTile, setSelectedTile] = useState<number>(-1);
  const [actionableTiles, setActionableTiles] = useState<number[]>([]);
  const [displayStats, setDisplayStats] = useState<DisplayMinionStats | undefined>();

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
      onChange: ({ newGame, yourPlayerId, players }) => {
        setGame(newGame);
        setMyPlayerId(yourPlayerId);
        setPlayers({
          ...players,
          AI: {
            playerId: "AI",
            displayName: "AI (Bot)",
            avatarUrl: "",
          },
        });
      },
    })
  }, []);  

  if (!game) {
    return <div>Loading...</div>
  }

  const { height, width } = getWindowDimensions();

  const playerIndex: PlayerIndex = getPlayerIndex(game, myPlayerId);
  const [enemy, player] = getTopBottomPlayers(game, playerIndex, players);

  const battlefieldCallbacks: BattlefieldCallbacks = {
    onTileSelected(i: number) {
      if (uiState === UIState.ANIMATING) { return }
      setSelectedTile(i);
      const tile = game.battlefield.tiles[i];
      const minion = game.battlefield.minions[tile.minion];
      if (minion != null) {
        setDisplayStats({ power: minion.power, health: minion.health, movement: minion.movement });
        if (minion.owner === playerIndex) {
          alert("Selected your own minion")
          const from = i;
          const to = i + 1;
          Rune.actions.move({ from, to });
          setActionableTiles([]);
        } else {
          alert("Selected an enemy minion")
        }
      } else {
        setDisplayStats(undefined);
      }
    }
  };

  const showPlayerActionBar: boolean = uiState != UIState.ANIMATING;
  const showEnemyActionBar: boolean = uiState != UIState.ANIMATING;

  const tempEnemyDisplayName: string = `width: ${width} ~ height: ${height}`;

  return (
    <>
      <PlayerStatusBar player={game.players[enemy.index]} displayName={tempEnemyDisplayName} flip={true} />
      <BattlefieldView battlefield={game.battlefield} player={playerIndex} callbacks={battlefieldCallbacks} />
      <PlayerStatusBar player={game.players[player.index]} displayName={player.displayName} flip={false} />

      <div className="hud">
        { !!displayStats && <div className="minion-stats">Stats</div> }
        <div className="resources"></div>
      </div>

      <div className="main-action-panel-container">
        { showPlayerActionBar && newPlayerActionPanel(game, playerIndex, uiState) }
      </div>

      <button onClick={toggleActionBar}>Toggle Action Bar</button>
      <ActionBar isVisible={isActionBarVisible} actions={barActions} />

      <button onClick={openModal}>Open Modal</button>
      { isModalOpen && <ModalPopup message="Hello, I'm a modal!" onClose={closeModal} /> }
    </>
  )
}

export default App
