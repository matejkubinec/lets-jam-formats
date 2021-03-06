import { Song, IFormatParser } from '../types';
export declare class ChordProParser implements IFormatParser {
    parse: (content: string) => Song;
    private getStringSections;
    private parseSection;
    private parseVerse;
    private parseChorus;
    private parseGrid;
    private parseMetadata;
    private getValueFromDirective;
    private parseLine;
    private isStartDirective;
    private isVerseStartDirective;
    private isChorusStartDirective;
    private isGridStartDirective;
    private isEndDirective;
    private isVerseEndDirective;
    private isChorusEndDirective;
    private isGridEndDirective;
}
