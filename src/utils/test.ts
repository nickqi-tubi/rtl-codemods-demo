import type { Options as JscodeshiftOptions } from 'jscodeshift';
import { runTest } from 'jscodeshift/src/testUtils';
import path from 'path';
import * as uuid from 'uuid';

import type { TransformOptions } from 'src/types';
import storage, { getWrapperNameKey } from 'src/utils/storage';

import { rootDir } from './transform';

export interface Options {
  only?: boolean;
  skip?: boolean;
  beforeEach?: VoidFunction;
  afterEach?: VoidFunction;
  descText?: string;
  transformOptions?: TransformOptions;
}

type DefineTestFn = (transformName: string, testFileName: string, options?: Options) => void;

interface DefineTest extends DefineTestFn {
  only: DefineTestFn;
  skip: DefineTestFn;
}

const testDir = path.join(rootDir, 'src/transforms/__tests__');

const defineTest: DefineTest = (transformName, testFileName, options = {}) => {
  const testFilePrefix = `${transformName}/${testFileName}`;
  const itText = `transforms correctly using "${testFilePrefix}" data`;

  let { descText } = options;
  if (!descText) {
    descText = testFilePrefix;
  }

  const describeFn = options.only ? describe.only : options.skip ? describe.skip : describe;

  describeFn(descText, () => {
    options.beforeEach?.();

    options.afterEach?.();

    it(itText, () => {
      runTest(testDir, transformName, options.transformOptions as JscodeshiftOptions, testFilePrefix, {
        // For the support of both JS & TS files, the "tsx" parser is chosen.
        // https://github.com/facebook/jscodeshift/blob/main/parser/tsx.js
        parser: 'tsx',
      });
    });
  });
};

defineTest.only = (...args) => {
  const [transformName, testFileName, options] = args;
  defineTest(transformName, testFileName, {
    ...options,
    only: true,
  });
};

defineTest.skip = (...args) => {
  const [transformName, testFileName, options] = args;
  defineTest(transformName, testFileName, {
    ...options,
    skip: true,
  });
};

export { defineTest };

// XXX: Workaround for a "cannot redefined property" issue when using jest.spyOn(uuid, 'v4')
// https://stackoverflow.com/a/72885576
jest.mock('uuid', () => ({
  __esModule: true,
  ...(jest.requireActual('uuid') as any),
}));

export const mockUuid = 'mock-uuid';

export const setupWrapperName = ({ wrapperName = 'wrapper' } = {}) => {
  jest.spyOn(uuid, 'v4').mockReturnValue(mockUuid);
  storage.set(getWrapperNameKey(mockUuid), wrapperName);
};
