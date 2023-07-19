import { applyMotions, hasDefaultImportSpecifier, hasImportSpecifier, insertImportSpecifier } from '@codeshift/utils';
import { execSync } from 'child_process';
import crypto from 'crypto';
import fs from 'fs';
import type { JSCodeshift, JSXElement } from 'jscodeshift';
import path from 'path';
import prettier from 'prettier';

import { TESTING_LIBRARY_PATH, USER_EVENT_LIBRARY_PATH } from 'src/constants';
import type { Ast, Motion, Transform, TransformOptions } from 'src/types';

interface ImportSpecifier {
  imported: string;
  source: string;
}

type BuildRender = (j: JSCodeshift, arg: JSXElement) => any;

interface GetMappingQueryFnOptions {
  queryAll?: boolean;
  prefix?: 'get' | 'query';
}

export const rootDir = path.resolve(__dirname, '..', '..');

export const toSource = (
  ast: ReturnType<JSCodeshift>,
  options: TransformOptions = {
    // Disable prettier-eslint for testing because it's relevantly slow. We give the control to
    // developers so that they can decide if they want enable for a specific test.
    enablePrettierEslintFix: process.env.NODE_ENV !== 'test',
    recastOptions: {},
  }
) => {
  const { enablePrettierEslintFix, recastOptions } = options;

  let source = ast.toSource(recastOptions);
  const prettierConfigPath = path.join(rootDir, '.prettierrc');

  // Using prettier-eslint in nodejs is a bit of a pain because it cannot detect the correct
  // config and the dependenceis. So we use the CLI to fix the linting and formatting.
  if (enablePrettierEslintFix) {
    // Attaching a hex string as a part of the filename in order to let Jest tests run in parallel.
    const hash = crypto.createHash('md5').update(source).digest('hex');
    const tempFilename = path.join(__dirname, `tempFileForLintFix-${hash}.tsx`);

    try {
      fs.writeFileSync(tempFilename, source);
      execSync(`prettier-eslint --write ${tempFilename} --config ${prettierConfigPath} --log-level silent`);
      source = fs.readFileSync(tempFilename, 'utf8');
      return source;
    } finally {
      fs.rmSync(tempFilename);
    }
  }

  const prettierConfig = JSON.parse(fs.readFileSync(prettierConfigPath).toString());
  return prettier.format(source, {
    ...prettierConfig,
    // https://prettier.io/docs/en/options.html#parser
    // Use babel-ts parser to support both JS & TS files.
    parser: 'babel-ts',
  });
};

export const genTransform = (motions: Motion[]) => {
  const transform: Transform = (file, api, options) => {
    const j = api.jscodeshift;
    const ast = j(file.source);
    applyMotions(j, ast, motions);
    return toSource(ast, options);
  };

  return transform;
};

export const getMappingQueryFn = (query: string, options?: GetMappingQueryFnOptions) => {
  const { queryAll, prefix } = { queryAll: false, prefix: 'get', ...options };
  const queryFnPrefix = `${prefix}${queryAll ? 'AllBy' : 'By'}`;

  if (/^h[1-6]$/.test(query)) {
    return `${queryFnPrefix}Role('heading', { level: ${query[1]} })`;
  }

  let queryFn = `${queryFnPrefix}QuerySelector('${query}')`;

  if (['button', 'img'].includes(query)) {
    queryFn = `${queryFnPrefix}Role('${query}')`;
  }

  return queryFn.replace(/'`/g, '`').replace(/`'/g, '`');
};

export const findTestBlock = (j: JSCodeshift, ast: Ast) =>
  ast
    .find(j.ExpressionStatement, {
      expression: {
        callee: {
          type: 'Identifier',
        },
        arguments: [
          {
            type: 'StringLiteral',
          },
          {
            type: 'ArrowFunctionExpression',
            body: {
              type: 'BlockStatement',
            },
          },
        ],
      },
    })
    .filter((path) => {
      const calleeName = path.get('expression', 'callee').value.name;
      return ['it', 'test'].includes(calleeName);
    });

export const buildImport = (j: JSCodeshift, { imported, source }: ImportSpecifier) =>
  j.importDeclaration([j.importSpecifier(j.identifier(imported))], j.literal(source));

export const buildDefaultImport = (j: JSCodeshift, { imported, source }: ImportSpecifier) =>
  j.importDeclaration([j.importDefaultSpecifier(j.identifier(imported))], j.literal(source));

export const buildRender: BuildRender = (j, arg) =>
  j.expressionStatement(j.callExpression(j.identifier('render'), [arg]));

export const buildRenderWithContainerReturn: BuildRender = (j, component) => {
  const container = j.property('init', j.identifier('container'), j.identifier('container'));
  container.shorthand = true;

  return j.variableDeclaration('const', [
    j.variableDeclarator(j.objectPattern([container]), j.callExpression(j.identifier('render'), [component])),
  ]);
};

export const insertRtlImportSpecifier = (j: JSCodeshift, ast: Ast, specifier: string) => {
  if (!hasImportSpecifier(j, ast, specifier, TESTING_LIBRARY_PATH)) {
    insertImportSpecifier(j, ast, j.importSpecifier(j.identifier(specifier)), TESTING_LIBRARY_PATH);
  }
};

export const createUserEventImport = (j: JSCodeshift, ast: Ast) => {
  if (!hasDefaultImportSpecifier(j, ast, USER_EVENT_LIBRARY_PATH)) {
    ast
      .get('program', 'body', 0)
      .insertBefore(buildDefaultImport(j, { imported: 'userEvent', source: USER_EVENT_LIBRARY_PATH }));
  }
};
