"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseChordPro = void 0;
const utils_1 = require("../utils");
const types_1 = require("../types");
const DIRECTIVES = {
    verse: {
        start: '{start_of_verse',
        end: '{end_of_verse}',
    },
    chorus: {
        start: '{start_of_chorus',
        end: '{end_of_chorus}',
    },
    grid: {
        start: '{start_of_grid',
        end: '{end_of_grid}',
    },
};
const chordRegex = /\[(.*?)\]/g;
const lineEndingRegex = /\r?\n/;
const chordReplacer = (chords) => (_, chord, pos) => {
    const offset = chords.reduce((res, { chord }) => res + chord.length + 2, 0);
    const offsetPos = pos - offset;
    chords.push({ pos: offsetPos, offset, chord });
    return '';
};
const parseLine = (line) => {
    const chords = new Array();
    const content = line.replace(chordRegex, chordReplacer(chords));
    return { content, chords };
};
const parseTitle = (line, directive) => line.includes(':')
    ? line.slice(directive.start.length + 1, line.length - 1)
    : '';
const parseGrid = (sectionContent) => {
    const [start, ...lines] = sectionContent.split(lineEndingRegex);
    const title = parseTitle(start, DIRECTIVES.grid);
    const filter = (line) => !line.startsWith(DIRECTIVES.grid.start) &&
        !line.startsWith(DIRECTIVES.grid.end) &&
        utils_1.isEmpty(line);
    const mapCell = (cell) => cell.replace(/\[|\]/g, '').trim().split(' ').filter(utils_1.isEmpty);
    const map = (line) => line.split('|').map(mapCell).filter(utils_1.isEmpty);
    const grid = lines.filter(filter).map(map).filter(utils_1.isEmpty)[0];
    return {
        title,
        grid,
        type: types_1.SectionType.grid,
    };
};
const parseVerse = (sectionContent) => {
    const [start, ...lines] = sectionContent.split(lineEndingRegex);
    const title = parseTitle(start, DIRECTIVES.verse);
    const filter = (line) => !line.startsWith(DIRECTIVES.verse.start) &&
        !line.startsWith(DIRECTIVES.verse.end) &&
        utils_1.isEmpty(line);
    const parsedLines = lines.filter(filter).map(parseLine);
    return {
        title: title,
        type: types_1.SectionType.verse,
        lines: parsedLines,
    };
};
const parseChorus = (sectionContent) => {
    const [start, ...lines] = sectionContent.split(lineEndingRegex);
    const title = parseTitle(start, DIRECTIVES.chorus);
    const filter = (line) => !line.startsWith(DIRECTIVES.chorus.start) &&
        !line.startsWith(DIRECTIVES.chorus.end) &&
        utils_1.isEmpty(line);
    const parsedLines = lines.filter(filter).map(parseLine);
    return {
        title: title,
        type: types_1.SectionType.chorus,
        lines: parsedLines,
    };
};
const parseMetadataTag = (lines, tag) => {
    const tagLine = (lines || []).find(line => line.includes(tag));
    return tagLine ? tagLine.slice(tag.length + 2, tagLine.length - 1) : '';
};
const parseMetadata = (content) => {
    const lines = content.split(lineEndingRegex);
    return {
        artist: parseMetadataTag(lines, 'artist'),
        title: parseMetadataTag(lines, 'title'),
        key: parseMetadataTag(lines, 'key'),
        capo: parseMetadataTag(lines, 'capo'),
        tempo: parseMetadataTag(lines, 'tempo'),
    };
};
const parseSections = (sections) => sections.filter(utils_1.isEmpty).map(section => {
    if (section.startsWith(DIRECTIVES.verse.start)) {
        return parseVerse(section);
    }
    if (section.startsWith(DIRECTIVES.chorus.start)) {
        return parseChorus(section);
    }
    if (section.startsWith(DIRECTIVES.grid.start)) {
        return parseGrid(section);
    }
    return { title: '', type: types_1.SectionType.unknown };
});
const divideIntoSections = (content) => {
    let current = [];
    const sections = [];
    content.split(lineEndingRegex).forEach(line => {
        if (line.startsWith(DIRECTIVES.verse.start) ||
            line.startsWith(DIRECTIVES.chorus.start) ||
            line.startsWith(DIRECTIVES.grid.start)) {
            sections.push(current.join('\n').trim());
            current = [line];
        }
        else {
            current.push(line);
        }
    });
    return sections;
};
const parseChordPro = (content) => {
    const [metadataSection, ...sections] = divideIntoSections(content);
    return {
        metadata: parseMetadata(metadataSection),
        sections: parseSections(sections),
    };
};
exports.parseChordPro = parseChordPro;
