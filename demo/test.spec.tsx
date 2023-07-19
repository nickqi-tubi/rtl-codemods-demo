import { shallow } from 'enzyme';
import React from 'react';

import OvalSpinner from './OvalSpinner';

test('should match snap', () => {
  const wrapper = shallow(<OvalSpinner data-test-id="oval-spinner" />);
  expect(wrapper).toMatchSnapshot();
});
