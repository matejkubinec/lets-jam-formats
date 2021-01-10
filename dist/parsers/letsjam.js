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
                    const chords = col
                        .split(' ')
                        .map(l => l.trim())
                        .filter(l => l);
                    row.push(chords);
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
                    section.lines.push({
                        chords: chords,
                        content: content[i],
                    });
                }
            }
            return section;
        };
        this.parseChordLine = (line) => {
            const chords = [];
            line.replace(/\w+/g, (chord, pos) => {
                const offset = chords.reduce((prev, curr) => prev + curr.chord.length, 0);
                chords.push({
                    chord: chord,
                    offset: offset,
                    pos: pos - offset,
                });
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
        this.isStartDirective = (line) => this.isVerseStartDirective(line) ||
            this.isChorusStartDirective(line) ||
            this.isGridStartDirective(line);
        this.isVerseStartDirective = (line) => line.startsWith('V:');
        this.isChorusStartDirective = (line) => line.startsWith('C:');
        this.isGridStartDirective = (line) => line.startsWith('G:');
    }
}
exports.LetsJamParser = LetsJamParser;
