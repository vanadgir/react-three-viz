import DMenu from "./DMenu";
import Results from "./Results";

import "./DOM.css";

const DOM = () => {
  return (
    <div className="DOM">
      <div className="UI noselect">
        <DMenu />
        <Results />
      </div>
    </div>
  );
};

export default DOM;
