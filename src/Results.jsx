import { useDice } from "./contexts/DiceContext";
import styles from "./Results.module.scss";

const Results = () => {
  const { diceCounts } = useDice();

  const formula = Object.keys(diceCounts?.individualCounts).reduce(
    (prev, cur) => {
      let addString = "";
      if (diceCounts?.individualCounts[cur] !== 0) {
        if (prev === "") {
          addString =
            diceCounts?.individualCounts[cur] + cur.toLocaleLowerCase();
        } else {
          addString = ` + ${
            diceCounts?.individualCounts[cur]
          }${cur.toLocaleLowerCase()}`;
        }
      }
      return prev + addString;
    },
    ""
  );

  return (
    <div className={styles.results}>
      <p>
        Dice in Play: {diceCounts.total} ({diceCounts.resolved} /{" "}
        {diceCounts.total} resolved)
      </p>
      <p>Formula: {formula}</p>
      <p>
        Result: {diceCounts.netScore}
        {diceCounts.total === diceCounts.resolved && " (Final)"}
      </p>
    </div>
  );
};

export default Results;
