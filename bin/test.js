import yargs from 'yargs';
import _ from 'lodash';
import { runCommand } from './common.js';

const { argv } = yargs(Deno.args).option('day', { type: 'string' }).option('watch', { type: 'boolean', default: false });

await runCommand(
  _.compact([
    'deno',
    'test',
    '--allow-run',
    '--allow-read',
    '--import-map=import_map.json',
    '--config',
    'deno.json',
    '--ignore=./bin', // ignore this file!
    argv.watch ? '--watch' : null,
    argv.day ? `src/days/${argv.day}` : null,
  ]),
);
