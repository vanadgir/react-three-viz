import { CompactPicker } from "react-color";
import { useState } from "react";

import Slider from "./Slider";
import { useAudio, useDice } from "../../../contexts";

import styles from "./Options.module.scss";
import { validDice } from "../../../utils";

const Options = ({}) => {
  const { globalVolume, updateGlobalVolume } = useAudio();
  const { diceAttributes, diceOptions, updateAttributes, updateOptions } =
    useDice();
  const [selectedForColor, setSelectedForColor] = useState("D4");
  const [selectedForSize, setSelectedForSize] = useState("D4");
  const [selectedForText, setSelectedForText] = useState("D4");

  return (
    <div className={styles.options}>
        <Slider
          className={styles.slider}
        label="Volume"
        max={2}
          min={0}
        update={updateGlobalVolume}
        value={globalVolume}
        />
        <div className={styles.optionWrapper}>
          <p>Resolve Only on Table</p>
          <input
            type="checkbox"
            onChange={(e) =>
              updateOptions("restOnTable", !diceOptions.restOnTable)
            }
            checked={diceOptions.restOnTable}
          />
        </div>
        <div className={styles.optionWrapper}>
          <p>Reset Stuck Dice</p>
          <input
            type="checkbox"
            onChange={(e) =>
              updateOptions("resetStuck", !diceOptions.resetStuck)
            }
            checked={diceOptions.resetStuck}
          />
        </div>
        {diceOptions.resetStuck && (
          <div className={styles.optionWrapper}>
            <p>Stuck Timer (sec)</p>
            <input
              type="number"
              max={30}
              min={1}
              onChange={(e) => updateOptions("stuckTimer", e.target.value)}
              value={diceOptions.stuckTimer}
            />
          </div>
        )}
        <div className={styles.optionWrapper}>
          <p>Global Size</p>
          <input
            type="checkbox"
            onChange={(e) =>
              updateOptions("globalSize", !diceOptions.globalSize)
            }
            checked={diceOptions.globalSize}
          />
        </div>
        <Slider
          className={styles.slider}
          label="Size"
          max={3}
          update={(value) => {
            updateAttributes(
              "sizes",
              diceOptions.globalSize ? "global" : selectedForSize,
              value
            );
          }}
          value={
            diceOptions.globalSize
              ? diceAttributes?.sizes.global
              : diceAttributes.sizes[selectedForSize] ?? 0
          }
        />
        {!diceOptions.globalSize && (
          <div className={styles.sizeButtons}>
            {validDice.map((d) => (
              <button
                key={`size-button-${d}`}
                className={`${styles.dButton} ${styles.sizeButton} ${
                  d === selectedForSize ? styles.active : ""
                }`}
                onClick={() => {
                  setSelectedForSize(d);
                }}
              >
                {d}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className={styles.optionsColumn}>
        <div className={styles.optionWrapper}>
          <p>Global Color</p>
          <input
            type="checkbox"
            onChange={(e) =>
              updateOptions("globalColor", !diceOptions.globalColor)
            }
            checked={diceOptions.globalColor}
          />
        </div>
        <div className={styles.colorWrapper}>
          <div className={styles.colorTitle}>
            <p>Body</p>
            {!diceOptions.globalColor ? (
              validDice.map((d) => (
                <button
                  key={`color-button-${d}`}
                  className={`${styles.dButton} ${styles.colorButton} ${
                    d === selectedForColor ? styles.active : ""
                  }`}
                  onClick={() => {
                    setSelectedForColor(d);
                  }}
                >
                  {d}
                </button>
              ))
            ) : (
              <p>(Global)</p>
            )}
          </div>
          <CompactPicker
            onChangeComplete={(color) => {
              if (diceOptions.globalColor || selectedForColor) {
                updateAttributes(
                  "colors",
                  diceOptions.globalColor ? "global" : selectedForColor,
                  color.hex
                );
              }
            }}
          />
        </div>
        <div className={styles.colorWrapper}>
          <div className={styles.colorTitle}>
            <p>Text</p>
            {!diceOptions.globalColor ? (
              validDice.map((d) => (
                <button
                  key={`text-button-${d}`}
                  className={`${styles.dButton} ${styles.colorButton} ${
                    d === selectedForText ? styles.active : ""
                  }`}
                  onClick={() => {
                    setSelectedForText(d);
                  }}
                >
                  {d}
                </button>
              ))
            ) : (
              <p>(Global)</p>
            )}
          </div>
          <CompactPicker
            onChangeComplete={(color) => {
              if (diceOptions.globalColor || selectedForText) {
                updateAttributes(
                  "textColors",
                  diceOptions.globalColor ? "global" : selectedForText,
                  color.hex
                );
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Options;
