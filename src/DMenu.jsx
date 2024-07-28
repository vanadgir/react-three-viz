import { CompactPicker } from "react-color";

import { useDice } from "./DiceContext";

import Slider from "./Slider";
import { useState } from "react";

const DMenu = () => {
  const [selectedD, setSelectedD] = useState(null);
  const { createDice, diceAttributes, updateAttributes } = useDice();
  return (
    <div className="dice-menu">
      <div className="dice-menu-entries">
        {["D4", "D6", "D8", "D10", "D12", "D20"].map((diceName) => (
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
