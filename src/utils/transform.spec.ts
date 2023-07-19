import { getMappingQueryFn } from './transform';

describe('getMappingQueryFn()', () => {
  it.each`
    query   | expected
    ${'h1'} | ${"getByRole('heading', { level: 1 })"}
    ${'h2'} | ${"getByRole('heading', { level: 2 })"}
    ${'h3'} | ${"getByRole('heading', { level: 3 })"}
    ${'h4'} | ${"getByRole('heading', { level: 4 })"}
    ${'h5'} | ${"getByRole('heading', { level: 5 })"}
    ${'h6'} | ${"getByRole('heading', { level: 6 })"}
  `('should handle heading tag $query', ({ query, expected }) => {
    expect(getMappingQueryFn(query)).toBe(expected);
  });

  it.each`
    tag
    ${'button'}
    ${'img'}
  `('should handle $tag tag', ({ tag }) => {
    expect(getMappingQueryFn(tag)).toBe(`getByRole('${tag}')`);
  });

  it('should handle query selector', () => {
    expect(getMappingQueryFn('li:first-child')).toBe("getByQuerySelector('li:first-child')");
  });

  it('should accept the queryAll option', () => {
    expect(getMappingQueryFn('button', { queryAll: true })).toBe("getAllByRole('button')");
    expect(getMappingQueryFn('.firstItem', { queryAll: true })).toBe("getAllByQuerySelector('.firstItem')");
  });

  it('should accept the prefix option', () => {
    expect(getMappingQueryFn('.firstItem', { prefix: 'query' })).toBe("queryByQuerySelector('.firstItem')");
    expect(getMappingQueryFn('h4', { queryAll: true, prefix: 'query' })).toBe(
      "queryAllByRole('heading', { level: 4 })"
    );
  });

  it('should handle StringLiteral', () => {
    // eslint-disable-next-line no-template-curly-in-string
    expect(getMappingQueryFn('`.${styles.hiddenCountdown}`')).toBe('getByQuerySelector(`.${styles.hiddenCountdown}`)');
  });
});
