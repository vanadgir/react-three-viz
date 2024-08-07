import DMenu from "./DMenu";
import BGM from "./BGM";
import Results from "./Results";

import "./DOM.scss";

const DOM = () => {
  return (
    <div className="DOM">
      <div className="UI noselect">
        <DMenu />
        <BGM />
        <Results />
      </div>
    </div>
  );
};

export default DOM;
