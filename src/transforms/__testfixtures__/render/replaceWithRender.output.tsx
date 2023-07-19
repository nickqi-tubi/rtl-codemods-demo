it('should replace mount with render', () => {
  render(<TestComponent testProperty="test-property" />);
});

it('should replace shallow with render', () => {
  render(<TestComponent />);
});

it('should handle HOC function call', () => {
  render(wrappedInProvider(WithAgeGateComponent, props, store));
});
