import {
  Chord,
  Metadata,
  Song,
  SectionType,
  SongSection,
  GridSection,
} from '../types';
import { LineEndingRegex } from '../constants';

export class LetsJamParser {
  parse = (content: string): Song => {
    const [metadataSec, ...stringSections] = this.divideIntoSections(content);
    const metadata = this.parseMetadata(metadataSec);
    const sections = stringSections.map(this.parseSection);
    return { metadata, sections };
  };

  private parseMetadata = (lines: string[]): Metadata => {
    const parsePart = (part: string) =>
      lines
        .find(l => l.startsWith(part))
        ?.split(' ')
        .slice(1)
        .join(' ') || '';

    const artist = parsePart('Artist');
    const title = parsePart('Title');
    const capo = parsePart('Capo');
    const key = parsePart('Key');
    const tempo = parsePart('Tempo');

    return {
      title,
      artist,
      capo,
      key,
      tempo,
    };
  };

  private parseSection = (lines: string[]) => {
    for (const line of lines) {
      if (
        this.isVerseStartDirective(line) ||
        this.isChorusStartDirective(line)
      ) {
        return this.parseVerseChorusSection(lines);
      }

      if (this.isGridStartDirective(line)) {
        return this.parseGridSection(lines);
      }
    }
  };

  private parseGridSection = (lines: string[]): GridSection => {
    const [titleStr, ...content] = lines;
    const title = this.getSectionTitle(titleStr);
    const grid = [];

    for (const line of content) {
      const row = [];
      const cols = line
        .split('|')
        .map(l => l.trim())
        .filter(l => l);

      for (const col of cols) {
        const chords = col
          .split(' ')
          .map(l => l.trim())
          .filter(l => l);

        row.push(chords);
      }
      grid.push(row);
    }

    return {
      title: title,
      grid: grid,
      type: SectionType.grid,
    };
  };

  private parseVerseChorusSection = (lines: string[]): SongSection => {
    const [titleStr, ...content] = lines;
    const title = this.getSectionTitle(titleStr);
    const section: SongSection = {
      lines: [],
      title: title,
      type: this.isVerseStartDirective(titleStr)
        ? SectionType.verse
        : SectionType.chorus,
    };
    let chords: Chord[] = [];

    for (let i = 0; i < content.length; i++) {
      if (i % 2 === 0) {
        chords = this.parseChordLine(content[i]);
      } else {
        section.lines.push({
          chords: chords,
          content: content[i],
        });
      }
    }

    return section;
  };

  private parseChordLine = (line: string): Chord[] => {
    const chords: Chord[] = [];
    line.replace(/\w+/g, (chord: string, pos: number) => {
      const offset = chords.reduce((prev, curr) => prev + curr.chord.length, 0);
      chords.push({
        chord: chord,
        offset: offset,
        pos: pos - offset,
      });
      return '';
    });
    return chords;
  };

  private getSectionTitle = (titleStr: string) => {
    return titleStr.slice(2).trim();
  };

  private divideIntoSections = (content: string): string[][] => {
    const lines = content.split(LineEndingRegex);
    const sections = new Array<string[]>();
    let currentSection = [];

    for (const line of lines) {
      if (this.isStartDirective(line)) {
        sections.push(currentSection);
        currentSection = [];
      }

      if (line) {
        currentSection.push(line);
      }
    }
    sections.push(currentSection);

    return sections;
  };

  private isStartDirective = (line: string) =>
    this.isVerseStartDirective(line) ||
    this.isChorusStartDirective(line) ||
    this.isGridStartDirective(line);

  private isVerseStartDirective = (line: string) => line.startsWith('V:');

  private isChorusStartDirective = (line: string) => line.startsWith('C:');

  private isGridStartDirective = (line: string) => line.startsWith('G:');
}
