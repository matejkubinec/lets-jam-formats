"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LetsJamParser = void 0;
const types_1 = require("../types");
const constants_1 = require("../constants");
class LetsJamParser {
    constructor() {
        this.parse = (content) => {
            const [metadataSec, ...stringSections] = this.divideIntoSections(content);
            const metadata = this.parseMetadata(metadataSec);
            const sections = stringSections.map(this.parseSection);
            return { metadata, sections };
        };
        this.parseMetadata = (lines) => {
            const parsePart = (part) => {
                var _a;
                return ((_a = lines
                    .find(l => l.startsWith(part))) === null || _a === void 0 ? void 0 : _a.split(' ').slice(1).join(' ')) || '';
            };
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
        this.parseSection = (lines) => {
            for (const line of lines) {
                if (this.isVerseStartDirective(line) ||
                    this.isChorusStartDirective(line)) {
                    return this.parseVerseChorusSection(lines);
                }
                if (this.isGridStartDirective(line)) {
                    return this.parseGridSection(lines);
                }
            }
        };
        this.parseGridSection = (lines) => {
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
                type: types_1.SectionType.grid,
            };
        };
        this.parseVerseChorusSection = (lines) => {
            const [titleStr, ...content] = lines;
            const title = this.getSectionTitle(titleStr);
            const section = {
                lines: [],
                title: title,
                type: this.isVerseStartDirective(titleStr)
                    ? types_1.SectionType.verse
                    : types_1.SectionType.chorus,
            };
            let chords = [];
            for (let i = 0; i < content.length; i++) {
                if (i % 2 === 0) {
                    chords = this.parseChordLine(content[i]);
                }
                else {
                    if (chords) {
                        section.lines.push({
                            blocks: this.parseTextLine(content[i], chords),
                        });
                    }
                    else {
                        section.lines.push({
                            blocks: [{ content: content[i], type: types_1.BlockType.text }],
                        });
                    }
                    chords = [];
                }
            }
            return section;
        };
        this.parseTextLine = (line, chords) => {
            let content = line;
            const blocks = new Array();
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
                    blocks.push({ content: after, type: types_1.BlockType.text });
                }
                blocks.push({ content: chord, type: types_1.BlockType.chord });
                content = before;
            }
            if (content) {
                blocks.push({ content, type: types_1.BlockType.text });
            }
            blocks.reverse();
            return blocks;
        };
        this.parseChordLine = (line) => {
            const chords = new Array();
            line.replace(/\[(.*?)\]/g, (_, chord, pos) => {
                const offset = chords.length * 2;
                chords.push({ chord, pos: pos - offset });
                return '';
            });
            return chords;
        };
        this.getSectionTitle = (titleStr) => {
            return titleStr.slice(2).trim();
        };
        this.divideIntoSections = (content) => {
            const lines = content.split(constants_1.LineEndingRegex);
            const sections = new Array();
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
        this.parseCell = (cell) => {
            const blocks = new Array();
            let currentType = types_1.BlockType.text;
            let currentContent = '';
            for (let i = 0; i < cell.length; i++) {
                // start of a chord
                if (cell[i] === '[') {
                    if (i !== 0) {
                        blocks.push({ type: currentType, content: currentContent });
                    }
                    currentType = types_1.BlockType.chord;
                    currentContent = '';
                    continue;
                }
                // end of a chord
                if (cell[i] === ']') {
                    blocks.push({ type: currentType, content: currentContent });
                    currentType = types_1.BlockType.text;
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
        this.isStartDirective = (line) => this.isVerseStartDirective(line) ||
            this.isChorusStartDirective(line) ||
            this.isGridStartDirective(line);
        this.isVerseStartDirective = (line) => line.startsWith('V:');
        this.isChorusStartDirective = (line) => line.startsWith('C:');
        this.isGridStartDirective = (line) => line.startsWith('G:');
    }
}
exports.LetsJamParser = LetsJamParser;
