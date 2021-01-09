"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chordReplacer = exports.isEmpty = void 0;
const isEmpty = (a) => a && a.length;
exports.isEmpty = isEmpty;
const chordReplacer = (chords) => (_, chord, pos) => {
    const offset = chords.reduce((res, { chord }) => res + chord.length + 2, 0);
    const offsetPos = pos - offset;
    chords.push({ pos: offsetPos, offset, chord });
    return '';
};
exports.chordReplacer = chordReplacer;
