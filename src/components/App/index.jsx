import { AudioProvider, DiceProvider } from "../../contexts";
import DOM from "../DOM";
import R3F from "../R3F";

import styles from "./App.module.scss";

const App = () => {
  return (
    <div className={styles.app}>
      <AudioProvider>
        <DiceProvider>
          <DOM />
          <R3F />
        </DiceProvider>
      </AudioProvider>
    </div>
  );
};

export default App;
