import {
  Block,
  BlockType,
  Metadata,
  Song,
  SectionType,
  SongSection,
  GridSection,
} from '../types';
import { LineEndingRegex } from '../constants';

type Chord = {
  pos: number;
  chord: string;
};

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
        row.push(this.parseCell(col));
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
        if (chords) {
          section.lines.push({
            blocks: this.parseTextLine(content[i], chords),
          });
        } else {
          section.lines.push({
            blocks: [{ content: content[i], type: BlockType.text }],
          });
        }
        chords = [];
      }
    }

    return section;
  };

  private parseTextLine = (line: string, chords: Chord[]): Block[] => {
    let content = line;
    const blocks = new Array<Block>();

    if (chords.length) {
      const { pos } = chords[chords.length - 1];

      while (pos > content.length) {
        content += ' ';
      }
    }

    for (let i = chords.length - 1; i >= 0; i--) {
      const { chord, pos } = chords[i];

      const after = content.slice(pos);
      const before = content.slice(0, pos);

      if (after) {
        blocks.push({ content: after, type: BlockType.text });
      }

      blocks.push({ content: chord, type: BlockType.chord });

      content = before;
    }

    if (content) {
      blocks.push({ content, type: BlockType.text });
    }

    blocks.reverse();

    return blocks;
  };

  private parseChordLine = (line: string): Chord[] => {
    const chords = new Array<Chord>();
    line.replace(/\[(.*?)\]/g, (_, chord: string, pos: number) => {
      const offset = chords.length * 2;
      chords.push({ chord, pos: pos - offset });
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

  private parseCell = (cell: string): Block[] => {
    const blocks = new Array<Block>();
    let currentType: BlockType = BlockType.text;
    let currentContent = '';

    for (let i = 0; i < cell.length; i++) {
      // start of a chord
      if (cell[i] === '[') {
        if (i !== 0) {
          blocks.push({ type: currentType, content: currentContent });
        }
        currentType = BlockType.chord;
        currentContent = '';
        continue;
      }

      // end of a chord
      if (cell[i] === ']') {
        blocks.push({ type: currentType, content: currentContent });
        currentType = BlockType.text;
        currentContent = '';
        continue;
      }

      currentContent += cell[i];
    }

    if (currentContent) {
      blocks.push({ type: currentType, content: currentContent });
    }

    return blocks;
  };

  private isStartDirective = (line: string) =>
    this.isVerseStartDirective(line) ||
    this.isChorusStartDirective(line) ||
    this.isGridStartDirective(line);

  private isVerseStartDirective = (line: string) => line.startsWith('V:');

  private isChorusStartDirective = (line: string) => line.startsWith('C:');

  private isGridStartDirective = (line: string) => line.startsWith('G:');
}
