import { render } from '@testing-library/react';
import React from 'react';

import OvalSpinner from './OvalSpinner';

test('should match snap', () => {
  const { container } = render(<OvalSpinner data-test-id="oval-spinner" />);

  expect(container).toMatchSnapshot();
});
