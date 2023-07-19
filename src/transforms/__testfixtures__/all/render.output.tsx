import { render } from '@testing-library/react';
import React from 'react';

import sampleState from 'test/fixtures/state_sample';

import TestComponent from './TestComponent';

it('should replace mount with render', () => {
  const props = {
    foo: 'bar',
  };
  render(<TestComponent {...props} />);
});

it('should replace shallow with render', () => {
  render(<TestComponent />);
});

it('should handle no wrapper return', () => {
  render(<TestComponent testProperty="test-property" />);
});
