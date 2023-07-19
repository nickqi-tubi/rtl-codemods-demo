import { v4 as uuid } from 'uuid';

import type { AnyCollection, Motion, TestBlockPath } from 'src/types';
import storage, { getWrapperNameKey, KEYS } from 'src/utils/storage';
import { findTestBlock, buildRender } from 'src/utils/transform';

type ReplaceWithRender = (wrapperCollection: AnyCollection, renderStatement: AnyCollection) => void;

// Support mount ant shallow
const transformToRender: Motion = (j, ast) => {
  findTestBlock(j, ast).forEach((path) => {
    (path as TestBlockPath)._uuid = uuid();

    const blockAst = j(path);

    const findWrapper = (enzymeFn?: string) => {
      if (!enzymeFn) {
        return null;
      }

      const wrapperCollection = blockAst.find(j.CallExpression, {
        callee: {
          name: enzymeFn,
        },
      });

      return wrapperCollection.length ? wrapperCollection : null;
    };

    const replaceWithRender: ReplaceWithRender = (wrapperCollection, renderStatement) => {
      const variableDeclaration = wrapperCollection.closest(j.VariableDeclaration).filter((path) => {
        return j(path).get('declarations', 0, 'init').value === wrapperCollection.nodes()[0];
      });

      if (variableDeclaration.length) {
        const wrapperName = variableDeclaration.find(j.Identifier).get().value.name;
        storage.set(getWrapperNameKey((path as TestBlockPath)._uuid), wrapperName);
        variableDeclaration.replaceWith(renderStatement);
      } else {
        wrapperCollection.replaceWith(renderStatement);
      }
    };

    const wrapperCollection =
      findWrapper(storage.get(KEYS.mountImportName)) || findWrapper(storage.get(KEYS.shallowImportName));

    if (wrapperCollection) {
      const arg = wrapperCollection.get('arguments', 0).value;
      replaceWithRender(wrapperCollection, buildRender(j, arg));
    }
  });
};

export default transformToRender;
