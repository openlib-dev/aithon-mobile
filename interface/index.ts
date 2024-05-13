import { Audio } from "expo-av";

export interface Recording {
  sound: Audio.Sound;
  duration: string;
  file: string | null;
}
