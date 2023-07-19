import { SNAPSHOT_TYPES } from 'src/constants';
import type { Motion } from 'src/types';
import storage, { KEYS } from 'src/utils/storage';
import { buildRenderWithContainerReturn, insertRtlImportSpecifier } from 'src/utils/transform';

const transformShallowMatch: Motion = (j, ast) => {
  const snapthotCollection = ast.find(j.ExpressionStatement, {
    expression: {
      callee: {
        property: {
          name: 'toMatchSnapshot',
        },
      },
    },
  });

  if (!snapthotCollection.length) {
    return;
  }

  const snapshotType = storage.get(KEYS.snapshotType);
  const isReactHelmetType = snapshotType === SNAPSHOT_TYPES.reactHelmet;

  if (isReactHelmetType) {
    insertRtlImportSpecifier(j, ast, 'waitFor');
  }

  const blockCollection = snapthotCollection.closest(j.BlockStatement);

  blockCollection.forEach((path) => {
    const blockAst = j(path);

    if (isReactHelmetType) {
      blockAst.closest(j.ArrowFunctionExpression).get().node.async = true;
    } else {
      const renderExpression = blockAst.find(j.ExpressionStatement, {
        expression: {
          callee: {
            name: 'render',
          },
        },
      });
      if (!renderExpression.length) {
        return;
      }
      const component = renderExpression.find(j.JSXElement).get().node;
      renderExpression.replaceWith(buildRenderWithContainerReturn(j, component));
    }

    const template = isReactHelmetType
      ? `
        // eslint-disable-next-line testing-library/no-node-access
        await waitFor(() => expect(document.querySelector('[data-react-helmet]')).toBeInTheDocument());
        expect(document.head).toMatchSnapshot();
      `
      : 'expect(container).toMatchSnapshot();';
    // It will add an unexpected extra blank line but nothing can be done at the jscodeshift side.
    // https://github.com/benjamn/recast/issues/371
    snapthotCollection.replaceWith(template);
  });
};

export default transformShallowMatch;
