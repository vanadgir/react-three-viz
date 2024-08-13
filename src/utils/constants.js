export const ZEROISH = 0.085;

export const REROLL_INTERVAL = 8000;
export const REST_INTERVAL = 500;

export const validDice = ["D4", "D6", "D8", "D10", "D12", "D20"];

export const D4_CONST = {
  NAME: "D4",
  RADIUS: 1,
  GROUP_SIZE: 1,
  INERTIA_MOD: 0.02,
};

export const D6_CONST = {
  NAME: "D6",
  RADIUS: 1,
  GROUP_SIZE: 2,
};

export const D8_CONST = {
  NAME: "D8",
  RADIUS: 0.9,
  GROUP_SIZE: 1,
};

export const D10_CONST = {
  NAME: "D10",
  RADIUS: 1,
  GROUP_SIZE: 2,
};

export const D12_CONST = {
  NAME: "D12",
  RADIUS: 0.9,
  GROUP_SIZE: 3,
};

export const D20_CONST = {
  NAME: "D20",
  RADIUS: 1,
  GROUP_SIZE: 1,
};

// create the default context values
export const defaultDiceAttributes = {
  colors: {
    D4: "grey",
    D6: "green",
    D8: "orange",
    D10: "red",
    D12: "blue",
    D20: "purple",
    global: "white",
  },
  sizes: {
    D4: D4_CONST.RADIUS,
    D6: D6_CONST.RADIUS,
    D8: D8_CONST.RADIUS,
    D10: D10_CONST.RADIUS,
    D12: D12_CONST.RADIUS,
    D20: D20_CONST.RADIUS,
    global: 1,
  },
  textColors: {
    D4: "white",
    D6: "white",
    D8: "white",
    D10: "white",
    D12: "white",
    D20: "white",
    global: "black",
  },
};

export const defaultDiceOptions = {
  globalColor: true,
  globalSize: true,
  resetStuck: false,
  restOnTable: false,
  stuckTimer: 2.0,
};

export const defaultVolumes = {
  bgm: 1,
  global: 1,
  sfx: 1,
};
