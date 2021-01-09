import { ChordProParser, GridSection } from '..';
import { SectionType } from '../types';

describe('ChordPro parser', () => {
  const parser = new ChordProParser();
  const song =
    '{artist:Harlej}\r\n{title:Svařák}\r\n\r\n{start_of_grid}\r\n| [C] [H] | [G] . . . | [Ami] . . . | [C] . . . | [G] . . . |   \r\n{end_of_grid}\r\n\r\n{start_of_verse}\r\n[G]Když jsem sám doma (2x)\r\n[Ami]poslouchám Vávra (2x)\r\n[C]starýho vola (2x)\r\n[D]pořád dokola (2x)\r\n[G]Chce to mít nápad (2x)\r\n[Ami]a ne pořád chrápat (2x)\r\n[C]já dostal jsem nápad (2x)\r\n[D]udělat mejdan (2x)\r\n{end_of_verse}\r\n\r\n{start_of_chorus}\r\n[G]Mám rád svařené [Ami]víno červené\r\n[C]já mám rád rád [G]svařák\r\n[G]Mám rád svařené [Ami]víno červené\r\n[C]já mám rád rád [G]svařák\r\n{end_of_chorus}\r\n\r\n{start_of_grid}\r\n| [C] [H] | [G] . . . | [Ami] . . . | [C] . . . | [G] . . . |   \r\n{end_of_grid}\r\n\r\n{start_of_verse}\r\n[G]Se známou partou (2x)\r\n[Ami]domluva krátká (2x)\r\n[C]zejtra v šest hodin (2x)\r\n[D]vstup jedna lampa (2x)\r\n\r\n[G]Začíná mejdan (2x)\r\n[Ami]na 200 procent (2x)\r\n[C]my plníme plány (2x)\r\n[D]rostou nám blány (2x)\r\n{end_of_verse}\r\n\r\n{start_of_chorus}\r\n[G]Mám rád svařené [Ami]víno červené\r\n[C]já mám rád rád [G]svařák\r\n[G]Mám rád svařené [Ami]víno červené\r\n[C]já mám rád rád [G]svařák\r\n{end_of_chorus}\r\n\r\n{start_of_grid}\r\n| [C] [H] | [G] . . . | [Ami] . . . | [C] . . . | [G] . . . |   \r\n{end_of_grid}\r\n\r\n{start_of_verse}\r\n[G]Když jsem sám doma\r\n[Ami]poslouchám Vávra\r\n[C]starýho vola\r\n[D]pořád dokola\r\n\r\n[G]Chce to mít nápad\r\n[Ami]a ne pořád chrápat\r\n[C]já dostal jsem nápad\r\n[D]udělat mejdan\r\n{end_of_verse}\r\n\r\n{start_of_chorus}\r\n[G]Mám rád svařené [Ami]víno červené\r\n[C]já mám rád rád [G]svařák\r\n[G]Mám rád svařené [Ami]víno červené\r\n[C]já mám rád rád [G]svařák\r\n\r\n[G]Mám rád svařené [Ami]víno červené\r\n[C]já mám rád rád [G]svařák\r\n[G]Mám rád svařené [Ami]víno červené\r\n[C]já mám rád rád [G]svařák\r\n{end_of_chorus}\r\n';

  it('parses metadata correctly', () => {
    const { metadata } = parser.parse(song);

    expect(metadata.title).toBe('Svařák');
    expect(metadata.artist).toBe('Harlej');
  });

  it('parses grid section correctly', () => {
    const { sections } = parser.parse(song);
    const introSection = sections[0] as GridSection;
    const { grid, type } = introSection;

    expect(grid.length).toBe(1);
    expect(type).toBe(SectionType.grid);
    expect(grid[0][0]).toEqual(expect.arrayContaining(['C', 'H']));
    expect(grid[0][1]).toEqual(expect.arrayContaining(['G', '.', '.', '.']));
    expect(grid[0][2]).toEqual(expect.arrayContaining(['Ami', '.', '.', '.']));
    expect(grid[0][3]).toEqual(expect.arrayContaining(['C', '.', '.', '.']));
    expect(grid[0][4]).toEqual(expect.arrayContaining(['G', '.', '.', '.']));
  });
});
