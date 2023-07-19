it('should replace mount with render', () => {
  mount(<TestComponent testProperty="test-property" />);
});

it('should replace shallow with render', () => {
  shallow(<TestComponent />);
});
