#!/usr/bin/env node

const { run: jscodeshift } = require('jscodeshift/src/Runner');
const pick = require('lodash/pick');
const path = require('path');
const yargs = require('yargs');

const { SNAPSHOT_TYPES, VERBOSE_LEVELS } = require('./constants');

const { argv } = yargs
  .option('v', {
    alias: 'verbose',
    describe: 'Show more information about the transform process',
    default: 'normal',
    choices: Object.keys(VERBOSE_LEVELS),
    number: true,
  })
  .option('d', {
    alias: 'dry',
    describe: 'Dry run (no changes are made to files)',
    boolean: true,
    default: false,
  })
  .option('t', {
    alias: 'transform',
    describe: 'Path to the transform file. Can be either a local path or url',
    default: './transforms/all.ts',
  })
  .option('snapshotType', {
    describe: 'The snapshot transformer type',
    default: SNAPSHOT_TYPES.default,
    choices: Object.values(SNAPSHOT_TYPES),
  });

const paths = argv._.map((filename: string) => path.resolve(filename));
const transformPath = path.join(__dirname, argv.transform);

const run = async () => {
  await jscodeshift(transformPath, paths, {
    ...pick(argv, ['dry', 'snapshotType']),
    verbose: VERBOSE_LEVELS[argv.verbose],
    // For the support of both JS & TS files, the "tsx" parser is chosen.
    // https://github.com/facebook/jscodeshift/blob/main/parser/tsx.js
    parser: 'tsx',
    enablePrettierEslintFix: true,
  });
};

run();
