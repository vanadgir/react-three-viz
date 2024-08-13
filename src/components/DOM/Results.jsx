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
      {diceCounts.formula !== "" && (
        <p>
          Formula: {diceCounts.formula} ={" "}
          <span
            className={
              diceCounts.total === diceCounts.resolved ? styles.final : ""
            }
          >
            {diceCounts.netScore}
          </span>
        </p>
      )}
    </div>
  );
};

export default Results;
