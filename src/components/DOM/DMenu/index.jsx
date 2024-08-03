import { useCallback, useState } from "react";
import { CompactPicker } from "react-color";

import { useDice } from "../../../contexts";
import Slider from "./Slider";

import { validDice } from "../../../utils";
import styles from "./DMenu.module.scss";

const DMenu = () => {
  const [selectedD, setSelectedD] = useState(null);
  const [diceFormula, setDiceFormula] = useState("");
  const {
    clearBoard,
    createDice,
    diceAttributes,
    rerollBoard,
    submitDiceFormula,
    updateAttributes,
  } = useDice();

  const parseDiceFormula = useCallback(
    (e) => {
      e.preventDefault();
      submitDiceFormula(diceFormula);
      setDiceFormula("");
    },
    [diceFormula]
  );

  return (
    <div className={styles.diceMenu}>
      <form className={styles.diceMenuText} onSubmit={parseDiceFormula}>
        <input
          type="text"
          onChange={(e) => setDiceFormula(e.target.value)}
          value={diceFormula}
          placeholder="2d20 + 4d6, etc..."
        />
        <button className={styles.textSubmit} type="submit">
          Submit
        </button>
        <button className={styles.rerollButton} onClick={rerollBoard}>
          Reroll Board
        </button>
        <button className={styles.clearButton} onClick={clearBoard}>
          Clear Board
        </button>
      </form>
      <div className={styles.diceMenuEntries}>
        {validDice.map((diceName) => (
          <div className={styles.diceMenuEntry} key={`${diceName}-menu`}>
            <button
              className={styles.spawnButton}
              onClick={() => createDice([diceName])}
              style={{
                backgroundColor: diceAttributes.colors[diceName],
                color: diceAttributes.textColors[diceName],
              }}
            >
              {diceName}
            </button>
            <button
              className={`${styles.menuButton} ${
                diceName === selectedD && styles.active
              }`}
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
        <div className={styles.diceMenuEdit}>
          <div className={styles.diceTitle}>
            <p>Dice</p>
            <p>{selectedD}</p>
          </div>
          <Slider
            className={styles.slider}
            label="Size"
            max={3}
            update={(value) => {
              updateAttributes("sizes", selectedD, value);
            }}
            value={diceAttributes?.sizes[selectedD]}
          />
          <div className={styles.colorWrapper}>
            <p>Color</p>
            <CompactPicker
              onChangeComplete={(color) => {
                updateAttributes("colors", selectedD, color.hex);
              }}
            />
          </div>
          <div className={styles.colorWrapper}>
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
