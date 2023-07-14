import type { RuneClient } from "rune-games-sdk/multiplayer"

export interface GameState {
  count: number,
  minions: Array<number>
}

type GameActions = {
  increment: (params: { amount: number }) => void
  spawnMinion: (params: { index: number }) => void
  clearMinions: () => void
}

declare global {
  const Rune: RuneClient<GameState, GameActions>
}

export function getCount(game: GameState) {
  return game.count
}

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 4,
  setup(): GameState {
    return {
      count: 0,
      minions: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
  },
  actions: {
    increment({ amount }, { game }) {
      game.count += amount
    },

    spawnMinion({ index }, { game }) {
      game.minions[index] = 1;
    },

    clearMinions(_noargs, { game }) {
      for (let i = game.minions.length - 1; i >= 0; i--) {
        game.minions[i] = 0;
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
