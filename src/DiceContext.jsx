import { createContext, useCallback, useContext, useState } from "react";
import { Color } from "three";

import { randomSpawnPosition } from "./Vec3Utils";

import D4 from "./D4";
import D6 from "./D6";
import D8 from "./D8";
import D10 from "./D10";
import D12 from "./D12";
import D20 from "./D20";

import {
  D4_CONST,
  D6_CONST,
  D8_CONST,
  D10_CONST,
  D12_CONST,
  D20_CONST,
} from "./constants";

// create the default context values
const defaultDiceAttributes = {
  colors: {
    D4: "grey",
    D6: "green",
    D8: "orange",
    D10: "red",
    D12: "blue",
    D20: "purple",
  },
  sizes: {
    D4: D4_CONST.RADIUS,
    D6: D6_CONST.RADIUS,
    D8: D8_CONST.RADIUS,
    D10: D10_CONST.RADIUS,
    D12: D12_CONST.RADIUS,
    D20: D20_CONST.RADIUS,
  },
  textColors: {
    D4: "white",
    D6: "white",
    D8: "white",
    D10: "white",
    D12: "white",
    D20: "white",
  },
};

// references to the components, for dynamic rendering
const diceComponents = {
  D4: D4,
  D6: D6,
  D8: D8,
  D10: D10,
  D12: D12,
  D20: D20,
};

// no implementation yet, more like an interface
export const DiceContext = createContext({
  diceAttributes: defaultDiceAttributes,
  diceInPlay: [],
  clearDice: () => undefined,
  createDice: (listToCreate) => undefined,
  updateAttributes: (attribute, key, value) => undefined,
});

export const DiceProvider = ({ children }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [diceAttributes, setDiceAttributes] = useState(defaultDiceAttributes);
  const [diceInPlay, setDiceInPlay] = useState([]);

  const createDx = useCallback(
    (dName, key) => {
      // use dName o dDie to dTermine dAttribute
      const Die = diceComponents[dName];
      return (
        <Die
          position={randomSpawnPosition()}
          key={key}
          radius={diceAttributes.sizes[dName]}
          color={new Color(diceAttributes.colors[dName])}
          textColor={diceAttributes.textColors[dName]}
        />
      );
    },
    [diceAttributes]
  );

  const createDice = useCallback(
    (listToCreate, shouldClear) => {
      let dice = diceInPlay;
      if (shouldClear) {
        dice = [];
      }
      const addedDice = listToCreate.map((item, i) =>
        createDx(item, currentIndex + i)
      );
      setDiceInPlay([...dice, ...addedDice]);
      setCurrentIndex(currentIndex + addedDice.length);
    },
    [diceAttributes, diceInPlay, createDx]
  );

  const updateAttributes = useCallback(
    (attribute, key, value) => {
      setDiceAttributes({
        ...diceAttributes,
        [attribute]: { ...diceAttributes[attribute], [key]: value },
      });
    },
    [diceAttributes]
  );

  return (
    <>
      <DiceContext.Provider
        value={{
          createDice,
          diceAttributes,
          diceInPlay,
          updateAttributes,
        }}
      >
        {children}
      </DiceContext.Provider>
    </>
  );
};

export function useDice() {
  if (!DiceContext) {
    throw new Error("DiceContext must be defined!");
  }
  return useContext(DiceContext);
}
