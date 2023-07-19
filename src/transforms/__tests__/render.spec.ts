import storage, { getWrapperNameKey, KEYS } from 'src/utils/storage';
import { defineTest, mockUuid, setupWrapperName } from 'src/utils/test';

describe('import related tests', () => {
  defineTest('render', 'mount');

  describe('render/mount', () => {
    it('should store the mount import name', () => {
      expect(storage.get(KEYS.mountImportName)).toBe('mount');
    });
  });

  defineTest('render', 'shallow');

  describe('render/shallow', () => {
    it('should store the shallow import name', () => {
      expect(storage.get(KEYS.shallowImportName)).toBe('shallow');
    });
  });

  defineTest('render', 'rename');

  describe('render/rename', () => {
    it('should store the renamed import func name', () => {
      expect(storage.get(KEYS.mountImportName)).toBe('renamedMount');
    });
  });

  defineTest('render', 'multipleImports');
});

describe('render related tests', () => {
  const setup = () => {
    setupWrapperName();
    storage.clear().set(KEYS.mountImportName, 'mount').set(KEYS.shallowImportName, 'shallow');
  };

  describe('mount or shallow with a wrapper return', () => {
    beforeAll(() => setup());

    defineTest('render', 'replaceWithRender');

    describe('render/replaceWithRender', () => {
      it('should store the wrapper name', () => {
        expect(storage.get(getWrapperNameKey(mockUuid))).toBe('wrapper');
      });
    });
  });

  describe('mount or shallow without a wrapper return', () => {
    beforeAll(() => setup());

    defineTest('render', 'noWrapperReturn');

    describe('render/noWrapperReturn', () => {
      it('should not store the wrapper name', () => {
        expect(storage.get(getWrapperNameKey(mockUuid))).toBeUndefined();
      });
    });
  });
});
