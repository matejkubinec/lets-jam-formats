import { Song } from '..';
import {
  GridSection,
  Metadata,
  Section,
  SectionType,
  SongLine,
  SongSection,
} from '../types';

export class LetsJamWriter {
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
      result += `${section}\n`;
    }

    return result.trim() + '\n';
  };

  private writeMetadata = (metadata: Metadata): string => {
    const lines: string[] = [];

    if (metadata.artist) {
      lines.push(`Artist ${metadata.artist}`);
    }

    if (metadata.title) {
      lines.push(`Title ${metadata.title}`);
    }

    if (metadata.capo) {
      lines.push(`Capo ${metadata.capo}`);
    }

    if (metadata.key) {
      lines.push(`Key ${metadata.key}`);
    }

    if (metadata.tempo) {
      lines.push(`Tempo ${metadata.tempo}`);
    }

    if (lines.length === 0) {
      return '';
    }

    return lines.join('\n');
  };

  private writeSections = (sections: Section[]): string[] => {
    let result = [];

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

  private writeVerse = (section: SongSection): string => {
    let result = '';

    if (section.title) {
      result += `V: ${section.title}\n`;
    } else {
      result += `V:\n`;
    }

    for (const line of section.lines) {
      result += this.writeLine(line);
    }

    return result;
  };

  private writeChorus = (section: SongSection): string => {
    let result = '';

    if (section.title) {
      result += `C: ${section.title}\n`;
    } else {
      result += `C:\n`;
    }

    for (const line of section.lines) {
      result += this.writeLine(line);
    }

    return result;
  };

  private writeLine = (line: SongLine): string => {
    if (line.chords.length === 0) {
      return line.content + '\n';
    }

    let chordLine = '';

    for (const { chord, offset, pos } of line.chords) {
      for (let i = 0; i < pos - offset; i++) {
        chordLine += ' ';
      }

      chordLine += chord;
    }

    return `${chordLine}\n${line.content}\n`;
  };

  private writeGrid = (section: GridSection): string => {
    const lines = [];

    if (section.title) {
      lines.push(`G: ${section.title}`);
    } else {
      lines.push(`G: `);
    }

    for (const row of section.grid) {
      lines.push(this.writeGridRow(row));
    }

    return lines.join('\n') + '\n';
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
