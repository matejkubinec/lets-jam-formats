"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseLetsJam = void 0;
const types_1 = require("../types");
const constants_1 = require("../constants");
const chordReplacer = (chords) => (_, chord, pos) => {
    const offset = chords.reduce((res, { chord }) => res + chord.length + 2, 0);
    const offsetPos = pos - offset;
    chords.push({ pos: offsetPos, offset, chord });
    return '';
};
const parseLine = (line) => {
    const chords = new Array();
    const content = line.replace(constants_1.chordRegex, chordReplacer(chords));
    return { content, chords };
};
const parseSection = (section) => {
    const [title, ...lines] = section.trim().split(constants_1.lineEndingRegex);
    // TODO: differentiate between chorus and verse
    return {
        title,
        lines: lines.map(parseLine),
        type: types_1.SectionType.verse,
    };
};
const parseSections = (sections) => {
    return sections.map(parseSection);
};
const parseMetadata = (titleSection) => {
    const [artist, title] = titleSection.split('-');
    return {
        artist,
        title,
        capo: '',
        key: '',
        tempo: '',
    };
};
const divideIntoSections = (content) => {
    return content.split('#').filter(Boolean);
};
const parseLetsJam = (content) => {
    const [titleSection, ...dividedSections] = divideIntoSections(content);
    const metadata = parseMetadata(titleSection);
    const sections = parseSections(dividedSections);
    return { metadata, sections };
};
exports.parseLetsJam = parseLetsJam;
