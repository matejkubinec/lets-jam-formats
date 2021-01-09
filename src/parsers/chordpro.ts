import { chordReplacer, isEmpty } from '../utils';
import {
  Chord,
  GridSection,
  Metadata,
  Song,
  SongLine,
  SectionType,
  SongSection,
  Section,
} from '../types';
import { ChordRegex, LineEndingRegex } from '../constants';

export class ChordProParser {
  parse = (content: string): Song => {
    const [metadataStr, ...strSections] = this.getStringSections(content);
    const metadata = this.parseMetadata(metadataStr);
    const sections = strSections.map(this.parseSection);
    return { metadata, sections };
  };

  private getStringSections = (content: string): string[][] => {
    const sections = new Array<string[]>();
    let current = new Array<string>();

    for (const line of content.split(LineEndingRegex)) {
      if (this.isStartDirective(line)) {
        sections.push(current);
        current = new Array<string>();
      }

      if (line.trim()) {
        current.push(line.trim());
      }
    }
    sections.push(current);

    return sections;
  };

  private parseSection = (sectionStr: string[]): Section => {
    const section: Section = {
      title: '',
      type: SectionType.unknown,
    };

    for (const line of sectionStr) {
      if (this.isVerseStartDirective(line)) {
        return this.parseVerse(sectionStr);
      }

      if (this.isChorusStartDirective(line)) {
        return this.parseChorus(sectionStr);
      }

      if (this.isGridStartDirective(line)) {
        return this.parseGrid(sectionStr);
      }
    }

    return section;
  };

  private parseVerse = (content: string[]): SongSection => {
    const title = this.getValueFromDirective(content[0]) || 'Verse';
    const lines = content.slice(1, content.length - 1).map(this.parseLine);
    return { title, lines, type: SectionType.verse };
  };

  private parseChorus = (content: string[]): SongSection => {
    const title = this.getValueFromDirective(content[0]) || 'Chorus';
    const lines = content.slice(1, content.length - 1).map(this.parseLine);
    return { title, lines, type: SectionType.chorus };
  };

  private parseGrid = (sectionContent: string[]): GridSection => {
    const [titleDirective, ...lines] = sectionContent;
    const title = this.getValueFromDirective(titleDirective);

    const filter = (line: string) =>
      line &&
      !this.isGridStartDirective(line) &&
      !this.isGridEndDirective(line);

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

  private parseMetadata = (metadataStr: string[]): Metadata => {
    const metadata: Metadata = {
      artist: '',
      title: '',
      capo: '',
      key: '',
      tempo: '',
    };

    for (const line of metadataStr) {
      if (line.includes('artist')) {
        metadata.artist = this.getValueFromDirective(line);
      }

      if (line.includes('title')) {
        metadata.title = this.getValueFromDirective(line);
      }

      if (line.includes('capo')) {
        metadata.title = this.getValueFromDirective(line);
      }

      if (line.includes('key')) {
        metadata.title = this.getValueFromDirective(line);
      }

      if (line.includes('tempo')) {
        metadata.title = this.getValueFromDirective(line);
      }
    }

    return metadata;
  };

  private getValueFromDirective = (directive: string) => {
    const parts = directive.slice(1, directive.length - 1).split(':');
    return parts.length > 1 ? parts[1] : '';
  };

  private parseLine = (line: string): SongLine => {
    if (!line) {
      return { content: '', chords: [] };
    }

    const chords = new Array<Chord>();
    const content = line.replace(ChordRegex, chordReplacer(chords));
    return { content, chords };
  };

  private isStartDirective = (line: string) =>
    this.isVerseStartDirective(line) ||
    this.isChorusStartDirective(line) ||
    this.isGridStartDirective(line);

  private isVerseStartDirective = (line: string) =>
    line.includes('start_of_verse') || line.includes('sov');

  private isChorusStartDirective = (line: string) =>
    line.includes('start_of_chorus') || line.includes('soc');

  private isGridStartDirective = (line: string) =>
    line.includes('start_of_grid') || line.includes('sog');

  private isEndDirective = (line: string) =>
    this.isVerseEndDirective(line) ||
    this.isChorusEndDirective(line) ||
    this.isGridEndDirective(line);

  private isVerseEndDirective = (line: string) =>
    line.includes('end_of_verse') || line.includes('eov');

  private isChorusEndDirective = (line: string) =>
    line.includes('end_of_chorus') || line.includes('eoc');

  private isGridEndDirective = (line: string) =>
    line.includes('end_of_grid') || line.includes('eog');
}
