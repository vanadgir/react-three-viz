import DOM from "./DOM";
import R3F from "./R3F";

import { DiceProvider } from "./DiceContext";

import "./App.css";

const App = () => {
  return (
    <DiceProvider>
      <DOM />
      <R3F />
    </DiceProvider>
  );
};

export default App;
