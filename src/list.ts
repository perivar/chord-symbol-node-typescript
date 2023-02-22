import chalk from 'chalk';
import { Arguments, Argv } from 'yargs';

import { getChordInformation } from './getChordInformation';

// const errorStyle = chalk.bold.red;
const warningStyle = chalk.keyword('orange').bold;
const successStyle = chalk.bold.green;

interface Args {
  all: boolean | undefined;
  name: string | undefined;
  verbose: boolean | undefined;
}

export const command = 'list [options]';
export const describe = 'List files';

export const builder = (yargs: Argv): Argv<Args> => {
  return yargs
    .option('all', {
      alias: 'a',
      describe: 'List all chords',
      type: 'boolean',
    })
    .option('name', {
      alias: 'n',
      describe: 'List chord with name',
      type: 'string',
    })
    .option('verbose', {
      alias: 'v',
      description: 'Run with verbose logging',
      type: 'boolean',
    })
    .example('$0 list -a', 'List all chords')
    .example('$0 list -n "Cadd9"', 'List chord with name "Cadd9"')
    .example('$0 list --help', 'Show help')
    .check((argv: Arguments<Args>) => {
      if (!argv.all && !argv.name) {
        throw new Error('You must supply either --all or --name');
      } else {
        return true;
      }
    });
};

export const handler = async (argv: Arguments<Args>): Promise<void> => {
  // process arguments using yarg
  let isVerbose = false;
  let doList = false;
  let nameQuery = undefined;

  if (argv.verbose) {
    console.info(warningStyle('Verbose mode on.'));
    isVerbose = true;
  }

  if (argv.all) {
    console.info(
      successStyle('--all argument found. Trying to list all chords ...')
    );
    doList = true;
  } else if (argv.name) {
    nameQuery = argv.name;
    console.info(
      successStyle(
        `--name argument found. Trying to list chord with ${nameQuery} ...`
      )
    );
    doList = true;
  } else {
    console.info(
      warningStyle(
        'Neither --name or --all arguments found. Use --help for more information.'
      )
    );
    doList = false;
  }

  if (doList) {
    if (nameQuery) {
      if (isVerbose) {
        console.info(warningStyle(`Listing chord: ${nameQuery} ...`));
      }

      listChord(nameQuery);
    } else {
      if (isVerbose) {
        console.info(warningStyle(`Listing all chords ...`));
      }

      listChord('C°7(addMa7,9,11,b13)');
      listChord('CMI7(add 11)');
      listChord('C6(b9)');
      listChord('A+(add b9,add #9)');
      listChord('Cø7');
      listChord('CMI7(omit 5)');
    }
  }
};

const listChord = (chordName: string) => {
  const chordInfo = getChordInformation(chordName);
  console.info(
    warningStyle(`${chordName}`) + ': ' + successStyle(`${chordInfo.chordName}`)
  );
};
