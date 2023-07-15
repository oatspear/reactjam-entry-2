import type { Players, RuneClient } from "rune-games-sdk/multiplayer"

// -----------------------------------------------------------------------------
// Player State
// -----------------------------------------------------------------------------


export interface PlayerState {
  id: string,
  team: number,
  deck: Array<number>
}


function newPlayerState(id: string, team: number, deck?: Array<number>): PlayerState {
  deck = deck || [];
  return { id, team, deck };
}


// -----------------------------------------------------------------------------
// Location State (One Component of the Battle Board)
// -----------------------------------------------------------------------------


export interface LocationState {
  index: number;
  minions: Array<Array<number>>;
}


function newMinionSlotsArray(): Array<number> {
  return [0, 0, 0, 0];
}


function newLocationState(index: number): LocationState {
  return { index, minions: [newMinionSlotsArray(), newMinionSlotsArray()] };
}


// -----------------------------------------------------------------------------
// Game State
// -----------------------------------------------------------------------------


export interface GameState {
  count: number,
  locations: Array<LocationState>,
  players: Array<PlayerState>
}


export function getCount(game: GameState) {
  return game.count;
}

// -----------------------------------------------------------------------------
// Game Actions
// -----------------------------------------------------------------------------


type GameActions = {
  increment: (params: { amount: number }) => void
  spawnMinion: (params: { location: number, team: number, index: number }) => void
  clearMinions: () => void
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
      count: 0,
      locations: [
        newLocationState(0),
        newLocationState(1),
        newLocationState(2),
      ],
      players: [
        newPlayerState("1", 0),
        newPlayerState("2", 1),
      ],
    }
  },

  actions: {
    increment({ amount }, { game }) {
      game.count += amount
    },

    spawnMinion({ location, team, index }, { game }) {
      game.locations[location].minions[team][index] = 1;
    },

    clearMinions(_noargs, { game }) {
      for (const location of game.locations) {
        for (const team of location.minions) {
          for (let i = 0; i < team.length; ++i) {
            team[i] = 0;
          }
        }
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
