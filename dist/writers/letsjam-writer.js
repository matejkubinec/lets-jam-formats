"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LetsJamWriter = void 0;
const types_1 = require("../types");
class LetsJamWriter {
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
                result += `${section}\n`;
            }
            return result.trim() + '\n';
        };
        this.writeMetadata = (metadata) => {
            const lines = [];
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
        this.writeSections = (sections) => {
            let result = [];
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
            let result = '';
            if (section.title) {
                result += `V: ${section.title}\n`;
            }
            else {
                result += `V:\n`;
            }
            for (const line of section.lines) {
                result += this.writeLine(line);
            }
            return result;
        };
        this.writeChorus = (section) => {
            let result = '';
            if (section.title) {
                result += `C: ${section.title}\n`;
            }
            else {
                result += `C:\n`;
            }
            for (const line of section.lines) {
                result += this.writeLine(line);
            }
            return result;
        };
        this.writeLine = (line) => {
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
        this.writeGrid = (section) => {
            const lines = [];
            if (section.title) {
                lines.push(`G: ${section.title}`);
            }
            else {
                lines.push(`G: `);
            }
            for (const row of section.grid) {
                lines.push(this.writeGridRow(row));
            }
            return lines.join('\n') + '\n';
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
exports.LetsJamWriter = LetsJamWriter;
