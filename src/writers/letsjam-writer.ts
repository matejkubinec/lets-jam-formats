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

export class LetsJamWriter implements IFormatWriter {
  write(song: Song): string {
    const metadata = this.writeMetadata(song.metadata);
    const sections = this.writeSections(song.sections);

    return this.writeResult(metadata, sections);
  }

  writeMetadata = (metadata: Metadata): string => {
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

  writeSections = (sections: Section[]): string => {
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

    return result.join('\n');
  };

  private writeResult = (metadata: string, sections: string): string => {
    let result = '';

    if (metadata) {
      result += `${metadata}\n`;
    }

    if (sections.length) {
      result += `\n${sections}`;
    }

    return result.trim() + '\n';
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
    let chordLine = '';
    let textLine = '';
    let chordCount = 0;

    for (const block of line.blocks) {
      if (block.type === BlockType.chord) {
        while (chordLine.length < textLine.length + chordCount * 2) {
          chordLine += ' ';
        }

        chordCount++;
        chordLine += `[${block.content}]`;
      } else if (block.type === BlockType.text) {
        textLine += block.content;
      }
    }

    if (chordLine) {
      return `${chordLine}\n${textLine}\n`;
    } else {
      return `${textLine}\n`;
    }
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
