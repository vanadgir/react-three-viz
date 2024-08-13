import { useAudio } from "../../../contexts";

import styles from "./BGM.module.scss";
import next from "../../../../assets/images/next.png";
import pause from "../../../../assets/images/pause.png";
import play from "../../../../assets/images/play.png";

const BGM = () => {
  const {
    bgmLoaded,
    bgmPlaying,
    nextTrack,
    playFromPosition,
    playbackPosition,
    togglePlayback,
    trackDuration,
  } = useAudio();

  const convertTime = (time) => {
    const minutes = `${Math.floor(time / 60)}`;
    const seconds = `${Math.floor(time % 60)}`.padStart(2, 0);
    return `${minutes}:${seconds}`;
  };

  return (
    <>
      {bgmLoaded && (
        <div className={styles.bgmMenu}>
          <span className={styles.bgmButtons}>
            <input
              className={bgmPlaying ? "" : styles.paused}
              type="image"
              src={bgmPlaying ? pause : play}
              onClick={togglePlayback}
            />
            <input type="image" src={next} onClick={nextTrack} />
          </span>
          <input
            className={styles.trackProgress}
            type="range"
            min={0}
            max={trackDuration}
            step={0.1}
            value={playbackPosition}
            onChange={(e) => playFromPosition(parseFloat(e.target.value))}
          />
          <span className={styles.trackDuration}>
            {convertTime(playbackPosition)} / {convertTime(trackDuration)}
          </span>
        </div>
      )}
    </>
  );
};

export default BGM;
