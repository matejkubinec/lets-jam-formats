export const isEmpty = (a: string | any[]) => a && a.length;

export const chordReplacer = (chords: any[]) => (
  _: any,
  chord: string,
  pos: number
): string => {
  const offset = chords.reduce((res, { chord }) => res + chord.length + 2, 0);
  const offsetPos = pos - offset;
  chords.push({ pos: offsetPos, offset, chord });
  return '';
};
