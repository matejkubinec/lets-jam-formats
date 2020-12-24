import { Chord } from './types';
export declare const isEmpty: (a: string | any[]) => number;
export declare const chordReplacer: (chords: Chord[]) => (_: any, chord: string, pos: number) => string;
