import { BlockType, GridSection, SectionType, SongSection } from '../types';
import { LetsJamParser } from './letsjam';

describe('Lets Jam Parser', () => {
  const content = [
    'Title Longer Title',
    'Artist Longer Artist',
    'Capo 1',
    'Key C',
    'Tempo 120',
    '',
    'G: Intro',
    '| [Ami] [Ami] |  [G] [E] |',
    '| [Ami]  .    |  [G] [E] |',
    '',
    'V: Sloha',
    '[Ami]            [G]        [E]',
    'Hledá se žena, mladá slečna',
    '[Ami]            [G]        [E]',
    'kdekoli ona může být.',
    '',
    'C: Refrén',
    '[Ami]            [G]        [E]',
    'Hledá se žena, mladá slečna',
    '[Ami]            [G]        [E]',
    'kdekoli ona může být.',
  ].join('\n');
  const parser = new LetsJamParser();

  it('parses metadata correctly', () => {
    const { metadata } = parser.parse(content);

    expect(metadata.title).toBe('Longer Title');
    expect(metadata.artist).toBe('Longer Artist');
    expect(metadata.capo).toBe('1');
    expect(metadata.key).toBe('C');
    expect(metadata.tempo).toBe('120');
  });

  it('parses grid correctly', () => {
    const { sections } = parser.parse(content);
    const intro = sections[0] as GridSection;

    expect(intro.title).toBe('Intro');
    expect(intro.type).toBe(SectionType.grid);

    const { grid } = intro;
    expect(grid).toHaveLength(2);

    const [row1, row2] = grid;

    expect(grid).toHaveLength(2);
    expect(row1).toHaveLength(2);

    const [rc11, rc12] = row1;

    expect(rc11).toEqual(
      expect.arrayContaining([
        { content: 'Ami', type: BlockType.chord },
        { content: ' ', type: BlockType.text },
        { content: 'Ami', type: BlockType.chord },
      ])
    );
    expect(rc12).toEqual(
      expect.arrayContaining([
        { content: 'G', type: BlockType.chord },
        { content: ' ', type: BlockType.text },
        { content: 'E', type: BlockType.chord },
      ])
    );

    const [rc21, rc22] = row2;

    expect(rc21).toEqual(
      expect.arrayContaining([
        { content: 'Ami', type: BlockType.chord },
        { content: '  .', type: BlockType.text },
      ])
    );
    expect(rc22).toEqual(
      expect.arrayContaining([
        { content: 'G', type: BlockType.chord },
        { content: ' ', type: BlockType.text },
        { content: 'E', type: BlockType.chord },
      ])
    );
  });

  it('parses verse correctly', () => {
    const { sections } = parser.parse(content);
    const verse = sections[1] as SongSection;

    expect(verse.title).toBe('Sloha');
    expect(verse.type).toBe(SectionType.verse);
    expect(verse.lines).toHaveLength(2);

    const [l1, l2] = verse.lines;

    expect(l1.blocks).toHaveLength(6);
    expect(l1.blocks).toEqual(
      expect.arrayContaining([
        { content: 'Ami', type: BlockType.chord },
        { content: 'Hledá se žena, ', type: BlockType.text },
        { content: 'G', type: BlockType.chord },
        { content: 'mladá sle', type: BlockType.text },
        { content: 'E', type: BlockType.chord },
        { content: 'čna', type: BlockType.text },
      ])
    );

    expect(l2.blocks).toHaveLength(5);
    expect(l2.blocks).toEqual(
      expect.arrayContaining([
        { content: 'Ami', type: BlockType.chord },
        { content: 'kdekoli ona můž', type: BlockType.text },
        { content: 'G', type: BlockType.chord },
        { content: 'e být.   ', type: BlockType.text },
        { content: 'E', type: BlockType.chord },
      ])
    );
  });

  it('parses chorus correctly', () => {
    const { sections } = parser.parse(content);
    const chorus = sections[2] as SongSection;

    expect(chorus.title).toBe('Refrén');
    expect(chorus.type).toBe(SectionType.chorus);
    expect(chorus.lines).toHaveLength(2);

    const [l1, l2] = chorus.lines;

    expect(l1.blocks).toHaveLength(6);
    expect(l1.blocks).toEqual(
      expect.arrayContaining([
        { content: 'Ami', type: BlockType.chord },
        { content: 'Hledá se žena, ', type: BlockType.text },
        { content: 'G', type: BlockType.chord },
        { content: 'mladá sle', type: BlockType.text },
        { content: 'E', type: BlockType.chord },
        { content: 'čna', type: BlockType.text },
      ])
    );

    expect(l2.blocks).toHaveLength(5);
    expect(l2.blocks).toEqual(
      expect.arrayContaining([
        { content: 'Ami', type: BlockType.chord },
        { content: 'kdekoli ona můž', type: BlockType.text },
        { content: 'G', type: BlockType.chord },
        { content: 'e být.   ', type: BlockType.text },
        { content: 'E', type: BlockType.chord },
      ])
    );
  });
});
