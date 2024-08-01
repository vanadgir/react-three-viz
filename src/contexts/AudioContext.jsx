import React, { createContext, useContext, useCallback, useMemo } from "react";
import { AudioLoader, AudioListener, Audio } from "three";
import { useLoader } from "@react-three/fiber";

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const maxRollSFXBuffer = useLoader(AudioLoader, `../../assets/wahoo.wav`);
  const minRollSFXBuffer = useLoader(AudioLoader, `../../assets/nooo.wav`);
  const neutralRollSFXBuffer = useLoader(AudioLoader, `../../assets/neutral.mp3`);

  // this allows the dice to create their own listener for roll results
  const createRollResultSFX = useCallback(() => {
    const listener = new AudioListener();
    
    const allRollResultSFX = useMemo(() => ({
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
      })()
    }), [maxRollSFXBuffer, minRollSFXBuffer, neutralRollSFXBuffer]);

    return (roll) => {
      const selectedAudio = allRollResultSFX[roll] || allRollResultSFX.neutral;
      if (selectedAudio.isPlaying) {
        selectedAudio.stop();
      }
      selectedAudio.play();
    };
  }, [maxRollSFXBuffer, minRollSFXBuffer, neutralRollSFXBuffer]);

  return (
    <AudioContext.Provider value={{ createRollResultSFX }}>
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