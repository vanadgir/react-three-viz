import { useCallback, useState } from "react";

import { useDice } from "../../../contexts";
import BGM from "../BGM";
import Options from "./Options";

import { validDice } from "../../../utils";
import styles from "./DMenu.module.scss";

const DMenu = () => {
  const [menuPopped, setMenuPopped] = useState(false);
  const [diceFormula, setDiceFormula] = useState("");
  const {
    clearBoard,
    createDice,
    diceAttributes,
    diceOptions,
    rerollBoard,
    submitDiceFormula,
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
        <button
          className={`${styles.menuButton} ${menuPopped ? styles.active : ""}`}
          onClick={() => setMenuPopped(!menuPopped)}
        >
          Options
        </button>
      </form>
      <div className={styles.diceMenuEntries}>
        {validDice.map((diceName) => (
          <div className={styles.diceMenuEntry} key={`${diceName}-menu`}>
            <button
              className={styles.spawnButton}
              onClick={() => createDice([diceName])}
              style={{
                backgroundColor: diceOptions.globalColor
                  ? diceAttributes.colors["global"]
                  : diceAttributes.colors[diceName],
                color: diceOptions.globalColor
                  ? diceAttributes.textColors["global"]
                  : diceAttributes.textColors[diceName],
              }}
            >
              {diceName}
            </button>
          </div>
        ))}
      </div>
      <BGM />
      {menuPopped && <Options />}
    </div>
  );
};

export default DMenu;
