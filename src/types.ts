export enum SectionType {
  verse = 'verse',
  chorus = 'chorus',
  grid = 'grid',
  unknown = 'unknown',
}

export enum BlockType {
  text = 'text',
  chord = 'chord',
}

export interface Block {
  content: string;
  type: BlockType;
}

export interface SongLine {
  blocks: Block[];
}

export interface Section {
  title: string;
  type: SectionType;
}

export interface SongSection extends Section {
  lines: SongLine[];
}

export interface GridSection extends Section {
  grid: Block[][][];
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
