it('should replace mount with render', () => {
  const wrapper = mount(<TestComponent testProperty="test-property" />);
});

it('should replace shallow with render', () => {
  const wrapper = shallow(<TestComponent />);
});

it('should handle HOC function call', () => {
  const wrapper = mount(wrappedInProvider(WithAgeGateComponent, props, store));
});
