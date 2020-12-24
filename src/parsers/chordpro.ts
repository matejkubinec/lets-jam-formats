import { chordReplacer, isEmpty } from '../utils';
import {
  Chord,
  GridSection,
  Metadata,
  Song,
  SongLine,
  SectionType,
  SongSection,
} from '../types';
import { chordRegex, lineEndingRegex } from '../constants';

interface Directive {
  start: string;
  end: string;
}

const DIRECTIVES = {
  verse: {
    start: '{start_of_verse',
    end: '{end_of_verse}',
  },
  chorus: {
    start: '{start_of_chorus',
    end: '{end_of_chorus}',
  },
  grid: {
    start: '{start_of_grid',
    end: '{end_of_grid}',
  },
};

const parseLine = (line: string): SongLine => {
  const chords = new Array<Chord>();
  const content = line.replace(chordRegex, chordReplacer(chords));
  return { content, chords };
};

const parseTitle = (line: string, directive: Directive) =>
  line.includes(':')
    ? line.slice(directive.start.length + 1, line.length - 1)
    : '';

const parseGrid = (sectionContent: string): GridSection => {
  const [start, ...lines] = sectionContent.split(lineEndingRegex);
  const title = parseTitle(start, DIRECTIVES.grid);

  const filter = (line: string) =>
    !line.startsWith(DIRECTIVES.grid.start) &&
    !line.startsWith(DIRECTIVES.grid.end) &&
    isEmpty(line);

  const mapCell = (cell: string) =>
    cell.replace(/\[|\]/g, '').trim().split(' ').filter(isEmpty);

  const map = (line: string) => line.split('|').map(mapCell).filter(isEmpty);

  const grid = lines.filter(filter).map(map).filter(isEmpty);

  return {
    title,
    grid,
    type: SectionType.grid,
  };
};

const parseVerse = (sectionContent: string): SongSection => {
  const [start, ...lines] = sectionContent.split(lineEndingRegex);
  const title = parseTitle(start, DIRECTIVES.verse);

  const filter = (line: string) =>
    !line.startsWith(DIRECTIVES.verse.start) &&
    !line.startsWith(DIRECTIVES.verse.end) &&
    isEmpty(line);

  const parsedLines = lines.filter(filter).map(parseLine);

  return {
    title: title,
    type: SectionType.verse,
    lines: parsedLines,
  };
};

const parseChorus = (sectionContent: string): SongSection => {
  const [start, ...lines] = sectionContent.split(lineEndingRegex);
  const title = parseTitle(start, DIRECTIVES.chorus);

  const filter = (line: string) =>
    !line.startsWith(DIRECTIVES.chorus.start) &&
    !line.startsWith(DIRECTIVES.chorus.end) &&
    isEmpty(line);

  const parsedLines = lines.filter(filter).map(parseLine);

  return {
    title: title,
    type: SectionType.chorus,
    lines: parsedLines,
  };
};

const parseMetadataTag = (lines: string[], tag: string) => {
  const tagLine = (lines || []).find(line => line.includes(tag));
  return tagLine ? tagLine.slice(tag.length + 2, tagLine.length - 1) : '';
};

const parseMetadata = (content: string): Metadata => {
  const lines = content ? content.split(lineEndingRegex) : [];
  return {
    artist: parseMetadataTag(lines, 'artist'),
    title: parseMetadataTag(lines, 'title'),
    key: parseMetadataTag(lines, 'key'),
    capo: parseMetadataTag(lines, 'capo'),
    tempo: parseMetadataTag(lines, 'tempo'),
  };
};

const parseSections = (sections: string[]) =>
  sections.filter(isEmpty).map(section => {
    if (section.startsWith(DIRECTIVES.verse.start)) {
      return parseVerse(section);
    }

    if (section.startsWith(DIRECTIVES.chorus.start)) {
      return parseChorus(section);
    }

    if (section.startsWith(DIRECTIVES.grid.start)) {
      return parseGrid(section);
    }

    return { title: '', type: SectionType.unknown };
  });

const divideIntoSections = (content: string): string[] => {
  let current = [];
  const sections = [];
  content.split(lineEndingRegex).forEach(line => {
    if (
      line.startsWith(DIRECTIVES.verse.start) ||
      line.startsWith(DIRECTIVES.chorus.start) ||
      line.startsWith(DIRECTIVES.grid.start)
    ) {
      sections.push(current.join('\n').trim());
      current = [line];
    } else {
      current.push(line);
    }
  });
  return sections;
};

export const parseChordPro = (content: string): Song => {
  const [metadataSection, ...sections] = divideIntoSections(content);
  return {
    metadata: parseMetadata(metadataSection),
    sections: parseSections(sections),
  };
};
