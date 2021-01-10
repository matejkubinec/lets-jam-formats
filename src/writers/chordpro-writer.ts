import { Song } from '..';
import {
  GridSection,
  Metadata,
  Section,
  SectionType,
  SongLine,
  SongSection,
} from '../types';

export class ChordProWriter {
  write(song: Song): string {
    const metadata = this.writeMetadata(song.metadata);
    const sections = this.writeSections(song.sections);

    return this.writeResult(metadata, sections);
  }

  private writeResult = (metadata: string, sections: string[]): string => {
    let result = '';

    if (metadata) {
      result += `${metadata}\n`;
    }

    if (sections.length) {
      result += '\n';
    }

    for (const section of sections) {
      result += `${section}\n\n`;
    }

    return result.trim() + '\n';
  };

  private writeMetadata = (metadata: Metadata) => {
    const lines: string[] = [];

    if (metadata.artist) {
      lines.push(`{artist: ${metadata.artist}}`);
    }

    if (metadata.title) {
      lines.push(`{title: ${metadata.title}}`);
    }

    if (metadata.capo) {
      lines.push(`{capo: ${metadata.capo}}`);
    }

    if (metadata.key) {
      lines.push(`{key: ${metadata.key}}`);
    }

    if (metadata.tempo) {
      lines.push(`{tempo: ${metadata.tempo}}`);
    }

    return lines.join('\n');
  };

  private writeSections = (sections: Section[]): string[] => {
    const result = [];

    for (const section of sections) {
      if (section.type === SectionType.verse) {
        result.push(this.writeVerse(section as SongSection));
      } else if (section.type === SectionType.chorus) {
        result.push(this.writeChorus(section as SongSection));
      } else if (section.type === SectionType.grid) {
        result.push(this.writeGrid(section as GridSection));
      }
    }

    return result;
  };

  private writeVerse = (section: SongSection) => {
    const lines = [];

    if (section.title) {
      lines.push(`{start_of_verse: ${section.title}}`);
    } else {
      lines.push(`{start_of_verse}`);
    }

    for (const line of section.lines) {
      lines.push(this.writeLine(line));
    }

    lines.push('{end_of_verse}');

    return lines.join('\n');
  };

  private writeChorus = (section: SongSection) => {
    const lines = [];

    if (section.title) {
      lines.push(`{start_of_chorus: ${section.title}}`);
    } else {
      lines.push(`{start_of_chorus}`);
    }

    for (const line of section.lines) {
      lines.push(this.writeLine(line));
    }

    lines.push('{end_of_chorus}');

    return lines.join('\n');
  };

  private writeLine = (line: SongLine): string => {
    let content = line.content;

    for (const { chord, offset, pos } of line.chords) {
      const end = pos + offset;
      const start = pos + offset + chord.length - 1;
      content = content.slice(0, end) + `[${chord}]` + content.slice(start);
    }

    return content;
  };

  private writeGrid = (section: GridSection) => {
    const lines = [];

    if (section.title) {
      lines.push(`{start_of_grid: ${section.title}}`);
    } else {
      lines.push(`{start_of_grid}`);
    }

    for (const row of section.grid) {
      lines.push(this.writeGridRow(row));
    }

    lines.push('{end_of_grid}');

    return lines.join('\n');
  };

  private writeGridRow = (row: string[][]): string => {
    let result = '| ';

    for (const col of row) {
      result += this.writeGridCol(col) + ' | ';
    }

    return row.length ? result.trim() : result + ' |';
  };

  private writeGridCol = (col: string[]): string => {
    return col.join(' ');
  };
}
