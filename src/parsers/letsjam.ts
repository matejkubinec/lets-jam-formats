import {
  Chord,
  Metadata,
  Song,
  SongLine,
  SectionType,
  SongSection,
} from '../types';
import { chordRegex, lineEndingRegex } from '../constants';

const chordReplacer = (chords: Chord[]) => (
  _: any,
  chord: string,
  pos: number
): string => {
  const offset = chords.reduce((res, { chord }) => res + chord.length + 2, 0);
  const offsetPos = pos - offset;
  chords.push({ pos: offsetPos, offset, chord });
  return '';
};

const parseLine = (line: string): SongLine => {
  const chords = new Array<Chord>();
  const content = line.replace(chordRegex, chordReplacer(chords));
  return { content, chords };
};

const parseSection = (section: string): SongSection => {
  const [title, ...lines] = section.trim().split(lineEndingRegex);
  // TODO: differentiate between chorus and verse
  return {
    title,
    lines: lines.map(parseLine),
    type: SectionType.verse,
  };
};

const parseSections = (sections: string[]): SongSection[] => {
  return sections.map(parseSection);
};

const parseMetadata = (titleSection: string): Metadata => {
  const [artist, title] = titleSection.split('-');
  return {
    artist,
    title,
    capo: '',
    key: '',
    tempo: '',
  };
};

const divideIntoSections = (content: string): string[] => {
  return content.split('#').filter(Boolean);
};

export const parseLetsJam = (content: string): Song => {
  const [titleSection, ...dividedSections] = divideIntoSections(content);
  const metadata = parseMetadata(titleSection);
  const sections = parseSections(dividedSections);
  return { metadata, sections };
};
