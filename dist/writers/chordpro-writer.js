"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChordProWriter = void 0;
const types_1 = require("../types");
class ChordProWriter {
    constructor() {
        this.writeResult = (metadata, sections) => {
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
        this.writeMetadata = (metadata) => {
            const lines = [];
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
        this.writeSections = (sections) => {
            const result = [];
            for (const section of sections) {
                if (section.type === types_1.SectionType.verse) {
                    result.push(this.writeVerse(section));
                }
                else if (section.type === types_1.SectionType.chorus) {
                    result.push(this.writeChorus(section));
                }
                else if (section.type === types_1.SectionType.grid) {
                    result.push(this.writeGrid(section));
                }
            }
            return result;
        };
        this.writeVerse = (section) => {
            const lines = [];
            if (section.title) {
                lines.push(`{start_of_verse: ${section.title}}`);
            }
            else {
                lines.push(`{start_of_verse}`);
            }
            for (const line of section.lines) {
                lines.push(this.writeLine(line));
            }
            lines.push('{end_of_verse}');
            return lines.join('\n');
        };
        this.writeChorus = (section) => {
            const lines = [];
            if (section.title) {
                lines.push(`{start_of_chorus: ${section.title}}`);
            }
            else {
                lines.push(`{start_of_chorus}`);
            }
            for (const line of section.lines) {
                lines.push(this.writeLine(line));
            }
            lines.push('{end_of_chorus}');
            return lines.join('\n');
        };
        this.writeLine = (line) => {
            let content = line.content;
            for (const { chord, offset, pos } of line.chords) {
                const end = pos + offset;
                const start = pos + offset + chord.length - 1;
                content = content.slice(0, end) + `[${chord}]` + content.slice(start);
            }
            return content;
        };
        this.writeGrid = (section) => {
            const lines = [];
            if (section.title) {
                lines.push(`{start_of_grid: ${section.title}}`);
            }
            else {
                lines.push(`{start_of_grid}`);
            }
            for (const row of section.grid) {
                lines.push(this.writeGridRow(row));
            }
            lines.push('{end_of_grid}');
            return lines.join('\n');
        };
        this.writeGridRow = (row) => {
            let result = '| ';
            for (const col of row) {
                result += this.writeGridCol(col) + ' | ';
            }
            return row.length ? result.trim() : result + ' |';
        };
        this.writeGridCol = (col) => {
            return col.join(' ');
        };
    }
    write(song) {
        const metadata = this.writeMetadata(song.metadata);
        const sections = this.writeSections(song.sections);
        return this.writeResult(metadata, sections);
    }
}
exports.ChordProWriter = ChordProWriter;
