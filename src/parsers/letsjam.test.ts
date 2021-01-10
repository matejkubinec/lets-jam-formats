import { GridSection, SectionType, SongSection } from '../types';
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
    '| Ami Ami |  G E |',
    '| Ami  .  |  G E |',
    '',
    'V: Sloha',
    'Ami            G        E',
    'Hledá se žena, mladá slečna',
    'Ami            G        E',
    'kdekoli ona může být.',
    '',
    'C: Refrén',
    'Ami            G        E',
    'Hledá se žena, mladá slečna',
    'Ami            G        E',
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
    expect(row1[0]).toHaveLength(2);
    expect(row1[0]).toEqual(expect.arrayContaining(['Ami', 'Ami']));
    expect(row1[1]).toHaveLength(2);
    expect(row1[1]).toEqual(expect.arrayContaining(['G', 'E']));

    expect(row2).toHaveLength(2);
    expect(row2[0]).toHaveLength(2);
    expect(row2[0]).toEqual(expect.arrayContaining(['Ami', '.']));
    expect(row2[1]).toHaveLength(2);
    expect(row2[1]).toEqual(expect.arrayContaining(['G', 'E']));
  });

  it('parses verse correctly', () => {
    const { sections } = parser.parse(content);
    const verse = sections[1] as SongSection;

    expect(verse.title).toBe('Sloha');
    expect(verse.type).toBe(SectionType.verse);
    expect(verse.lines).toHaveLength(2);

    const [l1, l2] = verse.lines;

    const chordsL1 = l1.chords.map(c => c.chord);
    const offsetsL1 = l1.chords.map(c => c.offset);
    const positionsL1 = l1.chords.map(c => c.pos);

    expect(l1.content).toBe('Hledá se žena, mladá slečna');
    expect(chordsL1).toEqual(expect.arrayContaining(['Ami', 'G', 'E']));
    expect(offsetsL1).toEqual(expect.arrayContaining([0, 3, 4]));
    expect(positionsL1).toEqual(expect.arrayContaining([0, 12, 20]));

    const chordsL2 = l2.chords.map(c => c.chord);
    const offsetsL2 = l2.chords.map(c => c.offset);
    const positionsL2 = l2.chords.map(c => c.pos);

    expect(l2.content).toBe('kdekoli ona může být.');
    expect(chordsL2).toEqual(expect.arrayContaining(['Ami', 'G', 'E']));
    expect(offsetsL2).toEqual(expect.arrayContaining([0, 3, 4]));
    expect(positionsL2).toEqual(expect.arrayContaining([0, 12, 20]));
  });

  it('parses chorus correctly', () => {
    const { sections } = parser.parse(content);
    const verse = sections[2] as SongSection;

    expect(verse.title).toBe('Refrén');
    expect(verse.type).toBe(SectionType.chorus);
    expect(verse.lines).toHaveLength(2);

    const [l1, l2] = verse.lines;

    const chordsL1 = l1.chords.map(c => c.chord);
    const offsetsL1 = l1.chords.map(c => c.offset);
    const positionsL1 = l1.chords.map(c => c.pos);

    expect(l1.content).toBe('Hledá se žena, mladá slečna');
    expect(chordsL1).toEqual(expect.arrayContaining(['Ami', 'G', 'E']));
    expect(offsetsL1).toEqual(expect.arrayContaining([0, 3, 4]));
    expect(positionsL1).toEqual(expect.arrayContaining([0, 12, 20]));

    const chordsL2 = l2.chords.map(c => c.chord);
    const offsetsL2 = l2.chords.map(c => c.offset);
    const positionsL2 = l2.chords.map(c => c.pos);

    expect(l2.content).toBe('kdekoli ona může být.');
    expect(chordsL2).toEqual(expect.arrayContaining(['Ami', 'G', 'E']));
    expect(offsetsL2).toEqual(expect.arrayContaining([0, 3, 4]));
    expect(positionsL2).toEqual(expect.arrayContaining([0, 12, 20]));
  });
});
