import { KEYS } from 'src/utils/storage';

import { genMotion } from './transformMountImport';

export default genMotion({
  imported: 'shallow',
  storageKey: KEYS.shallowImportName,
});
