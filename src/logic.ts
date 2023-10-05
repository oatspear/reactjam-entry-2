// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------

import type { Players, RuneClient } from "rune-games-sdk/multiplayer"

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------


export const TIME_PER_TURN: number = 45;  // seconds
export const MINIONS_PER_LOCATION: number = 4;


export enum Role {
  TANK = 1,
  DAMAGE,
  SUPPORT,
}


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
// Minion State
// -----------------------------------------------------------------------------


export interface MinionState {
  index: number;
  minionType: number;
  power: number;
  ability: number;
  role: Role;
  powerBonus: number;
}


function newMinionState(index: number, minionType: number): MinionState {
  return {
    index,
    minionType,
    power: 1,
    ability: 0,
    role: Role.TANK,
    powerBonus: 0,
  };
}


// -----------------------------------------------------------------------------
// Location State (One Component of the Battle Board)
// -----------------------------------------------------------------------------


export interface LocationState {
  index: number;
  minions: Array<Array<MinionState | null>>;
}


function newMinionSlotsArray(): Array<MinionState | null> {
  return [null, null, null, null];
}


function newLocationState(index: number): LocationState {
  return { index, minions: [newMinionSlotsArray(), newMinionSlotsArray()] };
}


// -----------------------------------------------------------------------------
// Game State
// -----------------------------------------------------------------------------


export interface GameState {
  turnsTaken: number,
  timer: number,
  locations: Array<LocationState>,
  players: Array<PlayerState>
}


function resolveCombatPhase(game: GameState): void {
  
}


function resolveLocationCombat(location: LocationState): void {

}


function sortInAttackingOrder(minions: MinionState[]): MinionState[][] {
  // order is DAMAGE > TANK > SUPPORT
  const sorted: MinionState[][] = [[], [], []];
  for (const minion of minions) {
    switch (minion.damageType) {
      case DamageType.RANGED:
        sorted[0].push(minion);
        break;
      case DamageType.MELEE:
        sorted[1].push(minion);
        break;
      case DamageType.SPELL:
        sorted[2].push(minion);
        break;
    }
  }
  return sorted;
}


function sortInDefendingOrder(minions: MinionState[]): MinionState[] {
  // order is MELEE > SPELL > RANGED
  const sorted = [];
  const spell = [];
  const ranged = [];
  for (const minion of minions) {
    switch (minion.damageType) {
      case DamageType.MELEE:
        sorted.push(minion);
        break;
      case DamageType.SPELL:
        spell.push(minion);
        break;
      case DamageType.RANGED:
        ranged.push(minion);
        break;
    }
  }
  sorted.push.apply(sorted, spell);
  sorted.push.apply(sorted, ranged);
  return sorted;
}


// -----------------------------------------------------------------------------
// Game Actions
// -----------------------------------------------------------------------------


type GameActions = {
  spawnMinion: (params: { location: number, team: number, minionType: number }) => void
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
      turnsTaken: 0,
      timer: TIME_PER_TURN,
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

  update: ({ game }) => {
    if (game.timer <= 0) {
      resolveCombatPhase(game);
      game.timer = TIME_PER_TURN;
    } else {
      --game.timer;
    }
  },

  actions: {
    spawnMinion({ location, team, minionType }, { game }) {
      const minions: MinionState[] = game.locations[location].minions[team];
      const index: number = minions.length
      if (minions.length < MINIONS_PER_LOCATION) {
        minions.push(newMinionState(index, minionType));
      }
    },

    clearMinions(_noargs, { game }) {
      for (const location of game.locations) {
        location.minions = [];
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
