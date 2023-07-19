export const TESTING_LIBRARY_PATH = '@testing-library/react';
export const USER_EVENT_LIBRARY_PATH = '@testing-library/user-event';

export enum SNAPSHOT_TYPES {
  default = 'default',
  reactHelmet = 'reactHelmet',
}

// Mapping to the verbose options in jscodeshift CLI:
// https://github.com/facebook/jscodeshift/blob/8a6f59bae81dbc299cba73e94bf7b5e20ea5a285/src/Runner.js#L48-L61
// https://github.com/facebook/jscodeshift/tree/main#usage-cli
export const VERBOSE_LEVELS = {
  normal: 0,
  verbose: 1,
  debug: 2,
};
