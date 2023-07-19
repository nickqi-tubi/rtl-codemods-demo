import { hasImportSpecifier, getImportSpecifier, getDefaultImportSpecifier } from '@codeshift/utils';

import { TESTING_LIBRARY_PATH } from 'src/constants';
import type { Motion } from 'src/types';
import storage, { KEYS } from 'src/utils/storage';
import { buildImport } from 'src/utils/transform';

interface GenMotionParams {
  imported?: string;
  source?: string;
  storageKey: KEYS;
}

type GenMotion = (params: GenMotionParams) => Motion;

export const genMotion: GenMotion =
  ({ imported, storageKey, source = 'enzyme' }) =>
  (j, ast) => {
    const isDefaultImport = !imported;
    const importCollection = (
      isDefaultImport ? getDefaultImportSpecifier(j, ast, source) : getImportSpecifier(j, ast, imported, source)
    ).closest(j.ImportDeclaration);

    if (!importCollection.length) {
      return;
    }

    const importSpecifier = isDefaultImport
      ? importCollection.find(j.ImportDefaultSpecifier)
      : importCollection.find(j.ImportSpecifier, {
          imported: {
            name: imported,
          },
        });
    const importName = importSpecifier.get('local', 'name').value;

    storage.set(storageKey, importName);

    const renderImport = buildImport(j, {
      imported: 'render',
      source: TESTING_LIBRARY_PATH,
    });

    if (importCollection.find(j.ImportSpecifier).size() > 1) {
      importCollection.insertAfter(renderImport);
      importSpecifier.remove();
    } else if (hasImportSpecifier(j, ast, 'render', TESTING_LIBRARY_PATH)) {
      importCollection.remove();
    } else {
      importCollection.replaceWith(renderImport);
    }
  };

export default genMotion({
  imported: 'mount',
  storageKey: KEYS.mountImportName,
});
