import { Song } from '../types';
export declare class LetsJamParser {
    parse: (content: string) => Song;
    private parseMetadata;
    private parseSection;
    private parseGridSection;
    private parseVerseChorusSection;
    private parseTextLine;
    private parseChordLine;
    private getSectionTitle;
    private divideIntoSections;
    private parseCell;
    private isStartDirective;
    private isVerseStartDirective;
    private isChorusStartDirective;
    private isGridStartDirective;
}
