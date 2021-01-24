"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChordProWriter = void 0;
const types_1 = require("../types");
class ChordProWriter {
    constructor() {
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
            return result.join('\n\n');
        };
        this.writeResult = (metadata, sections) => {
            let result = '';
            if (metadata) {
                result += `${metadata}\n`;
            }
            if (sections.trim().length) {
                result += `\n${sections}`;
            }
            return result.trim() + '\n';
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
            let content = '';
            for (const block of line.blocks) {
                if (block.type === types_1.BlockType.chord) {
                    content += `[${block.content}]`;
                }
                else if (block.type === types_1.BlockType.text) {
                    content += block.content;
                }
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
                let text = '';
                for (const block of col) {
                    if (block.type === types_1.BlockType.chord) {
                        text += `[${block.content}]`;
                    }
                    else if (block.type === types_1.BlockType.text) {
                        text += block.content;
                    }
                }
                result += text + ' | ';
            }
            return row.length ? result.trim() : result + ' |';
        };
    }
    write(song) {
        const metadata = this.writeMetadata(song.metadata);
        const sections = this.writeSections(song.sections);
        return this.writeResult(metadata, sections);
    }
}
exports.ChordProWriter = ChordProWriter;
