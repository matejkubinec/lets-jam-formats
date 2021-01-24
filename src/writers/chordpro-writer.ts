import { Song } from '..';
import {
  Block,
  BlockType,
  GridSection,
  IFormatWriter,
  Metadata,
  Section,
  SectionType,
  SongLine,
  SongSection,
} from '../types';

export class ChordProWriter implements IFormatWriter {
  write(song: Song): string {
    const metadata = this.writeMetadata(song.metadata);
    const sections = this.writeSections(song.sections);

    return this.writeResult(metadata, sections);
  }

  writeMetadata = (metadata: Metadata) => {
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

  writeSections = (sections: Section[]): string => {
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

    return result.join('\n\n');
  };

  private writeResult = (metadata: string, sections: string): string => {
    let result = '';

    if (metadata) {
      result += `${metadata}\n`;
    }

    if (sections.trim().length) {
      result += `\n${sections}`;
    }

    return result.trim() + '\n';
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
    let content = '';

    for (const block of line.blocks) {
      if (block.type === BlockType.chord) {
        content += `[${block.content}]`;
      } else if (block.type === BlockType.text) {
        content += block.content;
      }
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

  private writeGridRow = (row: Block[][]): string => {
    let result = '| ';

    for (const col of row) {
      let text = '';

      for (const block of col) {
        if (block.type === BlockType.chord) {
          text += `[${block.content}]`;
        } else if (block.type === BlockType.text) {
          text += block.content;
        }
      }

      result += text + ' | ';
    }

    return row.length ? result.trim() : result + ' |';
  };
}
