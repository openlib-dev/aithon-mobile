import { Recording } from "@/interface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import { LocationObject } from "expo-location";
import { Audio } from "expo-av";
import { atom } from "jotai";

const sound = new Audio.Sound();
sound.loadAsync({
  uri: "https://raw.githubusercontent.com/rafaelreis-hotmart/Audio-Sample-files/master/sample.mp3",
});

export const recordAtom = atom<Recording[]>([
  {
    sound: sound,
    duration: "",
    file: "",
    me: false,
  },
] as Recording[]);

export const locationAtom = atom<LocationObject>({} as LocationObject);

interface Content {
  [key: string]: string | null;
}
const content: Content = {
  device_id: null,
};

const storage = createJSONStorage<Content>(() => AsyncStorage);

export const storedAtom = atomWithStorage<Content>(
  "stored-key",
  content,
  storage
);
