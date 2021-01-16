import { ChordProParser, GridSection } from '..';
import { BlockType, SectionType, SongSection } from '../types';

describe('ChordPro parser', () => {
  const parser = new ChordProParser();
  const song = [
    '{artist:Harlej}',
    '{title:Svařák}',
    '',
    '{start_of_grid}',
    '| [C] [H] | [G] . . . | [Ami] . . . | [C] . . . | [G] . . . |   ',
    '{end_of_grid}',
    '',
    '{start_of_verse}',
    '[G]Když jsem sám doma (2x)',
    '[Ami]poslouchám Vávra (2x)',
    '[C]starýho vola (2x)',
    '[D]pořád dokola (2x)',
    '[G]Chce to mít nápad (2x)',
    '[Ami]a ne pořád chrápat (2x)',
    '[C]já dostal jsem nápad (2x)',
    '[D]udělat mejdan (2x)',
    '{end_of_verse}',
    '',
    '{start_of_chorus}',
    '[G]Mám rád svařené [Ami]víno červené',
    '[C]já mám rád rád [G]svařák',
    '[G]Mám rád svařené [Ami]víno červené',
    '[C]já mám rád rád [G]svařák',
    '{end_of_chorus}',
    '',
    '{start_of_grid}',
    '| [C] [H] | [G] . . . | [Ami] . . . | [C] . . . | [G] . . . |   ',
    '{end_of_grid}',
    '',
    '{start_of_verse}',
    '[G]Se známou partou (2x)',
    '[Ami]domluva krátká (2x)',
    '[C]zejtra v šest hodin (2x)',
    '[D]vstup jedna lampa (2x)',
    '',
    '[G]Začíná mejdan (2x)',
    '[Ami]na 200 procent (2x)',
    '[C]my plníme plány (2x)',
    '[D]rostou nám blány (2x)',
    '{end_of_verse}',
    '',
    '{start_of_chorus}',
    '[G]Mám rád svařené [Ami]víno červené',
    '[C]já mám rád rád [G]svařák',
    '[G]Mám rád svařené [Ami]víno červené',
    '[C]já mám rád rád [G]svařák',
    '{end_of_chorus}',
    '',
    '{start_of_grid}',
    '| [C] [H] | [G] . . . | [Ami] . . . | [C] . . . | [G] . . . |   ',
    '{end_of_grid}',
    '',
    '{start_of_verse}',
    '[G]Když jsem sám doma',
    '[Ami]poslouchám Vávra',
    '[C]starýho vola',
    '[D]pořád dokola',
    '',
    '[G]Chce to mít nápad',
    '[Ami]a ne pořád chrápat',
    '[C]já dostal jsem nápad',
    '[D]udělat mejdan',
    '{end_of_verse}',
    '',
    '{start_of_chorus}',
    '[G]Mám rád svařené [Ami]víno červené',
    '[C]já mám rád rád [G]svařák',
    '[G]Mám rád svařené [Ami]víno červené',
    '[C]já mám rád rád [G]svařák',
    '',
    '[G]Mám rád svařené [Ami]víno červené',
    '[C]já mám rád rád [G]svařák',
    '[G]Mám rád svařené [Ami]víno červené',
    '[C]já mám rád rád [G]svařák',
    '{end_of_chorus}',
    '',
  ].join('\n');

  it('parses metadata correctly', () => {
    const { metadata } = parser.parse(song);

    expect(metadata.title).toBe('Svařák');
    expect(metadata.artist).toBe('Harlej');
  });

  it('parses first verse correctly', () => {
    const { sections } = parser.parse(song);
    const verse = sections[1] as SongSection;

    expect(verse.type).toBe(SectionType.verse);
    expect(verse.lines).toHaveLength(8);

    const [l1] = verse.lines;
    expect(l1.blocks).toHaveLength(2);
    expect(l1.blocks).toEqual(
      expect.arrayContaining([
        { content: 'G', type: BlockType.chord },
        { content: 'Když jsem sám doma (2x)', type: BlockType.text },
      ])
    );
  });

  it('parses first chorus correctly', () => {
    const { sections } = parser.parse(song);
    const chorus = sections[2] as SongSection;

    expect(chorus.type).toBe(SectionType.chorus);
    expect(chorus.lines).toHaveLength(4);

    const [l1] = chorus.lines;
    expect(l1.blocks).toHaveLength(4);
    expect(l1.blocks).toEqual(
      expect.arrayContaining([
        { content: 'G', type: BlockType.chord },
        { content: 'Mám rád svařené ', type: BlockType.text },
        { content: 'Ami', type: BlockType.chord },
        { content: 'víno červené', type: BlockType.text },
      ])
    );
  });

  it('parses grid section correctly', () => {
    const { sections } = parser.parse(song);
    const introSection = sections[0] as GridSection;
    const { grid, type } = introSection;

    expect(grid.length).toBe(1);
    expect(type).toBe(SectionType.grid);
    expect(grid[0][0]).toEqual(
      expect.arrayContaining([
        { content: 'C', type: BlockType.chord },
        { content: ' ', type: BlockType.text },
        { content: 'H', type: BlockType.chord },
      ])
    );
    expect(grid[0][1]).toEqual(
      expect.arrayContaining([
        { content: 'G', type: BlockType.chord },
        { content: ' . . .', type: BlockType.text },
      ])
    );
    expect(grid[0][2]).toEqual(
      expect.arrayContaining([
        { content: 'Ami', type: BlockType.chord },
        { content: ' . . .', type: BlockType.text },
      ])
    );
    expect(grid[0][3]).toEqual(
      expect.arrayContaining([
        { content: 'C', type: BlockType.chord },
        { content: ' . . .', type: BlockType.text },
      ])
    );
    expect(grid[0][4]).toEqual(
      expect.arrayContaining([
        { content: 'G', type: BlockType.chord },
        { content: ' . . .', type: BlockType.text },
      ])
    );
  });
});
