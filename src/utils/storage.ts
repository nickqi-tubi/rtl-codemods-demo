import { v4 } from 'uuid';

export enum KEYS {
  mountImportName = 'mountImportName',
  shallowImportName = 'shallowImportName',
  snapshotType = 'snapshotType',
}

export const getWrapperNameKey = (uuid: string = v4()) => `wrapperName:${uuid}`;

class Storage {
  static instance: Storage;

  private data: Map<string, string> = new Map();

  constructor() {
    if (Storage.instance) {
      return Storage.instance;
    }
    Storage.instance = this;
  }

  get(key: string) {
    return this.data.get(key);
  }

  set(key: string, value: string) {
    this.data.set(key, value);
    return this;
  }

  clear() {
    this.data.clear();
    return this;
  }

  delete(key: string) {
    return this.data.delete(key);
  }
}

const storage = new Storage();

export default storage;
