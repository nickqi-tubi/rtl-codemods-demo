it('should replace mount with render', () => {
  render(<TestComponent testProperty="test-property" />);
});

it('should replace shallow with render', () => {
  render(<TestComponent />);
});
