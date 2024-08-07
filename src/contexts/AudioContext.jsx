import React, {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  useState,
} from "react";
import { useLoader } from "@react-three/fiber";
import { AudioLoader, AudioListener, Audio } from "three";

const AudioContext = createContext({
  children: [],
  playContactSFX: (impactVelocity) => undefined,
  playRollResultSFX: (roll) => undefined,
  togglePlayback: () => undefined,
  nextTrack: () => undefined,
});

const CONTACT_FACTOR = 20;
const CONTACT_THRESHOLD = 0.0075;
const CONTACT_DETUNE_RANGE = 300;

export const AudioProvider = ({ children }) => {
  // BEGIN SFX LOGIC
  const maxRollSFXBuffer = useLoader(AudioLoader, `../../assets/audio/wahoo.wav`);
  const minRollSFXBuffer = useLoader(AudioLoader, `../../assets/audio/nooo.wav`);
  const neutralRollSFXBuffer = useLoader(AudioLoader, `../../assets/audio/neutral.mp3`);
  const contactSFXBuffer = useLoader(AudioLoader, "../../assets/audio/dice.wav");
  const sfxListener = useMemo(() => new AudioListener(), []);

  const allRollResultSFX = useMemo(
    () => ({
      max: (() => {
        const audio = new Audio(sfxListener);
        audio.setBuffer(maxRollSFXBuffer);
        audio.setLoop(false);
        audio.setVolume(0.6);
        return audio;
      })(),
      min: (() => {
        const audio = new Audio(sfxListener);
        audio.setBuffer(minRollSFXBuffer);
        audio.setLoop(false);
        audio.setVolume(0.6);
        return audio;
      })(),
      neutral: (() => {
        const audio = new Audio(sfxListener);
        audio.setBuffer(neutralRollSFXBuffer);
        audio.setLoop(false);
        audio.setVolume(0.2);
        return audio;
      })(),
    }),
    [sfxListener, maxRollSFXBuffer, minRollSFXBuffer, neutralRollSFXBuffer]
  );

  const playRollResultSFX = useCallback(
    (roll) => {
      const selectedAudio = allRollResultSFX[roll] || allRollResultSFX.neutral;
      selectedAudio.play();
    },
    [allRollResultSFX]
  );

  const playContactSFX = useCallback(
    (impactVelocity) => {
      const constrained = Math.min(
        Math.max(impactVelocity / CONTACT_FACTOR / 2, 0),
        1
      );
      if (constrained > CONTACT_THRESHOLD) {
        const audio = new Audio(sfxListener);
        audio.setBuffer(contactSFXBuffer);
        audio.setLoop(false);
        audio.setVolume(constrained);
        audio.setDetune(
          (audio.getDetune() -
            CONTACT_DETUNE_RANGE / 2 +
            Math.random() * CONTACT_DETUNE_RANGE) /
            constrained
        );
        audio.play();
      }
    },
    [contactSFXBuffer, sfxListener]
  );
  // END SFX LOGIC

  // BEGIN BGM LOGIC
  const bgmBuffersRef = useRef([]);
  const bgmAudioRef = useRef(new Audio(new AudioListener()));
  const [bgmLoaded, setBGMLoaded] = useState(false);
  const [bgmVolume, setBGMVolume] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(null);

  // this effect loads BGM tracks asynchronously
  // then stores them in a bgm tracklist ref
  useEffect(() => {
    const tracks = [
      "../../assets/audio/bgm1.mp3",
      "../../assets/audio/bgm2.mp3",
    ];
    const loader = new AudioLoader();

    Promise.all(tracks.map((path) => loader.loadAsync(path)))
      .then((buffers) => {
        bgmBuffersRef.current = buffers;
        setBGMLoaded(true);
        setCurrentTrack(0);
        bgmAudioRef.current.setBuffer(bgmBuffersRef.current[0]);
        bgmAudioRef.current.setVolume(0.5);
        bgmAudioRef.current.setLoop(true);
        bgmAudioRef.current.play();
        console.log("BGM loaded and playing");
      })
      .catch((err) => {
        console.error("There was an issue loading BGM tracks: ", err);
      });

    return () => {
      bgmAudioRef.current.stop();
      bgmAudioRef.current.disconnect();
    };
  }, []);

  const togglePlayback = useCallback(() => {
    if (!bgmLoaded) return;

    if (bgmAudioRef.current.isPlaying) {
      bgmAudioRef.current.pause();
    } else {
      bgmAudioRef.current.play();
    }
  }, [bgmLoaded]);

  const nextTrack = useCallback(() => {
    if (!bgmLoaded) return;

    const nextTrackIndex = (currentTrack + 1) % bgmBuffersRef.current.length;
    setCurrentTrack(nextTrackIndex);

    bgmAudioRef.current.stop();
    bgmAudioRef.current.setBuffer(bgmBuffersRef.current[nextTrackIndex]);
    bgmAudioRef.current.play();
  }, [currentTrack, bgmLoaded]);

  const changeVolume = useCallback((volume) => {
    if (!bgmLoaded) return;

    setBGMVolume(volume);
    bgmAudioRef.current.setVolume(volume);
  }, [bgmLoaded]);
  // END BGM LOGIC

  return (
    <AudioContext.Provider value={{ playContactSFX, playRollResultSFX, togglePlayback, nextTrack, changeVolume }}>
      {children}
    </AudioContext.Provider>
  );
};

export function useAudio() {
  if (!AudioContext) {
    throw new Error("AudioContext must be defined!");
  }
  return useContext(AudioContext);
}
