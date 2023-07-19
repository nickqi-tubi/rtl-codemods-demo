it("should match Component's snapshot", () => {
  const { container } = render(<Component />);

  expect(container).toMatchSnapshot();
});

it("should match Component2's snapshot2", () => {
  const { container } = render(<Component2 />);

  expect(container).toMatchSnapshot();
});
