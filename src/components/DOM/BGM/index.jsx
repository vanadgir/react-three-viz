import { useAudio } from "../../../contexts";

import styles from "./BGM.module.scss";

const BGM = () => {
  const { togglePlayback, nextTrack, changeVolume } = useAudio();

  return (
    <div className={styles.bgmMenu}>
      <span className={styles.bgmButtons}>
        <input
          type="image"
          src="../../assets/playpause.png"
          onClick={togglePlayback}
        ></input>
        <input
          type="image"
          src="../../assets/next.png"
          onClick={nextTrack}
        ></input>
      </span>
      <input
        className={styles.volumeSlider}
        type="range"
        min={0}
        max={1}
        step={0.01}
        defaultValue={0.5}
        onChange={(e) => changeVolume(parseFloat(e.target.value))}
      ></input>
    </div>
  );
};

export default BGM;
