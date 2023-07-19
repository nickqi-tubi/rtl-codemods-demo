it('should match the snapshot', async () => {
  // eslint-disable-next-line testing-library/no-node-access
  await waitFor(() => expect(document.querySelector('[data-react-helmet]')).toBeInTheDocument());
  expect(document.head).toMatchSnapshot();
});
