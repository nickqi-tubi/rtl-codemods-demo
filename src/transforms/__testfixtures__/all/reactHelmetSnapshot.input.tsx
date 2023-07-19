import { shallow } from 'enzyme';
import React from 'react';

import FaqObject from './FaqObject';

describe('FaqObject', () => {
  const items = [
    {
      id: '123',
      question: 'Question one?',
      answer: 'Answer one.',
    },
    {
      question: 'Question 2?',
      answer: 'Answer 2!',
    },
    {
      question: 'Q3',
      answer: 'A3',
    },
  ];

  it('should render correct script tag for the FAQ', () => {
    const wrapper = shallow(<FaqObject items={items} />);
    expect(wrapper).toMatchSnapshot();
  });
});
