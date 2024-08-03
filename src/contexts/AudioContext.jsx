import React, { createContext, useContext, useCallback, useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { AudioLoader, AudioListener, Audio } from "three";

const AudioContext = createContext({
  children: [],
  playContactSFX: (impactVelocity) => undefined,
  playRollResultSFX: (roll) => undefined,
});
const CONTACT_FACTOR = 20;
const CONTACT_THRESHOLD = 0.0075;
const CONTACT_DETUNE_RANGE = 300;

export const AudioProvider = ({ children }) => {
  const maxRollSFXBuffer = useLoader(AudioLoader, `../../assets/audio/wahoo.wav`);
  const minRollSFXBuffer = useLoader(AudioLoader, `../../assets/audio/nooo.wav`);
  const neutralRollSFXBuffer = useLoader(
    AudioLoader,
    `../../assets/audio/neutral.mp3`
  );
  const contactSFXBuffer = useLoader(AudioLoader, "../../assets/audio/dice.wav");

  const listener = useMemo(() => new AudioListener(), []);

  const allRollResultSFX = useMemo(
    () => ({
      max: (() => {
        const audio = new Audio(listener);
        audio.setBuffer(maxRollSFXBuffer);
        audio.setLoop(false);
        audio.setVolume(0.6);
        return audio;
      })(),
      min: (() => {
        const audio = new Audio(listener);
        audio.setBuffer(minRollSFXBuffer);
        audio.setLoop(false);
        audio.setVolume(0.6);
        return audio;
      })(),
      neutral: (() => {
        const audio = new Audio(listener);
        audio.setBuffer(neutralRollSFXBuffer);
        audio.setLoop(false);
        audio.setVolume(0.2);
        return audio;
      })(),
    }),
    [listener, maxRollSFXBuffer, minRollSFXBuffer, neutralRollSFXBuffer]
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
        const audio = new Audio(listener);
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
    [contactSFXBuffer, listener]
  );

  return (
    <AudioContext.Provider value={{ playContactSFX, playRollResultSFX }}>
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
