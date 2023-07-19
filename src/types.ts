import type { API, ASTPath, Collection, FileInfo, JSCodeshift, ExpressionStatement } from 'jscodeshift';
import type { Options as RecastOptions } from 'recast';

import type { SNAPSHOT_TYPES } from './constants';

export type AnyCollection = Collection<any>;

export type Ast = ReturnType<JSCodeshift>;

export type TestBlockPath = ASTPath<ExpressionStatement> & {
  // Will be used to identify a specific test block.
  _uuid: string;
};
export interface TransformOptions {
  enablePrettierEslintFix?: boolean;
  recastOptions?: RecastOptions;
  snapshotType?: SNAPSHOT_TYPES;
}

export type Transform = (file: FileInfo, api: API, options: TransformOptions) => string;

export interface Values {
  wrapperIdentifier?: string;
}

export type Motion = (j: JSCodeshift, ast: Ast) => void;
