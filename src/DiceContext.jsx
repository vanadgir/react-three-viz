import { createContext, useCallback, useContext, useState } from "react";
import { Color } from "three";

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

// no implementation yet, more like an interface
export const DiceContext = createContext({
  diceAttributes: defaultDiceAttributes,
  diceInPlay: [],
  createDice: (listToCreate) => undefined,
});

export const DiceProvider = ({ children }) => {
  const [diceAttributes, setDiceAttributes] = useState(defaultDiceAttributes);
  const [diceInPlay, setDiceInPlay] = useState([]);

  const createD4 = useCallback(
    (radius) => (
      <D4
        position={[-1, 3, 5]}
        key={diceInPlay.length}
        radius={radius}
        color={new Color(diceAttributes.colors["D4"])}
        textColor={diceAttributes.textColors["D4"]}
      />
    ),
    [diceAttributes, diceInPlay]
  );

  const createD6 = useCallback(
    (radius) => (
      <D6
        position={[2, 3, -5]}
        key={diceInPlay.length}
        radius={radius}
        color={new Color(diceAttributes.colors["D6"])}
        textColor={diceAttributes.textColors["D6"]}
      />
    ),
    [diceAttributes, diceInPlay]
  );

  const createD8 = useCallback(
    (radius) => (
      <D8
        position={[3, 3, 5]}
        key={diceInPlay.length}
        radius={radius}
        color={new Color(diceAttributes.colors["D8"])}
        textColor={diceAttributes.textColors["D8"]}
      />
    ),
    [diceAttributes, diceInPlay]
  );

  const createD10 = useCallback(
    (radius) => (
      <D10
        position={[-6, 3, 5]}
        key={diceInPlay.length}
        radius={radius}
        color={new Color(diceAttributes.colors["D10"])}
        textColor={diceAttributes.textColors["D10"]}
      />
    ),
    [diceAttributes, diceInPlay]
  );

  const createD12 = useCallback(
    (radius) => (
      <D12
        position={[1, 3, 5]}
        key={diceInPlay.length}
        radius={radius}
        color={new Color(diceAttributes.colors["D12"])}
        textColor={diceAttributes.textColors["D12"]}
      />
    ),
    [diceAttributes, diceInPlay]
  );

  const createD20 = useCallback(
    (radius) => (
      <D20
        position={[-2, 3, -5]}
        key={diceInPlay.length}
        radius={radius}
        color={new Color(diceAttributes.colors["D20"])}
        textColor={diceAttributes.textColors["D20"]}
      />
    ),
    [diceAttributes, diceInPlay]
  );

  const createDice = useCallback(
    (listToCreate) => {
      console.log(diceAttributes);
      const addedDice = listToCreate.map((item) => {
        switch (item) {
          case "D4":
            return createD4(diceAttributes.sizes.D4);
          case "D6":
            return createD6(diceAttributes.sizes.D6);
          case "D8":
            return createD8(diceAttributes.sizes.D8);
          case "D10":
            return createD10(diceAttributes.sizes.D10);
          case "D12":
            return createD12(diceAttributes.sizes.D12);
          default:
            return createD20(diceAttributes.sizes.D20);
        }
      });
      setDiceInPlay([...diceInPlay, ...addedDice]);
    },
    [
      diceAttributes,
      diceInPlay,
      createD4,
      createD6,
      createD8,
      createD10,
      createD12,
      createD20,
    ]
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
        value={{ createDice, diceAttributes, diceInPlay, updateAttributes }}
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
