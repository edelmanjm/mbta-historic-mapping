export enum MbtaLine {
  Green = 0,
  Orange,
  Blue,
  Red,
  Other
}

export type MbtaLineInfo = {
  name: string;
  color: string;
};

export const MbtaLineInfoMap: Record<MbtaLine, MbtaLineInfo> = {
  [MbtaLine.Green]: {name: "Green", color: "#00884B"},
  [MbtaLine.Orange]: {name: "Orange", color: "#F6921E"},
  [MbtaLine.Blue]: {name: "Blue", color: "#0071BA"},
  [MbtaLine.Red]: {name: "Red", color: "#EC1C24"},
  [MbtaLine.Other]: {name: "Other", color: "#000000"}
}

export function stringToLine(name: string): MbtaLine {
  if (name?.includes("Green Line")) {
    return MbtaLine.Green;
  } else if (name?.includes("Orange Line")) {
    return MbtaLine.Orange;
  } else if (name?.includes("Blue Line")) {
    return MbtaLine.Blue;
  } else if (name?.includes("Red Line") || name?.includes("Ashmont–Mattapan") || name?.includes("Mattapan Trolley")) {
    return MbtaLine.Red;
  } else {
    return MbtaLine.Other;
  }
}