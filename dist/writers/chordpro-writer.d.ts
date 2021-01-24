import { Song } from '..';
import { IFormatWriter, Metadata, Section } from '../types';
export declare class ChordProWriter implements IFormatWriter {
    write(song: Song): string;
    writeMetadata: (metadata: Metadata) => string;
    writeSections: (sections: Section[]) => string;
    private writeResult;
    private writeVerse;
    private writeChorus;
    private writeLine;
    private writeGrid;
    private writeGridRow;
}
