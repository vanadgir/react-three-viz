import { useDice } from "../../contexts";
import styles from "./Results.module.scss";

const Results = () => {
  const { diceCounts } = useDice();

  return (
    <div className={styles.results}>
      <p>
        Dice in Play: {diceCounts.total} ({diceCounts.resolved} /{" "}
        {diceCounts.total} resolved)
      </p>
      <p>Formula: {diceCounts.formula}</p>
      <p>
        Result: {diceCounts.netScore}
        {diceCounts.total === diceCounts.resolved && " (Final)"}
      </p>
    </div>
  );
};

export default Results;
