import { getChordSymbol } from '../getChordSymbol';

const chordTestOrig = `
[ch]AM7[/ch]
[ch]Cmi7(add b9,#9)[/ch]
[ch]H[/ch]       [ch]F#[/ch]      [ch]Hadd9/F[/ch]
[ch]A/H[/ch]       [ch]Gm/H[/ch]
[ch]Em7[/ch]
[ch]C7(b9)[/ch]      [ch]Eb7(b5)[/ch]
`;

const chordTestResult = `
[ch]AMaj7[/ch]
[ch]Cm7addb9#9[/ch]
[ch]B[/ch]       [ch]F#[/ch]      [ch]B2/F[/ch]
[ch]A/B[/ch]       [ch]Gm/B[/ch]
[ch]Em7[/ch]
[ch]C7b9[/ch]      [ch]Eb7b5[/ch]
`;

const cleanupUltimateGuitarChordSymbolsRaw = (content: string) => {
  const replacer = (substring: string, ...args: any[]): string => {
    const match = args[0];
    // console.log(`Found: ${match} within ${substring}`);
    return `[ch]${getChordSymbol(match)}[/ch]`;
  };

  const chordsRegExp = /\[ch\]([^[]+)\[\/ch\]/g;
  return content.replace(chordsRegExp, replacer);
};

test('getChordSymbol', () => {
  expect(cleanupUltimateGuitarChordSymbolsRaw(chordTestOrig)).toBe(
    chordTestResult
  );
});
