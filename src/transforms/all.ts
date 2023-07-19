import { applyMotions, hasImportDeclaration } from '@codeshift/utils';
import { yellow } from 'chalk';

import type { Transform } from 'src/types';
import storage, { KEYS } from 'src/utils/storage';
import { toSource } from 'src/utils/transform';

import renderMotions from './render/motions';
import snapshotMotions from './snapshot/motions';

const { log } = console;

const transform: Transform = (file, api, options) => {
  const j = api.jscodeshift;
  const { source } = file;
  const ast = j(source);

  if (!hasImportDeclaration(j, ast, 'enzyme')) {
    log(yellow('No Enzyme related imports found, skipping file', file.path));
    return source;
  }

  const { snapshotType, ...toSourceOptions } = options;

  if (snapshotType) {
    storage.set(KEYS.snapshotType, snapshotType);
  }

  // NOTE: The order of motions is important. Some motions need to be applied before others.
  applyMotions(j, ast, [...renderMotions, ...snapshotMotions]);

  return toSource(ast, toSourceOptions);
};

export default transform;
