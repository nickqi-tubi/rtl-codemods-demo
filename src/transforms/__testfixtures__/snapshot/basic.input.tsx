it("should match Component's snapshot", () => {
  render(<Component />);
  expect(wrapper).toMatchSnapshot();
});

it("should match Component2's snapshot2", () => {
  render(<Component2 />);
  expect(wrapper).toMatchSnapshot();
});
