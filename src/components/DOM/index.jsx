import DMenu from "./DMenu";
import BGM from "./BGM";
import Results from "./Results";

import styles from "./DOM.module.scss";

const DOM = () => {
  return (
    <div className={styles.DOM}>
      <div className={`${styles.UI} ${styles.noselect}`}>
        <DMenu />
        <BGM />
        <Results />
      </div>
    </div>
  );
};

export default DOM;
