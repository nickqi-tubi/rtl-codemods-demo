it('should match the snapshot', () => {
  render(<SeriesObject series={series as unknown as Video} />);
  expect(wrapper).toMatchSnapshot();
});
