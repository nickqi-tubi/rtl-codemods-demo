import { SNAPSHOT_TYPES } from 'src/constants';
import storage, { KEYS } from 'src/utils/storage';
import { defineTest } from 'src/utils/test';

describe('default snapshot transformer', () => {
  beforeAll(() => {
    storage.set(KEYS.snapshotType, SNAPSHOT_TYPES.default);
  });

  defineTest('snapshot', 'basic');

  defineTest('snapshot', 'withTypes');
});

describe('reactHelmet snapshot transformer', () => {
  beforeAll(() => {
    storage.set(KEYS.snapshotType, SNAPSHOT_TYPES.reactHelmet);
  });

  defineTest('snapshot', 'reactHelmet');
});
