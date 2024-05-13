import { Audio } from "expo-av";

export function getDurationFormatted(milliseconds: number) {
  const minutes = milliseconds / 1000 / 60;
  const seconds = Math.round((minutes - Math.floor(minutes)) * 60);
  return seconds < 10
    ? `${Math.floor(minutes)}:0${seconds}`
    : `${Math.floor(minutes)}:${seconds}`;
}

export function getUploadForm(recording: Audio.Recording): FormData {
  const uri = recording.getURI();
  const fd = new FormData();
  if (!uri) {
    return fd;
  }
  const filetype = uri.split(".").pop();
  const filename = uri.split("/").pop();
  const file = {
    uri,
    type: `audio/${filetype}`,
    name: filename || "audio",
  } as unknown as Blob;

  fd.append("file", file);
  return fd;
}
