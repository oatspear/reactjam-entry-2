// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------

import type { Players, RuneClient } from "rune-games-sdk/multiplayer"

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------


export const TIME_PER_TURN: number = 45;  // seconds
export const SQUADRONS_PER_LOCATION: number = 4;
export const MAX_SQUADRON_SIZE: number = 6;


export enum GameplayPhase {
  INPUT_ANY,
  INPUT_MOVEMENT,
}


export enum BoardLocation {
  NONE = 0,
  BENCH,
  BATTLEFIELD,
  GRAVEYARD
}

export enum TileType {
  NORMAL,
  SPAWN,
  BASE,
}

export enum PlayerIndex {
  NONE = -1,
  PLAYER1 = 0,
  PLAYER2 = 1,
}

export enum Direction {
  NORTH,
  SOUTH,
  EAST,
  WEST,
}


// -----------------------------------------------------------------------------
// Minion Data
// -----------------------------------------------------------------------------


export interface MinionData {
  species: number;
  name: string;
  power: number;
  health: number;
  movement: number;
  supplyCost: number;
}


function newMinionData(species: number): MinionData {
  return {
    species,
    name: `Minion-${species}`,
    power: 1,
    health: 1,
    movement: 1,
    supplyCost: 1,
  };
}


// -----------------------------------------------------------------------------
// Player Deck
// -----------------------------------------------------------------------------


export interface Deck {
  id: number;
  name: string;
  minions: MinionData[];
  spells: number[];
}


function newDeck(id: number): Deck {
  return {
    id,
    name: `Deck-${id}`,
    minions: [],
    spells: [],
  };
}


// -----------------------------------------------------------------------------
// Minion State
// -----------------------------------------------------------------------------


export interface Minion {
  uid: number;
  owner: PlayerIndex;
  species: number;
  power: number;
  health: number;
  movement: number;
  supplyCost: number;
  location: BoardLocation;
  position: number;
  isToken: boolean;
}


function newMinion(uid: number, owner: number, data: MinionData): Minion {
  return {
    uid,
    owner,
    species: data.species,
    power: data.power,
    health: data.health,
    movement: data.movement,
    supplyCost: data.supplyCost,
    location: BoardLocation.BENCH,
    position: 0,
    isToken: false,
  };
}


// -----------------------------------------------------------------------------
// Tile State
// -----------------------------------------------------------------------------


export interface Tile {
  // adjacent: Array = []
  index: number;
  type: TileType;
  owner: PlayerIndex;
  minion: number;
}


function newTile(index: number): Tile {
  return {
    index,
    type: TileType.NORMAL,
    owner: PlayerIndex.NONE,
    minion: 0,
  };
}


// sorted insertion (defensive order)
function newBaseTile(index: number, owner: PlayerIndex): Tile {
  return {
    index,
    type: TileType.BASE,
    owner,
    minion: 0,
  };
}


// sorted insertion (defensive order)
function newSpawnTile(index: number, owner: PlayerIndex): Tile {
  return {
    index,
    type: TileType.SPAWN,
    owner,
    minion: 0,
  };
}


// -----------------------------------------------------------------------------
// Board State
// -----------------------------------------------------------------------------


export interface Battlefield {
  tiles: Tile[];
  minions: Record<number, Minion>;
}


// [S o B o S]
// [o o o o o]
// [R o R o R]
// [o o o o o]
// [S o B o S]


function newBattlefield(): Battlefield {
  return {
    minions: {},
    tiles: [
      // row 1
      newSpawnTile(0, PlayerIndex.PLAYER1),
      newTile(1),
      newBaseTile(2, PlayerIndex.PLAYER1),
      newTile(3),
      newSpawnTile(4, PlayerIndex.PLAYER1),
      // row 2
      newTile(5),
      newTile(6),
      newTile(7),
      newTile(8),
      newTile(9),
      // row 3
      newTile(10),
      newTile(11),
      newTile(12),
      newTile(13),
      newTile(14),
      // row 4
      newTile(15),
      newTile(16),
      newTile(17),
      newTile(18),
      newTile(19),
      // row 5
      newSpawnTile(20, PlayerIndex.PLAYER2),
      newTile(21),
      newBaseTile(22, PlayerIndex.PLAYER2),
      newTile(23),
      newSpawnTile(24, PlayerIndex.PLAYER2),
    ],
  };
}


export function getPath(i: number, j: number, n: number): number[] {
    const paths: Record<number, number[]> = getPaths(i, n);
    return paths[j] || [];
}


export function getPathsNSteps(i: number, n: number): number[][] {
    const paths: Record<number, number[]> = getPaths(i, n);
    delete paths[i];
    return Object.values(paths);
}


function getPaths(i: number, n: number): Record<number, number[]> {
    const paths: Record<number, number[]> = {};
    paths[i] = [];
    buildPaths(paths, [], i, n);
    return paths;
}


function buildPaths(paths: Record<number, number[]>, path: number[], i: number, n: number): void {
    if (n <= 0) { return }
    const adjacent: number[] = getAdjacentTiles(i);
    for (const j of adjacent) {
      // if (!!tiles[j].minion) { continue }
      const previous = paths[j];
      if (previous != null && previous.length <= (path.length + 1)) { continue }
      var current = path.slice();
      current.push(j);
      paths[j] = current;
      buildPaths(paths, current, j, n - 1);
    }
}


function getAdjacentTiles(i: number): number[] {
  if (i <= 0 || i >= 25) { return []; }
  const adjacent: number[] = [];
  const row = (i / 5) | 0;
  const column = i % 5;
  if (row > 0) {
    adjacent.push(i - 5);
  }
  if (row < 4) {
    adjacent.push(i + 5);
  }
  if (column > 0) {
    adjacent.push(i - 1);
  }
  if (column < 4) {
    adjacent.push(i + 1);
  }
  return adjacent;
}


function getAdjacentEnemies(game: GameState, i: number): number[] {
  let uid: number = game.battlefield.tiles[i].minion;
  let minion: Minion | undefined = game.battlefield.minions[uid];
  const enemies: number[] = [];
  if (minion != null) {
    const pi = minion.owner;
    for (const k of getAdjacentTiles(i)) {
      uid = game.battlefield.tiles[k].minion;
      minion = game.battlefield.minions[uid];
      if (minion != null && minion.owner != pi) {
        enemies.push(k);
      }
    }
  }
  return enemies;
}


// -----------------------------------------------------------------------------
// Player State
// -----------------------------------------------------------------------------


export interface PlayerState {
  id: string;
  index: PlayerIndex;
  team: number;
  deck: Array<number>;
}


function newPlayerState(id: string, team: number, deck?: Array<number>): PlayerState {
  deck = deck || [];
  return { id, team, deck, index: PlayerIndex.PLAYER1 };
}


// -----------------------------------------------------------------------------
// Game Actions and Outcomes
// -----------------------------------------------------------------------------


export interface MinionMovement {
  minion: number;
  from: number;
  to: number;
  remaining: number;
}


export interface MinionSpawn {
  minion: number;
  tile: number;
  movement: number;
}


// -----------------------------------------------------------------------------
// Game State
// -----------------------------------------------------------------------------


export interface GameState {
  phase: GameplayPhase;
  turnsTaken: number;
  timer: number;
  battlefield: Battlefield;
  players: PlayerState[];
  events: Record<string, number>[];

  minionIdGenerator: number;
  minions: Record<number, Minion>;
  currentPlayer: number;
  movementCommand?: MinionMovement;
  spawnCommand?: MinionSpawn;
}


// -----------------------------------------------------------------------------
// Game Logic
// -----------------------------------------------------------------------------


function isMovementAllowed(game: GameState, from: number, to: number): boolean {
  const tile: Tile = game.battlefield.tiles[to];
  // is the tile already occupied?
  if (!!tile.minion) { return false; }
  // is the tile valid?
  if (from < 0 || from > 24) { return false; }
  if (to < 0 || to > 24) { return false; }
  // are the tiles adjacent?
  const k = to - from;
  return (k === 1) || (k === -1) || (k === 5) || (k === -5);
}


function moveAlongPath(game: GameState, i: number, path: number[]): void {
  let j = i;
  const tiles = game.battlefield.tiles;
  const uid = tiles[i].minion;
  const minion = game.battlefield.minions[uid];
  for (const k of path) {
    emitMinionMoving(game, uid, j, k);
    tiles[j].minion = 0;
    tiles[k].minion = uid;
    minion.position = k;
    emitMinionMoved(game, uid, j, k);
    j = k;
  }
}


function placeMinionOnBattlefield(game: GameState, minion: Minion, tile: number): boolean {
  // assert(minion != null)
  // assert(tiles[ti].minion == null)
  const uid = minion.uid;
  game.battlefield.minions[uid] = minion;
  const tiles = game.battlefield.tiles;
  tiles[tile].minion = minion.uid;
  minion.location = BoardLocation.BATTLEFIELD;
  minion.position = tile;
  emitMinionEnteredBattlefield(game, uid, tile);
  return true;
}


// -----------------------------------------------------------------------------
// Game Actions
// -----------------------------------------------------------------------------


type MoveActionPayload = {
  minionId: number;
  tileId: number;
};

type SpawnActionPayload = {
  speciesId: number;
  tileId: number;
};


type GameActions = {
  move: (params: MoveActionPayload) => void;
  spawn: (params: SpawnActionPayload) => void;
};


// -----------------------------------------------------------------------------
// Rune Setup
// -----------------------------------------------------------------------------


declare global {
  const Rune: RuneClient<GameState, GameActions>
}


Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 2,

  setup(): GameState {
    return {
      phase: GameplayPhase.INPUT_ANY,
      turnsTaken: 0,
      timer: TIME_PER_TURN,
      battlefield: newBattlefield(),
      players: [
        newPlayerState("1", 0),
        newPlayerState("2", 1),
      ],
      minionIdGenerator: 0,
    }
  },

  update: ({ game }) => {
    if (game.timer <= 0) {
      // resolveCombatPhase(game);
      game.timer = TIME_PER_TURN;
    } else {
      --game.timer;
    }
  },

  actions: {
    move({ minionId, tileId }, { game, playerId }) {
      const player: PlayerState = game.players[game.currentPlayer];
      // is it the player's turn?
      if (player.id != playerId) { return }
      // can the selected minion move?
      const minion: Minion = game.battlefield.minions[minionId];
      if (minion == null) { return }
      if (minion.owner != player.index) { return }
      if (minion.location != BoardLocation.BATTLEFIELD) { return }
      if (!isMovementAllowed(game, minion.position, tileId)) { return }
      // can the player issue movement commands?
      let movement: number = minion.movement - 1;
      if (game.phase === GameplayPhase.INPUT_MOVEMENT) {
        // this is a continuation of a multi-step command
        if (game.spawnCommand != null) {
          if (game.spawnCommand.minion != minionId) { return }
        } else if (game.movementCommand != null) {
          if (game.movementCommand.minion != minionId) { return }
          movement = game.movementCommand.remaining;
        } 
      }
      else if (game.phase != GameplayPhase.INPUT_ANY) { return }
      if (movement <= 0) { return }
      // issue movement command
      minion.position = tileId;
      game.movementCommand = {
        minion: minionId,
        from: minion.location,
        to: tileId,
        remaining: movement - 1,
      };
      // transition to the next phase
      if (movement === 1) {
        game.currentPlayer = (game.currentPlayer + 1) % game.players.length;
        game.phase.INPUT_ANY;
      }
    },

    spawn({ speciesId, tileId }, { game, playerId }) {
      const player: PlayerState = game.players[game.currentPlayer];
      // is it the player's turn?
      if (player.id != playerId) { return }
      // can the player issue spawn commands?
      if (game.phase != GameplayPhase.INPUT_ANY) { return }
      const tile: Tile = game.battlefield.tiles[tileId];
      // is the tile a spawn point?
      if (tile.type != TileType.SPAWN) { return }
      // is the spawn point owned by the player?
      if (tile.owner != player.index) { return }
      // is the spawn point free?
      if (!!tile.minion) { return }
      // generate minion
      const species: MinionData = player.deck[speciesId];
      const uid: number = ++game.minionIdGenerator;
      const minion: Minion = newMinion(uid, player.index, species);
      minion.location = BoardLocation.BATTLEFIELD;
      minion.position = tileId;
      game.movementCommand = null;
      game.spawnCommand = {
        minion: uid,
        tile: tileId,
        movement: minion.movement - 1,
      };
      // transition to the next phase
      if (minion.movement > 1) {
        game.phase = GameplayPhase.INPUT_MOVEMENT;
      } else {

      }
    },
  },

  events: {
    playerJoined() {
      // Handle player joined
    },

    playerLeft() {
      // Handle player left
    },
  },
})
