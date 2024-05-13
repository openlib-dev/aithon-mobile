import { useEffect, useState } from "react";
import { Audio } from "expo-av";

interface AudioPlayer {
  isPlaying: boolean;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  stop: () => Promise<void>;
}

const useAudioPlayer = (): AudioPlayer => {
  const [sound, setSound] = useState<Audio.Sound | undefined>();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    const loadAudio = async (): Promise<void> => {
      const { sound } = await Audio.Sound.createAsync(
        { uri: "http://example.com/audio.mp3" }, // Put your audio file URL here
        { shouldPlay: false }
      );
      setSound(sound);
    };

    loadAudio();

    return (): void => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const play = async (): Promise<void> => {
    if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const pause = async (): Promise<void> => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const stop = async (): Promise<void> => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };

  return {
    isPlaying,
    play,
    pause,
    stop,
  };
};

export default useAudioPlayer;
