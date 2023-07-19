import merge from 'lodash/merge';

import { SNAPSHOT_TYPES } from 'src/constants';
import { defineTest } from 'src/utils/test';
import type { Options } from 'src/utils/test';

const getOptions = (options?: Partial<Options>): Options =>
  merge(
    {
      transformOptions: {
        enablePrettierEslintFix: true,
      },
    },
    options
  );

defineTest('all', 'render', getOptions());

defineTest('all', 'snapshot', getOptions());

defineTest(
  'all',
  'reactHelmetSnapshot',
  getOptions({
    transformOptions: {
      snapshotType: SNAPSHOT_TYPES.reactHelmet,
    },
  })
);
