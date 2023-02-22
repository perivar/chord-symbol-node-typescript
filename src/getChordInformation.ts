import {
  Chord,
  ChordParseFailure,
  chordParserFactory,
  chordRendererFactory,
  MaybeChord,
} from 'chord-symbol/lib/chord-symbol';

export interface ChordInformation {
  /**
   * - whether the input text could be parsed as a chord
   */
  isChord: boolean;
  /**
   * - the full chord name Ex: `Cm7b5/Gb`
   */
  chordName: string;
  /**
   * - the normalized root note in english notation. Ex: `C`
   */
  rootNote?: string;
  /**
   * - the normalized bass note in english notation. Ex: `Gb`
   */
  bassNote?: string;
  /**
   * - list of intervals composing the chord. Ex: `['1', 'b3', 'b5', 'b7']` for `Cm7b5/Gb`
   */
  intervals: string[];
  /**
   * - list of notes composing the chord. Ex: `['C', 'Eb', 'Gb', 'Bb']` for `Cm7b5/Gb`
   */
  notes: string[];
  /**
   * - error object
   */
  error: any;
}

export const getChordInformation = (value: string): ChordInformation => {
  let isChord = false;
  let chordName: string = value;

  let notes: string[] = [];
  let intervals: string[] = [];
  let rootNote: string | undefined;
  let bassNote: string | undefined;

  let error: any;

  try {
    const maybeChord: MaybeChord = parseChord(chordName);

    if ((maybeChord as Chord).normalized) {
      isChord = true;
      const chord = maybeChord as Chord;
      rootNote = chord.normalized?.rootNote;
      bassNote = chord.normalized?.bassNote;
      notes = chord.normalized?.notes ?? [];
      intervals = chord.normalized?.intervals ?? [];

      // render chord name using chord-symbol
      chordName = renderChord(chord);
    } else if ((maybeChord as ChordParseFailure).error) {
      const chordError = maybeChord as ChordParseFailure;
      error = chordError.error;
    }
  } catch (e) {
    error = e;
  }

  return {
    isChord,
    chordName,
    rootNote,
    bassNote,
    intervals,
    notes,
    error,
  };
};

const chordSymbolUltimateGuitarRenderer = (chord: any) => {
  chord.formatted.symbol = chord.formatted.symbol
    .replace(/[(), ]/g, '')
    .replace(/mM(?!aj)/g, 'mMaj')
    .replace(/M(?!aj)/g, 'Maj')
    .replace('°', 'dim');

  return chord;
};

const parseChord = chordParserFactory({
  altIntervals: ['b5', '#5', 'b9', '#9', '#11', 'b13'],
  notationSystems: ['english', 'german'],
});

const renderChord = chordRendererFactory({
  customFilters: [chordSymbolUltimateGuitarRenderer],
  useShortNamings: true,
});
