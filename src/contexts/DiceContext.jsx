import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Color } from "three";

import { randomSpawnPosition } from "../Vec3Utils";

import D4 from "../D4";
import D6 from "../D6";
import D8 from "../D8";
import D10 from "../D10";
import D12 from "../D12";
import D20 from "../D20";

import {
  D4_CONST,
  D6_CONST,
  D8_CONST,
  D10_CONST,
  D12_CONST,
  D20_CONST,
} from "../constants";
import { useAudio } from "./AudioContext";

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
  const [diceInPlay, setDiceInPlay] = useState({});
  const { playRollResultSFX } = useAudio();

  const diceCounts = useMemo(() => {
    const total = Object.keys(diceInPlay).length;
    const resolved = Object.keys(diceInPlay).filter(
      (d) => diceInPlay[d].resolved
    ).length;
    const netScore = Object.keys(diceInPlay).reduce(
      (prev, cur) => prev + diceInPlay[cur].resolveValue,
      0
    );
    const diceNames = Object.keys(diceInPlay).map((d) => diceInPlay[d].name);
    const individualCounts = diceNames.reduce(
      (prev, cur) => {
        prev[cur]++;
        return prev;
      },
      {
        D4: 0,
        D6: 0,
        D8: 0,
        D10: 0,
        D12: 0,
        D20: 0,
      }
    );
    return { total, resolved, netScore, individualCounts };
  }, [diceInPlay]);

  const onDieResolve = useCallback(
    (id, result, resultFudge) => {
      try {
        setDiceInPlay({
          ...diceInPlay,
          [id]: { ...diceInPlay[id], resolved: true, resolveValue: result },
        });
        playRollResultSFX(resultFudge);
      } catch (e) {
        console.error(e);
        return;
      }
    },
    [diceInPlay, playRollResultSFX]
  );

  const resetDie = useCallback(
    (key) => {
      setDiceInPlay({
        ...diceInPlay,
        [key]: { ...diceInPlay[key], resolved: false, resolveValue: 0 },
      });
    },
    [diceInPlay]
  );

  const clearBoard = useCallback(() => {
    setDiceInPlay({});
    setCurrentIndex(0);
  }, []);

  const createDx = useCallback(
    (dName, key) => {
      // use dName o dDie to dTermine dAttribute
      const D = diceComponents[dName];
      return {
        component: (
          <D
            id={key}
            position={randomSpawnPosition()}
            key={key}
            radius={diceAttributes.sizes[dName]}
            color={new Color(diceAttributes.colors[dName])}
            textColor={diceAttributes.textColors[dName]}
          />
        ),
        name: dName,
        resolved: false,
        resolveValue: 0,
      };
    },
    [diceAttributes]
  );

  const createDice = useCallback(
    (listToCreate, shouldClear) => {
      let dice = diceInPlay;
      if (shouldClear) {
        dice = {};
      }
      const addedDice = listToCreate.reduce(
        (prev, cur, i) => ({
          ...prev,
          [currentIndex + i]: createDx(cur, currentIndex + i),
        }),
        {}
      );
      setDiceInPlay({ ...dice, ...addedDice });
      setCurrentIndex(currentIndex + listToCreate.length);
    },
    [currentIndex, diceAttributes, diceInPlay, createDx]
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
          clearBoard,
          createDice,
          diceAttributes,
          diceCounts,
          diceInPlay,
          onDieResolve,
          resetDie,
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
