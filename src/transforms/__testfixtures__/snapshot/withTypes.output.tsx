it('should match the snapshot', () => {
  const { container } = render(<SeriesObject series={series as unknown as Video} />);

  expect(container).toMatchSnapshot();
});
