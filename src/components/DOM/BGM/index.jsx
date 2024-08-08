import { useAudio } from "../../../contexts";

import styles from "./BGM.module.scss";

const BGM = () => {
  const {
    togglePlayback,
    nextTrack,
    changeVolume,
    playFromPosition,
    playbackPosition,
    trackDuration,
  } = useAudio();

  const convertTime = (time) => {
    const minutes = `${Math.floor(time / 60)}`;
    const seconds = `${Math.floor(time % 60)}`.padStart(2, 0);
    return `${minutes}:${seconds}`;
  };

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
        className={styles.trackProgress}
        type="range"
        min={0}
        max={trackDuration}
        step={0.1}
        value={playbackPosition}
        onChange={(e) => playFromPosition(parseFloat(e.target.value))}
      ></input>
      <span className={styles.trackDuration}>
        {convertTime(playbackPosition)} / {convertTime(trackDuration)}
      </span>
      <span className={styles.volumeButtons}>
        <button onClick={() => changeVolume(-0.05)}>-</button>
        <button onClick={() => changeVolume(0.05)}>+</button>
      </span>
    </div>
  );
};

export default BGM;
