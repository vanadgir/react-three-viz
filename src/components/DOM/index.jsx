import DMenu from "./DMenu";
import Results from "./Results";

import "./DOM.scss";

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
