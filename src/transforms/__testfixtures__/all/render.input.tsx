import { mount, shallow as renamedShallow } from 'enzyme';
import React from 'react';

import sampleState from 'test/fixtures/state_sample';

import TestComponent from './TestComponent';

it('should replace mount with render', () => {
  const props = {
    foo: 'bar',
  };
  const wrapper = mount(<TestComponent {...props} />);
});

it('should replace shallow with render', () => {
  const wrapper = renamedShallow(<TestComponent />);
});

it('should handle no wrapper return', () => {
  mount(<TestComponent testProperty="test-property" />);
});
