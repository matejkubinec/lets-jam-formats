"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChordProParser = void 0;
const utils_1 = require("../utils");
const types_1 = require("../types");
const constants_1 = require("../constants");
class ChordProParser {
    constructor() {
        this.parse = (content) => {
            const [metadataStr, ...strSections] = this.getStringSections(content);
            const metadata = this.parseMetadata(metadataStr);
            const sections = strSections.map(this.parseSection);
            return { metadata, sections };
        };
        this.getStringSections = (content) => {
            const sections = new Array();
            let current = new Array();
            for (const line of content.split(constants_1.LineEndingRegex)) {
                if (this.isStartDirective(line)) {
                    sections.push(current);
                    current = new Array();
                }
                if (line.trim()) {
                    current.push(line.trim());
                }
            }
            sections.push(current);
            return sections;
        };
        this.parseSection = (sectionStr) => {
            const section = {
                title: '',
                type: types_1.SectionType.unknown,
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
        this.parseVerse = (content) => {
            const title = this.getValueFromDirective(content[0]) || 'Verse';
            const lines = content.slice(1, content.length - 1).map(this.parseLine);
            return { title, lines, type: types_1.SectionType.verse };
        };
        this.parseChorus = (content) => {
            const title = this.getValueFromDirective(content[0]) || 'Chorus';
            const lines = content.slice(1, content.length - 1).map(this.parseLine);
            return { title, lines, type: types_1.SectionType.chorus };
        };
        this.parseGrid = (sectionContent) => {
            const [titleDirective, ...lines] = sectionContent;
            const title = this.getValueFromDirective(titleDirective);
            const filter = (line) => line &&
                !this.isGridStartDirective(line) &&
                !this.isGridEndDirective(line);
            const mapCell = (cell) => cell.replace(/\[|\]/g, '').trim().split(' ').filter(utils_1.isEmpty);
            const map = (line) => line.split('|').map(mapCell).filter(utils_1.isEmpty);
            const grid = lines.filter(filter).map(map).filter(utils_1.isEmpty);
            return {
                title,
                grid,
                type: types_1.SectionType.grid,
            };
        };
        this.parseMetadata = (metadataStr) => {
            const metadata = {
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
        this.getValueFromDirective = (directive) => {
            const parts = directive.slice(1, directive.length - 1).split(':');
            return parts.length > 1 ? parts[1] : '';
        };
        this.parseLine = (line) => {
            if (!line) {
                return { content: '', chords: [] };
            }
            const chords = new Array();
            const content = line.replace(constants_1.ChordRegex, utils_1.chordReplacer(chords));
            return { content, chords };
        };
        this.isStartDirective = (line) => this.isVerseStartDirective(line) ||
            this.isChorusStartDirective(line) ||
            this.isGridStartDirective(line);
        this.isVerseStartDirective = (line) => line.includes('start_of_verse') || line.includes('sov');
        this.isChorusStartDirective = (line) => line.includes('start_of_chorus') || line.includes('soc');
        this.isGridStartDirective = (line) => line.includes('start_of_grid') || line.includes('sog');
        this.isEndDirective = (line) => this.isVerseEndDirective(line) ||
            this.isChorusEndDirective(line) ||
            this.isGridEndDirective(line);
        this.isVerseEndDirective = (line) => line.includes('end_of_verse') || line.includes('eov');
        this.isChorusEndDirective = (line) => line.includes('end_of_chorus') || line.includes('eoc');
        this.isGridEndDirective = (line) => line.includes('end_of_grid') || line.includes('eog');
    }
}
exports.ChordProParser = ChordProParser;
