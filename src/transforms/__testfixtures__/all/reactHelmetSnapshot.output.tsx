import { render, waitFor } from '@testing-library/react';
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

  it('should render correct script tag for the FAQ', async () => {
    render(<FaqObject items={items} />);

    // eslint-disable-next-line testing-library/no-node-access
    await waitFor(() => expect(document.querySelector('[data-react-helmet]')).toBeInTheDocument());
    expect(document.head).toMatchSnapshot();
  });
});
