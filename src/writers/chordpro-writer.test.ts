import {
  BlockType,
  GridSection,
  SectionType,
  Song,
  SongSection,
} from '../types';
import { ChordProWriter } from './chordpro-writer';

describe('ChordPro Writer', () => {
  const writer = new ChordProWriter();

  it('converts metadata correctly', () => {
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

    const content = writer.write(song);
    const lines = content.split('\n');

    expect(lines).toHaveLength(6);

    const [artist, title, capo, key, tempo] = lines;

    expect(artist).toBe('{artist: Artist}');
    expect(title).toBe('{title: Title}');
    expect(capo).toBe('{capo: 1}');
    expect(key).toBe('{key: D}');
    expect(tempo).toBe('{tempo: 123}');
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

    const content = writer.write(song);
    const lines = content.split('\n');

    expect(lines).toHaveLength(4);

    const [title, capo, tempo] = lines;

    expect(title).toBe('{title: Title}');
    expect(capo).toBe('{capo: 1}');
    expect(tempo).toBe('{tempo: 123}');
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

    const content = writer.write(song);
    const lines = content.split('\n');

    expect(lines).toHaveLength(3);

    const [start, end] = lines;

    expect(start).toBe('{start_of_verse: Verse}');
    expect(end).toBe('{end_of_verse}');
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

    const content = writer.write(song);
    const lines = content.split('\n');

    expect(lines).toHaveLength(3);

    const [start, end] = lines;

    expect(start).toBe('{start_of_verse}');
    expect(end).toBe('{end_of_verse}');
  });

  it('parses verse without chords correctly', () => {
    const verse: SongSection = {
      title: 'Verse',
      type: SectionType.verse,
      lines: [
        {
          blocks: [{ content: 'This is a verse line 1', type: BlockType.text }],
        },
        {
          blocks: [{ content: 'This is a verse line 2', type: BlockType.text }],
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

    const content = writer.write(song);
    const lines = content.split('\n');

    expect(lines).toHaveLength(5);

    const [start, line1, line2, end] = lines;

    expect(start).toBe('{start_of_verse: Verse}');
    expect(line1).toBe('This is a verse line 1');
    expect(line2).toBe('This is a verse line 2');
    expect(end).toBe('{end_of_verse}');
  });

  it('parses verse with chords correctly', () => {
    const verse: SongSection = {
      title: 'Verse',
      type: SectionType.verse,
      lines: [
        {
          blocks: [
            { content: 'C', type: BlockType.chord },
            { content: 'This is', type: BlockType.text },
            { content: 'D', type: BlockType.chord },
            { content: ' a verse line 1', type: BlockType.text },
          ],
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

    const content = writer.write(song);
    const lines = content.split('\n');

    expect(lines).toHaveLength(4);

    const [start, line1, end] = lines;

    expect(start).toBe('{start_of_verse: Verse}');
    expect(line1).toBe('[C]This is[D] a verse line 1');
    expect(end).toBe('{end_of_verse}');
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

    const content = writer.write(song);
    const lines = content.split('\n');

    expect(lines).toHaveLength(3);

    const [start, end] = lines;

    expect(start).toBe('{start_of_chorus: Chorus}');
    expect(end).toBe('{end_of_chorus}');
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

    const content = writer.write(song);
    const lines = content.split('\n');

    expect(lines).toHaveLength(3);

    const [start, end] = lines;

    expect(start).toBe('{start_of_chorus}');
    expect(end).toBe('{end_of_chorus}');
  });

  it('parses chorus without chords correctly', () => {
    const chorus: SongSection = {
      title: 'Chorus',
      type: SectionType.chorus,
      lines: [
        {
          blocks: [
            { content: 'This is a chorus line 1', type: BlockType.text },
          ],
        },
        {
          blocks: [
            { content: 'This is a chorus line 2', type: BlockType.text },
          ],
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

    const content = writer.write(song);
    const lines = content.split('\n');

    expect(lines).toHaveLength(5);

    const [start, line1, line2, end] = lines;

    expect(start).toBe('{start_of_chorus: Chorus}');
    expect(line1).toBe('This is a chorus line 1');
    expect(line2).toBe('This is a chorus line 2');
    expect(end).toBe('{end_of_chorus}');
  });

  it('parses chorus with chords correctly', () => {
    const chorus: SongSection = {
      title: 'Chorus',
      type: SectionType.chorus,
      lines: [
        {
          blocks: [
            { content: 'C', type: BlockType.chord },
            { content: 'This is', type: BlockType.text },
            { content: 'D', type: BlockType.chord },
            { content: ' a chorus line 1', type: BlockType.text },
          ],
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

    const content = writer.write(song);
    const lines = content.split('\n');

    expect(lines).toHaveLength(4);

    const [start, line1, end] = lines;

    expect(start).toBe('{start_of_chorus: Chorus}');
    expect(line1).toBe('[C]This is[D] a chorus line 1');
    expect(end).toBe('{end_of_chorus}');
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

    const content = writer.write(song);
    const lines = content.split('\n');

    expect(lines).toHaveLength(3);

    const [start, end] = lines;

    expect(start).toBe('{start_of_grid: Grid}');
    expect(end).toBe('{end_of_grid}');
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

    const content = writer.write(song);
    const lines = content.split('\n');

    expect(lines).toHaveLength(3);

    const [start, end] = lines;

    expect(start).toBe('{start_of_grid}');
    expect(end).toBe('{end_of_grid}');
  });

  it('parses grid', () => {
    const grid = [
      [
        [
          { content: 'C', type: BlockType.chord },
          { content: ' . . .', type: BlockType.text },
        ],
        [{ content: 'G', type: BlockType.chord }],
      ],
      [
        [{ content: 'D', type: BlockType.chord }],
        [
          { content: 'E', type: BlockType.chord },
          { content: ' . . .', type: BlockType.text },
        ],
      ],
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

    const content = writer.write(song);
    const lines = content.split('\n');

    expect(lines).toHaveLength(5);

    const [start, line1, line2, end] = lines;

    expect(start).toBe('{start_of_grid: Grid}');
    expect(line1).toBe('| [C] . . . | [G] |');
    expect(line2).toBe('| [D] | [E] . . . |');
    expect(end).toBe('{end_of_grid}');
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
      [
        [
          { content: 'C', type: BlockType.chord },
          { content: ' . . .', type: BlockType.text },
        ],
        [{ content: 'G', type: BlockType.chord }],
      ],
      [
        [{ content: 'D', type: BlockType.chord }],
        [
          { content: 'E', type: BlockType.chord },
          { content: ' . . .', type: BlockType.text },
        ],
      ],
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
          blocks: [{ content: 'This is a verse line 1', type: BlockType.text }],
        },
        {
          blocks: [{ content: 'This is a verse line 2', type: BlockType.text }],
        },
      ],
    };
    const chorusSection: SongSection = {
      title: 'Chorus',
      type: SectionType.chorus,
      lines: [
        {
          blocks: [
            { content: 'C', type: BlockType.chord },
            { content: 'This is', type: BlockType.text },
            { content: 'D', type: BlockType.chord },
            { content: ' a chorus line 1', type: BlockType.text },
          ],
        },
      ],
    };
    const sections = [verseSection, chorusSection, gridSection];
    const song: Song = {
      metadata,
      sections,
    };

    const content = writer.write(song);

    const expected = [
      '{artist: Artist}',
      '{title: Title}',
      '{capo: 1}',
      '{key: D}',
      '{tempo: 123}',
      '',
      '{start_of_verse: Verse}',
      'This is a verse line 1',
      'This is a verse line 2',
      '{end_of_verse}',
      '',
      '{start_of_chorus: Chorus}',
      '[C]This is[D] a chorus line 1',
      '{end_of_chorus}',
      '',
      '{start_of_grid: Grid}',
      '| [C] . . . | [G] |',
      '| [D] | [E] . . . |',
      '{end_of_grid}',
      '',
    ].join('\n');

    expect(content).toBe(expected);
  });
});
