import { useCallback, useState } from "react";
import { CompactPicker } from "react-color";

import { useDice } from "./contexts/DiceContext";

import Slider from "./Slider";

const validDice = ["D4", "D6", "D8", "D10", "D12", "D20"];

const DMenu = () => {
  const [selectedD, setSelectedD] = useState(null);
  const [diceFormula, setDiceFormula] = useState("");
  const { clearBoard, createDice, diceAttributes, updateAttributes } =
    useDice();

  const parseDiceFormula = useCallback(
    (e) => {
      e.preventDefault();
      const splitFormula = [
        ...diceFormula.matchAll(new RegExp(/(\d*)[d|D](\d{1,2})/gm)),
      ]
        .filter((group) => validDice.includes(`D${group[2]}`))
        .reduce((prev, cur) => {
          const toAdd = new Array(parseInt(cur[1]) || 1)
            .fill(undefined)
            .map((e) => {
              return `D${cur[2]}`;
            });
          return [...prev, ...toAdd];
        }, []);

      if (splitFormula.length) {
        createDice(splitFormula, true);
      }
      setDiceFormula("");
    },
    [diceFormula]
  );

  return (
    <div className="dice-menu">
      <form className="dice-menu-text" onSubmit={parseDiceFormula}>
        <input
          type="text"
          onChange={(e) => setDiceFormula(e.target.value)}
          value={diceFormula}
        />
        <button className="text-submit" type="submit">
          Submit
        </button>
        <button className="clear-button" onClick={clearBoard}>
          Clear Board
        </button>
      </form>
      <div className="dice-menu-entries">
        {validDice.map((diceName) => (
          <div className="dice-menu-entry">
            <button
              className="spawn-button"
              onClick={() => createDice([diceName])}
              style={{
                backgroundColor: diceAttributes.colors[diceName],
                color: diceAttributes.textColors[diceName],
              }}
            >
              {diceName}
            </button>
            <button
              className={`menu-button ${diceName === selectedD && "active"}`}
              onClick={() => {
                if (selectedD !== diceName) {
                  setSelectedD(diceName);
                } else {
                  setSelectedD(null);
                }
              }}
            >
              edit
            </button>
          </div>
        ))}
      </div>
      {selectedD && (
        <div className="dice-menu-edit">
          <div className="dice-title">
            <p>Dice</p>
            <p>{selectedD}</p>
          </div>
          <Slider
            className="slider"
            label="Size"
            max={3}
            update={(value) => {
              updateAttributes("sizes", selectedD, value);
            }}
            value={diceAttributes?.sizes[selectedD]}
          />
          <div className="color-wrapper">
            <p>Color</p>
            <CompactPicker
              onChangeComplete={(color) => {
                updateAttributes("colors", selectedD, color.hex);
              }}
            />
          </div>
          <div className="color-wrapper">
            <p>Text Color</p>
            <CompactPicker
              onChangeComplete={(color) => {
                updateAttributes("textColors", selectedD, color.hex);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DMenu;
