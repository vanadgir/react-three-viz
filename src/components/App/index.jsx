import { DiceProvider } from "../../contexts";
import DOM from "../DOM";
import R3F from "../R3F";

import "./App.module.scss";

const App = () => {
  return (
    <DiceProvider>
      <DOM />
      <R3F />
    </DiceProvider>
  );
};

export default App;
