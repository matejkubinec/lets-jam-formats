export enum SectionType {
  verse = 'verse',
  chorus = 'chorus',
  grid = 'grid',
  unknown = 'unknown',
}

export interface Chord {
  pos: number;
  offset: number;
  chord: string;
}

export interface SongLine {
  content: string;
  chords: Chord[];
}

export interface Section {
  title: string;
  type: SectionType;
}

export interface SongSection extends Section {
  lines: SongLine[];
}

export interface GridSection extends Section {
  grid: string[][][];
}

export interface Metadata {
  artist: string;
  title: string;
  tempo: string;
  capo: string;
  key: string;
}

export interface Song {
  metadata: Metadata;
  sections: Section[];
}
