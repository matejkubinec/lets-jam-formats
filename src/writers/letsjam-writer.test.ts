import { GridSection, SectionType, Song, SongSection } from '..';
import { LetsJamWriter } from './letsjam-writer';

describe('LetsJam Writer', () => {
  const writer = new LetsJamWriter();

  it('writes metadata correctly', () => {
    const song: Song = {
      metadata: {
        artist: 'Artist',
        title: 'Title',
        capo: '1',
        key: 'D',
        tempo: '123',
      },
      sections: [],
    };

    const actual = writer.write(song);

    const expected = [
      'Artist Artist',
      'Title Title',
      'Capo 1',
      'Key D',
      'Tempo 123',
      '',
    ].join('\n');

    expect(actual).toBe(expected);
  });

  it('converts partial metadata', () => {
    const song: Song = {
      metadata: {
        artist: '',
        title: 'Title',
        capo: '1',
        key: '',
        tempo: '123',
      },
      sections: [],
    };

    const actual = writer.write(song);

    const expected = ['Title Title', 'Capo 1', 'Tempo 123', ''].join('\n');

    expect(actual).toBe(expected);
  });

  it('parses verse without lines correctly', () => {
    const verse: SongSection = {
      title: 'Verse',
      type: SectionType.verse,
      lines: [],
    };
    const song: Song = {
      metadata: {
        artist: '',
        title: '',
        capo: '',
        key: '',
        tempo: '',
      },
      sections: [verse],
    };

    const actual = writer.write(song);
    const expected = [
      'V: Verse',
      ''
    ].join('\n');

    expect(actual).toBe(expected);
  });

  it('parses verse without title correctly', () => {
    const verse: SongSection = {
      title: '',
      type: SectionType.verse,
      lines: [],
    };
    const song: Song = {
      metadata: {
        artist: '',
        title: '',
        capo: '',
        key: '',
        tempo: '',
      },
      sections: [verse],
    };

    const actual = writer.write(song);
    const expected = [
      'V:',
      '',
    ].join('\n');

    expect(actual).toBe(expected);
  });

  it('parses verse without chords correctly', () => {
    const verse: SongSection = {
      title: 'Verse',
      type: SectionType.verse,
      lines: [
        {
          chords: [],
          content: 'This is a verse line 1',
        },
        {
          chords: [],
          content: 'This is a verse line 2',
        },
      ],
    };
    const song: Song = {
      metadata: {
        artist: '',
        title: '',
        capo: '',
        key: '',
        tempo: '',
      },
      sections: [verse],
    };

    const actual = writer.write(song);
    const expected = [
      'V: Verse',
      'This is a verse line 1',
      'This is a verse line 2',
      '',
    ].join('\n');

    expect(actual).toBe(expected);
  });

  it('parses verse with chords correctly', () => {
    const verse: SongSection = {
      title: 'Verse',
      type: SectionType.verse,
      lines: [
        {
          chords: [
            {
              chord: 'C',
              offset: 0,
              pos: 0,
            },
            {
              chord: 'D',
              offset: 1,
              pos: 7,
            },
          ],
          content: 'This is a verse line 1',
        },
      ],
    };
    const song: Song = {
      metadata: {
        artist: '',
        title: '',
        capo: '',
        key: '',
        tempo: '',
      },
      sections: [verse],
    };

    const actual = writer.write(song);
    const expected = [
      'V: Verse',
      'C      D',
      'This is a verse line 1',
      '',
    ].join('\n');

    expect(actual).toBe(expected);
  });

  it('parses verse without lines correctly', () => {
    const chorus: SongSection = {
      title: 'Chorus',
      type: SectionType.chorus,
      lines: [],
    };
    const song: Song = {
      metadata: {
        artist: '',
        title: '',
        capo: '',
        key: '',
        tempo: '',
      },
      sections: [chorus],
    };

    const actual = writer.write(song);
    const expected = [
      'C: Chorus',
      '',
    ].join('\n');

    expect(actual).toBe(expected);
  });

  it('parses chorus without title correctly', () => {
    const chorus: SongSection = {
      title: '',
      type: SectionType.chorus,
      lines: [],
    };
    const song: Song = {
      metadata: {
        artist: '',
        title: '',
        capo: '',
        key: '',
        tempo: '',
      },
      sections: [chorus],
    };
    
    const actual = writer.write(song);
    const expected = [
      'C:',
      '',
    ].join('\n');

    expect(actual).toBe(expected);
  });

  it('parses chorus without chords correctly', () => {
    const chorus: SongSection = {
      title: 'Chorus',
      type: SectionType.chorus,
      lines: [
        {
          chords: [],
          content: 'This is a chorus line 1',
        },
        {
          chords: [],
          content: 'This is a chorus line 2',
        },
      ],
    };
    const song: Song = {
      metadata: {
        artist: '',
        title: '',
        capo: '',
        key: '',
        tempo: '',
      },
      sections: [chorus],
    };

    const actual = writer.write(song);
    const expected = [
      'C: Chorus',
      'This is a chorus line 1',
      'This is a chorus line 2',
      '',
    ].join('\n');

    expect(actual).toBe(expected);
  });

  it('parses chorus with chords correctly', () => {
    const chorus: SongSection = {
      title: 'Chorus',
      type: SectionType.chorus,
      lines: [
        {
          chords: [
            {
              chord: 'C',
              offset: 0,
              pos: 0,
            },
            {
              chord: 'D',
              offset: 1,
              pos: 7,
            },
          ],
          content: 'This is a chorus line 1',
        },
      ],
    };
    const song: Song = {
      metadata: {
        artist: '',
        title: '',
        capo: '',
        key: '',
        tempo: '',
      },
      sections: [chorus],
    };

    const actual = writer.write(song);
    const expected = [
      'C: Chorus',
      'C      D',
      'This is a chorus line 1',
      ''
    ].join('\n');

    expect(actual).toBe(expected);
  });

  it('parses grid with title', () => {
    const gridSection: GridSection = {
      title: 'Grid',
      type: SectionType.grid,
      grid: [],
    };
    const song: Song = {
      metadata: {
        artist: '',
        title: '',
        capo: '',
        key: '',
        tempo: '',
      },
      sections: [gridSection],
    };

    const actual = writer.write(song);
    const expected = [
      'G: Grid',
      '',
    ].join('\n');

    expect(actual).toBe(expected);
  });

  it('parses grid without title', () => {
    const gridSection: GridSection = {
      title: '',
      type: SectionType.grid,
      grid: [],
    };
    const song: Song = {
      metadata: {
        artist: '',
        title: '',
        capo: '',
        key: '',
        tempo: '',
      },
      sections: [gridSection],
    };

    const actual = writer.write(song);
    const expected = [
      'G:',
      '',
    ].join('\n');

    expect(actual).toBe(expected);
  });

  it('parses grid', () => {
    const grid = [
      [['C', '.', '.', '.'], ['G']],
      [['D'], ['E', '.', '.', '.']],
    ];
    const gridSection: GridSection = {
      title: 'Grid',
      type: SectionType.grid,
      grid: grid,
    };
    const song: Song = {
      metadata: {
        artist: '',
        title: '',
        capo: '',
        key: '',
        tempo: '',
      },
      sections: [gridSection],
    };

    const actual = writer.write(song);
    const expected = [
      'G: Grid',
      '| C . . . | G |',
      '| D | E . . . |',
      '',
    ].join('\n');

    expect(actual).toBe(expected);
  });

  it('parses song', () => {
    const metadata = {
      artist: 'Artist',
      title: 'Title',
      capo: '1',
      key: 'D',
      tempo: '123',
    };
    const grid = [
      [['C', '.', '.', '.'], ['G']],
      [['D'], ['E', '.', '.', '.']],
    ];
    const gridSection: GridSection = {
      title: 'Grid',
      type: SectionType.grid,
      grid: grid,
    };
    const verseSection: SongSection = {
      title: 'Verse',
      type: SectionType.verse,
      lines: [
        {
          chords: [],
          content: 'This is a verse line 1',
        },
        {
          chords: [],
          content: 'This is a verse line 2',
        },
      ],
    };
    const chorusSection: SongSection = {
      title: 'Chorus',
      type: SectionType.chorus,
      lines: [
        {
          chords: [
            {
              chord: 'C',
              offset: 0,
              pos: 0,
            },
            {
              chord: 'D',
              offset: 1,
              pos: 7,
            },
          ],
          content: 'This is a chorus line 1',
        },
      ],
    };
    const sections = [verseSection, chorusSection, gridSection];
    const song: Song = {
      metadata,
      sections,
    };

    const actual = writer.write(song);

    const expected = [
      'Artist Artist',
      'Title Title',
      'Capo 1',
      'Key D',
      'Tempo 123',
      '',
      'V: Verse',
      'This is a verse line 1',
      'This is a verse line 2',
      '',
      'C: Chorus',
      'C      D',
      'This is a chorus line 1',
      '',
      'G: Grid',
      '| C . . . | G |',
      '| D | E . . . |',
      '',
    ].join('\n');

    expect(actual).toBe(expected);
  });
});
